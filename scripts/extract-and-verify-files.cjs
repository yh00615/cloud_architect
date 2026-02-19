#!/usr/bin/env node

/**
 * ZIP 파일 압축 해제 및 검증 스크립트
 * 
 * 1. 모든 ZIP 파일 압축 해제
 * 2. labEnvironments.ts와 실제 파일 비교
 * 3. 마크다운 가이드 DOWNLOAD Alert와 비교
 * 4. 누락/불일치 파일 리포트 생성
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🔍 ZIP 파일 압축 해제 및 검증 시작\n')

// 1. 모든 ZIP 파일 찾기
console.log('📦 1. ZIP 파일 검색 중...')
const zipFiles = execSync('find public/files -name "*.zip" -type f', { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .filter(Boolean)

console.log(`✓ ${zipFiles.length}개 ZIP 파일 발견\n`)

// 2. 각 ZIP 파일 압축 해제
console.log('📂 2. ZIP 파일 압축 해제 중...')
const extractedDirs = []

for (const zipPath of zipFiles) {
    const zipName = path.basename(zipPath, '.zip')
    const zipDir = path.dirname(zipPath)
    const extractDir = path.join(zipDir, zipName)

    // 이미 압축 해제된 폴더가 있으면 삭제
    if (fs.existsSync(extractDir)) {
        execSync(`rm -rf "${extractDir}"`)
    }

    // 압축 해제
    try {
        execSync(`unzip -q "${zipPath}" -d "${extractDir}"`)
        extractedDirs.push(extractDir)
        console.log(`  ✓ ${zipName}`)
    } catch (error) {
        console.log(`  ✗ ${zipName} - 압축 해제 실패`)
    }
}

console.log(`\n✓ ${extractedDirs.length}개 ZIP 파일 압축 해제 완료\n`)

// 3. 압축 해제된 파일 목록 생성
console.log('📋 3. 압축 해제된 파일 구조 분석 중...')

function getFileStructure(dir, baseDir = dir) {
    const files = []

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir)

        for (const item of items) {
            const fullPath = path.join(currentDir, item)
            const stat = fs.statSync(fullPath)

            if (stat.isDirectory()) {
                traverse(fullPath)
            } else {
                const relativePath = path.relative(baseDir, fullPath)
                files.push(relativePath)
            }
        }
    }

    traverse(dir)
    return files.sort()
}

const extractedStructure = {}

for (const extractDir of extractedDirs) {
    const zipName = path.basename(extractDir)
    const files = getFileStructure(extractDir)
    extractedStructure[zipName] = files
}

console.log(`✓ ${Object.keys(extractedStructure).length}개 ZIP 파일 구조 분석 완료\n`)

// 4. labEnvironments.ts 로드
console.log('📖 4. labEnvironments.ts 로드 중...')

// TypeScript 파일 컴파일
const tempDir = path.join(__dirname, '.temp-lab-verify')
if (fs.existsSync(tempDir)) {
    execSync(`rm -rf ${tempDir}`)
}
fs.mkdirSync(tempDir, { recursive: true })

try {
    execSync(`npx tsc src/data/labEnvironments.ts --outDir ${tempDir} --module commonjs --target es2015 --moduleResolution node --esModuleInterop --skipLibCheck --resolveJsonModule`, {
        stdio: 'pipe',
        cwd: path.join(__dirname, '..')
    })

    // .js를 .cjs로 변경
    const jsPath = path.join(tempDir, 'labEnvironments.js')
    const cjsPath = path.join(tempDir, 'labEnvironments.cjs')
    if (fs.existsSync(jsPath)) {
        fs.renameSync(jsPath, cjsPath)
    }
} catch (error) {
    console.error('✗ TypeScript 컴파일 실패')
    console.error(error.message)
    process.exit(1)
}

const labEnvironmentsPath = path.join(tempDir, 'labEnvironments.cjs')
if (!fs.existsSync(labEnvironmentsPath)) {
    console.error(`✗ 컴파일된 파일을 찾을 수 없습니다: ${labEnvironmentsPath}`)
    console.error(`tempDir 내용:`)
    execSync(`find ${tempDir}`, { stdio: 'inherit' })
    process.exit(1)
}

const { labEnvironments } = require(path.resolve(labEnvironmentsPath))

console.log(`✓ labEnvironments.ts 로드 완료 (${labEnvironments.length}개 항목)\n`)

// 5. 비교 및 검증
console.log('🔍 5. 파일 비교 및 검증 중...\n')

const issues = []

for (const env of labEnvironments) {
    if (!env.hasPrerequisites || !env.zipFileName) continue

    const zipName = env.zipFileName.replace('.zip', '')
    const actualFiles = extractedStructure[zipName]

    if (!actualFiles) {
        issues.push({
            week: env.week,
            session: env.session,
            type: 'ZIP_NOT_FOUND',
            message: `ZIP 파일이 압축 해제되지 않음: ${env.zipFileName}`
        })
        continue
    }

    // labEnvironments.ts에 명시된 파일 확인
    for (const file of env.files) {
        const fileName = file.name

        // 실제 파일에서 찾기 (경로 무시하고 파일명만 비교)
        const found = actualFiles.some(f => {
            const baseName = path.basename(f)
            return baseName === fileName
        })

        if (!found) {
            issues.push({
                week: env.week,
                session: env.session,
                type: 'FILE_MISSING',
                zipName: env.zipFileName,
                expectedFile: fileName,
                actualFiles: actualFiles,
                message: `파일 누락: ${fileName}`
            })
        }
    }

    // 실제 파일 중 labEnvironments.ts에 없는 파일 확인
    for (const actualFile of actualFiles) {
        const baseName = path.basename(actualFile)
        const found = env.files.some(f => f.name === baseName)

        if (!found) {
            issues.push({
                week: env.week,
                session: env.session,
                type: 'FILE_EXTRA',
                zipName: env.zipFileName,
                extraFile: actualFile,
                message: `추가 파일 발견 (labEnvironments.ts에 없음): ${actualFile}`
            })
        }
    }
}

// 6. 결과 리포트 생성
console.log('📊 검증 결과:\n')

if (issues.length === 0) {
    console.log('✅ 모든 파일이 일치합니다!\n')
} else {
    console.log(`⚠️  ${issues.length}개 문제 발견\n`)

    // 문제 유형별 분류
    const byType = {
        ZIP_NOT_FOUND: [],
        FILE_MISSING: [],
        FILE_EXTRA: []
    }

    for (const issue of issues) {
        byType[issue.type].push(issue)
    }

    // ZIP 파일 없음
    if (byType.ZIP_NOT_FOUND.length > 0) {
        console.log(`❌ ZIP 파일 없음 (${byType.ZIP_NOT_FOUND.length}개):`)
        for (const issue of byType.ZIP_NOT_FOUND) {
            console.log(`   Week ${issue.week}-${issue.session}: ${issue.message}`)
        }
        console.log()
    }

    // 파일 누락
    if (byType.FILE_MISSING.length > 0) {
        console.log(`❌ 파일 누락 (${byType.FILE_MISSING.length}개):`)
        const grouped = {}
        for (const issue of byType.FILE_MISSING) {
            const key = `${issue.week}-${issue.session}`
            if (!grouped[key]) grouped[key] = []
            grouped[key].push(issue)
        }

        for (const [key, group] of Object.entries(grouped)) {
            const first = group[0]
            console.log(`\n   Week ${first.week}-${first.session} (${first.zipName}):`)
            console.log(`   labEnvironments.ts에 명시된 파일:`)
            for (const issue of group) {
                console.log(`     - ${issue.expectedFile}`)
            }
            console.log(`   실제 ZIP 내부 파일:`)
            for (const file of first.actualFiles) {
                console.log(`     - ${file}`)
            }
        }
        console.log()
    }

    // 추가 파일
    if (byType.FILE_EXTRA.length > 0) {
        console.log(`⚠️  추가 파일 (${byType.FILE_EXTRA.length}개):`)
        const grouped = {}
        for (const issue of byType.FILE_EXTRA) {
            const key = `${issue.week}-${issue.session}`
            if (!grouped[key]) grouped[key] = []
            grouped[key].push(issue)
        }

        for (const [key, group] of Object.entries(grouped)) {
            const first = group[0]
            console.log(`   Week ${first.week}-${first.session} (${first.zipName}):`)
            for (const issue of group) {
                console.log(`     + ${issue.extraFile}`)
            }
        }
        console.log()
    }
}

// 7. 상세 리포트 파일 생성
const reportPath = 'FILE_STRUCTURE_REPORT.md'
let report = '# ZIP 파일 구조 검증 리포트\n\n'
report += `**생성일**: ${new Date().toISOString().split('T')[0]}\n\n`
report += '---\n\n'

report += '## 📊 요약\n\n'
report += `- 총 ZIP 파일: ${zipFiles.length}개\n`
report += `- 압축 해제 성공: ${extractedDirs.length}개\n`
report += `- 발견된 문제: ${issues.length}개\n\n`

if (issues.length > 0) {
    report += '---\n\n'
    report += '## 🔍 상세 문제 목록\n\n'

    const byWeek = {}
    for (const issue of issues) {
        const key = `${issue.week}-${issue.session}`
        if (!byWeek[key]) byWeek[key] = []
        byWeek[key].push(issue)
    }

    for (const [key, weekIssues] of Object.entries(byWeek).sort()) {
        const [week, session] = key.split('-')
        const first = weekIssues[0]

        report += `### Week ${week} Session ${session}\n\n`
        if (first.zipName) {
            report += `**ZIP 파일**: \`${first.zipName}\`\n\n`
        }

        const missing = weekIssues.filter(i => i.type === 'FILE_MISSING')
        const extra = weekIssues.filter(i => i.type === 'FILE_EXTRA')

        if (missing.length > 0) {
            report += '**누락된 파일** (labEnvironments.ts에는 있지만 ZIP에는 없음):\n'
            for (const issue of missing) {
                report += `- \`${issue.expectedFile}\`\n`
            }
            report += '\n'

            if (first.actualFiles) {
                report += '**실제 ZIP 내부 파일**:\n'
                for (const file of first.actualFiles) {
                    report += `- \`${file}\`\n`
                }
                report += '\n'
            }
        }

        if (extra.length > 0) {
            report += '**추가 파일** (ZIP에는 있지만 labEnvironments.ts에는 없음):\n'
            for (const issue of extra) {
                report += `- \`${issue.extraFile}\`\n`
            }
            report += '\n'
        }
    }
}

report += '---\n\n'
report += '## 📁 전체 ZIP 파일 구조\n\n'

for (const [zipName, files] of Object.entries(extractedStructure).sort()) {
    report += `### ${zipName}\n\n`
    report += '```\n'
    for (const file of files) {
        report += `${file}\n`
    }
    report += '```\n\n'
}

fs.writeFileSync(reportPath, report)
console.log(`📄 상세 리포트 생성: ${reportPath}\n`)

// 정리
execSync(`rm -rf ${tempDir}`)

process.exit(issues.length > 0 ? 1 : 0)
