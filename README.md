# University Lab Guide System

> AWS 실습 가이드 시스템 - CloudScape Design System 기반

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [📚 문서 가이드](#-문서-가이드)
- [🚀 빠른 시작](#-빠른-시작)
- [📁 프로젝트 구조](#-프로젝트-구조)
- [🛠 기술 스택](#-기술-스택)
- [📜 npm 스크립트](#-npm-스크립트)

---

## 프로젝트 개요

대학교 AWS 실습 과정을 위한 인터랙티브 가이드 시스템입니다. 15주차 커리큘럼을 체계적으로 제공하며, 학생들의 진도를 추적하고 실습 환경을 안내합니다.

### 주요 기능

- 📚 **15주차 체계적 커리큘럼**: Week 1부터 Week 14까지 단계별 학습
- 🎯 **진도 추적 시스템**: 학생별 실습 완료 현황 추적
- 📝 **마크다운 기반 가이드**: 코드 수정 없이 콘텐츠 관리
- 🎨 **CloudScape Design System**: AWS 스타일 일관성
- 🌙 **다크모드 지원**: 사용자 선호도에 따른 테마
- ♿ **접근성 준수**: WCAG 2.1 AA 기준 준수
- 🔍 **자동 검증 시스템**: 30개 규칙 기반 표준 준수 검증

### 사용자 역할

1. **학생**: 실습 가이드를 따라 AWS 실습 수행
2. **교수**: 마크다운 파일 및 실습 파일 수정
3. **개발자**: 시스템 개발, 유지보수, 기능 추가

---

## 📚 문서 가이드

### 👨‍💻 개발자용 문서 (`docs/developers/`)

#### 🆕 처음 프로젝트를 인수받는 2차 개발자

**시작 문서**: **[HANDOVER_GUIDE.md](docs/developers/HANDOVER_GUIDE.md)** ⭐

이 문서 하나로 인수인계 완료!
- ✅ Kiro 환경 설정
- ✅ 표준 준수 검토
- ✅ 추가 개발 가이드
- ✅ 가이드 콘텐츠 수정
- ✅ 교수 인계 준비

**읽는 순서**:
1. [HANDOVER_GUIDE.md](docs/developers/HANDOVER_GUIDE.md) - 인수인계 완벽 가이드
2. [DEVELOPER_GUIDE.md](docs/developers/DEVELOPER_GUIDE.md) - 시스템 전체 이해
3. [VALIDATION_GUIDE.md](docs/developers/VALIDATION_GUIDE.md) - 검증 방법

---

#### 🔧 기존 개발자 (기능 추가/수정)

**시작 문서**: **[DEVELOPER_GUIDE.md](docs/developers/DEVELOPER_GUIDE.md)** ⭐

시스템 전체를 이해하는 완벽 가이드
- ✅ Kiro 프로젝트 설정
- ✅ 로컬 개발 환경 구축
- ✅ 프로젝트 구조 이해
- ✅ 마크다운 렌더링 파이프라인
- ✅ 검증 시스템 사용
- ✅ 커스텀 문법 추가
- ✅ 배포 옵션

**기술 세부사항**: **[TECHNICAL_DETAILS.md](docs/developers/TECHNICAL_DETAILS.md)**

프로젝트 설정 및 고급 기술 정보
- ✅ 프로젝트 설정 파일 상세
- ✅ CloudScape 통합 상세
- ✅ 스타일링 규칙
- ✅ 성능 최적화
- ✅ 알려진 이슈 및 해결
- ✅ 배포 전 체크리스트

---

#### 📊 전체 문서 네비게이션

**[DOCUMENTATION_INDEX.md](docs/developers/DOCUMENTATION_INDEX.md)** - 모든 문서의 인덱스

- 역할별 문서 가이드
- 상황별 문서 찾기
- 학습 경로
- 문서 관계도

---

### 👨‍🏫 교수용 문서 (`docs/professors/`)

#### 🆕 마크다운 처음 사용하는 교수

**시작 문서**: **[QUICK_START_FOR_PROFESSORS.md](docs/professors/QUICK_START_FOR_PROFESSORS.md)** ⭐

5분 안에 첫 수정 완료!
- ✅ Kiro 열기 (30초)
- ✅ 가이드 파일 찾기 (1분)
- ✅ 내용 수정하기 (2분)
- ✅ 저장하기 (30초)
- ✅ 미리보기 (1분)

**자주 하는 작업**:
- 새로운 실습 단계 추가
- 경고 메시지 추가
- 실습 파일 추가
- 학습 목표 수정
- Git으로 변경사항 저장

---

#### 📝 마크다운 익숙한 교수

**시작 문서**: **[PROFESSOR_GUIDE.md](docs/professors/PROFESSOR_GUIDE.md)** ⭐

마크다운 작성 완벽 가이드
- ✅ 파일 구조 이해
- ✅ Front Matter 작성
- ✅ 마크다운 문법 (버튼, Alert, 코드 블록 등)
- ✅ 실습 가이드 작성 예시
- ✅ 파일 업로드 방법
- ✅ Git 사용법
- ✅ FAQ

---

### 📖 문서 선택 가이드

#### "나는 누구인가?"

| 역할 | 상황 | 시작 문서 |
|------|------|----------|
| 👨‍💻 **2차 개발자** | 처음 프로젝트 인수 | [HANDOVER_GUIDE.md](docs/developers/HANDOVER_GUIDE.md) |
| 👨‍💻 **개발자** | 기능 추가/수정 | [DEVELOPER_GUIDE.md](docs/developers/DEVELOPER_GUIDE.md) |
| 👨‍🏫 **교수** | 마크다운 처음 | [QUICK_START_FOR_PROFESSORS.md](docs/professors/QUICK_START_FOR_PROFESSORS.md) |
| 👨‍🏫 **교수** | 마크다운 익숙 | [PROFESSOR_GUIDE.md](docs/professors/PROFESSOR_GUIDE.md) |
| 📊 **모두** | 전체 문서 보기 | [DOCUMENTATION_INDEX.md](docs/developers/DOCUMENTATION_INDEX.md) |

---

### 📂 문서 구조

```
docs/
├── developers/                          # 개발자용 문서
│   ├── HANDOVER_GUIDE.md               # 인수인계 가이드 (17KB)
│   ├── DEVELOPER_GUIDE.md              # 개발자 완벽 가이드 (33KB)
│   ├── VALIDATION_GUIDE.md             # 검증 가이드 (12KB)
│   └── DOCUMENTATION_INDEX.md          # 전체 문서 인덱스 (11KB)
│
└── professors/                          # 교수용 문서
    ├── QUICK_START_FOR_PROFESSORS.md   # 5분 빠른 시작 (9KB)
    └── PROFESSOR_GUIDE.md              # 교수용 완벽 가이드 (14KB)
```

---

## 🚀 빠른 시작

### 개발자용

```bash
# 1. 저장소 클론
git clone <repository-url>
cd university-lab-guide

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 확인
# http://localhost:3000
```

**Kiro 사용자**:
1. Kiro 실행
2. **File > Open Folder** → `university-lab-guide` 선택
3. 터미널에서 `npm run dev` 실행

**다음 단계**: 
- 2차 개발자 → [HANDOVER_GUIDE.md](docs/developers/HANDOVER_GUIDE.md)
- 기존 개발자 → [DEVELOPER_GUIDE.md](docs/developers/DEVELOPER_GUIDE.md)

---

### 교수용

```bash
# 1. Kiro 실행
# 2. File > Open Folder → university-lab-guide 선택
# 3. public/content/week1/ 폴더 열기
# 4. 마크다운 파일 수정
# 5. 저장 (Cmd+S 또는 Ctrl+S)
# 6. Git으로 커밋 및 푸시하여 배포
```

**다음 단계**: 
- 마크다운 처음 → [QUICK_START_FOR_PROFESSORS.md](docs/professors/QUICK_START_FOR_PROFESSORS.md)
- 마크다운 익숙 → [PROFESSOR_GUIDE.md](docs/professors/PROFESSOR_GUIDE.md)

---

## 📁 프로젝트 구조

```
university-lab-guide/
├── .kiro/                          # Kiro 설정 및 스티어링 문서
│   └── steering/
│       ├── markdown-guide.md       # 마크다운 작성 표준 (AI 컨텍스트)
│       ├── cloudscape-integration.md
│       └── university-lab-guide-development.md
│
├── docs/                           # 📚 사용자 문서
│   ├── developers/                 # 👨‍💻 개발자용 문서
│   │   ├── HANDOVER_GUIDE.md
│   │   ├── DEVELOPER_GUIDE.md
│   │   ├── VALIDATION_GUIDE.md
│   │   └── DOCUMENTATION_INDEX.md
│   └── professors/                 # 👨‍🏫 교수용 문서
│       ├── QUICK_START_FOR_PROFESSORS.md
│       └── PROFESSOR_GUIDE.md
│
├── public/
│   ├── content/                    # 📝 마크다운 실습 가이드
│   │   ├── week1/
│   │   ├── week2/
│   │   └── ...
│   └── files/                      # 📦 실습 파일 (zip, yaml 등)
│       ├── week1/
│       ├── week2/
│       └── ...
│
├── scripts/                        # 검증 및 유틸리티 스크립트
│   ├── validate-markdown-guide.js  # 기본 검증 (18개 규칙)
│   ├── validate-advanced.js        # 고급 검증 (30개 규칙)
│   ├── fix-common-errors.sh        # 자동 수정
│   └── generate-validation-report.sh
│
├── src/
│   ├── components/
│   │   ├── education/              # 교육용 컴포넌트
│   │   ├── markdown/               # 마크다운 렌더링
│   │   ├── interactive/            # 인터랙티브 컴포넌트
│   │   └── ui/                     # UI 컴포넌트
│   ├── pages/                      # 페이지 컴포넌트
│   ├── contexts/                   # React Context
│   ├── styles/                     # CSS 스타일
│   └── utils/                      # 유틸리티 함수
│
├── README.md                       # 이 파일
└── package.json                    # 의존성 및 스크립트
```

### 주요 폴더 설명

#### 개발자가 수정하는 폴더
- `src/` - React 컴포넌트 및 로직
- `scripts/` - 검증 스크립트
- `.kiro/steering/` - 개발 표준 문서

#### 교수가 수정하는 폴더
- `public/content/` - 마크다운 실습 가이드
- `public/files/` - 실습 파일 (zip, yaml 등)

#### 문서 폴더
- `docs/developers/` - 개발자용 가이드
- `docs/professors/` - 교수용 가이드

---

## 🛠 기술 스택

### 프론트엔드
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **React Router** - 라우팅

### UI 프레임워크
- **CloudScape Design System** - AWS 스타일 컴포넌트
- **react-markdown** - 마크다운 렌더링
- **react-syntax-highlighter** - 코드 하이라이팅

### 개발 도구
- **Kiro** - AI 어시스턴트 통합 에디터
- **Vitest** - 단위 테스트
- **React Testing Library** - 컴포넌트 테스트
- **ESLint** - 코드 품질
- **Prettier** - 코드 포맷팅

### 검증 시스템
- **커스텀 검증 스크립트** - 30개 규칙 기반
- **정규식 기반 검증** - 표준 문구 준수 확인
- **자동 수정 스크립트** - 일반적인 오류 자동 수정

---

## 📜 npm 스크립트

### 개발
```bash
npm run dev          # 개발 서버 시작 (HMR 지원)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
```

### 코드 품질
```bash
npm run type-check   # TypeScript 타입 체크
npm run lint         # ESLint 검사
npm run lint:fix     # ESLint 자동 수정
```

### 검증
```bash
npm run validate:all              # 전체 마크다운 검증
npm run validate:advanced         # 고급 검증 (30개 규칙)
npm run validate:file <파일경로>  # 특정 파일 검증
```

### 테스트
```bash
npm run test                # 단위 테스트 실행
npm run test:coverage       # 테스트 커버리지
```

---

## 🔍 빠른 참조

### 자주 사용하는 명령어

| 작업 | 명령어 |
|------|--------|
| 개발 서버 시작 | `npm run dev` |
| 전체 파일 검증 | `npm run validate:advanced` |
| 특정 파일 검증 | `npm run validate:file [파일경로]` |
| 특정 주차 검증 | `node scripts/validate-advanced.js public/content/week[N]` |
| 진행률 확인 | `./scripts/check-progress.sh` |
| 일반 오류 자동 수정 | `./scripts/fix-common-errors.sh` |

### 자주 찾는 파일

| 파일 | 경로 | 용도 |
|------|------|------|
| 표준 정의 | `.kiro/steering/markdown-guide.md` | 작성 표준 및 규칙 |
| 검증 스크립트 | `scripts/validate-advanced.js` | 자동 검증 로직 |
| 마크다운 렌더러 | `src/components/markdown/MarkdownRenderer.tsx` | 렌더링 엔진 |
| Alert 스타일 | `src/styles/info-boxes.css` | Alert 박스 스타일 |

---

## 🤝 기여하기

### 개발자
1. [HANDOVER_GUIDE.md](docs/developers/HANDOVER_GUIDE.md) 읽기
2. 표준 준수 검토
3. 기능 개발 또는 버그 수정
4. Pull Request 생성

### 교수
1. [QUICK_START_FOR_PROFESSORS.md](docs/professors/QUICK_START_FOR_PROFESSORS.md) 읽기
2. 마크다운 가이드 수정
3. 실습 파일 추가/수정
4. Git Commit & Push

---

## 📞 지원 및 문의

### 개발 관련
- 개발팀 이메일: [이메일]
- Slack 채널: [채널명]
- 이슈 트래커: [GitHub Issues]

### 콘텐츠 관련
- 교수 지원: [이메일]
- 긴급 연락: [전화번호]

---

## 📄 라이선스

MIT License

---

**마지막 업데이트**: 2026-01-28  
**버전**: 2.0.0  
**관리자**: 개발팀
