#!/usr/bin/env node

/**
 * Lab Files Recompression Script
 * 
 * 압축 해제된 폴더들을 다시 ZIP 파일로 압축합니다.
 * 
 * 사용법:
 *   node scripts/recompress-lab-files.cjs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

console.log(`${colors.magenta}🗜️  Lab Files 재압축 시작${colors.reset}\n`);

// public/files 디렉토리 경로
const filesDir = path.join(__dirname, '../public/files');

// 모든 week 폴더 찾기
const weekDirs = fs.readdirSync(filesDir)
    .filter(name => name.startsWith('week') && fs.statSync(path.join(filesDir, name)).isDirectory())
    .sort();

let totalCompressed = 0;
let totalSkipped = 0;
let totalErrors = 0;

weekDirs.forEach(weekDir => {
    const weekPath = path.join(filesDir, weekDir);
    console.log(`${colors.cyan}📁 ${weekDir}${colors.reset}`);

    // 해당 week 폴더 내의 모든 항목 확인
    const items = fs.readdirSync(weekPath);

    items.forEach(item => {
        const itemPath = path.join(weekPath, item);
        const stat = fs.statSync(itemPath);

        // 폴더이고 .zip 파일이 아닌 경우
        if (stat.isDirectory() && !item.endsWith('.zip')) {
            const zipFileName = `${item}.zip`;
            const zipFilePath = path.join(weekPath, zipFileName);

            // 이미 ZIP 파일이 존재하는지 확인
            if (fs.existsSync(zipFilePath)) {
                console.log(`  ${colors.yellow}⏭️  건너뜀: ${zipFileName} (이미 존재)${colors.reset}`);
                totalSkipped++;
                return;
            }

            try {
                // ZIP 파일 생성
                // -r: 재귀적으로 압축
                // -q: 조용한 모드
                // -X: 추가 파일 속성 제외
                // -x: __MACOSX 및 .DS_Store 제외
                const command = `cd "${weekPath}" && zip -r -q -X "${zipFileName}" "${item}" -x "*.DS_Store" -x "__MACOSX/*"`;

                execSync(command, { encoding: 'utf-8' });

                // 파일 크기 확인
                const zipStat = fs.statSync(zipFilePath);
                const sizeMB = (zipStat.size / 1024 / 1024).toFixed(2);

                console.log(`  ${colors.green}✓ 압축 완료: ${zipFileName} (${sizeMB} MB)${colors.reset}`);
                totalCompressed++;

            } catch (error) {
                console.log(`  ${colors.red}✗ 압축 실패: ${item}${colors.reset}`);
                console.log(`     ${colors.red}오류: ${error.message}${colors.reset}`);
                totalErrors++;
            }
        }
    });

    console.log('');
});

// 최종 결과
console.log(`${'='.repeat(80)}`);
console.log(`${colors.cyan}📊 재압축 결과${colors.reset}\n`);
console.log(`총 처리: ${totalCompressed + totalSkipped + totalErrors}개`);
console.log(`  - 압축 완료: ${colors.green}${totalCompressed}${colors.reset}`);
console.log(`  - 건너뜀: ${colors.yellow}${totalSkipped}${colors.reset}`);
console.log(`  - 오류: ${colors.red}${totalErrors}${colors.reset}\n`);

if (totalErrors === 0) {
    console.log(`${colors.green}✅ 모든 파일이 성공적으로 압축되었습니다!${colors.reset}\n`);
} else {
    console.log(`${colors.red}❌ ${totalErrors}개 파일 압축 실패${colors.reset}\n`);
    process.exit(1);
}

console.log(`${'='.repeat(80)}\n`);
