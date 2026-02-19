#!/usr/bin/env node

/**
 * 종합 검토 시스템
 * 
 * 소스코드와 가이드의 품질을 체계적으로 검증합니다.
 * 
 * 사용법:
 *   npm run review              # 전체 검토
 *   npm run review:code         # 소스코드만 검토
 *   npm run review:guides       # 가이드만 검토
 *   npm run review:report       # 상세 리포트 생성
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
};

class ComprehensiveReviewer {
    constructor() {
        this.results = {
            code: {
                total: 0,
                passed: 0,
                failed: 0,
                warnings: 0,
                issues: []
            },
            guides: {
                total: 0,
                passed: 0,
                failed: 0,
                warnings: 0,
                issues: []
            },
            overall: {
                score: 0,
                grade: '',
                recommendations: []
            }
        };
    }

    /**
     * 전체 검토 실행
     */
    async runFullReview() {
        console.log(`\n${colors.cyan}${'='.repeat(80)}${colors.reset}`);
        console.log(`${colors.cyan}🔍 종합 검토 시스템 시작${colors.reset}`);
        console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}\n`);

        // 1. 소스코드 검토
        await this.reviewSourceCode();

        // 2. 가이드 검토
        await this.reviewGuides();

        // 3. 통합 분석
        this.analyzeOverall();

        // 4. 리포트 생성
        this.generateReport();
    }

    /**
     * 소스코드 검토
     */
    async reviewSourceCode() {
        console.log(`${colors.yellow}📦 소스코드 검토 중...${colors.reset}\n`);

        const checks = [
            this.checkTypeScriptErrors(),
            this.checkESLintIssues(),
            this.checkInlineStyles(),
            this.checkImportPaths(),
            this.checkComponentStructure(),
            this.checkCSSFiles(),
            this.checkAccessibility()
        ];

        for (const check of checks) {
            await check;
        }
    }

    /**
     * TypeScript 오류 검사
     */
    checkTypeScriptErrors() {
        console.log(`${colors.blue}  ├─ TypeScript 타입 검사...${colors.reset}`);

        try {
            execSync('npx tsc --noEmit', { stdio: 'pipe' });
            console.log(`${colors.green}  │  ✅ TypeScript 오류 없음${colors.reset}`);
            this.results.code.passed++;
        } catch (error) {
            const output = error.stdout?.toString() || error.stderr?.toString() || '';
            const errorCount = (output.match(/error TS/g) || []).length;

            console.log(`${colors.red}  │  ❌ TypeScript 오류 ${errorCount}개 발견${colors.reset}`);
            this.results.code.failed++;
            this.results.code.issues.push({
                category: 'TypeScript',
                severity: 'error',
                count: errorCount,
                message: 'TypeScript 타입 오류가 있습니다',
                fix: 'npx tsc --noEmit 실행하여 상세 오류 확인'
            });
        }

        this.results.code.total++;
    }

    /**
     * ESLint 검사
     */
    checkESLintIssues() {
        console.log(`${colors.blue}  ├─ ESLint 코드 품질 검사...${colors.reset}`);

        try {
            execSync('npx eslint src --ext .ts,.tsx --format json', { stdio: 'pipe' });
            console.log(`${colors.green}  │  ✅ ESLint 오류 없음${colors.reset}`);
            this.results.code.passed++;
        } catch (error) {
            const output = error.stdout?.toString() || '[]';
            const results = JSON.parse(output);
            const errorCount = results.reduce((sum, file) => sum + file.errorCount, 0);
            const warningCount = results.reduce((sum, file) => sum + file.warningCount, 0);

            if (errorCount > 0) {
                console.log(`${colors.red}  │  ❌ ESLint 오류 ${errorCount}개 발견${colors.reset}`);
                this.results.code.failed++;
            }

            if (warningCount > 0) {
                console.log(`${colors.yellow}  │  ⚠️  ESLint 경고 ${warningCount}개 발견${colors.reset}`);
                this.results.code.warnings += warningCount;
            }

            this.results.code.issues.push({
                category: 'ESLint',
                severity: errorCount > 0 ? 'error' : 'warning',
                count: errorCount + warningCount,
                message: `코드 품질 문제 발견`,
                fix: 'npx eslint src --ext .ts,.tsx --fix 실행'
            });
        }

        this.results.code.total++;
    }

    /**
     * 인라인 스타일 검사
     */
    checkInlineStyles() {
        console.log(`${colors.blue}  ├─ 인라인 스타일 검사...${colors.reset}`);

        const srcDir = path.join(process.cwd(), 'src');
        const files = this.getAllFiles(srcDir, ['.tsx', '.ts']);
        let inlineStyleCount = 0;
        const violatingFiles = [];

        files.forEach(file => {
            const content = fs.readFileSync(file, 'utf-8');
            const matches = content.match(/style=\{\{/g);

            if (matches) {
                inlineStyleCount += matches.length;
                violatingFiles.push({
                    file: path.relative(process.cwd(), file),
                    count: matches.length
                });
            }
        });

        if (inlineStyleCount === 0) {
            console.log(`${colors.green}  │  ✅ 인라인 스타일 없음${colors.reset}`);
            this.results.code.passed++;
        } else {
            console.log(`${colors.red}  │  ❌ 인라인 스타일 ${inlineStyleCount}개 발견${colors.reset}`);
            violatingFiles.forEach(({ file, count }) => {
                console.log(`${colors.red}  │     - ${file}: ${count}개${colors.reset}`);
            });

            this.results.code.failed++;
            this.results.code.issues.push({
                category: '스타일링',
                severity: 'error',
                count: inlineStyleCount,
                message: '인라인 스타일 사용 금지 (CSS 파일 사용 필수)',
                files: violatingFiles,
                fix: '별도 CSS 파일 생성 및 className 사용'
            });
        }

        this.results.code.total++;
    }

    /**
     * Import 경로 검사 (절대 경로 사용 확인)
     */
    checkImportPaths() {
        console.log(`${colors.blue}  ├─ Import 경로 검사...${colors.reset}`);

        const srcDir = path.join(process.cwd(), 'src');
        const files = this.getAllFiles(srcDir, ['.tsx', '.ts']);
        let relativeImportCount = 0;
        const violatingFiles = [];

        files.forEach(file => {
            const content = fs.readFileSync(file, 'utf-8');
            // 상대 경로 import 찾기 (../../ 패턴)
            const matches = content.match(/import .* from ['"]\.\.\/\.\.\//g);

            if (matches) {
                relativeImportCount += matches.length;
                violatingFiles.push({
                    file: path.relative(process.cwd(), file),
                    count: matches.length
                });
            }
        });

        if (relativeImportCount === 0) {
            console.log(`${colors.green}  │  ✅ 모든 import가 절대 경로 사용${colors.reset}`);
            this.results.code.passed++;
        } else {
            console.log(`${colors.yellow}  │  ⚠️  상대 경로 import ${relativeImportCount}개 발견${colors.reset}`);
            this.results.code.warnings += relativeImportCount;

            this.results.code.issues.push({
                category: 'Import 경로',
                severity: 'warning',
                count: relativeImportCount,
                message: '상대 경로 대신 절대 경로(@/) 사용 권장',
                files: violatingFiles,
                fix: 'import 경로를 @/로 시작하도록 변경'
            });
        }

        this.results.code.total++;
    }

    /**
     * 컴포넌트 구조 검사
     */
    checkComponentStructure() {
        console.log(`${colors.blue}  ├─ 컴포넌트 구조 검사...${colors.reset}`);

        const componentsDir = path.join(process.cwd(), 'src', 'components');
        const files = this.getAllFiles(componentsDir, ['.tsx']);
        let issueCount = 0;
        const issues = [];

        files.forEach(file => {
            const content = fs.readFileSync(file, 'utf-8');
            const fileName = path.basename(file, '.tsx');

            // 1. Props 인터페이스 확인
            if (!content.includes(`interface ${fileName}Props`)) {
                issueCount++;
                issues.push({
                    file: path.relative(process.cwd(), file),
                    issue: 'Props 인터페이스 누락'
                });
            }

            // 2. React.FC 사용 확인
            if (!content.includes('React.FC') && !content.includes('FC<')) {
                issueCount++;
                issues.push({
                    file: path.relative(process.cwd(), file),
                    issue: 'React.FC 타입 미사용'
                });
            }

            // 3. export 방식 확인
            if (!content.includes(`export const ${fileName}`)) {
                issueCount++;
                issues.push({
                    file: path.relative(process.cwd(), file),
                    issue: 'export const 방식 미사용'
                });
            }
        });

        if (issueCount === 0) {
            console.log(`${colors.green}  │  ✅ 모든 컴포넌트가 표준 구조 준수${colors.reset}`);
            this.results.code.passed++;
        } else {
            console.log(`${colors.yellow}  │  ⚠️  구조 문제 ${issueCount}개 발견${colors.reset}`);
            this.results.code.warnings += issueCount;

            this.results.code.issues.push({
                category: '컴포넌트 구조',
                severity: 'warning',
                count: issueCount,
                message: '컴포넌트 표준 구조 미준수',
                details: issues
            });
        }

        this.results.code.total++;
    }

    /**
     * CSS 파일 존재 확인
     */
    checkCSSFiles() {
        console.log(`${colors.blue}  ├─ CSS 파일 검사...${colors.reset}`);

        const srcDir = path.join(process.cwd(), 'src');
        const tsxFiles = this.getAllFiles(srcDir, ['.tsx']);
        let missingCSSCount = 0;
        const missingFiles = [];

        tsxFiles.forEach(file => {
            const content = fs.readFileSync(file, 'utf-8');
            const cssImport = content.match(/import ['"].*\.css['"]/);

            if (!cssImport) {
                // 스타일이 필요한 컴포넌트인지 확인 (className 사용 여부)
                if (content.includes('className=')) {
                    const cssFile = file.replace('.tsx', '.css');
                    if (!fs.existsSync(cssFile)) {
                        missingCSSCount++;
                        missingFiles.push(path.relative(process.cwd(), file));
                    }
                }
            }
        });

        if (missingCSSCount === 0) {
            console.log(`${colors.green}  │  ✅ 모든 컴포넌트에 CSS 파일 존재${colors.reset}`);
            this.results.code.passed++;
        } else {
            console.log(`${colors.yellow}  │  ⚠️  CSS 파일 누락 ${missingCSSCount}개${colors.reset}`);
            this.results.code.warnings += missingCSSCount;

            this.results.code.issues.push({
                category: 'CSS 파일',
                severity: 'warning',
                count: missingCSSCount,
                message: 'className 사용하는 컴포넌트에 CSS 파일 누락',
                files: missingFiles
            });
        }

        this.results.code.total++;
    }

    /**
     * 접근성 검사
     */
    checkAccessibility() {
        console.log(`${colors.blue}  └─ 접근성 검사...${colors.reset}\n`);

        const srcDir = path.join(process.cwd(), 'src');
        const files = this.getAllFiles(srcDir, ['.tsx']);
        let issueCount = 0;
        const issues = [];

        files.forEach(file => {
            const content = fs.readFileSync(file, 'utf-8');

            // 1. img 태그에 alt 속성 확인
            const imgMatches = content.match(/<img[^>]*>/g);
            if (imgMatches) {
                imgMatches.forEach(img => {
                    if (!img.includes('alt=')) {
                        issueCount++;
                        issues.push({
                            file: path.relative(process.cwd(), file),
                            issue: 'img 태그에 alt 속성 누락'
                        });
                    }
                });
            }

            // 2. button에 aria-label 또는 텍스트 확인
            const buttonMatches = content.match(/<button[^>]*>[\s\S]*?<\/button>/g);
            if (buttonMatches) {
                buttonMatches.forEach(button => {
                    if (!button.includes('aria-label') && !button.match(/>[\s\S]*?[가-힣a-zA-Z]/)) {
                        issueCount++;
                        issues.push({
                            file: path.relative(process.cwd(), file),
                            issue: 'button에 aria-label 또는 텍스트 누락'
                        });
                    }
                });
            }
        });

        if (issueCount === 0) {
            console.log(`${colors.green}  ✅ 접근성 문제 없음${colors.reset}\n`);
            this.results.code.passed++;
        } else {
            console.log(`${colors.yellow}  ⚠️  접근성 문제 ${issueCount}개 발견${colors.reset}\n`);
            this.results.code.warnings += issueCount;

            this.results.code.issues.push({
                category: '접근성',
                severity: 'warning',
                count: issueCount,
                message: 'WCAG 접근성 기준 미준수',
                details: issues
            });
        }

        this.results.code.total++;
    }

    /**
     * 가이드 검토
     */
    async reviewGuides() {
        console.log(`${colors.yellow}📚 실습 가이드 검토 중...${colors.reset}\n`);

        // 기본 검증 실행
        console.log(`${colors.blue}  ├─ 기본 표준 검증...${colors.reset}`);
        try {
            execSync('node scripts/validate-markdown-guide.js', { stdio: 'pipe' });
            console.log(`${colors.green}  │  ✅ 기본 표준 통과${colors.reset}`);
            this.results.guides.passed++;
        } catch (error) {
            const output = error.stdout?.toString() || '';
            const errorCount = (output.match(/❌ 오류/g) || []).length;
            const warningCount = (output.match(/⚠️  경고/g) || []).length;

            if (errorCount > 0) {
                console.log(`${colors.red}  │  ❌ 오류 ${errorCount}개 발견${colors.reset}`);
                this.results.guides.failed++;
            }

            if (warningCount > 0) {
                console.log(`${colors.yellow}  │  ⚠️  경고 ${warningCount}개 발견${colors.reset}`);
                this.results.guides.warnings += warningCount;
            }

            this.results.guides.issues.push({
                category: '기본 표준',
                severity: errorCount > 0 ? 'error' : 'warning',
                count: errorCount + warningCount,
                message: '마크다운 표준 미준수',
                fix: 'npm run validate:all 실행하여 상세 확인'
            });
        }

        this.results.guides.total++;

        // 파일 내용 검증 실행
        console.log(`${colors.blue}  ├─ ZIP 파일 내용 검증...${colors.reset}`);
        try {
            execSync('node scripts/validate-file-contents.js', { stdio: 'pipe' });
            console.log(`${colors.green}  │  ✅ 파일 내용 검증 통과${colors.reset}`);
            this.results.guides.passed++;
        } catch (error) {
            const output = error.stdout?.toString() || '';
            const errorCount = (output.match(/❌ 오류/g) || []).length;
            const warningCount = (output.match(/⚠️  경고/g) || []).length;

            if (errorCount > 0) {
                console.log(`${colors.red}  │  ❌ 파일 내용 오류 ${errorCount}개 발견${colors.reset}`);
                this.results.guides.failed++;
            }

            if (warningCount > 0) {
                console.log(`${colors.yellow}  │  ⚠️  파일 내용 경고 ${warningCount}개 발견${colors.reset}`);
                this.results.guides.warnings += warningCount;
            }

            this.results.guides.issues.push({
                category: '파일 내용',
                severity: errorCount > 0 ? 'error' : 'warning',
                count: errorCount + warningCount,
                message: 'CloudFormation/Python/SQL 파일 검증 실패',
                fix: 'npm run validate:file-contents 실행하여 상세 확인'
            });
        }

        this.results.guides.total++;

        // 고급 검증 실행
        console.log(`${colors.blue}  └─ 고급 표준 검증...${colors.reset}\n`);
        try {
            execSync('node scripts/validate-advanced.js', { stdio: 'pipe' });
            console.log(`${colors.green}  ✅ 고급 표준 통과${colors.reset}\n`);
            this.results.guides.passed++;
        } catch (error) {
            const output = error.stdout?.toString() || '';
            const infoCount = (output.match(/정보:/g) || []).length;

            if (infoCount > 0) {
                console.log(`${colors.cyan}  ℹ️  개선 제안 ${infoCount}개${colors.reset}\n`);
                this.results.guides.warnings += infoCount;
            }

            this.results.guides.issues.push({
                category: '고급 표준',
                severity: 'info',
                count: infoCount,
                message: '일관성 및 구조 개선 가능',
                fix: 'npm run validate:advanced 실행하여 상세 확인'
            });
        }

        this.results.guides.total++;
    }

    /**
     * 통합 분석
     */
    analyzeOverall() {
        console.log(`${colors.yellow}📊 통합 분석 중...${colors.reset}\n`);

        // 점수 계산
        const totalChecks = this.results.code.total + this.results.guides.total;
        const totalPassed = this.results.code.passed + this.results.guides.passed;
        const totalFailed = this.results.code.failed + this.results.guides.failed;

        this.results.overall.score = Math.round((totalPassed / totalChecks) * 100);

        // 등급 산정
        if (this.results.overall.score >= 90) {
            this.results.overall.grade = 'A';
        } else if (this.results.overall.score >= 80) {
            this.results.overall.grade = 'B';
        } else if (this.results.overall.score >= 70) {
            this.results.overall.grade = 'C';
        } else if (this.results.overall.score >= 60) {
            this.results.overall.grade = 'D';
        } else {
            this.results.overall.grade = 'F';
        }

        // 권장사항 생성
        if (totalFailed > 0) {
            this.results.overall.recommendations.push({
                priority: 'high',
                message: `${totalFailed}개의 오류를 먼저 수정하세요`,
                action: '오류 항목부터 우선 처리'
            });
        }

        if (this.results.code.warnings > 10) {
            this.results.overall.recommendations.push({
                priority: 'medium',
                message: '코드 품질 경고가 많습니다',
                action: 'ESLint 및 구조 개선 필요'
            });
        }

        if (this.results.guides.warnings > 20) {
            this.results.overall.recommendations.push({
                priority: 'medium',
                message: '가이드 일관성 개선이 필요합니다',
                action: '표준 문구 및 구조 통일'
            });
        }

        if (this.results.overall.score < 80) {
            this.results.overall.recommendations.push({
                priority: 'high',
                message: '전반적인 품질 개선이 필요합니다',
                action: '체계적인 리팩토링 계획 수립'
            });
        }
    }

    /**
     * 리포트 생성
     */
    generateReport() {
        console.log(`\n${colors.cyan}${'='.repeat(80)}${colors.reset}`);
        console.log(`${colors.cyan}📋 종합 검토 리포트${colors.reset}`);
        console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}\n`);

        // 전체 점수
        const gradeColor = this.results.overall.score >= 80 ? colors.green :
            this.results.overall.score >= 60 ? colors.yellow : colors.red;

        console.log(`${colors.white}전체 점수: ${gradeColor}${this.results.overall.score}점 (${this.results.overall.grade}등급)${colors.reset}\n`);

        // 소스코드 결과
        console.log(`${colors.yellow}📦 소스코드 검토 결과${colors.reset}`);
        console.log(`  총 검사: ${this.results.code.total}개`);
        console.log(`  ${colors.green}통과: ${this.results.code.passed}개${colors.reset}`);
        console.log(`  ${colors.red}실패: ${this.results.code.failed}개${colors.reset}`);
        console.log(`  ${colors.yellow}경고: ${this.results.code.warnings}개${colors.reset}\n`);

        if (this.results.code.issues.length > 0) {
            console.log(`  ${colors.red}주요 문제:${colors.reset}`);
            this.results.code.issues.forEach((issue, index) => {
                const icon = issue.severity === 'error' ? '❌' : '⚠️';
                console.log(`  ${icon} ${issue.category}: ${issue.message} (${issue.count}개)`);
                if (issue.fix) {
                    console.log(`     💡 해결: ${issue.fix}`);
                }
            });
            console.log('');
        }

        // 가이드 결과
        console.log(`${colors.yellow}📚 실습 가이드 검토 결과${colors.reset}`);
        console.log(`  총 검사: ${this.results.guides.total}개`);
        console.log(`  ${colors.green}통과: ${this.results.guides.passed}개${colors.reset}`);
        console.log(`  ${colors.red}실패: ${this.results.guides.failed}개${colors.reset}`);
        console.log(`  ${colors.yellow}경고: ${this.results.guides.warnings}개${colors.reset}\n`);

        if (this.results.guides.issues.length > 0) {
            console.log(`  ${colors.red}주요 문제:${colors.reset}`);
            this.results.guides.issues.forEach((issue, index) => {
                const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
                console.log(`  ${icon} ${issue.category}: ${issue.message} (${issue.count}개)`);
                if (issue.fix) {
                    console.log(`     💡 해결: ${issue.fix}`);
                }
            });
            console.log('');
        }

        // 권장사항
        if (this.results.overall.recommendations.length > 0) {
            console.log(`${colors.yellow}💡 권장사항${colors.reset}`);
            this.results.overall.recommendations.forEach((rec, index) => {
                const priorityColor = rec.priority === 'high' ? colors.red : colors.yellow;
                console.log(`  ${index + 1}. [${priorityColor}${rec.priority.toUpperCase()}${colors.reset}] ${rec.message}`);
                console.log(`     → ${rec.action}\n`);
            });
        }

        // 다음 단계
        console.log(`${colors.cyan}🎯 다음 단계${colors.reset}`);
        if (this.results.code.failed > 0 || this.results.guides.failed > 0) {
            console.log(`  1. ${colors.red}오류 수정${colors.reset}: 먼저 모든 오류를 수정하세요`);
            console.log(`  2. ${colors.yellow}경고 검토${colors.reset}: 경고 항목을 검토하고 개선하세요`);
            console.log(`  3. ${colors.green}재검증${colors.reset}: npm run review 다시 실행\n`);
        } else if (this.results.code.warnings > 0 || this.results.guides.warnings > 0) {
            console.log(`  1. ${colors.yellow}경고 개선${colors.reset}: 경고 항목을 하나씩 개선하세요`);
            console.log(`  2. ${colors.green}재검증${colors.reset}: npm run review 다시 실행\n`);
        } else {
            console.log(`  ${colors.green}✅ 모든 검증 통과! 배포 준비 완료${colors.reset}\n`);
        }

        console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}\n`);

        // JSON 리포트 저장
        this.saveJSONReport();
    }

    /**
     * JSON 리포트 저장
     */
    saveJSONReport() {
        const reportPath = path.join(process.cwd(), 'REVIEW_REPORT.json');
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`${colors.cyan}📄 상세 리포트 저장: ${reportPath}${colors.reset}\n`);
    }

    /**
     * 디렉토리에서 특정 확장자 파일 찾기
     */
    getAllFiles(dirPath, extensions) {
        const files = [];

        const walk = (dir) => {
            const items = fs.readdirSync(dir);

            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
                    walk(fullPath);
                } else if (extensions.some(ext => item.endsWith(ext))) {
                    files.push(fullPath);
                }
            });
        };

        walk(dirPath);
        return files;
    }
}

// 메인 실행
const reviewer = new ComprehensiveReviewer();
const args = process.argv.slice(2);

if (args.includes('--code')) {
    reviewer.reviewSourceCode().then(() => {
        reviewer.analyzeOverall();
        reviewer.generateReport();
    });
} else if (args.includes('--guides')) {
    reviewer.reviewGuides().then(() => {
        reviewer.analyzeOverall();
        reviewer.generateReport();
    });
} else {
    reviewer.runFullReview();
}
