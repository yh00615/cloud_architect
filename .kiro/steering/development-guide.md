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
import { TaskDescription } from '@/components/education/TaskDescription'
import '@/styles/guide-badges.css'

// ❌ 상대 경로 금지
import { TaskDescription } from '../../../components/education/TaskDescription'
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
const [isLoading, setIsLoading] = useState(false)
const [data, setData] = useState<DataType | null>(null)
```

### useEffect
```typescript
useEffect(() => {
  // 부수 효과
  return () => {
    // 정리 함수
  }
}, [dependencies])
```

---

## 에러 처리

```typescript
try {
  const result = await fetchData()
  setData(result)
} catch (error) {
  console.error('데이터 로드 실패:', error)
  showNotification('오류가 발생했습니다')
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

---

**마지막 업데이트**: 2025-02-19  
**버전**: 2.0.0 (축소판)
