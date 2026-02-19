# 기술 세부사항 가이드

> 개발자가 알아야 할 추가 기술 정보

## 📋 목차

1. [프로젝트 설정 파일](#프로젝트-설정-파일)
2. [CloudScape 통합 상세](#cloudscape-통합-상세)
3. [스타일링 규칙](#스타일링-규칙)
4. [성능 최적화](#성능-최적화)
5. [디버깅 팁](#디버깅-팁)
6. [알려진 이슈](#알려진-이슈)
7. [배포 전 체크리스트](#배포-전-체크리스트)

---

## 프로젝트 설정 파일

### vite.config.ts

**절대 경로 alias 설정**:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@/components': path.resolve(__dirname, './src/components'),
    '@/styles': path.resolve(__dirname, './src/styles'),
    '@/utils': path.resolve(__dirname, './src/utils'),
    '@/types': path.resolve(__dirname, './src/types'),
    '@/contexts': path.resolve(__dirname, './src/contexts'),
    '@/hooks': path.resolve(__dirname, './src/hooks'),
    '@/data': path.resolve(__dirname, './src/data'),
    '@/pages': path.resolve(__dirname, './src/pages')
  }
}
```

**중요**: 모든 import는 절대 경로를 사용해야 합니다.
```typescript
// ✅ 올바른 예시
import { TaskDescription } from '@/components/education/TaskDescription'
import '@/styles/guide-badges.css'

// ❌ 잘못된 예시
import { TaskDescription } from '../../../components/education/TaskDescription'
import '../../../styles/guide-badges.css'
```

**빌드 최적화**:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'cloudscape': ['@cloudscape-design/components', '@cloudscape-design/global-styles']
      }
    }
  }
}
```

**서버 설정**:
```typescript
server: {
  port: 3000,  // 개발 서버 포트
  open: true   // 자동으로 브라우저 열기
}
```

**주의**: README.md에는 `http://localhost:5173`으로 되어 있지만, 실제 설정은 `3000` 포트입니다.

---

### tsconfig.json

**절대 경로 매핑**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/styles/*": ["src/styles/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"],
      "@/contexts/*": ["src/contexts/*"],
      "@/hooks/*": ["src/hooks/*"]
    }
  }
}
```

---

### package.json

**사용 가능한 모든 스크립트**:

| 스크립트 | 명령어 | 설명 |
|---------|--------|------|
| **개발** | `npm run dev` | 개발 서버 시작 (포트 3000) |
| **빌드** | `npm run build` | TypeScript 컴파일 + Vite 빌드 |
| **미리보기** | `npm run preview` | 빌드 결과 미리보기 |
| **타입 체크** | `npm run type-check` | TypeScript 타입 검사 |
| **린트** | `npm run lint` | ESLint 검사 |
| **린트 수정** | `npm run lint:fix` | ESLint 자동 수정 |
| **테스트** | `npm run test` | Vitest 단위 테스트 |
| **커버리지** | `npm run test:coverage` | 테스트 커버리지 |
| **전체 검증** | `npm run validate:all` | 모든 마크다운 검증 |
| **고급 검증** | `npm run validate:advanced` | 30개 규칙 검증 |
| **파일 검증** | `npm run validate:file` | 특정 파일 검증 |
| **주차 검증** | `npm run validate:week` | 특정 주차 검증 |
| **진행률** | `npm run validate:progress` | 검증 진행률 확인 |
| **자동 수정** | `npm run fix:auto` | 일반 오류 자동 수정 |

---

## CloudScape 통합 상세

### 필수 임포트

**main.tsx에서 글로벌 스타일 임포트**:
```typescript
import '@cloudscape-design/global-styles/index.css'
```

**개별 컴포넌트 임포트 (트리 쉐이킹)**:
```typescript
// ✅ 올바른 방법
import { Container, Header, Button, Alert } from '@cloudscape-design/components'

// ❌ 잘못된 방법 (번들 크기 증가)
import * as CloudScape from '@cloudscape-design/components'
```

---

### 테마 설정

**다크모드 지원**:
```typescript
// ThemeContext.tsx
useEffect(() => {
  document.documentElement.setAttribute('data-awsui-theme', theme)
}, [theme])
```

**CSS 변수 활용**:
```css
.custom-component {
  background-color: var(--color-background-container-content);
  color: var(--color-text-body-default);
  border: 1px solid var(--color-border-divider-default);
}

/* 다크모드 자동 지원 */
[data-awsui-theme="dark"] .custom-component {
  /* CloudScape 변수가 자동으로 다크모드 색상으로 변경됨 */
}
```

---

### 디자인 제한사항

**❌ 절대 금지: 그라데이션 사용**
```css
/* ❌ 금지 */
.component {
  background: linear-gradient(135deg, #color1, #color2);
}

/* ✅ 허용 */
.component {
  background: var(--color-background-container-content);
  border: 1px solid var(--color-border-divider-default);
}
```

**이유**:
- CloudScape Design System 일관성 유지
- 접근성 및 색상 대비 문제 방지
- 다크모드 호환성 보장
- AWS 브랜드 가이드라인 준수

---

### 텍스트 크기 표준화

**필수 규칙**:
```css
/* 기본 텍스트 */
.standard-text {
  font-size: 1rem;      /* 16px */
  line-height: 1.6;
}

/* 보조 텍스트 */
.small-text {
  font-size: 0.875rem;  /* 14px */
  line-height: 1.5;
}

/* 강조 텍스트 */
.large-text {
  font-size: 1.125rem;  /* 18px */
  line-height: 1.4;
}
```

**금지사항**:
```typescript
// ❌ 비표준 크기 사용 금지
<div style={{ fontSize: '13px' }}>텍스트</div>
<div style={{ fontSize: '15px' }}>텍스트</div>
<div style={{ fontSize: '0.8rem' }}>텍스트</div>

// ✅ 표준 크기만 사용
<div style={{ fontSize: '1rem' }}>텍스트</div>
<div style={{ fontSize: '0.875rem' }}>보조 텍스트</div>
<div style={{ fontSize: '1.125rem' }}>강조 텍스트</div>
```

---

## 스타일링 규칙

### CSS 파일 분리 필수

**❌ 절대 금지: 인라인 스타일**
```typescript
// ❌ 잘못된 예시
export const UserValue: React.FC = ({ children }) => {
  return (
    <code style={{
      backgroundColor: '#e3f2fd',
      color: '#0d47a1',
      padding: '2px 6px'
    }}>
      {children}
    </code>
  )
}
```

**✅ 올바른 방법: CSS 파일 분리**
```typescript
// UserValue.tsx
import './UserValue.css'

export const UserValue: React.FC = ({ children }) => {
  return <code className="user-value">{children}</code>
}
```

```css
/* UserValue.css */
.user-value {
  background-color: #e3f2fd;
  color: #0d47a1;
  padding: 2px 6px;
  font-size: 1rem;
  font-family: Monaco, Menlo, monospace;
  border-radius: 3px;
}

/* 다크모드 지원 */
[data-awsui-theme="dark"] .user-value {
  background-color: #1e3a5f;
  color: #90caf9;
}
```

**예외 상황** (인라인 스타일 허용):
- 동적으로 계산되는 값 (예: `width: ${progress}%`)
- 사용자 입력에 따른 스타일 (예: 사용자 선택 색상)
- 한 번만 사용되는 매우 특수한 경우

---

### 한국어 UI 텍스트 필수

**모든 사용자 대면 텍스트는 한국어로 작성**:
```typescript
// ✅ 올바른 예시
<Button variant="primary">실습 시작하기</Button>
<Alert type="success">실습이 성공적으로 완료되었습니다!</Alert>
<Header variant="h2">학습 목표</Header>

// ❌ 잘못된 예시
<Button variant="primary">Start Lab</Button>
<Alert type="success">Lab completed successfully!</Alert>
<Header variant="h2">Learning Objectives</Header>
```

**예외**: AWS 서비스명, 기술 용어, 코드 예시는 영어 사용 가능
```typescript
// ✅ 허용
<Box>Amazon S3 버킷을 생성합니다</Box>
<code>aws s3 ls</code>
```

---

## 성능 최적화

### 코드 스플리팅

**동적 임포트 사용**:
```typescript
// App.tsx
import { lazy, Suspense } from 'react'

const WeeklyGuide = lazy(() => import('./pages/WeeklyGuide'))
const SessionGuide = lazy(() => import('./pages/SessionGuide'))

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/week/:week" element={<WeeklyGuide />} />
        <Route path="/week/:week/:session" element={<SessionGuide />} />
      </Routes>
    </Suspense>
  )
}
```

---

### React.memo 사용

**불필요한 리렌더링 방지**:
```typescript
export const WeekCard = React.memo<WeekCardProps>(({ week, status }) => {
  return (
    <Container>
      {/* 컴포넌트 내용 */}
    </Container>
  )
})

WeekCard.displayName = 'WeekCard'
```

---

### useMemo와 useCallback

**비싼 계산 캐싱**:
```typescript
const sortedWeeks = useMemo(() => {
  return weeks.sort((a, b) => a.number - b.number)
}, [weeks])

const handleWeekComplete = useCallback((weekNumber: number) => {
  markWeekCompleted(weekNumber)
}, [markWeekCompleted])
```

---

## 디버깅 팁

### 마크다운 렌더링 디버깅

```typescript
// MarkdownRenderer.tsx
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const processedContent = preprocessContent(content)
  
  // 개발 모드에서만 디버깅
  if (import.meta.env.DEV) {
    console.group('Markdown Rendering')
    console.log('Original:', content.substring(0, 200))
    console.log('Processed:', processedContent.substring(0, 200))
    console.groupEnd()
  }
  
  return <ReactMarkdown>{processedContent}</ReactMarkdown>
}
```

---

### 검증 규칙 디버깅

```javascript
// validate-advanced.js
ruleName: {
  check: (content, filePath) => {
    console.log(`[DEBUG] Checking ${filePath}`)
    
    const issues = [];
    // 검증 로직...
    
    console.log(`[DEBUG] Found ${issues.length} issues`)
    return issues;
  }
}
```

---

### React DevTools 활용

1. Chrome에서 React DevTools 설치
2. 개발 서버 실행: `npm run dev`
3. 브라우저에서 F12 → React 탭
4. 컴포넌트 트리 및 Props 확인

---

## 알려진 이슈

### 1. 포트 번호 불일치

**문제**: README.md에는 `localhost:5173`으로 되어 있지만, 실제 설정은 `3000` 포트

**해결**: `vite.config.ts`에서 포트 확인
```typescript
server: {
  port: 3000  // 실제 포트
}
```

---

### 2. Buffer 폴리필 필요

**문제**: Vite에서 Node.js `buffer` 모듈 사용 시 오류

**해결**: 이미 설정되어 있음
```typescript
// vite.config.ts
define: {
  'global': 'globalThis',
  'process.env': {}
},
optimizeDeps: {
  include: ['buffer']
}
```

---

### 3. CloudScape 스타일 로드 순서

**문제**: CloudScape 스타일이 적용되지 않음

**해결**: `main.tsx`에서 글로벌 스타일을 가장 먼저 임포트
```typescript
// main.tsx
import '@cloudscape-design/global-styles/index.css'  // 가장 먼저!
import React from 'react'
import ReactDOM from 'react-dom/client'
```

---

## 배포 전 체크리스트

### 코드 품질

- [ ] `npm run type-check` 통과
- [ ] `npm run lint` 통과 (경고 0개)
- [ ] `npm run test` 통과
- [ ] `npm run test:coverage` 80% 이상

### 마크다운 검증

- [ ] `npm run validate:advanced` 통과 (오류 0개)
- [ ] 모든 주차 가이드 작성 완료
- [ ] 실습 파일 모두 업로드 완료
- [ ] 다운로드 블록 표준 형식 준수

### 성능

- [ ] 빌드 크기 확인: `npm run build`
- [ ] Lighthouse 점수 90점 이상
- [ ] 페이지 로드 시간 3초 이내

### 접근성

- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 테스트
- [ ] 색상 대비 확인 (WCAG 2.1 AA)

### 브라우저 호환성

- [ ] Chrome 최신 버전
- [ ] Firefox 최신 버전
- [ ] Safari 최신 버전
- [ ] Edge 최신 버전

### 문서

- [ ] README.md 최신 상태
- [ ] DEVELOPER_GUIDE.md 최신 상태
- [ ] PROFESSOR_GUIDE.md 최신 상태
- [ ] 변경 이력 업데이트

---

## 환경 변수

### 개발 환경 (.env.development)
```bash
VITE_ENVIRONMENT=development
VITE_API_URL=http://localhost:3000
VITE_ENABLE_DEBUG=true
```

### 프로덕션 환경 (.env.production)
```bash
VITE_ENVIRONMENT=production
VITE_API_URL=https://api.university-lab-guide.com
VITE_ENABLE_DEBUG=false
```

### 사용 방법
```typescript
const apiUrl = import.meta.env.VITE_API_URL
const isDebug = import.meta.env.VITE_ENABLE_DEBUG === 'true'

if (isDebug) {
  console.log('API URL:', apiUrl)
}
```

---

## Git 워크플로우

### 브랜치 전략

```bash
main          # 프로덕션 브랜치
├── develop   # 개발 브랜치
    ├── feature/new-component    # 기능 개발
    ├── fix/bug-description      # 버그 수정
    └── docs/update-guide        # 문서 업데이트
```

### 커밋 메시지 규칙

```bash
# 형식
<type>(<scope>): <subject>

# 예시
feat(InfoCard): add difficulty badge display
fix(MarkdownRenderer): resolve Alert parsing issue
docs(DEVELOPER_GUIDE): update validation section
style(UserValue): improve CSS organization
refactor(SessionGuide): extract TaskCard component
test(InfoCard): add unit tests for badge rendering
```

**타입**:
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 설정 등

---

## 추가 리소스

### 공식 문서
- [CloudScape Design System](https://cloudscape.design/)
- [React 공식 문서](https://react.dev/)
- [Vite 공식 문서](https://vitejs.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)

### 프로젝트 문서
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - 개발자 완벽 가이드
- [HANDOVER_GUIDE.md](HANDOVER_GUIDE.md) - 인수인계 가이드
- [VALIDATION_GUIDE.md](VALIDATION_GUIDE.md) - 검증 가이드
- [markdown-guide.md](../../.kiro/steering/markdown-guide.md) - 마크다운 표준
- [cloudscape-integration.md](../../.kiro/steering/cloudscape-integration.md) - CloudScape 통합

---

**마지막 업데이트**: 2026-01-28  
**버전**: 1.0.0  
**작성자**: 개발팀
