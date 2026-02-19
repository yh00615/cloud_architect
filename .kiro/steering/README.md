# 🚀 Steering 문서

AWS 실습 가이드 프로젝트의 작성 표준 및 개발 가이드입니다.

---

## ⚡ 핵심 규칙 (빠른 참조)

### 금지 사항
- ❌ **curriculum.ts 수정** (명시적 지시 없이)
- ❌ 청유형 ("~하세요" → "~합니다") → [상세](markdown-guide/03-standard-phrases.md#31)
- ❌ 인라인 스타일 (`style={{}}`) → [상세](development-guide.md#스타일링-규칙)
- ❌ 상대 경로 import (`../../` → `@/`) → [상세](development-guide.md#import-경로-표준)
- ❌ 괄호 설명 과다 → [상세](markdown-guide/03-standard-phrases.md#5)
- ❌ 마침표 누락

### 필수 사항
- ✅ **한국어로 채팅** - 모든 대화는 한국어로 진행
- ✅ 명령형 + 마침표 → [상세](markdown-guide/03-standard-phrases.md#4)
- ✅ 버튼 문법: `[[버튼명]]` → [상세](markdown-guide/02-markdown-syntax.md#1)
- ✅ 필드 강조: `**필드명**`
- ✅ 복사 가능 값: `` `값` ``

### 표준 문구 Top 5
1. AWS Management Console에 로그인한 후 상단 검색창에서 ~
2. [[버튼명]] 버튼을 클릭합니다.
3. **필드명**에 `값`을 입력합니다.
4. 상태가 "Available"로 변경될 때까지 기다립니다.
5. ~한 후 ~합니다.

상세 내용: [표준 문구 50개 규칙](markdown-guide/03-standard-phrases.md)

---

## 📚 상세 가이드

### 마크다운 가이드 작성
**[markdown-guide/](markdown-guide/)** - 실습 가이드 작성 방법 (8개 문서)
- [마크다운 문법](markdown-guide/02-markdown-syntax.md)
- [표준 문구 50개](markdown-guide/03-standard-phrases.md)
- [Alert 가이드](markdown-guide/04-alert-guidelines.md)
- [태스크 및 환경 설정](markdown-guide/05-task-and-environment-setup.md)
- [페이지 구조](markdown-guide/06-page-structure.md)
- [가이드 작성 전략](markdown-guide/08-guide-strategy.md)
- [리소스 관리](markdown-guide/11-resource-management.md)

### 코드 개발
- **[development-guide.md](development-guide.md)** - TypeScript/React 코드 작성 표준
- **[cloudscape-integration.md](cloudscape-integration.md)** - CloudScape UI 컴포넌트 사용법

### 인프라 및 검증
- **[cloudformation-standards.md](cloudformation-standards.md)** - CloudFormation 템플릿 표준
- **[code-review-system.md](code-review-system.md)** - 종합 검증 시스템

---

## 🔍 검증 및 테스트

### 커밋 전 필수 검증
```bash
npm run review  # 전체 검증 (80점 이상, 오류 0개)
```

### 개별 검증
```bash
npm run review:code    # 소스코드만
npm run review:guides  # 가이드만
```

상세 내용은 [검증 시스템](code-review-system.md)을 참조하세요.

---

## 🔍 빠른 검색

### 마크다운 작성
- 버튼 문법? → [02-markdown-syntax.md](markdown-guide/02-markdown-syntax.md#1)
- 표준 문구? → [03-standard-phrases.md](markdown-guide/03-standard-phrases.md)
- Alert 사용? → [04-alert-guidelines.md](markdown-guide/04-alert-guidelines.md)
- 태스크 구성? → [05-task-and-environment-setup.md](markdown-guide/05-task-and-environment-setup.md)
- 페이지 구조? → [06-page-structure.md](markdown-guide/06-page-structure.md)
- 리소스 관리? → [11-resource-management.md](markdown-guide/11-resource-management.md)
- 이미지 가이드? → [09-image-guidelines.md](markdown-guide/09-image-guidelines.md)

### 코드 작성
- 스타일링? → [development-guide.md](development-guide.md#스타일링-규칙)
- Import 경로? → [development-guide.md](development-guide.md#import-경로-표준)
- 컴포넌트? → [cloudscape-integration.md](cloudscape-integration.md)

### 검증
- 자동 검증? → [code-review-system.md](code-review-system.md)
- CloudFormation? → [cloudformation-standards.md](cloudformation-standards.md)

---

---

**마지막 업데이트**: 2025-02-19  
**버전**: 5.0.0 (적극 정리 완료 - 8개 문서)  
**다음 단계**: 역할에 맞는 문서를 선택하여 시작하세요!
