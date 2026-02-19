---
inclusion: auto
description: 종합 검토 시스템 - 소스코드와 실습 가이드 품질 검증 가이드
keywords: ['검증', '리뷰', '테스트', '검사', '확인', '점검', '오류', '경고', 'review', 'validate', 'lint', '품질', '표준', '규칙']
---

# 🔍 종합 검토 시스템 (Comprehensive Review System)

**작성일**: 2025-02-07  
**목적**: 소스코드와 실습 가이드의 품질을 체계적으로 검증

---

## 📋 개요

종합 검토 시스템은 프로젝트의 모든 소스코드와 실습 가이드를 자동으로 검증하여 품질을 보장하는 통합 시스템입니다.

### 핵심 기능

1. **소스코드 검증** (7개 항목)
   - TypeScript 타입 검사
   - ESLint 코드 품질
   - 인라인 스타일 검사 (금지)
   - Import 경로 검사 (절대 경로 권장)
   - 컴포넌트 구조 검사
   - CSS 파일 존재 확인
   - 접근성 검사 (WCAG 2.1 AA)

2. **가이드 검증** (2개 항목)
   - 기본 표준 검증 (18개 규칙)
   - 고급 표준 검증 (30개 규칙)

3. **통합 분석**
   - 점수 및 등급 산정 (A-F)
   - 우선순위별 권장사항 제공
   - JSON 리포트 생성

4. **파일 내용 검증** (5개 카테고리) ⭐ 신규
   - CloudFormation 템플릿 검증
   - Python 스크립트 검증 (Lambda DocString)
   - SQL 파일 검증
   - JSON 파일 검증
   - README 파일 검증

---

## 🚀 사용법

### 기본 명령어

```bash
# 전체 검토 (권장)
npm run review

# 소스코드만 검토
npm run review:code

# 가이드만 검토
npm run review:guides
```

### 개발 워크플로우

#### 1. 코드 작성 중
```bash
# 빠른 검증
npm run review:code
```

#### 2. 가이드 작성 중
```bash
# 빠른 검증
npm run review:guides
```

#### 3. 파일 내용 작성 중
```bash
# ZIP 파일 내용 검증
npm run validate:file-contents

# 특정 주차만
npm run validate:file-contents 4
```

#### 4. 커밋 전
```bash
# 전체 검증
npm run review
```

#### 5. 문제 수정 후
```bash
# 재검증
npm run review
```

---

## 📊 검증 항목 상세

### 소스코드 검증

#### 1. TypeScript 타입 검사 ⭐ 필수
- **검사**: 타입 오류, 타입 불일치
- **통과 기준**: 타입 오류 0개
- **실패 시**: `npx tsc --noEmit` 실행

#### 2. ESLint 코드 품질 ⭐ 필수
- **검사**: 코드 스타일, 잠재적 버그
- **통과 기준**: 오류 0개
- **실패 시**: `npm run lint:fix` 실행

#### 3. 인라인 스타일 검사 ⭐ 필수
- **검사**: `style={{}}` 사용 여부
- **통과 기준**: 인라인 스타일 0개
- **실패 시**: CSS 파일 생성 및 className 사용

**❌ 금지:**
```typescript
<div style={{ padding: '10px', color: 'red' }}>내용</div>
```

**✅ 권장:**
```typescript
// Component.tsx
import './Component.css'
<div className="my-component">내용</div>

// Component.css
.my-component {
  padding: 10px;
  color: red;
}
```

#### 4. Import 경로 검사
- **검사**: 상대 경로(`../../`) 사용 여부
- **통과 기준**: 모든 import가 절대 경로(`@/`) 사용
- **권장**: 상대 경로를 절대 경로로 변경

**❌ 금지:**
```typescript
import { InfoCard } from '../../../components/education/InfoCard'
```

**✅ 권장:**
```typescript
import { InfoCard } from '@/components/education/InfoCard'
```

#### 5. 컴포넌트 구조 검사
- **검사**: Props 인터페이스, React.FC 사용, export 방식
- **통과 기준**: 표준 구조 준수

**✅ 표준 구조:**
```typescript
import React from 'react'
import './MyComponent.css'

interface MyComponentProps {
  title: string
  description?: string
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  description 
}) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
```

#### 6. CSS 파일 존재 확인
- **검사**: className 사용하는 컴포넌트에 CSS 파일 존재
- **통과 기준**: 모든 컴포넌트에 대응하는 CSS 파일 존재

#### 7. 접근성 검사
- **검사**: img alt 속성, button aria-label
- **통과 기준**: WCAG 2.1 AA 기준 준수

---

### 가이드 검증

#### 1. 기본 표준 검증 (18개 규칙) ⭐ 필수

**주요 규칙:**
- AWS Management Console 표준 표현
- 왼쪽 메뉴에서 (조사 통일)
- 모든 단계 끝에 마침표
- 청유형 금지 (~하세요 → ~합니다)
- 상태값 큰따옴표 ("Available")
- 연속 동작 (~하고 → ~한 후)
- 버튼 문법 ([[버튼명]])
- 필드 입력 (`값`)
- 예상 출력 ([!OUTPUT])

**실패 시**: `npm run validate:all` 실행

#### 2. 고급 표준 검증 (30개 규칙)

**주요 규칙:**
- Front Matter 완성도
- 표준 구조 준수
- Alert 사용 패턴
- 조사/동사/용어 일관성
- 태스크 설명 품질
- 다운로드 파일 설명
- 페이지 구조 표준
- CONCEPT Alert 사용 (실습 제한, 데모 적극)
- **리소스 태그 규칙** (신규) ⭐

**실패 시**: `npm run validate:advanced` 실행

#### 3. 리소스 태그 규칙 검증 ⭐ 신규

**목적**: 모든 수동 생성 리소스에 표준 태그 추가 확인

**필수 태그 3개**:
- `Project=AWS-Lab` (고정값)
- `Week={주차}-{세션}` (예: 5-3, 10-1)
- `CreatedBy=Student` (고정값)

**검증 항목**:
1. **태그 추가 단계 존재**
   - 모든 수동 생성 리소스에 태그 추가 단계 포함
   - 표 형식 또는 간결 버전 사용
   - 필수 태그 3개 모두 포함

2. **리소스 정리 섹션 표준**
   - 방법 1: Tag Editor로 리소스 찾기 (권장)
   - 방법 2: CloudFormation 스택 삭제
   - 방법 3: 수동 삭제 (필요시)

**태그 추가 표준 형식**:

**표 형식 (권장)**:
```markdown
X. **Tags - optional** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `{주차}-{세션}` |
| `CreatedBy` | `Student` |
```

**간결 버전 (허용)**:
```markdown
X. **Tags - optional**에서 태그를 추가합니다: `Project=AWS-Lab`, `Week={주차}-{세션}`, `CreatedBy=Student`
```

**리소스 정리 표준 구조**:
```markdown
## 리소스 정리

> [!WARNING]
> 다음 단계를 **반드시 수행**하여 불필요한 비용을 방지하세요.

### 방법 1: Tag Editor로 리소스 찾기 (권장)

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Resource Groups & Tag Editor`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `ap-northeast-2`를 선택합니다.
4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Week`
   - **Tag value**: `{주차}-{세션}`
6. [[Search resources]] 버튼을 클릭합니다.
7. 이 실습에서 생성한 모든 리소스가 표시됩니다.

> [!NOTE]
> Tag Editor는 리소스를 찾는 용도로만 사용됩니다. 실제 삭제는 각 서비스 콘솔에서 수행해야 합니다.

### 방법 2: CloudFormation 스택 삭제 (태스크 0이 있는 경우)

1. CloudFormation 콘솔로 이동합니다.
2. `week{주차}-{세션}-lab-stack` 스택을 선택합니다.
3. [[Delete]] 버튼을 클릭합니다.
4. 확인 창에서 [[Delete]] 버튼을 클릭합니다.
5. 스택 삭제가 완료될 때까지 기다립니다 (2-3분 소요).

> [!NOTE]
> CloudFormation 스택을 삭제하면 태스크 0에서 생성한 모든 리소스가 자동으로 삭제됩니다.

### 방법 3: 수동 삭제 (필요시)

태스크 1-N에서 수동으로 생성한 리소스가 있다면 다음 순서로 삭제합니다:

1. [리소스 1] 삭제
2. [리소스 2] 삭제
3. ...

✅ **실습 종료**: 모든 리소스가 정리되었습니다.
```

**태그 지원 서비스**:
- ✅ Amazon S3 (버킷)
- ✅ AWS Lambda (함수)
- ✅ Amazon DynamoDB (테이블)
- ✅ Amazon EC2 (인스턴스)
- ✅ Amazon RDS (인스턴스)
- ✅ Amazon VPC (VPC, 서브넷, 보안 그룹, 엔드포인트)
- ✅ Amazon ElastiCache (클러스터)
- ✅ Amazon API Gateway (API)
- ✅ Amazon CloudFront (배포)
- ✅ Amazon EventBridge (규칙)
- ✅ AWS IAM (역할)
- ✅ AWS CloudFormation (스택)
- ✅ AWS Glue (데이터베이스, 크롤러, ETL 작업)
- ✅ Amazon Bedrock (Knowledge Base, Agent)
- ✅ Amazon EKS (클러스터)
- ✅ AWS CodeBuild (프로젝트)
- ✅ AWS CodePipeline (파이프라인)

**태그 미지원 서비스**:
- ❌ IAM 사용자 (일부 제한)
- ❌ IAM 그룹
- ❌ CloudWatch Logs 로그 그룹 (일부 제한)
- ❌ Route 53 레코드

**검증 체크리스트**:
- [ ] 모든 수동 생성 리소스에 태그 추가 단계 포함
- [ ] 필수 태그 3개 모두 포함 (`Project`, `Week`, `CreatedBy`)
- [ ] `Week` 값이 올바른 형식 (`{주차}-{세션}`)
- [ ] 리소스 정리 섹션에 Tag Editor 사용법 포함
- [ ] CloudFormation 스택 삭제 단계 포함 (태스크 0이 있는 경우)
- [ ] 수동 삭제 단계 포함 (필요시)

**참고 문서**: `.kiro/steering/markdown-guide/11-resource-tagging-rules.md`

**실패 시**: 태그 추가 단계 및 리소스 정리 섹션 업데이트

#### 3. 파일 내용 검증 (5개 카테고리) ⭐ 신규

**검증 항목:**
- CloudFormation 템플릿 (YAML)
- Python 스크립트 (Lambda DocString)
- SQL 파일
- JSON 파일
- README 파일

**실행 방법:**
```bash
# 전체 검증
npm run validate:file-contents

# 특정 주차
npm run validate:file-contents 4
```

**주요 검증 규칙:**

**CloudFormation 템플릿:**
- 필수 섹션: Resources
- 권장 섹션: Description, Parameters, Outputs
- 리소스 타입 확인
- Outputs 섹션 상세 검증 (Value, Description)

**Python 스크립트 (Lambda 함수):**
- 모듈 레벨 DocString 필수 (규칙 40)
- 함수 레벨 DocString 필수 (Args, Returns)
- 한국어 주석 권장
- import 문 확인

**SQL 파일:**
- SQL 키워드 확인 (CREATE, INSERT, SELECT 등)
- 세미콜론(;) 확인
- 주석 권장 (-- 또는 /* */)

**JSON 파일:**
- JSON 파싱 검증
- 구조 확인

**README 파일:**
- 최소 길이 확인 (100자 이상)
- 마크다운 제목(#) 권장

**Lambda 함수 DocString 예시:**
```python
"""
AWS Lambda 함수: 서버리스 API

이 Lambda 함수는 DynamoDB와 연동하여 RESTful API를 제공합니다.

주요 기능:
    1. GET /todos - 할 일 목록 조회
    2. POST /todos - 새 할 일 생성

환경 변수:
    TABLE_NAME (str): DynamoDB 테이블 이름

트리거:
    API Gateway (REST API)
"""

def lambda_handler(event, context):
    """
    API Gateway 요청을 처리하는 Lambda 함수
    
    Args:
        event (dict): API Gateway에서 전달된 이벤트
        context (LambdaContext): Lambda 실행 컨텍스트
    
    Returns:
        dict: HTTP 응답 형식
            - statusCode (int): 200 (성공)
            - body (str): JSON 형식의 처리 결과
    """
    # 이벤트 전체 내용을 로그에 출력 (디버깅용)
    print(f"Received event: {json.dumps(event)}")
```

**실패 시**: Lambda 함수에 DocString 추가, CloudFormation Outputs 섹션 추가

#### 4. Lab Environment 검증 (5개 카테고리)

**검증 항목:**
- ZIP 파일 존재 확인
- ZIP 내부 파일 검증
- 데이터 일관성 (curriculum.ts vs labEnvironments.ts)
- 마크다운 가이드 검증 (DOWNLOAD Alert)
- AWS MCP 서버 통합 (선택사항)

**실행 방법:**
```bash
# 전체 검증
npm run validate:lab-env

# 특정 주차
npm run validate:lab-env:week 3

# 특정 파일
npm run validate:lab-env:file public/content/week3/3-1-vpc-design-strategy.md
```

**AWS MCP 서버 활용:**
```
"Week 3 Session 1 가이드가 AWS 공식 문서와 일치하는지 확인해줘"
"VPC Endpoint 설정이 AWS 베스트 프랙티스를 따르는지 확인해줘"
```

자세한 내용: `scripts/README.md` 참조

#### 4. Lab Content 검증 (7단계 체크리스트) ⭐ 신규

**목적**: 실습 가이드의 기술적 세부사항이 참조 문서(README.md 등)와 정확히 일치하는지 검증

**검증 방법론**: `LAB_CONTENT_VERIFICATION_METHODOLOGY.md`

**7단계 체크리스트**:
1. ✅ 파일 구조 확인
2. ✅ DOWNLOAD Alert 검증
3. ✅ 학습 목표 일치 확인
4. ✅ 태스크 내용 검증
5. ⭐ **기술적 세부사항 검증** (가장 중요)
   - IP/CIDR 블록
   - 포트 번호
   - URL 파라미터
   - 환경 변수
   - 명령어 파라미터
6. ✅ 아키텍처 구성 요소 검증
7. ✅ 추가 기술 정보 검증

**검증 우선순위**:
- ⭐⭐⭐ 기술적 세부사항 (5단계) - 필수
- ⭐⭐ DOWNLOAD Alert (2단계) - 필수
- ⭐⭐ 학습 목표 (3단계) - 필수
- ⭐ 태스크 내용 (4단계) - 권장
- ⭐ 아키텍처 구성 요소 (6단계) - 권장
- ⭐ 추가 기술 정보 (7단계) - 권장

**검증 예시**: Week 1-3 (100% 일치)
- 상세 리포트: `WEEK1-3_CONTENT_VERIFICATION.md`
- 검증 항목: 28개 (모두 일치)

**사용 방법**:
```bash
# 방법론 문서 확인
cat LAB_CONTENT_VERIFICATION_METHODOLOGY.md

# 특정 주차 검증 (수동)
# 1. 가이드 파일과 README.md 읽기
# 2. 7단계 체크리스트 적용
# 3. WEEK{X}-{Y}_CONTENT_VERIFICATION.md 생성
```

자세한 내용: `LAB_CONTENT_VERIFICATION_METHODOLOGY.md` 참조

---

## 📈 리포트 해석

### 점수 및 등급

```
전체 점수: 85점 (B등급)
```

- **A등급 (90-100점)**: 우수 - 배포 준비 완료
- **B등급 (80-89점)**: 양호 - 경고 개선 권장
- **C등급 (70-79점)**: 보통 - 개선 필요
- **D등급 (60-69점)**: 미흡 - 상당한 개선 필요
- **F등급 (0-59점)**: 불합격 - 전면 재작업 필요

### 결과 해석

```
📦 소스코드 검토 결과
  총 검사: 7개
  통과: 5개
  실패: 1개
  경고: 3개

  주요 문제:
  ❌ 인라인 스타일: 인라인 스타일 사용 금지 (5개)
     💡 해결: 별도 CSS 파일 생성 및 className 사용
```

- **❌ 오류**: 반드시 수정 필요
- **⚠️ 경고**: 개선 권장
- **ℹ️ 정보**: 참고 사항

### 권장사항

```
💡 권장사항
  1. [HIGH] 3개의 오류를 먼저 수정하세요
     → 오류 항목부터 우선 처리

  2. [MEDIUM] 코드 품질 경고가 많습니다
     → ESLint 및 구조 개선 필요
```

- **HIGH**: 즉시 처리 필요
- **MEDIUM**: 가능한 빨리 처리
- **LOW**: 시간 날 때 처리

---

## 🔧 문제 해결

### 자주 발생하는 문제

#### 1. TypeScript 오류
```bash
# 상세 오류 확인
npx tsc --noEmit

# 타입 정의 추가
npm install --save-dev @types/react @types/react-dom
```

#### 2. ESLint 오류
```bash
# 자동 수정
npm run lint:fix

# 수동 확인
npm run lint
```

#### 3. 인라인 스타일 제거
```typescript
// Before
<div style={{ padding: '10px' }}>내용</div>

// After
import './Component.css'
<div className="my-component">내용</div>

// Component.css
.my-component { padding: 10px; }
```

#### 4. 가이드 표준 오류
```bash
# 전체 확인
npm run validate:all

# 특정 파일
npm run validate:file public/content/week1/1-1-demo.md
```

#### 5. AWS MCP 서버 활용 (권장)
AWS MCP 서버를 사용하면 가이드 작성 및 코드 검토 시 AWS 공식 문서를 실시간으로 참조할 수 있습니다.

**설정 확인**:
```bash
# MCP 서버 설정 확인
cat .kiro/settings/mcp.json

# 설정이 없으면 자동 생성됨 (이미 완료)
```

**가이드 작성 시 활용**:
```
"VPC Endpoint에 대한 AWS 공식 문서를 참조해서 개념을 확인해줘"
"Lambda 함수 환경 변수 설정 방법을 AWS 문서에서 찾아줘"
"S3 버킷 보안 설정 베스트 프랙티스를 AWS 문서로 확인해줘"
```

**가이드 검증 시 활용**:
```
"이 VPC Endpoint 가이드가 AWS 공식 문서와 일치하는지 확인해줘"
"CloudFormation 템플릿이 AWS 베스트 프랙티스를 따르는지 검증해줘"
"보안 그룹 설정이 AWS 권장사항을 준수하는지 확인해줘"
```

**검증 워크플로우**:
```bash
# 1. 가이드 작성 (MCP 서버로 AWS 문서 참조)
"RDS Multi-AZ 개념을 AWS 문서로 확인해줘"

# 2. 가이드 검증 (MCP 서버로 정확성 확인)
"작성한 RDS 가이드가 AWS 문서와 일치하는지 확인해줘"

# 3. 종합 검토 실행
npm run review

# 4. 최종 확인 (MCP 서버로 베스트 프랙티스 검증)
"전체 가이드가 AWS 베스트 프랙티스를 따르는지 확인해줘"
```

**장점**:
- ✅ AWS 공식 문서 기반 정확한 가이드 작성
- ✅ 최신 AWS 기능 및 변경사항 반영
- ✅ 베스트 프랙티스 자동 검증
- ✅ 보안 설정 권장사항 확인
- ✅ 비용 정보 정확성 검증

**자세한 활용 방법**: `markdown-guide.md`의 "AWS MCP 서버 활용 가이드" 섹션 참조

---

## 📋 개선 워크플로우

### 1단계: 오류 수정 (필수)
```bash
npm run review
# 오류 항목 확인 및 수정
npm run review  # 재검증
```

### 2단계: 경고 개선 (권장)
```bash
# 경고 항목 하나씩 개선
npm run review  # 재검증
```

### 3단계: 정보 검토 (선택)
```bash
# 개선 제안 검토 및 적용
npm run review  # 최종 검증
```

### 4단계: 배포 준비
```bash
npm run review  # 모든 검증 통과 확인
npm run build   # 빌드 테스트
```

---

## 💡 베스트 프랙티스

### 1. 정기적인 검증
- 매일 작업 시작 전: `npm run review`
- 커밋 전: `npm run review`
- PR 생성 전: `npm run review`

### 2. 점진적 개선
- 한 번에 모든 경고를 수정하려 하지 마세요
- 우선순위가 높은 것부터 하나씩 개선
- 개선 후 반드시 재검증

### 3. 팀 협업
- 리포트를 팀원과 공유
- 공통 문제는 가이드에 추가
- 베스트 프랙티스를 문서화

---

## 🎯 목표 기준

### 배포 준비 완료 기준
- ✅ 전체 점수 80점 이상
- ✅ 오류 0개
- ✅ 경고 10개 이하
- ✅ TypeScript 타입 오류 0개
- ✅ 인라인 스타일 0개
- ✅ 마크다운 표준 오류 0개

### 우수 품질 기준
- ✅ 전체 점수 90점 이상
- ✅ 오류 0개
- ✅ 경고 5개 이하
- ✅ 모든 컴포넌트 표준 구조 준수
- ✅ 모든 가이드 고급 표준 준수

---

## 📄 생성 파일

### REVIEW_REPORT.json
검증 후 자동 생성되는 상세 리포트:

```json
{
  "code": {
    "total": 7,
    "passed": 5,
    "failed": 1,
    "warnings": 3,
    "issues": [...]
  },
  "guides": {
    "total": 2,
    "passed": 1,
    "failed": 0,
    "warnings": 8,
    "issues": [...]
  },
  "overall": {
    "score": 85,
    "grade": "B",
    "recommendations": [...]
  }
}
```

---

## 🔗 관련 문서

- [실습 가이드 마크다운 작성 가이드](markdown-guide.md)
- [대학교 실습 가이드 개발 가이드](university-lab-guide-development.md)
- [검증 스크립트 상세 가이드](../scripts/REVIEW_GUIDE.md)
- [검증 스크립트 README](../scripts/README.md)

---

## 🚨 중요 규칙

### 절대 금지 사항
1. ❌ 인라인 스타일 사용 (`style={{}}`)
2. ❌ 상대 경로 import (`../../`)
3. ❌ 청유형 사용 (~하세요)
4. ❌ 예상 출력 이모지 사용 (📋)
5. ❌ 마침표 누락
6. ❌ 괄호 설명 과다 사용

### 필수 준수 사항
1. ✅ CSS 파일 사용 (className)
2. ✅ 절대 경로 import (@/)
3. ✅ 명령형 사용 (~합니다)
4. ✅ [!OUTPUT] Alert 사용
5. ✅ 모든 단계 끝에 마침표
6. ✅ 간결한 표현

---

## 📊 검증 통계 (참고)

### 일반적인 문제 분포
- 인라인 스타일: 30%
- Import 경로: 25%
- 마크다운 표준: 20%
- 컴포넌트 구조: 15%
- 접근성: 10%

### 평균 개선 시간
- 오류 수정: 1-2시간
- 경고 개선: 2-4시간
- 정보 검토: 1-2시간
- 총 소요: 4-8시간

---

**마지막 업데이트**: 2025-02-07  
**버전**: 1.0.0
