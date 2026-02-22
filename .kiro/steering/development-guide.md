# 개발 가이드 (Development Guide)

TypeScript/React 코드 작성 표준 및 컴포넌트 개발 규칙입니다.

---

## 언어 사용 규칙

- **한국어 UI**: 모든 사용자 인터페이스
- **영어 변수명**: 코드는 영어
- **AWS 용어 유지**: "Create function", "S3" 영어 그대로
- **한국어 주석**: 코드 주석은 한국어

---

## 스타일링 규칙 ⭐

### 절대 금지

- ❌ 인라인 스타일 (`style={{...}}`)

### 필수

- ✅ 별도 CSS 파일 + className
- ✅ CSS 변수 사용 (`var(--color-background-container-content)`)
- ✅ 다크모드 지원 (`[data-theme="dark"]`)

### 예외 (허용)

- 동적 계산 값: `width: ${progress}%`
- 사용자 입력 스타일

---

## TypeScript 표준

### 컴포넌트 구조

```typescript
import React from 'react'
import { Container } from '@cloudscape-design/components'
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
    <Container className="my-component">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </Container>
  )
}
```

### 타입 정의

- 유니온 타입: `type Status = 'completed' | 'current' | 'pending'`
- 제네릭: `interface ApiResponse<T> { data: T }`

---

## Import 경로 표준 ⭐

### 절대 경로 필수

```typescript
// ✅ 절대 경로
import { TaskDescription } from '@/components/education/TaskDescription';
import '@/styles/guide-badges.css';

// ❌ 상대 경로 금지
import { TaskDescription } from '../../../components/education/TaskDescription';
```

### Import 순서

1. React
2. 외부 라이브러리
3. 내부 컴포넌트
4. 훅 & 유틸리티
5. 타입
6. 스타일

---

## 컴포넌트 명명 규칙

- **파일명**: PascalCase (`TaskDescription.tsx`)
- **컴포넌트명**: PascalCase (`TaskDescription`)
- **Props 인터페이스**: `ComponentNameProps`
- **CSS 클래스**: kebab-case (`task-description`)

---

## 상태 관리

### useState

```typescript
const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState<DataType | null>(null);
```

### useEffect

```typescript
useEffect(() => {
  // 부수 효과
  return () => {
    // 정리 함수
  };
}, [dependencies]);
```

---

## 에러 처리

```typescript
try {
  const result = await fetchData();
  setData(result);
} catch (error) {
  console.error('데이터 로드 실패:', error);
  showNotification('오류가 발생했습니다');
}
```

---

## 접근성 (Accessibility)

- `alt` 속성 필수
- `aria-label` 사용
- 키보드 네비게이션 지원
- 색상 대비 4.5:1 이상

---

## 성능 최적화

- `React.memo` 사용
- `useMemo`, `useCallback` 적절히 사용
- 불필요한 리렌더링 방지
- 코드 스플리팅 (`React.lazy`)

---

## Git 브랜치 및 머지 규칙 ⭐

### 브랜치 전략

- **main**: 프로덕션 배포 브랜치 (안정 버전)
- **feature/\***: 기능 개발 브랜치 (최신 작업)

### 머지 전 필수 확인 사항

**중요**: 마크다운 가이드 파일은 수동 편집이 빈번하므로 머지 전 반드시 확인 필요

#### 1. 머지 전 질문하기

```
"main 브랜치로 머지할까요? 마크다운 파일 충돌 확인이 필요합니다."
```

#### 2. 충돌 가능성이 있는 파일

- `public/content/**/*.md` - 실습 가이드 마크다운 파일
- `docs/**/*.md` - 문서 파일
- `.kiro/steering/**/*.md` - Steering 문서

#### 3. 머지 원칙

**기본 원칙**: feature 브랜치 버전을 우선 사용 (최신 작업)

```bash
# ✅ 올바른 머지 프로세스
git checkout main
git merge --no-commit --no-ff feature/branch-name

# 충돌 확인 후 사용자에게 질문
# "마크다운 파일 충돌이 있습니다. feature 브랜치 버전을 사용할까요?"

# feature 브랜치 버전 사용 (기본)
git checkout feature/branch-name -- public/content/week1/1-1-tag-editor-lab.md

# 커밋 및 푸시
git commit -m "Merge feature/branch-name into main"
git push origin main
```

#### 4. 자동 머지 금지 파일

다음 파일들은 자동 머지하지 말고 반드시 사용자 확인 필요:

- `public/content/**/*.md`
- `docs/**/*.md`
- `.kiro/steering/**/*.md`

#### 5. 머지 후 확인

- [ ] 마크다운 파일이 최신 버전인지 확인
- [ ] 이미지 경로가 올바른지 확인
- [ ] 빌드 오류가 없는지 확인
- [ ] GitHub Pages 배포 확인

### 머지 시나리오 예시

**시나리오 1**: 마크다운 파일 수정 포함

```
AI: "feature/guide-refinement를 main에 머지하려고 합니다.
     1-1-tag-editor-lab.md 파일이 수정되었는데,
     feature 브랜치 버전(최신)을 사용할까요?"

사용자: "네, feature 버전 사용하세요."

AI: [feature 브랜치 버전으로 머지 진행]
```

**시나리오 2**: 코드만 수정

```
AI: "feature/image-optimization을 main에 머지하려고 합니다.
     마크다운 파일 변경은 없고 CSS와 이미지만 수정되었습니다.
     바로 머지할까요?"

사용자: "네, 진행하세요."

AI: [자동 머지 진행]
```

---

## 파일 삭제 규칙 ⭐

### 기본 원칙

**모든 파일 삭제는 반드시 사용자 확인 후 진행**

### 삭제 전 필수 질문

```
AI: "다음 파일을 삭제하려고 합니다:
     - public/images/week1/old-image.png
     - src/components/OldComponent.tsx

     삭제해도 될까요?"

사용자: "네, 삭제하세요." 또는 "아니요, 유지하세요."
```

### 삭제 금지 (자동 삭제 불가)

다음 파일들은 절대 자동으로 삭제하지 않음:

- ✅ **마크다운 파일** (`*.md`)
- ✅ **이미지 파일** (`*.png`, `*.jpg`, `*.svg`)
- ✅ **설정 파일** (`*.json`, `*.yaml`, `*.config.*`)
- ✅ **소스 코드** (`*.ts`, `*.tsx`, `*.css`)
- ✅ **문서 파일** (`docs/**/*`, `.kiro/steering/**/*`)

### 삭제 가능 (확인 후)

- 임시 파일 (`*.tmp`, `*.bak`)
- 빌드 산출물 (`dist/**/*`, `build/**/*`)
- 캐시 파일 (`.cache/**/*`)
- 로그 파일 (`*.log`)

### 삭제 프로세스

#### 1단계: 삭제 대상 확인

```bash
# 삭제할 파일 목록 확인
git status
ls -la [파일경로]
```

#### 2단계: 사용자에게 질문

```
AI: "다음 파일을 삭제하려고 합니다:

     파일명: public/images/week1/old-screenshot.png
     크기: 245KB
     마지막 수정: 2025-02-15

     이 파일이 다른 곳에서 참조되고 있는지 확인했습니다:
     - public/content/week1/1-1-tag-editor-lab.md (참조 없음)

     삭제해도 될까요?"
```

#### 3단계: 확인 후 삭제

```bash
# 사용자 승인 후에만 실행
rm public/images/week1/old-screenshot.png
git add public/images/week1/old-screenshot.png
git commit -m "Remove unused image: old-screenshot.png"
```

### 삭제 시나리오 예시

**시나리오 1**: 사용하지 않는 이미지 발견

```
AI: "public/images/week1/temp-image.png 파일이
     어떤 마크다운 파일에서도 참조되지 않습니다.
     삭제할까요?"

사용자: "네, 삭제하세요."

AI: [파일 삭제 및 커밋]
```

**시나리오 2**: 컴포넌트 리팩토링

```
AI: "OldButton.tsx를 NewButton.tsx로 교체하려고 합니다.
     OldButton.tsx를 삭제할까요?

     참조 확인:
     - src/pages/Home.tsx (이미 NewButton으로 변경됨)
     - src/pages/About.tsx (이미 NewButton으로 변경됨)"

사용자: "네, 삭제하세요."

AI: [파일 삭제 및 커밋]
```

**시나리오 3**: 삭제 거부

```
AI: "public/content/week1/draft-guide.md 파일이
     완성된 가이드와 중복되는 것 같습니다.
     삭제할까요?"

사용자: "아니요, 나중에 참고할 수 있으니 유지하세요."

AI: [삭제 취소, 파일 유지]
```

### 삭제 체크리스트

삭제 전 반드시 확인:

- [ ] 파일이 다른 곳에서 참조되는지 확인 (grep 검색)
- [ ] 사용자에게 삭제 의사 확인
- [ ] 삭제 이유 명확히 설명
- [ ] Git 커밋 메시지에 삭제 이유 기록
- [ ] 중요 파일은 백업 제안

### 참조 확인 명령어

```bash
# 마크다운 파일에서 이미지 참조 확인
grep -r "old-image.png" public/content/

# TypeScript 파일에서 컴포넌트 import 확인
grep -r "OldComponent" src/

# 전체 프로젝트에서 파일명 검색
grep -r "filename" .
```

---

## 체크리스트

### 스타일

- [ ] 인라인 스타일 없음
- [ ] CSS 파일 분리
- [ ] CSS 변수 사용
- [ ] 다크모드 지원

### Import

- [ ] 절대 경로 사용
- [ ] Import 순서 준수

### 타입

- [ ] Props 인터페이스 정의
- [ ] 타입 안전성 확보

### 접근성

- [ ] alt 속성
- [ ] aria-label
- [ ] 키보드 네비게이션

### Git 머지

- [ ] 마크다운 파일 충돌 확인
- [ ] 사용자에게 머지 전 질문
- [ ] feature 브랜치 버전 우선 사용
- [ ] 머지 후 빌드 확인

### 파일 삭제

- [ ] 파일 참조 확인 (grep 검색)
- [ ] 사용자에게 삭제 확인 질문
- [ ] 삭제 이유 명확히 설명
- [ ] 커밋 메시지에 삭제 이유 기록

---

**마지막 업데이트**: 2025-02-21  
**버전**: 2.2.0 (Git 머지 및 파일 삭제 규칙 추가)
