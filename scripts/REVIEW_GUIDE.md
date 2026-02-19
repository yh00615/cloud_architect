# 🔍 종합 검토 시스템 가이드

소스코드와 실습 가이드의 품질을 체계적으로 검증하는 통합 시스템입니다.

## 📋 목차

- [빠른 시작](#빠른-시작)
- [검증 항목](#검증-항목)
- [사용법](#사용법)
- [리포트 해석](#리포트-해석)
- [문제 해결](#문제-해결)

---

## 🚀 빠른 시작

### 전체 검토 (권장)
```bash
npm run review
```

모든 소스코드와 가이드를 한 번에 검증합니다.

### 소스코드만 검토
```bash
npm run review:code
```

TypeScript, ESLint, 스타일링, 컴포넌트 구조 등을 검증합니다.

### 가이드만 검토
```bash
npm run review:guides
```

마크다운 표준, 일관성, 구조 등을 검증합니다.

---

## 📊 검증 항목

### 소스코드 검증 (7개 항목)

#### 1. TypeScript 타입 검사 ⭐ 필수
- **검사 내용**: 타입 오류, 타입 불일치
- **통과 기준**: 타입 오류 0개
- **실패 시**: `npx tsc --noEmit` 실행하여 상세 확인

#### 2. ESLint 코드 품질 ⭐ 필수
- **검사 내용**: 코드 스타일, 잠재적 버그, 베스트 프랙티스
- **통과 기준**: 오류 0개
- **실패 시**: `npm run lint:fix` 실행

#### 3. 인라인 스타일 검사 ⭐ 필수
- **검사 내용**: `style={{}}` 사용 여부
- **통과 기준**: 인라인 스타일 0개
- **실패 시**: CSS 파일 생성 및 className 사용

**❌ 잘못된 예시:**
```typescript
<div style={{ padding: '10px', color: 'red' }}>
  내용
</div>
```

**✅ 올바른 예시:**
```typescript
// Component.tsx
import './Component.css'

<div className="my-component">
  내용
</div>

// Component.css
.my-component {
  padding: 10px;
  color: red;
}
```

#### 4. Import 경로 검사
- **검사 내용**: 상대 경로(`../../`) 사용 여부
- **통과 기준**: 모든 import가 절대 경로(`@/`) 사용
- **권장**: 상대 경로를 절대 경로로 변경

**❌ 잘못된 예시:**
```typescript
import { InfoCard } from '../../../components/education/InfoCard'
```

**✅ 올바른 예시:**
```typescript
import { InfoCard } from '@/components/education/InfoCard'
```

#### 5. 컴포넌트 구조 검사
- **검사 내용**: Props 인터페이스, React.FC 사용, export 방식
- **통과 기준**: 표준 구조 준수
- **권장**: 일관된 컴포넌트 패턴 사용

**✅ 표준 구조:**
```typescript
import React from 'react'
import './MyComponent.css'

interface MyComponentProps {
  title: string
  description?: string
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, description }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
```

#### 6. CSS 파일 존재 확인
- **검사 내용**: className 사용하는 컴포넌트에 CSS 파일 존재
- **통과 기준**: 모든 컴포넌트에 대응하는 CSS 파일 존재
- **권장**: 컴포넌트와 동일한 이름의 CSS 파일 생성

#### 7. 접근성 검사
- **검사 내용**: img alt 속성, button aria-label, 키보드 접근성
- **통과 기준**: WCAG 2.1 AA 기준 준수
- **권장**: 모든 인터랙티브 요소에 접근성 속성 추가

---

### 실습 가이드 검증 (2개 항목)

#### 1. 기본 표준 검증 ⭐ 필수
- **검사 내용**: 18개 기본 규칙 (AWS 서비스 접근, 왼쪽 메뉴, 마침표, 청유형 등)
- **통과 기준**: 오류 0개
- **실패 시**: `npm run validate:all` 실행하여 상세 확인

**주요 규칙:**
- AWS Management Console 표준 표현
- 왼쪽 메뉴에서 (조사 통일)
- 모든 단계 끝에 마침표
- 청유형 금지 (~하세요 → ~합니다)
- 상태값 큰따옴표 ("Available")
- 연속 동작 (~하고 → ~한 후)

#### 2. 고급 표준 검증
- **검사 내용**: 30개 고급 규칙 (일관성, 구조, 품질)
- **통과 기준**: 정보 레벨 권장사항만 존재
- **실패 시**: `npm run validate:advanced` 실행하여 상세 확인

**주요 규칙:**
- Front Matter 완성도
- 표준 구조 준수
- Alert 사용 패턴
- 조사/동사/용어 일관성
- 태스크 설명 품질
- 다운로드 파일 설명

---

## 📖 사용법

### 1. 개발 중 검증

코드 작성 후 즉시 검증:

```bash
# 소스코드만 빠르게 검증
npm run review:code

# 가이드만 빠르게 검증
npm run review:guides
```

### 2. 커밋 전 검증

Git 커밋 전 전체 검증:

```bash
npm run review
```

### 3. CI/CD 통합

GitHub Actions에서 자동 검증:

```yaml
# .github/workflows/review.yml
name: Code Review

on: [push, pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run review
```

### 4. 상세 리포트 확인

검증 후 생성되는 JSON 리포트:

```bash
cat REVIEW_REPORT.json
```

---

## 📊 리포트 해석

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

#### 소스코드 결과
```
📦 소스코드 검토 결과
  총 검사: 7개
  통과: 5개
  실패: 1개
  경고: 3개
```

- **통과**: 해당 항목이 표준을 완벽히 준수
- **실패**: 반드시 수정해야 하는 오류 존재
- **경고**: 개선 권장 사항 존재

#### 가이드 결과
```
📚 실습 가이드 검토 결과
  총 검사: 2개
  통과: 1개
  실패: 0개
  경고: 15개
```

### 주요 문제 예시

```
주요 문제:
  ❌ 인라인 스타일: 인라인 스타일 사용 금지 (5개)
     💡 해결: 별도 CSS 파일 생성 및 className 사용

  ⚠️  Import 경로: 상대 경로 대신 절대 경로(@/) 사용 권장 (12개)
     💡 해결: import 경로를 @/로 시작하도록 변경
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

#### 1. TypeScript 오류가 많이 발생
```bash
# 상세 오류 확인
npx tsc --noEmit

# 타입 정의 추가
npm install --save-dev @types/react @types/react-dom
```

#### 2. ESLint 오류가 많이 발생
```bash
# 자동 수정 시도
npm run lint:fix

# 수동 수정 필요한 항목 확인
npm run lint
```

#### 3. 인라인 스타일 제거 방법
```typescript
// Before
<div style={{ padding: '10px' }}>내용</div>

// After
// Component.tsx
import './Component.css'
<div className="my-component">내용</div>

// Component.css
.my-component {
  padding: 10px;
}
```

#### 4. 가이드 표준 오류 수정
```bash
# 상세 오류 확인
npm run validate:all

# 특정 파일만 확인
npm run validate:file public/content/week1/1-1-demo.md
```

### 검증 스킵 (비권장)

특정 검증을 일시적으로 스킵해야 하는 경우:

```typescript
// ESLint 규칙 일시 비활성화
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = fetchData()
```

**⚠️ 주의**: 스킵은 최소한으로 사용하고 반드시 주석으로 이유를 명시하세요.

---

## 📈 개선 워크플로우

### 1단계: 오류 수정 (필수)
```bash
npm run review
# 오류 항목 확인 및 수정
# 재검증
npm run review
```

### 2단계: 경고 개선 (권장)
```bash
# 경고 항목 하나씩 개선
# 재검증
npm run review
```

### 3단계: 정보 검토 (선택)
```bash
# 개선 제안 검토 및 적용
# 최종 검증
npm run review
```

### 4단계: 배포 준비
```bash
# 모든 검증 통과 확인
npm run review
# 빌드 테스트
npm run build
# 배포
```

---

## 💡 팁

### 1. 정기적인 검증
- 매일 작업 시작 전: `npm run review`
- 커밋 전: `npm run review`
- PR 생성 전: `npm run review`

### 2. 점진적 개선
- 한 번에 모든 경고를 수정하려 하지 마세요
- 우선순위가 높은 것부터 하나씩 개선하세요
- 개선 후 반드시 재검증하세요

### 3. 팀 협업
- 리포트를 팀원과 공유하세요
- 공통 문제는 가이드에 추가하세요
- 베스트 프랙티스를 문서화하세요

---

## 📚 관련 문서

- [실습 가이드 마크다운 작성 가이드](../.kiro/steering/markdown-guide.md)
- [대학교 실습 가이드 개발 가이드](../.kiro/steering/university-lab-guide-development.md)
- [검증 스크립트 README](./README.md)

---

**마지막 업데이트**: 2025-02-07
