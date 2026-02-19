# 개발자 인수인계 가이드

> 1차 개발자 → 2차 개발자 인수인계 문서 (Kiro 사용자용)

## 📋 목차

1. [인수인계 개요](#인수인계-개요)
2. [프로젝트 인계 체크리스트](#프로젝트-인계-체크리스트)
3. [Kiro 환경 설정](#kiro-환경-설정)
4. [표준 준수 검토](#표준-준수-검토)
5. [추가 개발 가이드](#추가-개발-가이드)
6. [가이드 콘텐츠 수정](#가이드-콘텐츠-수정)
7. [교수 인계 준비](#교수-인계-준비)

---

## 인수인계 개요

### 프로젝트 현황

**개발 단계**: 1차 개발 완료 → 2차 개발 시작

**1차 개발자가 완료한 작업**:
- ✅ 기본 프로젝트 구조 및 컴포넌트 개발
- ✅ CloudScape Design System 통합
- ✅ 마크다운 렌더링 파이프라인 구축
- ✅ 검증 시스템 (30개 규칙) 구현
- ✅ 일부 실습 가이드 작성

**2차 개발자가 수행할 작업**:
1. **표준 준수 검토**: 1차 개발 코드 및 가이드 검증
2. **추가 개발**: 누락된 기능 구현 및 개선
3. **가이드 완성**: 나머지 주차 실습 가이드 작성
4. **교수 인계 준비**: 교수가 수정 가능한 환경 구축

### 사용 도구

- **에디터**: Kiro (AI 어시스턴트 통합)
- **버전 관리**: Git (CodeCommit 또는 GitHub)
- **패키지 관리**: npm
- **빌드 도구**: Vite
- **테스트**: Vitest + React Testing Library

---

## 프로젝트 인계 체크리스트

### 1단계: 프로젝트 접근 권한 확인

- [ ] Git 저장소 접근 권한 확인
- [ ] AWS 계정 접근 권한 확인 (필요 시)
- [ ] 프로젝트 문서 접근 권한 확인

### 2단계: 로컬 환경 설정

```bash
# 1. 저장소 클론
git clone <repository-url>
cd university-lab-guide

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 확인
# http://localhost:5173
```

- [ ] 프로젝트 클론 완료
- [ ] 의존성 설치 완료
- [ ] 개발 서버 정상 실행 확인
- [ ] 브라우저에서 페이지 로드 확인

### 3단계: Kiro 설정

- [ ] Kiro 설치 완료
- [ ] 프로젝트 폴더 열기
- [ ] 스티어링 문서 자동 로드 확인
- [ ] AI 어시스턴트 테스트

### 4단계: 프로젝트 구조 파악

- [ ] `DEVELOPER_GUIDE.md` 읽기
- [ ] `TECHNICAL_DETAILS.md` 읽기
- [ ] `README.md` 읽기
- [ ] `.kiro/steering/` 문서 확인
- [ ] 주요 컴포넌트 파악

### 5단계: 현재 상태 확인

```bash
# 전체 검증 실행
npm run validate:advanced

# 진행률 확인
./scripts/check-progress.sh

# 테스트 실행
npm run test
```

- [ ] 검증 결과 확인
- [ ] 진행률 파악
- [ ] 테스트 통과 확인

---

## Kiro 환경 설정

### Kiro 프로젝트 열기

1. Kiro 실행
2. **File > Open Folder**
3. `university-lab-guide` 폴더 선택
4. 프로젝트 로드 대기

### 스티어링 문서 확인

Kiro가 자동으로 로드하는 문서들:

```
.kiro/steering/
├── markdown-guide.md                      # 마크다운 작성 표준 (항상 포함)
├── cloudscape-integration.md              # CloudScape 통합 가이드
└── university-lab-guide-development.md    # 개발 가이드 (항상 포함)
```

**확인 방법**:
```
Kiro AI에게 질문: "스티어링 문서가 로드되었나요?"
```

### AI 어시스턴트 테스트

다음 명령어로 AI 어시스턴트가 정상 작동하는지 확인:

```
"프로젝트 구조를 설명해줘"
"Week 1 파일을 검증해줘"
"마크다운 작성 표준을 알려줘"
```

### AWS MCP 서버 설정 (선택사항)

AWS MCP 서버를 사용하면 실습 가이드 작성 및 코드 검토 시 AWS 문서를 실시간으로 참조할 수 있습니다.

#### MCP 서버란?
Model Context Protocol (MCP) 서버는 AI 어시스턴트가 외부 데이터 소스에 접근할 수 있게 해주는 도구입니다. AWS MCP 서버를 사용하면 AWS 공식 문서를 실시간으로 검색하고 참조할 수 있습니다.

#### 설정 방법

1. **MCP 설정 파일 확인**
   ```bash
   # 워크스페이스 레벨 설정 (권장)
   cat .kiro/settings/mcp.json
   
   # 또는 사용자 레벨 설정
   cat ~/.kiro/settings/mcp.json
   ```

2. **AWS MCP 서버 추가** (없는 경우)
   ```json
   {
     "mcpServers": {
       "aws-docs": {
         "command": "uvx",
         "args": ["awslabs.aws-documentation-mcp-server@latest"],
         "env": {
           "FASTMCP_LOG_LEVEL": "ERROR"
         },
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

3. **uv/uvx 설치** (Python 패키지 관리자)
   ```bash
   # macOS (Homebrew)
   brew install uv
   
   # 또는 공식 설치 스크립트
   curl -LsSf https://astral.sh/uv/install.sh | sh
   
   # 설치 확인
   uvx --version
   ```

4. **MCP 서버 재연결**
   - Kiro 명령 팔레트 열기 (Cmd+Shift+P)
   - "MCP: Reconnect All Servers" 검색 및 실행
   - 또는 Kiro 재시작

#### 사용 예시

**실습 가이드 작성 시**:
```
"VPC Endpoint에 대한 AWS 공식 문서를 참조해서 실습 가이드를 작성해줘"
"S3 Gateway Endpoint와 Interface Endpoint의 차이점을 AWS 문서에서 찾아서 설명해줘"
```

**코드 검토 시**:
```
"이 Lambda 함수 코드가 AWS 베스트 프랙티스를 따르는지 확인해줘"
"CloudFormation 템플릿의 보안 설정이 AWS 권장사항과 일치하는지 검토해줘"
```

**검증 시**:
```
"Week 3 VPC 가이드의 기술적 정확성을 AWS 문서와 비교해서 검증해줘"
"이 실습 단계가 AWS 콘솔의 최신 UI와 일치하는지 확인해줘"
```

#### 문제 해결

**문제**: "uvx: command not found"
**해결**: uv 설치 후 터미널 재시작 또는 PATH 설정 확인

**문제**: MCP 서버 연결 실패
**해결**: 
1. Kiro 명령 팔레트에서 "MCP: Show Server Logs" 실행
2. 오류 메시지 확인
3. 필요시 `"disabled": true`로 설정하여 비활성화

**문제**: 응답 속도 느림
**해결**: `autoApprove` 배열에 자주 사용하는 도구 추가
```json
"autoApprove": ["search_aws_documentation", "get_aws_service_info"]
```

#### 추가 정보
- MCP 서버는 선택사항이며, 없어도 개발 가능
- AWS 문서 참조가 필요한 경우에만 사용
- 자세한 내용은 `DEVELOPER_GUIDE.md` 섹션 1-5 참조

---

## 표준 준수 검토

### 1. 전체 검증 실행

```bash
# 고급 검증 (30개 규칙)
npm run validate:advanced

# 결과 파일로 저장
npm run validate:advanced > validation-report.txt 2>&1
```

**검증 항목**:
- Front Matter 필수 필드
- 표준 문구 준수 (24개 규칙)
- 버튼 문법 사용
- Alert 사용 규칙
- 다운로드 블록 형식
- 페이지 구조 표준

### 2. 주차별 검증

```bash
# Week 1 검증
node scripts/validate-advanced.js public/content/week1

# Week 2 검증
node scripts/validate-advanced.js public/content/week2

# 모든 주차 검증
for week in {1..14}; do
  echo "=== Week $week ==="
  node scripts/validate-advanced.js public/content/week$week
done
```

### 3. 검증 결과 분석

**Kiro AI 활용**:
```
"validation-report.txt 파일을 분석하고 우선순위별로 수정 사항을 정리해줘"
"오류가 가장 많은 파일 5개를 찾아줘"
"Week 2의 모든 오류를 자동으로 수정해줘"
```

### 4. 표준 위반 수정

#### 자동 수정 (Kiro AI 활용)

```
"Week 2의 청유형을 모두 명령형으로 수정해줘"
"모든 파일에서 'AWS Console'을 'AWS Management Console'로 변경해줘"
"다운로드 블록을 표준 형식으로 수정해줘"
```

#### 수동 수정

`VALIDATION_GUIDE.md`의 "일반적인 오류 수정 방법" 참고

### 5. 코드 품질 검토

```bash
# TypeScript 타입 체크
npm run type-check

# ESLint 검사
npm run lint

# 자동 수정
npm run lint:fix
```

**Kiro AI 활용**:
```
"src/components/education/ 폴더의 모든 컴포넌트에서 타입 오류를 찾아줘"
"인라인 스타일을 사용하는 컴포넌트를 찾아서 CSS 파일로 분리해줘"
```

**참고**: 스타일링 규칙 및 코드 표준은 `TECHNICAL_DETAILS.md`를 확인하세요.

### 6. 검토 체크리스트

#### 마크다운 가이드
- [ ] 모든 Front Matter 필수 필드 포함
- [ ] 표준 문구 준수 (24개 규칙)
- [ ] 버튼 문법 올바르게 사용
- [ ] Alert 타입 적절히 사용
- [ ] 다운로드 블록 표준 형식
- [ ] 페이지 구조 표준 준수

#### 코드 품질
- [ ] TypeScript 타입 오류 없음
- [ ] ESLint 경고 없음
- [ ] 인라인 스타일 사용 금지
- [ ] 절대 경로 import 사용
- [ ] 한국어 UI 텍스트 사용
- [ ] 컴포넌트 명명 규칙 준수

#### 테스트
- [ ] 모든 단위 테스트 통과
- [ ] 주요 컴포넌트 테스트 커버리지 80% 이상
- [ ] E2E 테스트 통과 (있는 경우)

---

## 추가 개발 가이드

### 1. 개발 우선순위 파악

**Kiro AI 활용**:
```
"현재 프로젝트에서 누락된 기능이나 미완성 부분을 찾아줘"
"TODO 주석이 있는 파일을 모두 찾아줘"
"Week 5-14 중 가이드가 없는 주차를 알려줘"
```

### 2. 선택적 개선 사항 (Optional Enhancements)

다음 항목들은 **선택사항**입니다. 시간과 리소스가 허락하는 경우에만 구현하세요.

#### 2-1. 실습 가이드 검증 단계 추가

**목적**: 각 태스크 완료 후 학생이 제대로 수행했는지 확인할 수 있는 체크리스트 제공

**현재 상태**:
```markdown
✅ **태스크 완료**: S3 읽기 전용 역할이 생성되었습니다.
```

**개선 제안**:
```markdown
✅ **태스크 완료**: S3 읽기 전용 역할이 생성되었습니다.

**검증:**
- [ ] 역할 이름이 `S3ReadOnlyRole`인지 확인
- [ ] 신뢰 정책에 현재 계정 ID가 포함되어 있는지 확인
- [ ] AmazonS3ReadOnlyAccess 정책이 연결되어 있는지 확인
```

**구현 방법**:
1. 각 실습 가이드의 태스크 완료 메시지 다음에 검증 체크리스트 추가
2. 마크다운 가이드에 검증 섹션 작성 예시 추가
3. 교수 가이드에 검증 체크리스트 작성 방법 설명

**우선순위**: 낮음 (현재 태스크 완료 메시지로도 충분)

#### 2-2. 도전 과제 섹션 추가

**목적**: 실습을 완료한 학생들을 위한 심화 학습 과제 제공

**예시**:
```markdown
## 🎯 도전 과제 (선택사항)

실습을 완료했다면 다음 과제에 도전해보세요:

### 도전 1: MFA 요구 조건 추가
신뢰 정책에 MFA 인증을 요구하는 조건을 추가해보세요.

**힌트**: `aws:MultiFactorAuthPresent` 조건 키를 사용합니다.

**참고 문서**: [IAM 정책의 MFA 조건](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_configure-api-require.html)

### 도전 2: 시간 제한 설정
AssumeRole 세션 시간을 30분으로 제한해보세요.

**힌트**: `--duration-seconds` 파라미터를 사용합니다.

### 도전 3: Cross-Account 역할
다른 AWS 계정에서 이 역할을 맡을 수 있도록 신뢰 정책을 수정해보세요.

**힌트**: Principal에 다른 계정의 ARN을 추가합니다.
```

**구현 방법**:
1. 실습 가이드 끝에 "도전 과제" 섹션 추가 (리소스 정리 전)
2. 각 도전 과제에 힌트와 참고 문서 링크 제공
3. 마크다운 가이드에 도전 과제 작성 예시 추가

**우선순위**: 낮음 (기본 실습 완성이 우선)

#### 2-3. TROUBLESHOOTING Alert 확대

**목적**: 자주 발생하는 오류와 해결 방법을 미리 알려주어 학생의 실습 진행 원활화

**현재 상태**: 일부 가이드에만 TROUBLESHOOTING Alert 포함

**개선 제안**:
```markdown
## 태스크 5: AWS CLI로 AssumeRole 수행

1. 터미널을 엽니다.
2. AssumeRole을 수행합니다:

```bash
aws sts assume-role \
  --role-arn arn:aws:iam::123456789012:role/S3ReadOnlyRole \
  --role-session-name s3-readonly-session
```

> [!TROUBLESHOOTING]
> **문제 1**: "User is not authorized to perform: sts:AssumeRole" 오류
> **원인**: IAM 사용자에게 AssumeRole 권한이 없습니다
> **해결**: 태스크 4를 완료했는지 확인하고, 정책이 올바르게 연결되었는지 확인하세요
> 
> **문제 2**: "Invalid principal in policy" 오류
> **원인**: 신뢰 정책의 계정 ID가 잘못되었습니다
> **해결**: 역할의 신뢰 정책에서 계정 ID를 확인하세요
> 
> **문제 3**: "Session name is invalid" 오류
> **원인**: 세션 이름에 특수문자가 포함되었습니다
> **해결**: 세션 이름은 영문자, 숫자, =,.@- 만 사용 가능합니다
```

**구현 방법**:
1. 각 실습 가이드에서 오류가 자주 발생하는 단계 파악
2. 해당 단계에 TROUBLESHOOTING Alert 추가
3. 문제-원인-해결 형식으로 작성
4. 실제 오류 메시지 포함

**우선순위**: 중간 (학생 피드백 수집 후 추가 권장)

#### 2-4. 구현 가이드라인

**추가 시 고려사항**:
- 실습 가이드가 너무 길어지지 않도록 주의
- 핵심 내용에 집중하고 선택사항은 명확히 표시
- 교수가 쉽게 추가/제거할 수 있도록 독립적인 섹션으로 구성

**마크다운 가이드 업데이트**:
```
Kiro AI: ".kiro/steering/markdown-guide.md에 다음 섹션을 추가해줘:
- 검증 체크리스트 작성 방법
- 도전 과제 작성 방법
- TROUBLESHOOTING Alert 작성 가이드"
```

**교수 가이드 업데이트**:
```
Kiro AI: "docs/professors/PROFESSOR_GUIDE.md에 선택적 섹션 추가 방법을 설명해줘"
```

### 3. 새로운 컴포넌트 개발

#### 개발 워크플로우

1. **요구사항 정의**
   ```
   Kiro AI: "InfoCard 컴포넌트와 유사한 WarningCard 컴포넌트를 만들어줘"
   ```

2. **컴포넌트 생성**
   - 파일 위치: `src/components/education/WarningCard.tsx`
   - CSS 파일: `src/styles/warning-card.css`
   - 타입 정의 포함
   - 한국어 UI 텍스트 사용

3. **테스트 작성**
   ```typescript
   // WarningCard.test.tsx
   describe('WarningCard', () => {
     it('should render with correct props', () => {
       // 테스트 코드
     })
   })
   ```

4. **문서화**
   ```typescript
   /**
    * 경고 메시지를 표시하는 카드 컴포넌트
    * @param title - 경고 제목
    * @param children - 경고 내용
    */
   export const WarningCard: React.FC<WarningCardProps> = ({ title, children }) => {
     // 구현
   }
   ```

5. **Storybook 추가** (선택사항)

#### 개발 표준 준수

**개발 표준 준수**:
- ✅ TypeScript 타입 정의
- ✅ CSS 파일 분리 (인라인 스타일 금지)
- ✅ 절대 경로 import (`@/components/...`)
- ✅ 한국어 UI 텍스트
- ✅ 접근성 속성 (ARIA)
- ✅ 다크모드 지원

**참고**: 자세한 개발 표준은 `TECHNICAL_DETAILS.md` 섹션 3 "스타일링 규칙"을 확인하세요.

**Kiro AI 활용**:
```
"WarningCard 컴포넌트가 개발 표준을 준수하는지 검토해줘"
"접근성 속성이 누락된 부분을 찾아서 추가해줘"
"다크모드 스타일을 추가해줘"
```

### 3. 마크다운 렌더링 확장

#### 새로운 문법 추가

**예시: `[!COST]` Alert 타입 추가**

1. **MarkdownRenderer.tsx 수정**
   ```
   Kiro AI: "MarkdownRenderer에 [!COST] Alert 타입을 추가해줘. 노란색 배경에 비용 아이콘을 사용해"
   ```

2. **스타일 추가**
   ```css
   /* info-boxes.css */
   .info-box--cost {
     background-color: #fff8e1;
     border-left: 4px solid #ffc107;
   }
   ```

3. **마크다운 가이드 업데이트**
   ```
   Kiro AI: ".kiro/steering/markdown-guide.md에 [!COST] Alert 사용법을 추가해줘"
   ```

4. **검증 규칙 추가**
   ```
   Kiro AI: "validate-advanced.js에 [!COST] Alert 검증 규칙을 추가해줘"
   ```

### 4. 검증 규칙 추가

**새로운 표준 규칙 추가 워크플로우**:

1. **표준 정의** (`.kiro/steering/markdown-guide.md`)
2. **검증 규칙 구현** (`scripts/validate-advanced.js`)
3. **테스트 샘플 작성**
4. **전체 검증 실행**

**Kiro AI 활용**:
```
"'콘솔 이동' 표준 규칙을 추가해줘. '~로 돌아갑니다'를 '~로 이동합니다'로 통일하는 규칙이야"
"validate-advanced.js에 이 규칙을 추가하고 테스트 샘플도 만들어줘"
```

### 5. 개발 체크리스트

#### 새 기능 개발 시
- [ ] 요구사항 명확히 정의
- [ ] 컴포넌트 설계 및 타입 정의
- [ ] CSS 파일 분리
- [ ] 단위 테스트 작성
- [ ] 접근성 검토
- [ ] 다크모드 지원 확인
- [ ] 문서화 (JSDoc)
- [ ] Kiro AI로 표준 준수 검토

#### 마크다운 문법 확장 시
- [ ] MarkdownRenderer.tsx 수정
- [ ] 스타일 추가
- [ ] 마크다운 가이드 업데이트
- [ ] 검증 규칙 추가
- [ ] 테스트 샘플 작성
- [ ] 전체 검증 실행

---

## 가이드 콘텐츠 수정

### 1. 실습 가이드 작성/수정

#### 태스크 0 분류 기준 ⭐

**핵심 원칙**: 실습 제목에 명시된 AWS 서비스 = 가이드 제공, 나머지 = 사전 환경

**사전 환경 (태스크 0)에 포함해야 하는 것**:
- ✅ 학습 목표와 무관한 인프라 (VPC, 서브넷, NAT Gateway 등)
- ✅ 테스트용 리소스 (IAM 사용자, 테스트 S3 버킷, EC2 인스턴스)
- ✅ 데이터 저장소 (학습 목표가 아닌 경우)
- ✅ 시간이 오래 걸리는 리소스 (RDS 5-10분, ElastiCache 3-5분)
- ✅ 반복적인 기본 설정 (IAM 역할, Cognito User Pool)

**가이드로 제공해야 하는 것**:
- ✅ 실습 제목에 명시된 리소스
- ✅ 학습 목표인 리소스
- ✅ 학생이 직접 생성하고 설정해야 하는 것

**예시**:
```markdown
실습 제목: "VPC Endpoint로 안전한 S3 접근"
→ 태스크 0: VPC, 서브넷, EC2 (사전 환경)
→ 태스크 1-3: VPC Endpoint 생성 및 설정 (가이드)

실습 제목: "IAM 역할 및 AssumeRole API 활용"
→ 태스크 0: lab-user, S3 버킷 (테스트용)
→ 태스크 1-6: IAM 역할 생성 및 AssumeRole (가이드)

실습 제목: "DynamoDB 테이블 설계 및 GSI 활용"
→ 태스크 0: 없음 (서버리스, 즉시 생성)
→ 태스크 1-4: DynamoDB 테이블 및 GSI (가이드)
```

**상세 가이드**: [태스크 0 분류 가이드](../../.kiro/steering/markdown-guide/10-task0-classification-guide.md)

#### 기존 가이드 수정

**Kiro AI 활용**:
```
"Week 2-1 IAM 역할 가이드를 열어줘"
"이 가이드에서 표준을 위반한 부분을 찾아서 수정해줘"
"태스크 3의 단계를 더 상세하게 작성해줘"
```

#### 새 가이드 작성

**템플릿 사용**:
```
Kiro AI: "Week 5-1 RDS Multi-AZ 실습 가이드를 템플릿을 사용해서 만들어줘"
```

**Front Matter 작성**:
```yaml
---
title: "RDS Multi-AZ 배포 및 페일오버 확인"
week: 5
session: 1
awsServices:
  - Amazon RDS
  - Amazon VPC
learningObjectives:
  - RDS Multi-AZ 배포를 구성할 수 있습니다
  - 페일오버 메커니즘을 이해하고 테스트할 수 있습니다
prerequisites:
  - Week 3-1 VPC 생성 완료
  - RDS 기본 개념 이해
---
```

**Kiro AI로 내용 작성**:
```
"다음 단계를 극도로 상세하게 작성해줘:
1. RDS 콘솔 접속
2. DB 서브넷 그룹 생성
3. Multi-AZ RDS 인스턴스 생성
4. 페일오버 테스트"
```

### 2. 실습 파일 추가

#### 파일 준비

1. **파일 생성**
   - CloudFormation 템플릿
   - Lambda 함수 코드
   - 설정 파일 (JSON, YAML)
   - README.md

2. **ZIP 파일 생성**
   ```bash
   cd public/files/week5
   zip -r week5-1-rds-lab.zip \
     cloudformation-template.yaml \
     init-database.sql \
     README.md
   ```

3. **파일 업로드**
   ```bash
   # public/files/week5/ 폴더에 복사
   cp week5-1-rds-lab.zip public/files/week5/
   ```

#### 다운로드 블록 작성

**Kiro AI 활용**:
```
"week5-1-rds-lab.zip 파일에 대한 다운로드 블록을 표준 형식으로 작성해줘.
파일 내용:
- cloudformation-template.yaml: VPC 및 서브넷 생성
- init-database.sql: 데이터베이스 초기화
- README.md: 실습 가이드"
```

**생성된 다운로드 블록**:
```markdown
> [!DOWNLOAD]
> [week5-1-rds-lab.zip](/files/week5/week5-1-rds-lab.zip)
> - `cloudformation-template.yaml` - VPC 및 서브넷 생성 템플릿 (태스크 0에서 기본 인프라 자동 생성)
> - `init-database.sql` - 데이터베이스 초기화 스크립트 (태스크 3에서 RDS 인스턴스에 테이블 및 샘플 데이터 생성)
> - `README.md` - 실습 파일 사용 안내
> 
> **관련 태스크:**
> - 태스크 0: VPC 환경 구축 (CloudFormation 템플릿 배포)
> - 태스크 3: 데이터베이스 초기화 (SQL 스크립트 실행)
```

### 3. 가이드 검증

```bash
# 특정 파일 검증
npm run validate:file public/content/week5/5-1-rds-multi-az.md

# 주차별 검증
node scripts/validate-advanced.js public/content/week5
```

**Kiro AI 활용**:
```
"방금 작성한 Week 5-1 가이드를 검증하고 오류를 수정해줘"
```

### 4. 가이드 작성 체크리스트

- [ ] Front Matter 필수 필드 포함
- [ ] 실습 개요 작성
- [ ] 다운로드 블록 (파일 있는 경우)
- [ ] 비용 경고 (WARNING Alert)
- [ ] 태스크별 상세 단계
- [ ] 완료 확인 메시지
- [ ] 리소스 정리 섹션
- [ ] 추가 학습 리소스
- [ ] 검증 통과 확인

---

## 교수 인계 준비

### 1. 교수가 수정 가능한 항목

**수정 가능**:
- ✅ 마크다운 실습 가이드 (`.md` 파일)
- ✅ 실습 파일 (`.zip`, `.yaml`, `.json` 등)
- ✅ Front Matter (제목, 학습 목표, 사전 요구사항)

**수정 불가** (개발자 영역):
- ❌ React 컴포넌트 (`.tsx` 파일)
- ❌ 스타일 파일 (`.css` 파일)
- ❌ 검증 스크립트 (`.js` 파일)
- ❌ 빌드 설정 (`vite.config.ts`, `package.json`)

### 2. 교수용 가이드 최종 검토

**PROFESSOR_GUIDE.md 확인 사항**:
- [ ] 마크다운 문법 설명 명확
- [ ] 예시 충분히 제공
- [ ] FAQ 실용적
- [ ] 파일 업로드 방법 명확
- [ ] 미리보기 방법 설명
- [ ] Git 기본 사용법 포함

**Kiro AI 활용**:
```
"PROFESSOR_GUIDE.md를 검토하고 교수가 이해하기 어려운 부분이 있는지 찾아줘"
"마크다운 초보자를 위한 추가 예시를 작성해줘"
```

### 3. 교수 교육 자료 준비

#### 빠른 시작 가이드 작성

**파일**: `docs/QUICK_START_FOR_PROFESSORS.md`

```markdown
# 교수용 빠른 시작 가이드

## 5분 안에 시작하기

### 1단계: 프로젝트 열기
1. Kiro 실행
2. File > Open Folder
3. university-lab-guide 선택

### 2단계: 가이드 수정
1. public/content/week1/ 폴더 열기
2. 1-1-sample.md 파일 열기
3. 내용 수정
4. 저장 (Cmd+S 또는 Ctrl+S)

### 3단계: 미리보기
1. 터미널에서 `npm run dev` 실행
2. 브라우저에서 http://localhost:5173 접속
3. Week 1 선택하여 확인

### 4단계: 변경사항 저장
1. Git 패널 열기
2. 변경된 파일 확인
3. 커밋 메시지 작성
4. Commit & Push
```

**Kiro AI 활용**:
```
"교수용 빠른 시작 가이드를 작성해줘. 5분 안에 첫 수정을 할 수 있도록"
```

#### 비디오 튜토리얼 스크립트

**주제**:
1. 마크다운 파일 수정하기 (5분)
2. 실습 파일 추가하기 (3분)
3. 변경사항 저장하기 (2분)

### 4. 교수 인계 체크리스트

#### 문서 준비
- [ ] PROFESSOR_GUIDE.md 최종 검토
- [ ] QUICK_START_FOR_PROFESSORS.md 작성
- [ ] FAQ 업데이트
- [ ] 비디오 튜토리얼 스크립트 준비

#### 환경 준비
- [ ] 교수용 Git 계정 생성
- [ ] 저장소 접근 권한 부여
- [ ] Kiro 설치 가이드 제공
- [ ] 로컬 개발 환경 설정 지원

#### 교육 준비
- [ ] 1:1 교육 일정 수립
- [ ] 실습 환경 준비
- [ ] 샘플 수정 작업 준비
- [ ] 질의응답 시간 확보

---

## 인수인계 완료 확인

### 최종 체크리스트

#### 프로젝트 상태
- [ ] 모든 검증 통과 (오류 0개)
- [ ] 타입 체크 통과
- [ ] 린트 검사 통과
- [ ] 테스트 통과
- [ ] 빌드 성공

#### 문서 완성도
- [ ] DEVELOPER_GUIDE.md 최신 상태
- [ ] PROFESSOR_GUIDE.md 최신 상태
- [ ] VALIDATION_GUIDE.md 최신 상태
- [ ] HANDOVER_GUIDE.md (이 문서) 작성 완료
- [ ] README.md 업데이트

#### 가이드 완성도
- [ ] Week 1-14 가이드 작성 완료
- [ ] 모든 실습 파일 준비 완료
- [ ] 다운로드 블록 표준 형식
- [ ] 리소스 정리 섹션 포함

#### 교수 인계 준비
- [ ] 교수용 가이드 완성
- [ ] 빠른 시작 가이드 작성
- [ ] 교육 자료 준비
- [ ] 환경 설정 완료

### 인수인계 미팅 안건

1. **프로젝트 개요** (10분)
   - 프로젝트 목적 및 구조
   - 주요 기술 스택
   - 개발 철학 및 원칙

2. **Kiro 환경 시연** (15분)
   - 프로젝트 열기
   - AI 어시스턴트 활용
   - 검증 시스템 사용

3. **표준 준수 검토** (20분)
   - 검증 결과 분석
   - 주요 표준 규칙 설명
   - 자동 수정 방법

4. **추가 개발 가이드** (20분)
   - 컴포넌트 개발 워크플로우
   - 마크다운 문법 확장
   - 검증 규칙 추가

5. **가이드 작성** (15분)
   - 실습 가이드 작성 방법
   - 실습 파일 추가 방법
   - 검증 및 미리보기

6. **교수 인계 준비** (10분)
   - 교수가 수정 가능한 항목
   - 교수용 가이드 설명
   - 교육 계획

7. **질의응답** (10분)

---

## 📞 지원 및 문의

### 1차 개발자 연락처
- 이름: [1차 개발자 이름]
- 이메일: [이메일]
- Slack: [Slack ID]

### 긴급 연락
- 프로젝트 관리자: [이름/연락처]
- 기술 지원: [이름/연락처]

### 유용한 리소스
- [프로젝트 Wiki](링크)
- [Slack 채널](링크)
- [이슈 트래커](링크)
- [TECHNICAL_DETAILS.md](TECHNICAL_DETAILS.md) - 기술 세부사항
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - 개발자 완벽 가이드
- [VALIDATION_GUIDE.md](VALIDATION_GUIDE.md) - 검증 가이드

---

**마지막 업데이트**: 2026-01-28  
**작성자**: 1차 개발자  
**검토자**: 프로젝트 관리자
