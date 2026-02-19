#!/usr/bin/env node

/**
 * 실습 가이드 마크다운 표준 준수 검증 스크립트
 * 
 * 사용법:
 *   node scripts/validate-markdown-guide.js
 *   node scripts/validate-markdown-guide.js public/content/week1/1-1-well-architected-tool-demo.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
    cyan: '\x1b[36m',
};

class MarkdownValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.info = [];
    }

    /**
     * 검증 규칙 정의
     */
    rules = {
        // 1. AWS 서비스 접근 표준
        awsServiceAccess: {
            pattern: /AWS Console에 로그인|AWS Console에서|상단 검색창에서(?! `)/g,
            message: '표준: "AWS Management Console에 로그인한 후 상단 검색창에서 `서비스명`을 검색하고 선택합니다."',
            severity: 'error',
            check: (content, lineNum, line) => {
                const issues = [];

                // "AWS Console" 체크 (Management 누락)
                if (line.includes('AWS Console에 로그인') && !line.includes('AWS Management Console')) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"AWS Console" → "AWS Management Console"로 수정 필요',
                        severity: 'error'
                    });
                }

                // "상단 검색창에서" 누락 체크
                if (line.match(/로그인한 후.*?를 검색하고/) && !line.includes('상단 검색창에서')) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"상단 검색창에서" 추가 필요',
                        severity: 'error'
                    });
                }

                return issues;
            }
        },

        // 2. 왼쪽 메뉴 선택
        leftMenu: {
            pattern: /왼쪽 메뉴의|콘솔 왼쪽 메뉴에서/g,
            message: '표준: "왼쪽 메뉴에서 **메뉴명**을 선택합니다."',
            severity: 'error',
            check: (content, lineNum, line) => {
                const issues = [];

                if (line.includes('왼쪽 메뉴의')) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"왼쪽 메뉴의" → "왼쪽 메뉴에서"로 수정',
                        severity: 'error'
                    });
                }

                if (line.match(/\w+ 콘솔 왼쪽 메뉴에서/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '불필요한 "콘솔" 명시 제거',
                        severity: 'warning'
                    });
                }

                return issues;
            }
        },

        // 3. 마침표 누락
        missingPeriod: {
            pattern: /^\d+\.\s+.+[^.。!?]$/,
            message: '모든 단계는 마침표(.)로 종결해야 합니다',
            severity: 'error',
            check: (content, lineNum, line) => {
                const issues = [];
                const trimmed = line.trim();

                // 숫자로 시작하는 단계인지 확인
                if (/^\d+\.\s+/.test(trimmed)) {
                    // 마침표, 물음표, 느낌표, 콜론으로 끝나지 않으면 오류
                    if (!/[.。!?:]$/.test(trimmed) && !trimmed.endsWith('```')) {
                        issues.push({
                            line: lineNum,
                            text: trimmed,
                            message: '단계 끝에 마침표(.) 추가 필요',
                            severity: 'error'
                        });
                    }
                }

                return issues;
            }
        },

        // 4. 괄호 설명
        parenthesesExplanation: {
            pattern: /\([^)]*아이콘[^)]*\)|\([^)]*메뉴[^)]*\)|\([^)]*버튼[^)]*\)/g,
            message: '불필요한 괄호 설명은 제거하고 간결하게 작성',
            severity: 'warning',
            check: (content, lineNum, line) => {
                const issues = [];
                const matches = line.match(/\([^)]*(?:아이콘|메뉴|버튼|탭)[^)]*\)/g);

                if (matches) {
                    matches.forEach(match => {
                        issues.push({
                            line: lineNum,
                            text: line.trim(),
                            message: `불필요한 괄호 설명 제거: ${match}`,
                            severity: 'warning'
                        });
                    });
                }

                return issues;
            }
        },

        // 5. 버튼 문법
        buttonSyntax: {
            pattern: /(?<!\[)\b(Create|Delete|Next|Save|Upload|Edit|Cancel|Back|Close)\b(?!\])/g,
            message: '버튼은 [[버튼명]] 문법 사용 필요',
            severity: 'warning',
            check: (content, lineNum, line) => {
                const issues = [];

                // "버튼을 클릭" 패턴이 있는데 [[ ]] 문법이 없는 경우
                if (line.includes('버튼을 클릭') || line.includes('버튼을 선택')) {
                    const buttonPattern = /(?<!\[\[)(?<!\*\*)(Create|Delete|Next|Save|Upload|Edit|Launch|Start|Stop|Add|Remove|Update|Deploy|Build|Test|Run)\s+(?:bucket|function|instance|cluster|stack|role|policy|group|table|database|endpoint|distribution|pipeline|repository|environment)(?!\]\])(?!\*\*)/gi;
                    const matches = line.match(buttonPattern);

                    if (matches) {
                        issues.push({
                            line: lineNum,
                            text: line.trim(),
                            message: `버튼명에 [[버튼명]] 문법 사용 필요: ${matches.join(', ')}`,
                            severity: 'warning'
                        });
                    }
                }

                return issues;
            }
        },

        // 6. 필드 입력 표현
        fieldInput: {
            pattern: /\*\*[^*]+\*\*에\s+[^`]/g,
            message: '필드 입력: **필드명**에 `값`을 입력합니다',
            severity: 'warning',
            check: (content, lineNum, line) => {
                const issues = [];

                // **필드명**에 값을 입력 패턴에서 백틱 누락 체크
                const matches = line.match(/\*\*([^*]+)\*\*에\s+([^`\s][^\s]*)\s*(?:을|를)\s*입력/g);

                if (matches) {
                    matches.forEach(match => {
                        if (!match.includes('`')) {
                            issues.push({
                                line: lineNum,
                                text: line.trim(),
                                message: '입력값을 백틱(`)으로 감싸야 함',
                                severity: 'warning'
                            });
                        }
                    });
                }

                return issues;
            }
        },

        // 7. 청유형 사용 금지
        imperativeForm: {
            pattern: /하세요|해주세요|해보세요|확인하세요|선택하세요|클릭하세요|입력하세요/g,
            message: '청유형 금지: "~하세요" → "~합니다"',
            severity: 'error',
            check: (content, lineNum, line) => {
                const issues = [];
                const matches = line.match(/하세요|해주세요|해보세요|확인하세요|선택하세요|클릭하세요|입력하세요/g);

                if (matches) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: `청유형을 명령형으로 변경: ${matches.join(', ')}`,
                        severity: 'error'
                    });
                }

                return issues;
            }
        },

        // 8. 상태값 따옴표
        stateQuotes: {
            pattern: /상태가\s+(?!")(?:Available|Enabled|Running|Active|Ready|Complete|Deployed|InService)/gi,
            message: '상태값은 큰따옴표로 감싸기: "Available"',
            severity: 'error',
            check: (content, lineNum, line) => {
                const issues = [];
                const statePattern = /상태가\s+(?!")([A-Z][a-z]+)/g;
                const matches = [...line.matchAll(statePattern)];

                matches.forEach(match => {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: `상태값을 큰따옴표로 감싸기: "${match[1]}"`,
                        severity: 'error'
                    });
                });

                return issues;
            }
        },

        // 9. 연속 동작 표현
        consecutiveActions: {
            pattern: /선택하고\s+선택|입력하고\s+입력|클릭하고\s+클릭/g,
            message: '연속 동작: "~한 후"로 연결 ("~하고" 금지)',
            severity: 'error',
            check: (content, lineNum, line) => {
                const issues = [];

                // "~하고 ~합니다" 패턴 체크
                if (line.match(/(?:선택|입력|클릭)하고\s+(?:선택|입력|클릭)/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"~하고"를 "~한 후"로 변경',
                        severity: 'error'
                    });
                }

                return issues;
            }
        },

        // 10. 탭 선택 표현
        tabSelection: {
            pattern: /탭으로\s+(?:이동|돌아갑니다)/g,
            message: '탭 선택: "**탭명** 탭을 선택합니다"',
            severity: 'error',
            check: (content, lineNum, line) => {
                const issues = [];

                if (line.match(/탭으로\s+(?:이동|돌아갑니다)/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '탭 이동은 "선택합니다"로 통일',
                        severity: 'error'
                    });
                }

                return issues;
            }
        },

        // 11. 예상 출력 이모지 사용
        outputEmoji: {
            pattern: /📋\s*\*\*예상 출력\*\*|💡\s*\*\*예상 출력\*\*/g,
            message: '예상 출력은 > [!OUTPUT] Alert 사용',
            severity: 'error',
            check: (content, lineNum, line) => {
                const issues = [];

                if (line.match(/[📋💡]\s*\*\*예상 출력\*\*/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '이모지 대신 > [!OUTPUT] Alert 블록 사용',
                        severity: 'error'
                    });
                }

                return issues;
            }
        },

        // 12. Front Matter 검증
        frontMatter: {
            check: (content) => {
                const issues = [];
                const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

                if (!frontMatterMatch) {
                    issues.push({
                        line: 1,
                        text: '',
                        message: 'Front Matter가 없습니다',
                        severity: 'error'
                    });
                    return issues;
                }

                const frontMatter = frontMatterMatch[1];

                // 필수 필드 체크
                const requiredFields = ['title', 'week', 'session'];
                requiredFields.forEach(field => {
                    if (!frontMatter.includes(`${field}:`)) {
                        issues.push({
                            line: 1,
                            text: 'Front Matter',
                            message: `필수 필드 누락: ${field}`,
                            severity: 'error'
                        });
                    }
                });

                return issues;
            }
        },

        // 13. 리소스 선택 표현 (규칙 25)
        resourceSelection: {
            pattern: /(?:클릭|찾아서\s+선택)/g,
            message: '리소스 선택: "~를 선택합니다" (클릭 대신 선택 사용)',
            severity: 'warning',
            check: (content, lineNum, line) => {
                const issues = [];

                // 리소스명 + "를 클릭합니다" 패턴 체크
                if (line.match(/`[^`]+`\s*를\s*클릭합니다/) &&
                    !line.includes('버튼') &&
                    !line.includes('아이콘')) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '리소스는 "클릭" 대신 "선택"을 사용',
                        severity: 'warning'
                    });
                }

                // "찾아서 선택합니다" 패턴 체크
                if (line.includes('찾아서 선택합니다')) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"찾아서" 불필요 - "~를 선택합니다"로 간결하게',
                        severity: 'warning'
                    });
                }

                return issues;
            }
        },

        // 14. 값 확인 및 검증 표현 (규칙 26)
        valueVerification: {
            pattern: /확인합니다(?!\s*\.)/g,
            message: '확인 표현: "~인지 확인합니다" 또는 "~를 확인합니다"',
            severity: 'info',
            check: (content, lineNum, line) => {
                const issues = [];

                // 상태값 확인 시 큰따옴표 누락 체크
                if (line.match(/(?:Status|상태).*?(?:Available|Enabled|Running|Active|Ready|Complete).*?인지\s*확인합니다/i)) {
                    if (!line.match(/"(?:Available|Enabled|Running|Active|Ready|Complete)"/i)) {
                        issues.push({
                            line: lineNum,
                            text: line.trim(),
                            message: '상태값은 큰따옴표로 감싸야 함',
                            severity: 'error'
                        });
                    }
                }

                return issues;
            }
        },

        // 15. 섹션/영역 이동 표현 (규칙 27)
        sectionNavigation: {
            pattern: /(?:아래쪽|위쪽|하단|상단)에서/g,
            message: '섹션 이동: "~섹션에서" 또는 "~영역에서" (구체적인 섹션명 사용)',
            severity: 'warning',
            check: (content, lineNum, line) => {
                const issues = [];

                // 애매한 위치 표현 체크
                if (line.match(/(?:아래쪽|위쪽)에서/) && !line.includes('섹션') && !line.includes('영역')) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '구체적인 섹션명 사용 권장 (예: **Network settings** 섹션에서)',
                        severity: 'warning'
                    });
                }

                // 섹션명 강조 누락 체크
                if (line.match(/\w+\s+섹션에서/) && !line.includes('**')) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '섹션명은 **섹션명** 형식으로 강조',
                        severity: 'info'
                    });
                }

                return issues;
            }
        },

        // 16. 설정 유지 표현 (규칙 28)
        settingsMaintenance: {
            pattern: /그대로\s+둡니다|변경하지\s+않습니다/g,
            message: '설정 유지: "기본값을 유지합니다" 또는 "~를 선택한 상태로 유지합니다"',
            severity: 'warning',
            check: (content, lineNum, line) => {
                const issues = [];

                if (line.match(/그대로\s+둡니다|변경하지\s+않습니다/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"기본값을 유지합니다"로 명확하게 표현',
                        severity: 'warning'
                    });
                }

                return issues;
            }
        },

        // 17. 메모장 저장 표현 (규칙 29)
        notepadSave: {
            pattern: /복사해?둡니다|저장합니다/g,
            message: '메모장 저장: "~를 복사하여 메모장에 저장합니다"',
            severity: 'info',
            check: (content, lineNum, line) => {
                const issues = [];

                // "복사해둡니다" 패턴 체크
                if (line.match(/복사해?둡니다/) && !line.includes('메모장')) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '나중에 사용할 값은 "메모장에 저장" 명시 권장',
                        severity: 'info'
                    });
                }

                // "저장합니다" 단독 사용 체크
                if (line.match(/(?:값|ID|URL|ARN).*?저장합니다/) &&
                    !line.includes('메모장') &&
                    !line.includes('파일')) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"메모장에 저장합니다"로 구체적으로 명시',
                        severity: 'info'
                    });
                }

                return issues;
            }
        },

        // 18. 청유형 완전 금지 (규칙 31 - 기존 규칙 9 강화)
        imperativeOnly: {
            pattern: /(하세요|해주세요|하십시오|해보세요|하시기\s+바랍니다)/g,
            message: '청유형 금지: "~하세요" → "~합니다" (모든 영역에서 명령형만 사용)',
            severity: 'error',
            check: (content, lineNum, line) => {
                const issues = [];

                // 청유형 패턴 체크
                const imperativePatterns = [
                    { pattern: /확인하세요/g, correct: '확인합니다' },
                    { pattern: /선택하세요/g, correct: '선택합니다' },
                    { pattern: /클릭하세요/g, correct: '클릭합니다' },
                    { pattern: /입력하세요/g, correct: '입력합니다' },
                    { pattern: /실행하세요/g, correct: '실행합니다' },
                    { pattern: /생성하세요/g, correct: '생성합니다' },
                    { pattern: /삭제하세요/g, correct: '삭제합니다' },
                    { pattern: /이동하세요/g, correct: '이동합니다' },
                    { pattern: /해주세요/g, correct: '합니다' },
                    { pattern: /하십시오/g, correct: '합니다' }
                ];

                imperativePatterns.forEach(({ pattern, correct }) => {
                    if (line.match(pattern)) {
                        issues.push({
                            line: lineNum,
                            text: line.trim(),
                            message: `청유형 금지: "${pattern.source.replace(/\\/g, '')}" → "${correct}"로 수정`,
                            severity: 'error'
                        });
                    }
                });

                return issues;
            }
        },

        // 19. 콘솔 재방문 표현 통일 (규칙 32 - 기존 규칙 3 강화)
        consoleNavigation: {
            pattern: /(돌아갑니다|다시\s+이동합니다|되돌아갑니다)/g,
            message: '콘솔 이동: "~콘솔로 돌아갑니다" → "~콘솔로 이동합니다" (재방문도 "이동합니다"로 통일)',
            severity: 'error',
            check: (content, lineNum, line) => {
                const issues = [];

                // "돌아갑니다" 패턴 체크
                if (line.match(/콘솔로\s+돌아갑니다/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"~콘솔로 돌아갑니다" → "~콘솔로 이동합니다"로 수정',
                        severity: 'error'
                    });
                }

                // "다시 이동합니다" 패턴 체크
                if (line.match(/콘솔로\s+다시\s+이동합니다/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"~콘솔로 다시 이동합니다" → "~콘솔로 이동합니다"로 수정',
                        severity: 'error'
                    });
                }

                // "되돌아갑니다" 패턴 체크
                if (line.match(/콘솔로\s+되돌아갑니다/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"~콘솔로 되돌아갑니다" → "~콘솔로 이동합니다"로 수정',
                        severity: 'error'
                    });
                }

                return issues;
            }
        },

        // 20. 용어 표기 규칙 (규칙 33)
        terminologyConsistency: {
            pattern: /(아마존\s+S3|AWS\s+람다|클라우드포메이션|함수\s+생성|버킷\s+생성|인스턴스\s+시작)/gi,
            message: 'AWS 서비스명은 영어로 표기, AWS 콘솔 버튼/메뉴는 영어 유지',
            severity: 'error',
            check: (content, lineNum, line) => {
                const issues = [];

                // AWS 서비스명 한글 표기 체크
                const koreanServiceNames = [
                    { pattern: /아마존\s+S3/gi, correct: 'Amazon S3' },
                    { pattern: /AWS\s+람다/gi, correct: 'AWS Lambda' },
                    { pattern: /클라우드포메이션/gi, correct: 'CloudFormation' },
                    { pattern: /일래스틱캐시/gi, correct: 'ElastiCache' },
                    { pattern: /세이지메이커/gi, correct: 'SageMaker' }
                ];

                koreanServiceNames.forEach(({ pattern, correct }) => {
                    if (line.match(pattern)) {
                        issues.push({
                            line: lineNum,
                            text: line.trim(),
                            message: `AWS 서비스명은 영어로 표기: "${correct}"`,
                            severity: 'error'
                        });
                    }
                });

                // AWS 콘솔 버튼/메뉴 한글 번역 체크
                const translatedButtons = [
                    { pattern: /함수\s+생성.*버튼/gi, correct: 'Create function' },
                    { pattern: /버킷\s+생성.*버튼/gi, correct: 'Create bucket' },
                    { pattern: /인스턴스\s+시작.*버튼/gi, correct: 'Launch instance' },
                    { pattern: /엔드포인트\s+생성.*버튼/gi, correct: 'Create endpoint' }
                ];

                translatedButtons.forEach(({ pattern, correct }) => {
                    if (line.match(pattern)) {
                        issues.push({
                            line: lineNum,
                            text: line.trim(),
                            message: `AWS 콘솔 버튼은 영어 유지: "${correct}"`,
                            severity: 'error'
                        });
                    }
                });

                return issues;
            }
        },

        // 21. 컨테이너/Pod 접속 및 종료 (규칙 34)
        containerAccess: {
            pattern: /(Pod|컨테이너).*?(들어갑니다|종료합니다)/g,
            message: '컨테이너 접속: "~에 접속합니다" / 종료: "~에서 나옵니다"',
            severity: 'warning',
            check: (content, lineNum, line) => {
                const issues = [];

                // "들어갑니다" 체크
                if (line.match(/(Pod|컨테이너).*?들어갑니다/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"들어갑니다" → "접속합니다" 또는 "내부에 접속합니다"',
                        severity: 'warning'
                    });
                }

                // "종료합니다" 체크 (exit 명령어 제외)
                if (line.match(/(Pod|컨테이너).*?종료합니다/) && !line.includes('exit')) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"종료합니다" → "~에서 나옵니다"',
                        severity: 'warning'
                    });
                }

                return issues;
            }
        },

        // 22. 웹 브라우저 IP/도메인 접속 (규칙 35)
        browserAccess: {
            pattern: /(IP|도메인|주소).*?(브라우저|접속)/g,
            message: '웹 브라우저 접속: "웹 브라우저에서 ~로 접속하여 ~를 확인합니다"',
            severity: 'info',
            check: (content, lineNum, line) => {
                const issues = [];

                // "브라우저로 접속" 체크 (웹 브라우저 누락)
                if (line.match(/브라우저로\s+접속/) && !line.includes('웹 브라우저')) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"브라우저" → "웹 브라우저"로 명시',
                        severity: 'info'
                    });
                }

                // IP/도메인 접속 시 확인 내용 누락 체크
                if (line.match(/(IP|도메인|주소).*?접속합니다/) &&
                    !line.includes('확인합니다') &&
                    !line.includes('접속하여')) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '접속 후 확인할 내용 명시 권장: "~로 접속하여 ~를 확인합니다"',
                        severity: 'info'
                    });
                }

                return issues;
            }
        },

        // 23. Lambda 함수 탭 이동 (규칙 36)
        lambdaTabNavigation: {
            pattern: /Lambda\s+함수\s+탭으로\s+돌아갑니다/g,
            message: 'Lambda 탭 이동: "Lambda 콘솔로 이동합니다" + "함수를 선택합니다" (두 단계 분리)',
            severity: 'error',
            check: (content, lineNum, line) => {
                const issues = [];

                // "Lambda 함수 탭으로 돌아갑니다" 패턴 체크
                if (line.match(/Lambda\s+함수\s+탭으로\s+돌아갑니다/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"Lambda 함수 탭으로 돌아갑니다" → "Lambda 콘솔로 이동합니다" + "함수를 선택합니다"로 분리',
                        severity: 'error'
                    });
                }

                // "Lambda 함수 페이지로 돌아갑니다" 패턴 체크
                if (line.match(/Lambda\s+함수\s+페이지로\s+돌아갑니다/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '"Lambda 함수 페이지로 돌아갑니다" → "Lambda 콘솔로 이동합니다" + "함수를 선택합니다"로 분리',
                        severity: 'error'
                    });
                }

                return issues;
            }
        },

        // 24. Configuration 탭 하위 메뉴 선택 (규칙 37)
        configurationSubMenu: {
            pattern: /\*\*Configuration\*\*\s+탭에서\s+\*\*[^*]+\*\*를\s+선택합니다/g,
            message: 'Configuration 하위 메뉴: 탭 선택과 메뉴 선택을 별도 단계로 분리',
            severity: 'error',
            check: (content, lineNum, line) => {
                const issues = [];

                // "**Configuration** 탭에서 **메뉴명**를 선택합니다" 패턴 체크
                if (line.match(/\*\*Configuration\*\*\s+탭에서\s+\*\*[^*]+\*\*를\s+선택합니다/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '탭 선택과 하위 메뉴 선택을 별도 단계로 분리: "**Configuration** 탭을 선택합니다" + "왼쪽 메뉴에서 **메뉴명**을 선택합니다"',
                        severity: 'error'
                    });
                }

                // "**Configuration** 탭의 **메뉴명**를 선택합니다" 패턴 체크 (조사 오류)
                if (line.match(/\*\*Configuration\*\*\s+탭의\s+\*\*[^*]+\*\*를\s+선택합니다/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '탭 선택과 하위 메뉴 선택을 별도 단계로 분리: "**Configuration** 탭을 선택합니다" + "왼쪽 메뉴에서 **메뉴명**을 선택합니다"',
                        severity: 'error'
                    });
                }

                return issues;
            }
        },

        // 25. AWS 리전 선택 (규칙 38)
        regionSelection: {
            pattern: /\*\*.*?Region.*?\*\*.*?선택합니다/gi,
            message: 'AWS 리전 선택: "**AWS Region**에서 `Asia Pacific (Seoul) ap-northeast-2`를 선택합니다"',
            severity: 'warning',
            check: (content, lineNum, line) => {
                const issues = [];

                // 리전 선택 관련 줄인지 확인
                if (!line.match(/\*\*.*?Region.*?\*\*.*?선택합니다/i)) {
                    return issues;
                }

                // 리전 코드만 있고 전체 리전명이 없는 경우
                if (line.match(/`ap-northeast-2`/) && !line.match(/Asia Pacific \(Seoul\)/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '리전 전체명 추가 필요: `Asia Pacific (Seoul) ap-northeast-2`',
                        severity: 'warning'
                    });
                }

                // 리전 전체명만 있고 코드가 없는 경우
                if (line.match(/Asia Pacific \(Seoul\)/) && !line.match(/ap-northeast-2/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '리전 코드 추가 필요: `Asia Pacific (Seoul) ap-northeast-2`',
                        severity: 'warning'
                    });
                }

                // "AWS Regions를 선택한 후" 패턴 (두 단계로 분리 금지)
                if (line.match(/\*\*AWS Regions?\*\*.*?선택한 후/)) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '한 단계로 작성: "**AWS Region**에서 `Asia Pacific (Seoul) ap-northeast-2`를 선택합니다"',
                        severity: 'error'
                    });
                }

                return issues;
            }
        },

        // 26. 태스크 제목 작성 (규칙 39)
        taskTitle: {
            pattern: /^##\s+태스크\s+\d+:.*?\(/,
            message: '태스크 제목: 괄호 설명 금지, 문장으로 작성',
            severity: 'warning',
            check: (content, lineNum, line) => {
                const issues = [];

                // 태스크 제목에 괄호가 있는 경우
                const taskTitleMatch = line.match(/^##\s+태스크\s+(\d+):\s*(.+)$/);
                if (taskTitleMatch) {
                    const title = taskTitleMatch[2];

                    // 괄호 체크 (단, 기술 용어 약어는 제외)
                    const hasParenthesis = title.match(/\([^)]+\)/);
                    if (hasParenthesis) {
                        const parenthesisContent = hasParenthesis[0];

                        // 기술 용어 약어 예외 (GSI, CTAS 등)
                        const isTechnicalAcronym = parenthesisContent.match(/\([A-Z][a-z]*\s*[A-Z]/);

                        if (!isTechnicalAcronym) {
                            issues.push({
                                line: lineNum,
                                text: line.trim(),
                                message: '태스크 제목에서 괄호 제거하고 문장으로 작성: "태스크 X: A를 생성하여 B 구현" 또는 "태스크 X: B를 위한 A 생성"',
                                severity: 'warning'
                            });
                        }
                    }
                }

                return issues;
            }
        },

        // 27. Lambda 함수 코드 주석 표준 (규칙 40)
        lambdaCodeComments: {
            pattern: /```python[\s\S]*?def lambda_handler/,
            message: 'Lambda 함수 코드: 모듈/함수 DocString + 한국어 주석 필수',
            severity: 'info',
            check: (content, lineNum, line) => {
                const issues = [];

                // Python 코드 블록 내 lambda_handler 함수 체크
                const codeBlockMatch = content.match(/```python\n([\s\S]*?)```/g);
                if (!codeBlockMatch) return issues;

                codeBlockMatch.forEach(block => {
                    // lambda_handler 함수가 있는지 확인
                    if (!block.includes('def lambda_handler')) return;

                    // 모듈 레벨 DocString 체크
                    const hasModuleDocstring = block.match(/```python\n\s*"""/);
                    if (!hasModuleDocstring) {
                        issues.push({
                            line: lineNum,
                            text: 'Lambda 함수 코드 블록',
                            message: '모듈 레벨 DocString 누락 (함수 목적, 환경 변수, 트리거 설명)',
                            severity: 'info'
                        });
                    }

                    // lambda_handler 함수 DocString 체크
                    const hasHandlerDocstring = block.match(/def lambda_handler[\s\S]*?"""/);
                    if (!hasHandlerDocstring) {
                        issues.push({
                            line: lineNum,
                            text: 'lambda_handler 함수',
                            message: '함수 레벨 DocString 누락 (Args, Returns, 설명)',
                            severity: 'info'
                        });
                    }

                    // 한국어 주석 체크 (최소 3개 이상 권장)
                    const koreanComments = (block.match(/#.*[가-힣]/g) || []).length;
                    if (koreanComments < 3) {
                        issues.push({
                            line: lineNum,
                            text: 'Lambda 함수 코드',
                            message: `한국어 주석 부족 (현재: ${koreanComments}개, 권장: 3개 이상)`,
                            severity: 'info'
                        });
                    }
                });

                return issues;
            }
        },

        // 28. 함수 파라미터 표 형식 표준 (규칙 41)
        functionParameterTable: {
            pattern: /파라미터|Parameters/,
            message: '함수 파라미터: 표 형식 (파라미터 | 타입 | 필수 | 설명) 사용',
            severity: 'info',
            check: (content, lineNum, line) => {
                const issues = [];

                // "파라미터" 섹션이 있는지 확인
                if (!line.match(/###.*파라미터|###.*Parameters/)) return issues;

                // 다음 줄들을 확인하여 표 형식인지 체크
                const lines = content.split('\n');
                const currentIndex = lines.indexOf(line);

                // 다음 5줄 내에 표 형식이 있는지 확인
                let hasTable = false;
                for (let i = currentIndex + 1; i < Math.min(currentIndex + 6, lines.length); i++) {
                    if (lines[i].includes('|') && lines[i].includes('파라미터') && lines[i].includes('타입')) {
                        hasTable = true;
                        break;
                    }
                }

                if (!hasTable) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '파라미터는 표 형식으로 작성 권장: | 파라미터 | 타입 | 필수 | 설명 |',
                        severity: 'info'
                    });
                }

                return issues;
            }
        },

        // 29. 코드 블록 언어 명시 표준 (규칙 42)
        codeBlockLanguage: {
            pattern: /^```$/,
            message: '코드 블록: 언어 명시 필수 (python, bash, json 등)',
            severity: 'warning',
            check: (content, lineNum, line) => {
                const issues = [];

                // 코드 블록 시작 체크 (언어 명시 없음)
                if (line.trim() === '```') {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '코드 블록에 언어 명시 필요: ```python, ```bash, ```json 등',
                        severity: 'warning'
                    });
                }

                return issues;
            }
        },

        // 30. 아키텍처 다이어그램 설명 표준 (규칙 43)
        architectureDiagram: {
            pattern: /!\[.*아키텍처.*\]/,
            message: '아키텍처 다이어그램: 이미지 + 구성 요소 + 데이터 흐름 설명 필수',
            severity: 'info',
            check: (content, lineNum, line) => {
                const issues = [];

                // 아키텍처 다이어그램 이미지가 있는지 확인
                if (!line.match(/!\[.*아키텍처.*\]/)) return issues;

                // 이미지 다음에 구성 요소 섹션이 있는지 확인
                const lines = content.split('\n');
                const currentIndex = lines.indexOf(line);

                let hasComponents = false;
                let hasDataFlow = false;

                // 다음 20줄 내에 구성 요소와 데이터 흐름 섹션 확인
                for (let i = currentIndex + 1; i < Math.min(currentIndex + 21, lines.length); i++) {
                    if (lines[i].includes('구성 요소') || lines[i].includes('**구성 요소**')) {
                        hasComponents = true;
                    }
                    if (lines[i].includes('데이터 흐름') || lines[i].includes('**데이터 흐름**')) {
                        hasDataFlow = true;
                    }
                }

                if (!hasComponents) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '아키텍처 다이어그램 다음에 **구성 요소** 섹션 추가 권장',
                        severity: 'info'
                    });
                }

                if (!hasDataFlow) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '아키텍처 다이어그램 다음에 **데이터 흐름** 섹션 추가 권장',
                        severity: 'info'
                    });
                }

                return issues;
            }
        },

        // 31. 환경 변수 설명 표준 (규칙 44)
        environmentVariableTable: {
            pattern: /환경\s*변수|Environment\s*Variables/,
            message: '환경 변수: 표 형식 (변수명 | 값 | 설명) 사용',
            severity: 'info',
            check: (content, lineNum, line) => {
                const issues = [];

                // "환경 변수" 섹션이 있는지 확인
                if (!line.match(/##.*환경\s*변수|##.*Environment\s*Variables/)) return issues;

                // 다음 줄들을 확인하여 표 형식인지 체크
                const lines = content.split('\n');
                const currentIndex = lines.indexOf(line);

                let hasTable = false;
                for (let i = currentIndex + 1; i < Math.min(currentIndex + 6, lines.length); i++) {
                    if (lines[i].includes('|') && (lines[i].includes('변수명') || lines[i].includes('Variable'))) {
                        hasTable = true;
                        break;
                    }
                }

                if (!hasTable) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '환경 변수는 표 형식으로 작성 권장: | 변수명 | 값 | 설명 |',
                        severity: 'info'
                    });
                }

                return issues;
            }
        },

        // 32. 문제 해결 섹션 표준 (규칙 45)
        troubleshootingSection: {
            pattern: /##.*문제\s*해결|##.*Troubleshooting/,
            message: '문제 해결: 문제 + 증상 + 원인 + 해결 순서로 작성',
            severity: 'info',
            check: (content, lineNum, line) => {
                const issues = [];

                // "문제 해결" 섹션이 있는지 확인
                if (!line.match(/##.*문제\s*해결|##.*Troubleshooting/)) return issues;

                // 다음 줄들을 확인하여 표준 구조인지 체크
                const lines = content.split('\n');
                const currentIndex = lines.indexOf(line);

                let hasSymptom = false;
                let hasCause = false;
                let hasSolution = false;

                // 다음 30줄 내에 증상, 원인, 해결 키워드 확인
                for (let i = currentIndex + 1; i < Math.min(currentIndex + 31, lines.length); i++) {
                    if (lines[i].includes('증상') || lines[i].includes('**증상**')) {
                        hasSymptom = true;
                    }
                    if (lines[i].includes('원인') || lines[i].includes('**원인**')) {
                        hasCause = true;
                    }
                    if (lines[i].includes('해결') || lines[i].includes('**해결**')) {
                        hasSolution = true;
                    }
                }

                if (!hasSymptom || !hasCause || !hasSolution) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: '문제 해결 섹션은 **증상**, **원인**, **해결** 순서로 작성 권장',
                        severity: 'info'
                    });
                }

                return issues;
            }
        },

        // 33. 비용 정보 표준화 (규칙 46)
        costInformationTable: {
            pattern: />\s*\[!WARNING\][\s\S]*?예상\s*비용|>\s*\[!WARNING\][\s\S]*?시간당\s*비용/,
            message: '비용 정보: 표 형식 (리소스 | 타입 | 시간당 비용) 사용 권장',
            severity: 'info',
            check: (content, lineNum, line) => {
                const issues = [];

                // WARNING Alert 내 비용 정보가 있는지 확인
                const warningBlocks = content.match(/>\s*\[!WARNING\][\s\S]*?(?=\n\n|$)/g);
                if (!warningBlocks) return issues;

                warningBlocks.forEach(block => {
                    // 비용 관련 키워드가 있는지 확인
                    if (!block.match(/예상\s*비용|시간당.*비용|부과됩니다/)) return;

                    // 표 형식이 있는지 확인
                    const hasTable = block.includes('|') && block.includes('리소스') && block.includes('비용');

                    if (!hasTable && block.includes('시간당')) {
                        issues.push({
                            line: lineNum,
                            text: 'WARNING Alert 내 비용 정보',
                            message: '비용 정보는 표 형식으로 작성 권장: | 리소스 | 타입 | 시간당 비용 |',
                            severity: 'info'
                        });
                    }
                });

                return issues;
            }
        },

        // 34. OUTPUT Alert 내 코드 블록 표준 (규칙 47)
        outputAlertCodeBlock: {
            pattern: />\s*\[!OUTPUT\]/,
            message: 'OUTPUT Alert: 반드시 코드 블록 사용',
            severity: 'warning',
            check: (content, lineNum, line) => {
                const issues = [];

                // OUTPUT Alert가 있는지 확인
                if (!line.match(/>\s*\[!OUTPUT\]/)) return issues;

                // 다음 줄들을 확인하여 코드 블록이 있는지 체크
                const lines = content.split('\n');
                const currentIndex = lines.indexOf(line);

                let hasCodeBlock = false;
                // 다음 5줄 내에 코드 블록 시작(```)이 있는지 확인
                for (let i = currentIndex + 1; i < Math.min(currentIndex + 6, lines.length); i++) {
                    if (lines[i].trim().startsWith('```')) {
                        hasCodeBlock = true;
                        break;
                    }
                    // 다른 Alert나 섹션이 시작되면 중단
                    if (lines[i].match(/^>?\s*\[!|^#{1,6}\s/)) {
                        break;
                    }
                }

                if (!hasCodeBlock) {
                    issues.push({
                        line: lineNum,
                        text: line.trim(),
                        message: 'OUTPUT Alert 내부에는 반드시 코드 블록(```) 사용 필요',
                        severity: 'warning'
                    });
                }

                return issues;
            }
        },

        // 35. Alert 남발 방지 (새 규칙)
        alertOveruse: {
            pattern: />\s*\[!NOTE\]|>\s*\[!TIP\]|>\s*\[!IMPORTANT\]|>\s*\[!WARNING\]|>\s*\[!CONCEPT\]/,
            message: 'Alert 남발 방지: 태스크당 3개 이하 권장, 불필요한 NOTE는 💡 이모지로 대체',
            severity: 'warning',
            check: (content) => {
                const issues = [];
                const lines = content.split('\n');

                // 태스크별 Alert 개수 카운트
                let currentTask = null;
                let taskAlerts = {};
                let consecutiveAlerts = [];
                let lastAlertLine = -1;

                lines.forEach((line, index) => {
                    const lineNum = index + 1;

                    // 태스크 시작 감지
                    const taskMatch = line.match(/^##\s+태스크\s+(\d+|0):/);
                    if (taskMatch) {
                        currentTask = taskMatch[1];
                        taskAlerts[currentTask] = {
                            total: 0,
                            note: 0,
                            tip: 0,
                            important: 0,
                            warning: 0,
                            concept: 0,
                            alerts: []
                        };
                    }

                    // Alert 감지
                    const alertMatch = line.match(/>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CONCEPT)\]/);
                    if (alertMatch && currentTask) {
                        const alertType = alertMatch[1].toLowerCase();
                        taskAlerts[currentTask].total++;
                        taskAlerts[currentTask][alertType]++;
                        taskAlerts[currentTask].alerts.push({
                            line: lineNum,
                            type: alertType,
                            content: line
                        });

                        // 연속된 Alert 감지 (Alert 사이에 단계가 없음)
                        if (lastAlertLine > 0 && lineNum - lastAlertLine < 5) {
                            // 사이에 단계 번호가 있는지 확인
                            let hasStep = false;
                            for (let i = lastAlertLine; i < lineNum; i++) {
                                if (lines[i].match(/^\d+\.\s+/)) {
                                    hasStep = true;
                                    break;
                                }
                            }

                            if (!hasStep) {
                                consecutiveAlerts.push({
                                    line: lineNum,
                                    prevLine: lastAlertLine + 1
                                });
                            }
                        }

                        lastAlertLine = index;
                    }
                });

                // 태스크별 Alert 개수 검증
                Object.entries(taskAlerts).forEach(([taskNum, alerts]) => {
                    if (alerts.total > 3) {
                        issues.push({
                            line: 0,
                            text: `태스크 ${taskNum}`,
                            message: `Alert 과다 사용 (${alerts.total}개): 태스크당 3개 이하 권장 (NOTE: ${alerts.note}, TIP: ${alerts.tip}, IMPORTANT: ${alerts.important}, WARNING: ${alerts.warning}, CONCEPT: ${alerts.concept})`,
                            severity: 'warning'
                        });
                    }

                    // NOTE Alert 과다 사용 경고
                    if (alerts.note > 2) {
                        issues.push({
                            line: 0,
                            text: `태스크 ${taskNum}`,
                            message: `NOTE Alert 과다 (${alerts.note}개): 간단한 참고사항은 💡 이모지로 대체 권장`,
                            severity: 'warning'
                        });
                    }
                });

                // 연속된 Alert 배치 경고
                consecutiveAlerts.forEach(({ line, prevLine }) => {
                    issues.push({
                        line: line,
                        text: `Alert 연속 배치`,
                        message: `Alert 사이에 단계 없음 (이전 Alert: 줄 ${prevLine}). Alert는 단계 사이에 배치 권장`,
                        severity: 'warning'
                    });
                });

                // 불필요한 NOTE 패턴 감지
                const unnecessaryNotePatterns = [
                    {
                        pattern: />\s*\[!NOTE\][\s\S]*?(?:예시|예:|예제|Example)/,
                        message: '간단한 예시는 💡 이모지로 대체 가능'
                    },
                    {
                        pattern: />\s*\[!NOTE\][\s\S]*?(?:참고로|참고:|Note:)[\s\S]{0,100}(?:\n\n|$)/,
                        message: '짧은 참고사항(2줄 이하)은 💡 이모지로 대체 가능'
                    },
                    {
                        pattern: />\s*\[!NOTE\][\s\S]*?(?:이름|명명|naming)[\s\S]{0,150}(?:\n\n|$)/,
                        message: '명명 규칙 설명은 💡 이모지로 대체 가능'
                    },
                    {
                        pattern: />\s*\[!NOTE\][\s\S]*?(?:설명|설치|install|설정)[\s\S]{0,100}(?:\n\n|$)/,
                        message: '간단한 설명은 💡 이모지 또는 일반 텍스트로 대체 가능'
                    }
                ];

                unnecessaryNotePatterns.forEach(({ pattern, message }) => {
                    const matches = content.match(new RegExp(pattern.source, 'g'));
                    if (matches) {
                        matches.forEach(match => {
                            // 해당 NOTE의 줄 번호 찾기
                            const noteLineIndex = lines.findIndex(line =>
                                line.includes('[!NOTE]') && content.indexOf(match) !== -1
                            );

                            if (noteLineIndex !== -1) {
                                issues.push({
                                    line: noteLineIndex + 1,
                                    text: match.substring(0, 50) + '...',
                                    message: `불필요한 NOTE Alert: ${message}`,
                                    severity: 'info'
                                });
                            }
                        });
                    }
                });

                return issues;
            }
        }
    };

    /**
     * 파일 검증
     */
    validateFile(filePath) {
        console.log(`\n${colors.cyan}📄 검증 중: ${filePath}${colors.reset}`);

        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        this.errors = [];
        this.warnings = [];
        this.info = [];

        // Front Matter 검증
        const frontMatterIssues = this.rules.frontMatter.check(content);
        frontMatterIssues.forEach(issue => {
            if (issue.severity === 'error') {
                this.errors.push(issue);
            }
        });

        // Alert 남발 검증 (전체 문서 분석)
        const alertOveruseIssues = this.rules.alertOveruse.check(content);
        alertOveruseIssues.forEach(issue => {
            if (issue.severity === 'error') {
                this.errors.push(issue);
            } else if (issue.severity === 'warning') {
                this.warnings.push(issue);
            } else {
                this.info.push(issue);
            }
        });

        // 각 줄 검증
        lines.forEach((line, index) => {
            const lineNum = index + 1;

            // 각 규칙 적용 (alertOveruse는 이미 실행했으므로 제외)
            Object.entries(this.rules).forEach(([ruleName, rule]) => {
                if (rule.check && ruleName !== 'frontMatter' && ruleName !== 'alertOveruse') {
                    const issues = rule.check(content, lineNum, line);
                    issues.forEach(issue => {
                        if (issue.severity === 'error') {
                            this.errors.push(issue);
                        } else if (issue.severity === 'warning') {
                            this.warnings.push(issue);
                        } else {
                            this.info.push(issue);
                        }
                    });
                }
            });
        });

        this.printResults(filePath);
    }

    /**
     * 결과 출력
     */
    printResults(filePath) {
        const totalIssues = this.errors.length + this.warnings.length;

        if (totalIssues === 0) {
            console.log(`${colors.green}✅ 모든 검증 통과!${colors.reset}\n`);
            return;
        }

        console.log(`\n${colors.yellow}📊 검증 결과:${colors.reset}`);
        console.log(`   오류: ${colors.red}${this.errors.length}${colors.reset}`);
        console.log(`   경고: ${colors.yellow}${this.warnings.length}${colors.reset}\n`);

        // 오류 출력
        if (this.errors.length > 0) {
            console.log(`${colors.red}❌ 오류 (${this.errors.length}):${colors.reset}`);
            this.errors.forEach((error, index) => {
                console.log(`\n${index + 1}. 줄 ${error.line}:`);
                console.log(`   ${colors.red}${error.message}${colors.reset}`);
                if (error.text) {
                    console.log(`   ${colors.blue}> ${error.text}${colors.reset}`);
                }
            });
        }

        // 경고 출력
        if (this.warnings.length > 0) {
            console.log(`\n${colors.yellow}⚠️  경고 (${this.warnings.length}):${colors.reset}`);
            this.warnings.forEach((warning, index) => {
                console.log(`\n${index + 1}. 줄 ${warning.line}:`);
                console.log(`   ${colors.yellow}${warning.message}${colors.reset}`);
                if (warning.text) {
                    console.log(`   ${colors.blue}> ${warning.text}${colors.reset}`);
                }
            });
        }

        console.log('\n');
    }

    /**
     * 디렉토리 내 모든 마크다운 파일 검증
     */
    validateDirectory(dirPath) {
        const files = this.getAllMarkdownFiles(dirPath);

        console.log(`${colors.magenta}🔍 총 ${files.length}개 파일 검증 시작${colors.reset}`);

        let totalErrors = 0;
        let totalWarnings = 0;
        const fileResults = [];

        files.forEach(file => {
            this.validateFile(file);
            totalErrors += this.errors.length;
            totalWarnings += this.warnings.length;

            fileResults.push({
                file,
                errors: this.errors.length,
                warnings: this.warnings.length
            });
        });

        // 전체 요약
        console.log(`\n${'='.repeat(80)}`);
        console.log(`${colors.cyan}📊 전체 검증 요약${colors.reset}\n`);
        console.log(`총 파일: ${files.length}`);
        console.log(`총 오류: ${colors.red}${totalErrors}${colors.reset}`);
        console.log(`총 경고: ${colors.yellow}${totalWarnings}${colors.reset}\n`);

        // 파일별 요약
        console.log(`${colors.cyan}파일별 결과:${colors.reset}`);
        fileResults.forEach(result => {
            const status = result.errors === 0 && result.warnings === 0
                ? `${colors.green}✅${colors.reset}`
                : `${colors.red}❌${colors.reset}`;
            const fileName = path.basename(result.file);
            console.log(`${status} ${fileName} - 오류: ${result.errors}, 경고: ${result.warnings}`);
        });

        console.log(`\n${'='.repeat(80)}\n`);
    }

    /**
     * 디렉토리에서 모든 마크다운 파일 찾기
     */
    getAllMarkdownFiles(dirPath) {
        const files = [];

        const walk = (dir) => {
            const items = fs.readdirSync(dir);

            items.forEach(item => {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    walk(fullPath);
                } else if (item.endsWith('.md')) {
                    files.push(fullPath);
                }
            });
        };

        walk(dirPath);
        return files;
    }
}

// 메인 실행
const validator = new MarkdownValidator();
const args = process.argv.slice(2);

if (args.length === 0) {
    // 인자가 없으면 전체 디렉토리 검증
    const contentDir = path.join(process.cwd(), 'public', 'content');
    validator.validateDirectory(contentDir);
} else {
    // 특정 파일 또는 디렉토리 검증
    args.forEach(filePath => {
        const fullPath = path.isAbsolute(filePath)
            ? filePath
            : path.join(process.cwd(), filePath);

        if (fs.existsSync(fullPath)) {
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // 디렉토리인 경우
                validator.validateDirectory(fullPath);
            } else {
                // 파일인 경우
                validator.validateFile(fullPath);
            }
        } else {
            console.error(`${colors.red}❌ 파일을 찾을 수 없습니다: ${filePath}${colors.reset}`);
        }
    });
}
