#!/usr/bin/env node

/**
 * ZIP 내부 파일 내용 검증 스크립트
 * 
 * 이 스크립트는 ZIP 파일 내부의 실제 파일 내용을 검증합니다.
 * 
 * 검증 항목:
 * 1. CloudFormation 템플릿 (YAML) 검증
 * 2. Python 스크립트 검증
 * 3. SQL 파일 검증
 * 4. JSON 파일 검증
 * 5. README 파일 검증
 * 
 * 사용법:
 *   npm run validate:file-contents              # 전체 검증
 *   npm run validate:file-contents <weekNum>    # 특정 주차 검증
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import os from 'os';

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
 * File Content Validator
 */
class FileContentValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.info = [];
        this.labEnvironments = null;
        this.tempDir = path.join(os.tmpdir(), 'lab-file-validation');
    }

    /**
     * labEnvironments.ts 데이터 로드
     */
    async loadLabEnvironments() {
        try {
            const labEnvPath = path.join(__dirname, '../src/data/labEnvironments.ts');
            const tempDir = path.join(__dirname, '../temp');
            const tempOutFile = path.join(tempDir, 'labEnvironments.js');

            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            console.log(`${colors.blue}ℹ${colors.reset} TypeScript 파일 컴파일 중...\n`);

            try {
                execSync(
                    `npx tsc "${labEnvPath}" --outDir "${tempDir}" --module es2020 --target es2020 --skipLibCheck --esModuleInterop`,
                    { encoding: 'utf-8', stdio: 'pipe' }
                );
            } catch (compileError) {
                throw new Error(`TypeScript 컴파일 실패: ${compileError.message}`);
            }

            if (!fs.existsSync(tempOutFile)) {
                throw new Error('컴파일된 파일을 찾을 수 없습니다');
            }

            const fileUrl = new URL(`file://${tempOutFile}`);
            const labEnvModule = await import(fileUrl.href);
            this.labEnvironments = labEnvModule.labEnvironments;

            if (!this.labEnvironments || !Array.isArray(this.labEnvironments)) {
                throw new Error('labEnvironments 배열을 찾을 수 없습니다');
            }

            try {
                fs.rmSync(tempDir, { recursive: true, force: true });
            } catch (cleanupError) {
                // 정리 실패는 무시
            }

            console.log(`${colors.green}✓${colors.reset} labEnvironments.ts 로드 완료 (${this.labEnvironments.length}개 항목)\n`);
        } catch (error) {
            console.error(`${colors.red}✗ labEnvironments.ts 로드 실패:${colors.reset}`, error.message);
            process.exit(1);
        }
    }

    /**
     * ZIP 파일 압축 해제
     */
    extractZipFile(zipPath, extractPath) {
        try {
            if (!fs.existsSync(extractPath)) {
                fs.mkdirSync(extractPath, { recursive: true });
            }

            execSync(`unzip -q -o "${zipPath}" -d "${extractPath}"`, { encoding: 'utf-8' });
            return true;
        } catch (error) {
            this.errors.push({
                category: 'ZIP 압축 해제',
                severity: 'error',
                message: `ZIP 파일 압축 해제 실패: ${error.message}`,
                file: zipPath
            });
            return false;
        }
    }

    /**
     * 1. CloudFormation 템플릿 검증
     */
    validateCloudFormationTemplate(filePath, week, session) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileName = path.basename(filePath);

        // Kubernetes YAML 파일 감지 (CloudFormation이 아님)
        const kubernetesIndicators = [
            'apiVersion:',
            'kind: Deployment',
            'kind: Service',
            'kind: Ingress',
            'kind: Pod',
            'kind: ConfigMap',
            'kind: Secret',
            'metadata:',
            'spec:',
            'selector:'
        ];

        let kubernetesIndicatorCount = 0;
        kubernetesIndicators.forEach(indicator => {
            if (content.includes(indicator)) {
                kubernetesIndicatorCount++;
            }
        });

        // Kubernetes YAML 파일이면 검증 스킵
        if (kubernetesIndicatorCount >= 2) {
            this.info.push({
                category: 'Kubernetes',
                severity: 'info',
                week,
                session,
                file: fileName,
                message: 'Kubernetes YAML 파일 (CloudFormation 검증 스킵)'
            });
            return;
        }

        // YAML 문법 검증 (기본적인 파싱 시도)
        try {
            // YAML 파싱 (간단한 검증)
            if (!content.trim()) {
                this.errors.push({
                    category: 'CloudFormation',
                    severity: 'error',
                    week,
                    session,
                    file: fileName,
                    message: '파일이 비어있습니다'
                });
                return;
            }

            // 필수 섹션 확인
            const requiredSections = ['Resources'];
            const recommendedSections = ['Description', 'Parameters', 'Outputs'];

            requiredSections.forEach(section => {
                if (!content.includes(`${section}:`)) {
                    this.errors.push({
                        category: 'CloudFormation',
                        severity: 'error',
                        week,
                        session,
                        file: fileName,
                        message: `필수 섹션 누락: ${section}`
                    });
                }
            });

            recommendedSections.forEach(section => {
                if (!content.includes(`${section}:`)) {
                    this.warnings.push({
                        category: 'CloudFormation',
                        severity: 'warning',
                        week,
                        session,
                        file: fileName,
                        message: `권장 섹션 누락: ${section}`
                    });
                }
            });

            // 리소스 타입 확인
            const resourceTypes = [
                'AWS::EC2::VPC',
                'AWS::EC2::Subnet',
                'AWS::EC2::SecurityGroup',
                'AWS::EC2::Instance',
                'AWS::RDS::DBInstance',
                'AWS::Lambda::Function',
                'AWS::DynamoDB::Table',
                'AWS::S3::Bucket',
                'AWS::S3::BucketPolicy',
                'AWS::CodeCommit::Repository',
                'AWS::CodeBuild::Project',
                'AWS::CodePipeline::Pipeline',
                'AWS::IAM::Role',
                'AWS::IAM::Policy'
            ];

            let hasResources = false;
            resourceTypes.forEach(type => {
                if (content.includes(type)) {
                    hasResources = true;
                }
            });

            if (!hasResources) {
                this.warnings.push({
                    category: 'CloudFormation',
                    severity: 'warning',
                    week,
                    session,
                    file: fileName,
                    message: '알려진 AWS 리소스 타입이 없습니다'
                });
            }

            // Outputs 섹션 상세 검증
            if (content.includes('Outputs:')) {
                const outputsMatch = content.match(/Outputs:([\s\S]*?)(?=\n\w+:|$)/);
                if (outputsMatch) {
                    const outputsSection = outputsMatch[1];

                    // Value 키워드 확인
                    if (!outputsSection.includes('Value:')) {
                        this.warnings.push({
                            category: 'CloudFormation',
                            severity: 'warning',
                            week,
                            session,
                            file: fileName,
                            message: 'Outputs 섹션에 Value가 없습니다'
                        });
                    }

                    // Description 권장
                    if (!outputsSection.includes('Description:')) {
                        this.info.push({
                            category: 'CloudFormation',
                            severity: 'info',
                            week,
                            session,
                            file: fileName,
                            message: 'Outputs에 Description 추가 권장'
                        });
                    }
                }
            }

            // 주석 확인
            const commentLines = content.split('\n').filter(line => line.trim().startsWith('#'));
            if (commentLines.length === 0) {
                this.info.push({
                    category: 'CloudFormation',
                    severity: 'info',
                    week,
                    session,
                    file: fileName,
                    message: '주석 추가 권장 (템플릿 설명)'
                });
            }

        } catch (error) {
            this.errors.push({
                category: 'CloudFormation',
                severity: 'error',
                week,
                session,
                file: fileName,
                message: `파일 파싱 실패: ${error.message}`
            });
        }
    }

    /**
     * 2. Python 스크립트 검증
     */
    validatePythonScript(filePath, week, session) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileName = path.basename(filePath);

        // Python 문법 검증 (python -m py_compile)
        try {
            execSync(`python3 -m py_compile "${filePath}"`, { encoding: 'utf-8', stdio: 'pipe' });
        } catch (error) {
            this.errors.push({
                category: 'Python',
                severity: 'error',
                week,
                session,
                file: fileName,
                message: `Python 문법 오류: ${error.message}`
            });
            return;
        }

        // Lambda 함수인지 확인
        const isLambdaFunction = content.includes('def lambda_handler');

        if (isLambdaFunction) {
            // Lambda 함수 검증

            // 1. 모듈 레벨 DocString 확인
            const hasModuleDocstring = content.match(/^"""[\s\S]*?"""/m) || content.match(/^'''[\s\S]*?'''/m);
            if (!hasModuleDocstring) {
                this.warnings.push({
                    category: 'Python',
                    severity: 'warning',
                    week,
                    session,
                    file: fileName,
                    message: 'Lambda 함수: 모듈 레벨 DocString 누락 (규칙 40)'
                });
            }

            // 2. 함수 레벨 DocString 확인
            const lambdaHandlerMatch = content.match(/def lambda_handler\([\s\S]*?\):([\s\S]*?)(?=\n    \w|\ndef |\nclass |\n$)/);
            if (lambdaHandlerMatch) {
                const functionBody = lambdaHandlerMatch[1];
                const hasFunctionDocstring = functionBody.trim().startsWith('"""') || functionBody.trim().startsWith("'''");

                if (!hasFunctionDocstring) {
                    this.warnings.push({
                        category: 'Python',
                        severity: 'warning',
                        week,
                        session,
                        file: fileName,
                        message: 'lambda_handler 함수: DocString 누락 (Args, Returns 설명 필요)'
                    });
                }
            }

            // 3. 한국어 주석 확인
            const koreanComments = content.split('\n').filter(line => {
                const trimmed = line.trim();
                return trimmed.startsWith('#') && /[가-힣]/.test(trimmed);
            });

            if (koreanComments.length === 0) {
                this.info.push({
                    category: 'Python',
                    severity: 'info',
                    week,
                    session,
                    file: fileName,
                    message: '한국어 주석 추가 권장 (규칙 40)'
                });
            }

            // 4. import 문 확인
            if (!content.includes('import')) {
                this.warnings.push({
                    category: 'Python',
                    severity: 'warning',
                    week,
                    session,
                    file: fileName,
                    message: 'import 문이 없습니다 (boto3, json 등 필요)'
                });
            }
        }

        // 일반 Python 스크립트 검증
        else {
            // 기본 주석 확인
            const commentLines = content.split('\n').filter(line => line.trim().startsWith('#'));
            if (commentLines.length === 0) {
                this.info.push({
                    category: 'Python',
                    severity: 'info',
                    week,
                    session,
                    file: fileName,
                    message: '주석 추가 권장'
                });
            }
        }
    }

    /**
     * 3. SQL 파일 검증
     */
    validateSQLFile(filePath, week, session) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileName = path.basename(filePath);

        if (!content.trim()) {
            this.errors.push({
                category: 'SQL',
                severity: 'error',
                week,
                session,
                file: fileName,
                message: '파일이 비어있습니다'
            });
            return;
        }

        // SQL 키워드 확인
        const sqlKeywords = ['CREATE', 'INSERT', 'SELECT', 'UPDATE', 'DELETE', 'DROP', 'ALTER'];
        let hasSQLKeyword = false;

        sqlKeywords.forEach(keyword => {
            if (content.toUpperCase().includes(keyword)) {
                hasSQLKeyword = true;
            }
        });

        if (!hasSQLKeyword) {
            this.warnings.push({
                category: 'SQL',
                severity: 'warning',
                week,
                session,
                file: fileName,
                message: 'SQL 키워드가 없습니다'
            });
        }

        // 세미콜론 확인
        if (!content.includes(';')) {
            this.warnings.push({
                category: 'SQL',
                severity: 'warning',
                week,
                session,
                file: fileName,
                message: 'SQL 문이 세미콜론(;)으로 끝나지 않습니다'
            });
        }

        // 주석 확인
        const commentLines = content.split('\n').filter(line => {
            const trimmed = line.trim();
            return trimmed.startsWith('--') || trimmed.startsWith('/*');
        });

        if (commentLines.length === 0) {
            this.info.push({
                category: 'SQL',
                severity: 'info',
                week,
                session,
                file: fileName,
                message: '주석 추가 권장 (-- 또는 /* */)'
            });
        }
    }

    /**
     * 4. JSON 파일 검증
     */
    validateJSONFile(filePath, week, session) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileName = path.basename(filePath);

        try {
            JSON.parse(content);
        } catch (error) {
            this.errors.push({
                category: 'JSON',
                severity: 'error',
                week,
                session,
                file: fileName,
                message: `JSON 파싱 오류: ${error.message}`
            });
        }
    }

    /**
     * 5. README 파일 검증
     */
    validateREADMEFile(filePath, week, session) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileName = path.basename(filePath);

        if (!content.trim()) {
            this.warnings.push({
                category: 'README',
                severity: 'warning',
                week,
                session,
                file: fileName,
                message: 'README 파일이 비어있습니다'
            });
            return;
        }

        // 최소 길이 확인
        if (content.length < 100) {
            this.warnings.push({
                category: 'README',
                severity: 'warning',
                week,
                session,
                file: fileName,
                message: 'README 내용이 너무 짧습니다 (최소 100자 권장)'
            });
        }

        // 마크다운 제목 확인
        if (!content.includes('#')) {
            this.info.push({
                category: 'README',
                severity: 'info',
                week,
                session,
                file: fileName,
                message: '마크다운 제목(#) 추가 권장'
            });
        }
    }

    /**
     * 파일 타입별 검증 실행
     */
    validateFile(filePath, week, session) {
        const ext = path.extname(filePath).toLowerCase();
        const fileName = path.basename(filePath).toLowerCase();

        // buildspec.yml은 CloudFormation이 아니므로 제외
        if (fileName === 'buildspec.yml' || fileName === 'buildspec.yaml') {
            return;
        }

        if (ext === '.yaml' || ext === '.yml') {
            this.validateCloudFormationTemplate(filePath, week, session);
        } else if (ext === '.py') {
            this.validatePythonScript(filePath, week, session);
        } else if (ext === '.sql') {
            this.validateSQLFile(filePath, week, session);
        } else if (ext === '.json') {
            this.validateJSONFile(filePath, week, session);
        } else if (fileName === 'readme.md' || fileName === 'readme.txt' || fileName === 'readme') {
            this.validateREADMEFile(filePath, week, session);
        }
    }

    /**
     * 모든 파일 검증
     */
    validateAllFiles(extractPath, week, session) {
        const files = this.getAllFiles(extractPath);

        files.forEach(file => {
            // 시스템 파일 무시
            if (file.includes('__MACOSX') || path.basename(file).startsWith('.')) {
                return;
            }

            this.validateFile(file, week, session);
        });
    }

    /**
     * 디렉토리 내 모든 파일 찾기
     */
    getAllFiles(dirPath, arrayOfFiles = []) {
        const files = fs.readdirSync(dirPath);

        files.forEach(file => {
            const fullPath = path.join(dirPath, file);
            if (fs.statSync(fullPath).isDirectory()) {
                arrayOfFiles = this.getAllFiles(fullPath, arrayOfFiles);
            } else {
                arrayOfFiles.push(fullPath);
            }
        });

        return arrayOfFiles;
    }

    /**
     * 카테고리별 결과 출력
     */
    printCategoryResults(category) {
        const categoryErrors = this.errors.filter(e => e.category === category);
        const categoryWarnings = this.warnings.filter(w => w.category === category);
        const categoryInfo = this.info.filter(i => i.category === category);

        if (categoryErrors.length === 0 && categoryWarnings.length === 0) {
            console.log(`${colors.green}✓${colors.reset} ${category}: 문제 없음\n`);
        } else {
            if (categoryErrors.length > 0) {
                console.log(`${colors.red}✗ ${category}: ${categoryErrors.length}개 오류${colors.reset}`);
                categoryErrors.slice(0, 5).forEach(err => {
                    console.log(`  Week ${err.week} Session ${err.session} - ${err.file}`);
                    console.log(`  ${colors.red}${err.message}${colors.reset}\n`);
                });
                if (categoryErrors.length > 5) {
                    console.log(`  ... 그 외 ${categoryErrors.length - 5}개 오류\n`);
                }
            }

            if (categoryWarnings.length > 0) {
                console.log(`${colors.yellow}⚠${colors.reset}  ${category}: ${categoryWarnings.length}개 경고`);
                categoryWarnings.slice(0, 3).forEach(warn => {
                    console.log(`  Week ${warn.week} Session ${warn.session} - ${warn.file}`);
                    console.log(`  ${colors.yellow}${warn.message}${colors.reset}\n`);
                });
                if (categoryWarnings.length > 3) {
                    console.log(`  ... 그 외 ${categoryWarnings.length - 3}개 경고\n`);
                }
            }
        }
    }

    /**
     * 최종 결과 출력
     */
    printFinalResults() {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`${colors.cyan}📊 파일 내용 검증 결과${colors.reset}`);
        console.log(`${'='.repeat(80)}\n`);

        console.log(`${colors.red}오류:${colors.reset} ${this.errors.length}개`);
        console.log(`${colors.yellow}경고:${colors.reset} ${this.warnings.length}개`);
        console.log(`${colors.blue}정보:${colors.reset} ${this.info.length}개\n`);

        if (this.errors.length > 0) {
            console.log(`${colors.red}❌ 오류 목록:${colors.reset}\n`);
            this.errors.slice(0, 10).forEach((error, index) => {
                console.log(`${index + 1}. Week ${error.week} Session ${error.session} [${error.category}]`);
                console.log(`   파일: ${error.file}`);
                console.log(`   ${colors.red}${error.message}${colors.reset}`);
                console.log('');
            });

            if (this.errors.length > 10) {
                console.log(`   ... 그 외 ${this.errors.length - 10}개 오류\n`);
            }
        }

        if (this.warnings.length > 0) {
            console.log(`${colors.yellow}⚠️  경고 목록:${colors.reset}\n`);
            this.warnings.slice(0, 10).forEach((warning, index) => {
                console.log(`${index + 1}. Week ${warning.week} Session ${warning.session} [${warning.category}]`);
                console.log(`   파일: ${warning.file}`);
                console.log(`   ${colors.yellow}${warning.message}${colors.reset}`);
                console.log('');
            });

            if (this.warnings.length > 10) {
                console.log(`   ... 그 외 ${this.warnings.length - 10}개 경고\n`);
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
    async run(weekFilter = null) {
        console.log(`${colors.magenta}🔍 ZIP 파일 내용 검증 시작${colors.reset}\n`);

        await this.loadLabEnvironments();

        // 주차 필터링
        let environments = this.labEnvironments;
        if (weekFilter) {
            environments = environments.filter(env => env.week === weekFilter);
            console.log(`${colors.blue}ℹ${colors.reset} Week ${weekFilter}만 검증합니다\n`);
        }

        // temp 디렉토리 생성
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }

        let processedCount = 0;

        for (const env of environments) {
            if (!env.hasPrerequisites || !env.zipFileName) continue;

            const zipPath = path.join(__dirname, '../public/files', `week${env.week}`, env.zipFileName);

            if (!fs.existsSync(zipPath)) {
                console.log(`${colors.yellow}⚠${colors.reset}  Week ${env.week} Session ${env.session}: ZIP 파일 없음 (건너뜀)\n`);
                continue;
            }

            console.log(`${colors.cyan}📦 Week ${env.week} Session ${env.session}: ${env.zipFileName}${colors.reset}`);

            // ZIP 압축 해제
            const extractPath = path.join(this.tempDir, `week${env.week}-${env.session}`);
            if (this.extractZipFile(zipPath, extractPath)) {
                // 파일 검증
                this.validateAllFiles(extractPath, env.week, env.session);
                processedCount++;
            }

            console.log('');
        }

        // temp 디렉토리 정리
        try {
            fs.rmSync(this.tempDir, { recursive: true, force: true });
        } catch (cleanupError) {
            // 정리 실패는 무시
        }

        if (processedCount === 0) {
            console.log(`${colors.yellow}⚠️  검증할 ZIP 파일이 없습니다${colors.reset}\n`);
            return;
        }

        // 카테고리별 결과 출력
        console.log(`${colors.cyan}📋 카테고리별 결과${colors.reset}\n`);
        ['CloudFormation', 'Python', 'SQL', 'JSON', 'README'].forEach(category => {
            this.printCategoryResults(category);
        });

        this.printFinalResults();
    }
}

// 메인 실행
const validator = new FileContentValidator();
const args = process.argv.slice(2);

if (args.length > 0 && !isNaN(parseInt(args[0]))) {
    // 특정 주차 검증
    const weekNum = parseInt(args[0]);
    validator.run(weekNum);
} else {
    // 전체 검증
    validator.run();
}
