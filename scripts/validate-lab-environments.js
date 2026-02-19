#!/usr/bin/env node

/**
 * Lab Environment Validation Script
 * 
 * 이 스크립트는 labEnvironments.ts의 데이터와 실제 파일 시스템을 검증합니다.
 * 
 * 검증 항목:
 * 1. ZIP 파일 존재 확인
 * 2. ZIP 내부 파일 검증
 * 3. 데이터 일관성 검증 (curriculum.ts vs labEnvironments.ts)
 * 4. 마크다운 가이드 검증 (DOWNLOAD Alert)
 * 5. AWS MCP 서버 통합 (UI 검증) - 선택사항
 * 
 * 사용법:
 *   npm run validate:lab-env                    # 전체 검증
 *   npm run validate:lab-env:file <path>        # 특정 파일 검증
 *   npm run validate:lab-env:week <weekNum>     # 특정 주차 검증
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 색상 코드
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

/**
 * Lab Environment Validator
 */
class LabEnvironmentValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.info = [];
        this.labEnvironments = null;
        this.curriculum = null;
    }

    /**
     * labEnvironments.ts 데이터 로드
     * TypeScript 컴파일러를 사용하여 안전하게 로드
     */
    async loadLabEnvironments() {
        try {
            const labEnvPath = path.join(__dirname, '../src/data/labEnvironments.ts');
            const tempDir = path.join(__dirname, '../temp');
            const tempOutFile = path.join(tempDir, 'labEnvironments.js');

            // 1. temp 디렉토리 생성
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            // 2. TypeScript 컴파일
            console.log(`${colors.blue}ℹ${colors.reset} TypeScript 파일 컴파일 중...\n`);

            try {
                execSync(
                    `npx tsc "${labEnvPath}" --outDir "${tempDir}" --module es2020 --target es2020 --skipLibCheck --esModuleInterop`,
                    { encoding: 'utf-8', stdio: 'pipe' }
                );
            } catch (compileError) {
                throw new Error(`TypeScript 컴파일 실패: ${compileError.message}`);
            }

            // 3. 컴파일된 JavaScript 파일 로드
            if (!fs.existsSync(tempOutFile)) {
                throw new Error('컴파일된 파일을 찾을 수 없습니다');
            }

            // 4. ES 모듈로 동적 로드
            const fileUrl = new URL(`file://${tempOutFile}`);
            const labEnvModule = await import(fileUrl.href);
            this.labEnvironments = labEnvModule.labEnvironments;

            if (!this.labEnvironments || !Array.isArray(this.labEnvironments)) {
                throw new Error('labEnvironments 배열을 찾을 수 없습니다');
            }

            // 5. temp 디렉토리 정리
            try {
                fs.rmSync(tempDir, { recursive: true, force: true });
            } catch (cleanupError) {
                // 정리 실패는 무시 (다음 실행 시 덮어씀)
            }

            console.log(`${colors.green}✓${colors.reset} labEnvironments.ts 로드 완료 (${this.labEnvironments.length}개 항목)\n`);
        } catch (error) {
            console.error(`${colors.red}✗ labEnvironments.ts 로드 실패:${colors.reset}`, error.message);

            // 상세 오류 정보
            if (error.stderr) {
                console.error('\n컴파일 오류 상세:');
                console.error(error.stderr);
            }

            process.exit(1);
        }
    }

    /**
     * curriculum.ts 데이터 로드
     * TypeScript 컴파일러를 사용하여 안전하게 로드
     */
    async loadCurriculum() {
        try {
            const curriculumPath = path.join(__dirname, '../src/data/curriculum.ts');
            const tempDir = path.join(__dirname, '../temp');
            const tempOutFile = path.join(tempDir, 'curriculum.js');

            // 1. temp 디렉토리 생성 (이미 있을 수 있음)
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            // 2. TypeScript 컴파일
            try {
                execSync(
                    `npx tsc "${curriculumPath}" --outDir "${tempDir}" --module es2020 --target es2020 --skipLibCheck --esModuleInterop`,
                    { encoding: 'utf-8', stdio: 'pipe' }
                );
            } catch (compileError) {
                throw new Error(`TypeScript 컴파일 실패: ${compileError.message}`);
            }

            // 3. 컴파일된 JavaScript 파일 로드
            if (!fs.existsSync(tempOutFile)) {
                throw new Error('컴파일된 파일을 찾을 수 없습니다');
            }

            // 4. ES 모듈로 동적 로드
            const fileUrl = new URL(`file://${tempOutFile}`);
            const curriculumModule = await import(fileUrl.href);
            this.curriculum = curriculumModule.curriculum;

            if (!this.curriculum || !Array.isArray(this.curriculum)) {
                throw new Error('curriculum 배열을 찾을 수 없습니다');
            }

            // 5. temp 디렉토리 정리
            try {
                fs.rmSync(tempDir, { recursive: true, force: true });
            } catch (cleanupError) {
                // 정리 실패는 무시
            }

            console.log(`${colors.green}✓${colors.reset} curriculum.ts 로드 완료 (${this.curriculum.length}개 주차)\n`);
        } catch (error) {
            console.error(`${colors.red}✗ curriculum.ts 로드 실패:${colors.reset}`, error.message);
            process.exit(1);
        }
    }

    /**
     * 1. ZIP 파일 존재 확인
     */
    validateZipFileExistence() {
        console.log(`${colors.cyan}📦 1. ZIP 파일 존재 확인${colors.reset}\n`);

        this.labEnvironments.forEach(env => {
            if (!env.hasPrerequisites || !env.zipFileName) return;

            const zipPath = path.join(__dirname, '../public/files', `week${env.week}`, env.zipFileName);

            if (!fs.existsSync(zipPath)) {
                this.errors.push({
                    category: 'ZIP 파일 존재',
                    severity: 'error',
                    week: env.week,
                    session: env.session,
                    message: `ZIP 파일이 존재하지 않습니다: ${env.zipFileName}`,
                    path: zipPath
                });
            } else {
                // 파일 크기 확인
                const stats = fs.statSync(zipPath);
                const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

                if (stats.size === 0) {
                    this.errors.push({
                        category: 'ZIP 파일 존재',
                        severity: 'error',
                        week: env.week,
                        session: env.session,
                        message: `ZIP 파일이 비어있습니다: ${env.zipFileName}`,
                        path: zipPath
                    });
                } else if (stats.size > 10 * 1024 * 1024) {
                    // 10MB 이상
                    this.warnings.push({
                        category: 'ZIP 파일 크기',
                        severity: 'warning',
                        week: env.week,
                        session: env.session,
                        message: `ZIP 파일이 큽니다 (${sizeMB}MB): ${env.zipFileName}`,
                        path: zipPath
                    });
                }
            }
        });

        this.printCategoryResults('ZIP 파일 존재');
    }

    /**
     * 2. ZIP 내부 파일 검증
     */
    validateZipContents() {
        console.log(`${colors.cyan}📂 2. ZIP 내부 파일 검증${colors.reset}\n`);

        this.labEnvironments.forEach(env => {
            if (!env.hasPrerequisites || !env.zipFileName || !env.files) return;

            const zipPath = path.join(__dirname, '../public/files', `week${env.week}`, env.zipFileName);

            if (!fs.existsSync(zipPath)) return; // 이미 1번에서 체크함

            try {
                // unzip -l 명령어로 ZIP 내부 파일 목록 확인
                const output = execSync(`unzip -l "${zipPath}"`, { encoding: 'utf-8' });
                const zipFiles = output
                    .split('\n')
                    .filter(line => line.match(/^\s*\d+\s+\d{4}-\d{2}-\d{2}/))
                    .map(line => {
                        const parts = line.trim().split(/\s+/);
                        return parts[parts.length - 1]; // 파일명
                    });

                // labEnvironments.ts에 명시된 파일이 ZIP에 있는지 확인
                env.files.forEach(file => {
                    const fileName = file.name;
                    const found = zipFiles.some(zf => zf.endsWith(fileName) || zf === fileName);

                    if (!found) {
                        this.errors.push({
                            category: 'ZIP 내부 파일',
                            severity: 'error',
                            week: env.week,
                            session: env.session,
                            message: `ZIP 내부에 파일이 없습니다: ${fileName}`,
                            zipFile: env.zipFileName
                        });
                    }
                });

                // ZIP에는 있지만 labEnvironments.ts에 명시되지 않은 파일 확인
                const declaredFiles = env.files.map(f => f.name);
                zipFiles.forEach(zf => {
                    const baseName = path.basename(zf);
                    if (baseName.startsWith('.') || baseName === '__MACOSX') return; // 시스템 파일 무시

                    const found = declaredFiles.some(df => zf.endsWith(df) || zf === df);

                    if (!found) {
                        this.warnings.push({
                            category: 'ZIP 내부 파일',
                            severity: 'warning',
                            week: env.week,
                            session: env.session,
                            message: `ZIP에 있지만 labEnvironments.ts에 명시되지 않은 파일: ${baseName}`,
                            zipFile: env.zipFileName
                        });
                    }
                });

            } catch (error) {
                this.errors.push({
                    category: 'ZIP 내부 파일',
                    severity: 'error',
                    week: env.week,
                    session: env.session,
                    message: `ZIP 파일 읽기 실패: ${error.message}`,
                    zipFile: env.zipFileName
                });
            }
        });

        this.printCategoryResults('ZIP 내부 파일');
    }

    /**
     * 3. 데이터 일관성 검증
     */
    validateDataConsistency() {
        console.log(`${colors.cyan}🔄 3. 데이터 일관성 검증${colors.reset}\n`);

        this.labEnvironments.forEach(env => {
            // curriculum.ts에서 해당 주차/세션 찾기
            const week = this.curriculum.find(w => w.week === env.week);

            if (!week) {
                this.errors.push({
                    category: '데이터 일관성',
                    severity: 'error',
                    week: env.week,
                    session: env.session,
                    message: `curriculum.ts에 Week ${env.week}가 없습니다`
                });
                return;
            }

            const session = week.sessions.find(s => s.session === env.session);

            if (!session) {
                this.errors.push({
                    category: '데이터 일관성',
                    severity: 'error',
                    week: env.week,
                    session: env.session,
                    message: `curriculum.ts에 Week ${env.week} Session ${env.session}이 없습니다`
                });
                return;
            }

            // sessionType 일치 확인
            if (env.sessionType !== session.type) {
                this.errors.push({
                    category: '데이터 일관성',
                    severity: 'error',
                    week: env.week,
                    session: env.session,
                    message: `sessionType 불일치: labEnvironments.ts="${env.sessionType}", curriculum.ts="${session.type}"`,
                    fix: `labEnvironments.ts의 sessionType을 "${session.type}"로 수정`
                });
            }

            // hasPrerequisites vs 실제 파일 존재 확인
            if (env.hasPrerequisites && !env.zipFileName) {
                this.warnings.push({
                    category: '데이터 일관성',
                    severity: 'warning',
                    week: env.week,
                    session: env.session,
                    message: 'hasPrerequisites=true이지만 zipFileName이 없습니다'
                });
            }

            if (!env.hasPrerequisites && env.zipFileName) {
                this.warnings.push({
                    category: '데이터 일관성',
                    severity: 'warning',
                    week: env.week,
                    session: env.session,
                    message: 'hasPrerequisites=false이지만 zipFileName이 있습니다'
                });
            }

            // markdownPath 확인
            if (session.markdownPath) {
                const mdPath = path.join(__dirname, '../public', session.markdownPath);
                if (!fs.existsSync(mdPath)) {
                    this.errors.push({
                        category: '데이터 일관성',
                        severity: 'error',
                        week: env.week,
                        session: env.session,
                        message: `마크다운 파일이 존재하지 않습니다: ${session.markdownPath}`,
                        path: mdPath
                    });
                }
            }
        });

        this.printCategoryResults('데이터 일관성');
    }

    /**
     * 4. 마크다운 가이드 검증
     */
    validateMarkdownGuides() {
        console.log(`${colors.cyan}📝 4. 마크다운 가이드 검증${colors.reset}\n`);

        this.labEnvironments.forEach(env => {
            if (!env.hasPrerequisites) return;

            // curriculum.ts에서 markdownPath 찾기
            const week = this.curriculum.find(w => w.number === env.week);
            if (!week) return;

            const session = week.sessions.find(s => s.number === env.session);
            if (!session || !session.markdownPath) return;

            const mdPath = path.join(__dirname, '../public/content', session.markdownPath);
            if (!fs.existsSync(mdPath)) return; // 이미 3번에서 체크함

            const content = fs.readFileSync(mdPath, 'utf-8');

            // DOWNLOAD Alert 확인
            const hasDownloadAlert = content.includes('[!DOWNLOAD]');

            if (!hasDownloadAlert) {
                this.errors.push({
                    category: '마크다운 가이드',
                    severity: 'error',
                    week: env.week,
                    session: env.session,
                    message: '[!DOWNLOAD] Alert가 없습니다',
                    file: session.markdownPath
                });
                return;
            }

            // DOWNLOAD Alert 내용 추출
            const downloadMatch = content.match(/>\s*\[!DOWNLOAD\]([\s\S]*?)(?=\n\n|^##)/m);
            if (!downloadMatch) {
                this.warnings.push({
                    category: '마크다운 가이드',
                    severity: 'warning',
                    week: env.week,
                    session: env.session,
                    message: '[!DOWNLOAD] Alert 형식이 올바르지 않습니다',
                    file: session.markdownPath
                });
                return;
            }

            const downloadContent = downloadMatch[1];

            // ZIP 파일명 확인
            if (!downloadContent.includes(env.zipFileName)) {
                this.errors.push({
                    category: '마크다운 가이드',
                    severity: 'error',
                    week: env.week,
                    session: env.session,
                    message: `DOWNLOAD Alert에 ZIP 파일명이 없습니다: ${env.zipFileName}`,
                    file: session.markdownPath
                });
            }

            // 파일 목록 확인
            if (env.files && env.files.length > 0) {
                env.files.forEach(file => {
                    if (!downloadContent.includes(file.name)) {
                        this.warnings.push({
                            category: '마크다운 가이드',
                            severity: 'warning',
                            week: env.week,
                            session: env.session,
                            message: `DOWNLOAD Alert에 파일이 명시되지 않음: ${file.name}`,
                            file: session.markdownPath
                        });
                    }
                });
            }

            // "관련 태스크" 섹션 확인
            if (!downloadContent.includes('**관련 태스크:**')) {
                this.warnings.push({
                    category: '마크다운 가이드',
                    severity: 'warning',
                    week: env.week,
                    session: env.session,
                    message: 'DOWNLOAD Alert에 "**관련 태스크:**" 섹션이 없습니다',
                    file: session.markdownPath
                });
            }

            // 파일 설명 길이 확인
            const fileDescriptions = downloadContent.match(/- `([^`]+)` - (.+)/g) || [];
            fileDescriptions.forEach(desc => {
                const match = desc.match(/- `([^`]+)` - (.+)/);
                if (match) {
                    const fileName = match[1];
                    const description = match[2].trim();

                    if (description.length < 5) {
                        this.info.push({
                            category: '마크다운 가이드',
                            severity: 'info',
                            week: env.week,
                            session: env.session,
                            message: `파일 설명이 너무 짧습니다 (${description.length}자): ${fileName}`,
                            file: session.markdownPath
                        });
                    }

                    if (description.length > 50) {
                        this.info.push({
                            category: '마크다운 가이드',
                            severity: 'info',
                            week: env.week,
                            session: env.session,
                            message: `파일 설명이 너무 깁니다 (${description.length}자). "관련 태스크"로 이동 권장: ${fileName}`,
                            file: session.markdownPath
                        });
                    }
                }
            });
        });

        this.printCategoryResults('마크다운 가이드');
    }

    /**
     * 5. AWS MCP 서버 통합 (선택사항)
     */
    validateWithAWSMCP() {
        console.log(`${colors.cyan}☁️  5. AWS MCP 서버 통합 (선택사항)${colors.reset}\n`);
        console.log(`${colors.yellow}ℹ️  AWS MCP 서버 검증은 수동으로 수행하세요:${colors.reset}\n`);
        console.log(`   1. Kiro에서 다음 명령어 실행:`);
        console.log(`      "Week X Session Y 가이드가 AWS 공식 문서와 일치하는지 확인해줘"\n`);
        console.log(`   2. 특정 서비스 검증:`);
        console.log(`      "VPC Endpoint 설정이 AWS 베스트 프랙티스를 따르는지 확인해줘"\n`);
        console.log(`   3. 보안 설정 검증:`);
        console.log(`      "보안 그룹 설정이 AWS 권장사항을 준수하는지 확인해줘"\n`);
        console.log(`${colors.blue}💡 자세한 내용: .kiro/steering/code-review-system.md 참조${colors.reset}\n`);
    }

    /**
     * 카테고리별 결과 출력
     */
    printCategoryResults(category) {
        const categoryErrors = this.errors.filter(e => e.category === category);
        const categoryWarnings = this.warnings.filter(w => w.category === category);
        const categoryInfo = this.info.filter(i => i.category === category);

        if (categoryErrors.length === 0 && categoryWarnings.length === 0 && categoryInfo.length === 0) {
            console.log(`${colors.green}✓ ${category}: 모든 검증 통과${colors.reset}\n`);
        } else {
            if (categoryErrors.length > 0) {
                console.log(`${colors.red}✗ ${category}: ${categoryErrors.length}개 오류${colors.reset}`);
            }
            if (categoryWarnings.length > 0) {
                console.log(`${colors.yellow}⚠ ${category}: ${categoryWarnings.length}개 경고${colors.reset}`);
            }
            if (categoryInfo.length > 0) {
                console.log(`${colors.blue}ℹ ${category}: ${categoryInfo.length}개 정보${colors.reset}`);
            }
            console.log('');
        }
    }

    /**
     * 전체 결과 출력
     */
    printFinalResults() {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`${colors.cyan}📊 Lab Environment 검증 결과${colors.reset}\n`);

        const totalIssues = this.errors.length + this.warnings.length + this.info.length;

        console.log(`총 검증 항목: ${this.labEnvironments.length}개`);
        console.log(`발견된 항목: ${totalIssues}개`);
        console.log(`  - 오류: ${colors.red}${this.errors.length}${colors.reset}`);
        console.log(`  - 경고: ${colors.yellow}${this.warnings.length}${colors.reset}`);
        console.log(`  - 정보: ${colors.blue}${this.info.length}${colors.reset}\n`);

        if (totalIssues === 0) {
            console.log(`${colors.green}✅ 모든 검증 통과!${colors.reset}\n`);
            console.log(`${'='.repeat(80)}\n`);
            return;
        }

        // 오류 출력
        if (this.errors.length > 0) {
            console.log(`${colors.red}❌ 오류 (${this.errors.length}):${colors.reset}\n`);
            this.errors.forEach((error, index) => {
                console.log(`${index + 1}. Week ${error.week} Session ${error.session} [${error.category}]`);
                console.log(`   ${colors.red}${error.message}${colors.reset}`);
                if (error.fix) {
                    console.log(`   ${colors.blue}💡 해결: ${error.fix}${colors.reset}`);
                }
                if (error.path || error.file || error.zipFile) {
                    console.log(`   ${colors.blue}📁 ${error.path || error.file || error.zipFile}${colors.reset}`);
                }
                console.log('');
            });
        }

        // 경고 출력
        if (this.warnings.length > 0) {
            console.log(`${colors.yellow}⚠️  경고 (${this.warnings.length}):${colors.reset}\n`);
            this.warnings.forEach((warning, index) => {
                console.log(`${index + 1}. Week ${warning.week} Session ${warning.session} [${warning.category}]`);
                console.log(`   ${colors.yellow}${warning.message}${colors.reset}`);
                if (warning.path || warning.file || warning.zipFile) {
                    console.log(`   ${colors.blue}📁 ${warning.path || warning.file || warning.zipFile}${colors.reset}`);
                }
                console.log('');
            });
        }

        // 정보 출력 (처음 10개만)
        if (this.info.length > 0) {
            console.log(`${colors.blue}ℹ️  정보 (${this.info.length}):${colors.reset}\n`);
            this.info.slice(0, 10).forEach((info, index) => {
                console.log(`${index + 1}. Week ${info.week} Session ${info.session} [${info.category}]`);
                console.log(`   ${colors.blue}${info.message}${colors.reset}`);
                console.log('');
            });

            if (this.info.length > 10) {
                console.log(`   ... 그 외 ${this.info.length - 10}개 정보 항목\n`);
            }
        }

        console.log(`${'='.repeat(80)}\n`);

        // 종료 코드
        if (this.errors.length > 0) {
            process.exit(1);
        }
    }

    /**
     * 전체 검증 실행
     */
    async run() {
        console.log(`${colors.magenta}🔍 Lab Environment 검증 시작${colors.reset}\n`);

        await this.loadLabEnvironments();
        await this.loadCurriculum();

        this.validateZipFileExistence();
        this.validateZipContents();
        this.validateDataConsistency();
        this.validateMarkdownGuides();
        this.validateWithAWSMCP();

        this.printFinalResults();
    }

    /**
     * 특정 주차 검증
     */
    async runForWeek(weekNum) {
        console.log(`${colors.magenta}🔍 Week ${weekNum} Lab Environment 검증 시작${colors.reset}\n`);

        await this.loadLabEnvironments();
        await this.loadCurriculum();

        // 해당 주차만 필터링
        this.labEnvironments = this.labEnvironments.filter(env => env.week === weekNum);
        this.curriculum = this.curriculum.filter(w => w.week === weekNum);

        if (this.labEnvironments.length === 0) {
            console.log(`${colors.yellow}⚠️  Week ${weekNum}에 lab environment가 없습니다${colors.reset}\n`);
            return;
        }

        this.validateZipFileExistence();
        this.validateZipContents();
        this.validateDataConsistency();
        this.validateMarkdownGuides();
        this.validateWithAWSMCP();

        this.printFinalResults();
    }

    /**
     * 특정 파일 검증
     */
    async runForFile(filePath) {
        console.log(`${colors.magenta}🔍 파일 검증: ${filePath}${colors.reset}\n`);

        await this.loadLabEnvironments();
        this.loadCurriculum();

        // 파일 경로에서 week/session 추출
        const match = filePath.match(/week(\d+)\/(\d+-\d+)/);
        if (!match) {
            console.error(`${colors.red}✗ 파일 경로에서 week/session을 추출할 수 없습니다${colors.reset}`);
            process.exit(1);
        }

        const weekNum = parseInt(match[1]);
        const sessionMatch = match[2].match(/(\d+)-(\d+)/);
        const sessionNum = parseInt(sessionMatch[2]);

        // 해당 파일만 필터링
        this.labEnvironments = this.labEnvironments.filter(
            env => env.week === weekNum && env.session === sessionNum
        );
        this.curriculum = this.curriculum.filter(w => w.week === weekNum);

        if (this.labEnvironments.length === 0) {
            console.log(`${colors.yellow}⚠️  Week ${weekNum} Session ${sessionNum}에 lab environment가 없습니다${colors.reset}\n`);
            return;
        }

        this.validateZipFileExistence();
        this.validateZipContents();
        this.validateDataConsistency();
        this.validateMarkdownGuides();

        this.printFinalResults();
    }
}

// 메인 실행
const validator = new LabEnvironmentValidator();
const args = process.argv.slice(2);

if (args.length === 0) {
    // 전체 검증
    validator.run();
} else if (args[0] === '--week' && args[1]) {
    // 특정 주차 검증
    const weekNum = parseInt(args[1]);
    validator.runForWeek(weekNum);
} else {
    // 특정 파일 검증
    validator.runForFile(args[0]);
}
