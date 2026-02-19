# 개발자 가이드 - University Lab Guide System

> AWS 실습 가이드 시스템 개발 및 검증 완벽 가이드

## 📑 목차

1. [Kiro에서 프로젝트 설정하기](#1-kiro에서-프로젝트-설정하기)
2. [로컬 개발 환경 구축](#2-로컬-개발-환경-구축)
3. [프로젝트 구조 이해하기](#3-프로젝트-구조-이해하기)
4. [마크다운 렌더링 파이프라인](#4-마크다운-렌더링-파이프라인)
5. [검증 시스템 사용하기](#5-검증-시스템-사용하기)
6. [새로운 표준 규칙 추가하기](#6-새로운-표준-규칙-추가하기)
7. [커스텀 문법 추가하기](#7-커스텀-문법-추가하기)
8. [검증 보고서 생성하기](#8-검증-보고서-생성하기)
9. [문제 해결](#9-문제-해결)
10. [배포하기](#10-배포하기)

---

## 1. Kiro에서 프로젝트 설정하기

### 1-1. Kiro 설치 및 실행

```bash
# Kiro 다운로드 및 설치
# https://kiro.ai 에서 다운로드

# Kiro 실행
# macOS: Applications에서 Kiro 실행
# Windows: 시작 메뉴에서 Kiro 실행
```

### 1-2. 프로젝트 열기

1. Kiro를 실행합니다
2. **File > Open Folder** 선택
3. `university-lab-guide` 폴더 선택
4. 프로젝트가 Kiro 워크스페이스에 로드됩니다

### 1-3. Kiro 스티어링 문서 확인

Kiro는 `.kiro/steering/` 폴더의 마크다운 파일을 자동으로 읽어 AI 어시스턴트에게 컨텍스트를 제공합니다.

**주요 스티어링 문서**:
- `.kiro/steering/markdown-guide.md` - 마크다운 작성 표준 (항상 포함)
- `.kiro/steering/cloudscape-integration.md` - CloudScape 통합 가이드 (조건부)
- `.kiro/steering/university-lab-guide-development.md` - 개발 가이드 (항상 포함)

**스티어링 문서 작동 방식**:
```yaml
---
title: "마크다운 작성 가이드"
inclusion: always  # 항상 포함
---
```

### 1-4. Kiro AI 어시스턴트 활용

Kiro의 AI 어시스턴트는 스티어링 문서를 기반으로 작업을 수행합니다.

**예시 명령어**:
```
"Week 2의 모든 파일을 검증해줘"
"IAM 역할 실습 가이드의 표준 문구를 수정해줘"
"새로운 Alert 타입을 추가해줘"
"다운로드 블록 형식을 표준에 맞게 수정해줘"
```

**Kiro의 장점**:
- ✅ 스티어링 문서 자동 인식으로 프로젝트 표준 준수
- ✅ 마크다운 검증 및 자동 수정
- ✅ 컴포넌트 생성 시 타입 안전성 보장
- ✅ 실습 가이드 작성 시 표준 문구 자동 적용

### 1-5. AWS MCP 서버 통합

AWS MCP(Model Context Protocol) 서버를 사용하여 AWS 문서를 실시간으로 참조하고 가이드 품질을 향상시킬 수 있습니다.

#### MCP 서버 설정

**1. MCP 설정 파일 확인**

프로젝트에 이미 MCP 설정이 있는지 확인:
```bash
# 워크스페이스 레벨 설정
cat .kiro/settings/mcp.json

# 사용자 레벨 설정
cat ~/.kiro/settings/mcp.json
```

**2. AWS Documentation MCP 서버 추가**

`.kiro/settings/mcp.json` 파일에 다음 설정 추가:

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

**3. uv 및 uvx 설치**

MCP 서버 실행을 위해 Python 패키지 관리자 설치:

```bash
# macOS (Homebrew)
brew install uv

# Linux/WSL
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# 설치 확인
uv --version
uvx --version
```

**4. MCP 서버 재연결**

Kiro에서 MCP 서버 재연결:
- Command Palette (`Cmd+Shift+P` 또는 `Ctrl+Shift+P`)
- "MCP: Reconnect All Servers" 선택
- 또는 Kiro 재시작

#### AWS MCP 서버 활용 방법

**1. 가이드 작성 시 AWS 문서 참조**

```
"Lambda 함수 생성 단계를 AWS 공식 문서를 참조하여 작성해줘"
"VPC Endpoint 설정 방법을 최신 AWS 문서 기준으로 업데이트해줘"
"S3 버킷 정책 예시를 AWS 문서에서 찾아서 추가해줘"
```

**2. 코드 검토 시 AWS 베스트 프랙티스 확인**

```
"이 CloudFormation 템플릿이 AWS 베스트 프랙티스를 따르는지 확인해줘"
"Lambda 함수 코드가 AWS 권장사항을 준수하는지 검토해줘"
"IAM 정책이 최소 권한 원칙을 따르는지 확인해줘"
```

**3. 실습 가이드 검증**

```
"Week 3-1 VPC 가이드의 AWS 서비스 설명이 정확한지 확인해줘"
"RDS Multi-AZ 설정 단계가 최신 AWS 콘솔과 일치하는지 검증해줘"
"이 가이드에서 언급한 AWS 서비스 제한사항이 정확한지 확인해줘"
```

**4. 최신 정보 업데이트**

```
"Lambda 런타임 버전 정보를 최신으로 업데이트해줘"
"EC2 인스턴스 타입 가격 정보를 확인해줘"
"새로운 AWS 리전 정보를 가이드에 반영해줘"
```

#### MCP 서버 문제 해결

**서버 연결 실패 시**:
```bash
# 1. uv 설치 확인
which uv
uv --version

# 2. MCP 서버 수동 실행 테스트
uvx awslabs.aws-documentation-mcp-server@latest

# 3. 로그 확인
# Kiro 개발자 도구에서 MCP 서버 로그 확인
```

**서버 응답 없음**:
- Kiro 재시작
- MCP 설정 파일 문법 확인
- `disabled: false` 설정 확인

**권한 오류**:
```bash
# uvx 실행 권한 확인
chmod +x $(which uvx)
```

#### MCP 서버 활용 팁

**1. 자동 승인 설정**

자주 사용하는 도구는 자동 승인 목록에 추가:

```json
{
  "mcpServers": {
    "aws-docs": {
      "autoApprove": [
        "search_documentation",
        "get_service_info"
      ]
    }
  }
}
```

**2. 로그 레벨 조정**

디버깅이 필요한 경우:

```json
{
  "mcpServers": {
    "aws-docs": {
      "env": {
        "FASTMCP_LOG_LEVEL": "DEBUG"
      }
    }
  }
}
```

**3. 여러 MCP 서버 동시 사용**

```json
{
  "mcpServers": {
    "aws-docs": {
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"]
    },
    "github": {
      "command": "uvx",
      "args": ["github-mcp-server@latest"]
    }
  }
}
```


---

## 2. 로컬 개발 환경 구축

### 2-1. 필수 요구사항

- **Node.js**: 18.x 이상
- **npm**: 9.x 이상
- **Git**: 최신 버전
- **에디터**: Kiro (권장) 또는 VS Code

### 2-2. 프로젝트 클론 및 설치

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

### 2-3. 사용 가능한 npm 스크립트

| 명령어 | 설명 | 사용 시기 |
|--------|------|----------|
| `npm run dev` | 개발 서버 시작 (HMR 지원) | 개발 중 |
| `npm run build` | 프로덕션 빌드 | 배포 전 |
| `npm run preview` | 빌드 결과 미리보기 | 배포 전 테스트 |
| `npm run type-check` | TypeScript 타입 체크 | 커밋 전 |
| `npm run lint` | ESLint 검사 | 커밋 전 |
| `npm run lint:fix` | ESLint 자동 수정 | 코드 정리 |
| `npm run validate:all` | 전체 마크다운 검증 | 표준 준수 확인 |
| `npm run validate:advanced` | 고급 검증 (30개 규칙) | 상세 검증 |
| `npm run validate:file` | 특정 파일 검증 | 개별 파일 확인 |

### 2-4. 개발 서버 실행 확인

```bash
npm run dev
```

**예상 출력**:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

브라우저에서 `http://localhost:5173`을 열면 대시보드가 표시됩니다.


---

## 3. 프로젝트 구조 이해하기

### 3-1. 디렉토리 구조

```
university-lab-guide/
├── .kiro/                          # Kiro 설정 및 스티어링 문서
│   └── steering/
│       ├── markdown-guide.md       # 마크다운 작성 표준 (AI 컨텍스트)
│       ├── cloudscape-integration.md
│       └── university-lab-guide-development.md
│
├── docs/                           # 사용자 문서
│   ├── PROFESSOR_GUIDE.md          # 교수용 가이드
│   └── VALIDATION_GUIDE.md         # 검증 가이드
│
├── public/
│   ├── content/                    # 📝 마크다운 실습 가이드
│   │   ├── week1/
│   │   │   ├── 1-1-well-architected-tool-demo.md
│   │   │   └── 1-3-drawio-architecture.md
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
│   ├── fix-common-errors.sh        # 자동 수정 스크립트
│   ├── check-progress.sh           # 진행률 확인
│   └── README.md                   # 스크립트 사용법
│
├── src/
│   ├── components/
│   │   ├── markdown/               # 마크다운 렌더링
│   │   │   ├── MarkdownRenderer.tsx  # 핵심 렌더러
│   │   │   └── index.ts
│   │   ├── education/              # 교육용 컴포넌트
│   │   │   ├── InfoCard.tsx
│   │   │   ├── KeyPointsChecklist.tsx
│   │   │   ├── TaskDescription.tsx
│   │   │   └── ...
│   │   ├── interactive/            # 인터랙티브 컴포넌트
│   │   │   ├── ProgressTracker.tsx
│   │   │   └── QuickJump.tsx
│   │   └── ui/                     # UI 컴포넌트
│   │       ├── AWSButton.tsx
│   │       ├── UserValue.tsx
│   │       └── ...
│   ├── pages/                      # 페이지 컴포넌트
│   │   ├── Dashboard.tsx           # 메인 대시보드
│   │   ├── SessionGuide.tsx        # 실습 가이드 페이지
│   │   ├── WeeklyGuide.tsx         # 주차별 가이드
│   │   └── ...
│   ├── contexts/                   # React Context
│   │   ├── ProgressContext.tsx     # 진도 추적
│   │   └── ThemeContext.tsx        # 테마 관리
│   ├── styles/                     # CSS 스타일
│   │   ├── markdown.css            # 마크다운 스타일
│   │   ├── info-boxes.css          # Alert 박스 스타일
│   │   ├── user-value.css          # 복사 가능한 값 스타일
│   │   └── ...
│   ├── utils/                      # 유틸리티 함수
│   │   └── markdownLoader.ts       # 마크다운 로더
│   └── main.tsx                    # 앱 진입점
│
├── DEVELOPER_GUIDE.md              # 이 파일
├── README.md                       # 프로젝트 개요
├── package.json                    # 의존성 및 스크립트
├── tsconfig.json                   # TypeScript 설정
└── vite.config.ts                  # Vite 설정
```

### 3-2. 핵심 파일 설명

#### 마크다운 렌더링 관련

| 파일 | 역할 | 중요도 |
|------|------|--------|
| `src/components/markdown/MarkdownRenderer.tsx` | 마크다운 → CloudScape 변환 | ⭐⭐⭐ |
| `src/utils/markdownLoader.ts` | 파일 로드 및 Front Matter 파싱 | ⭐⭐⭐ |
| `src/styles/markdown.css` | 마크다운 스타일 | ⭐⭐ |
| `src/styles/info-boxes.css` | Alert 박스 스타일 | ⭐⭐ |

#### 검증 시스템 관련

| 파일 | 역할 | 중요도 |
|------|------|--------|
| `scripts/validate-advanced.js` | 고급 검증 (30개 규칙) | ⭐⭐⭐ |
| `scripts/validate-markdown-guide.js` | 기본 검증 (18개 규칙) | ⭐⭐ |
| `.kiro/steering/markdown-guide.md` | 표준 정의 (AI 컨텍스트) | ⭐⭐⭐ |

#### 페이지 및 라우팅

| 파일 | 역할 | 중요도 |
|------|------|--------|
| `src/pages/SessionGuide.tsx` | 실습 가이드 페이지 | ⭐⭐⭐ |
| `src/pages/Dashboard.tsx` | 메인 대시보드 | ⭐⭐ |
| `src/App.tsx` | 라우팅 설정 | ⭐⭐ |


---

## 4. 마크다운 렌더링 파이프라인

### 4-1. 전체 흐름

```
┌─────────────────────────────────────────────────────────────┐
│ 1. 마크다운 파일 로드                                        │
│    public/content/week2/2-1-iam-role.md                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Front Matter 파싱 (markdownLoader.ts)                    │
│    title, week, session, awsServices, etc.                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. 페이지 구조 생성 (SessionGuide.tsx)                      │
│    헤더, 개요, 태스크 섹션 자동 생성                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. 전처리 (MarkdownRenderer.tsx)                            │
│    [[버튼]] → <awsbutton>버튼</awsbutton>                   │
│    `값` → <uservalue>값</uservalue>                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. 마크다운 파싱 (react-markdown)                           │
│    마크다운 → AST (Abstract Syntax Tree)                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. 컴포넌트 매핑 (MarkdownRenderer.tsx)                     │
│    AST 노드 → React 컴포넌트                                │
│    - awsbutton → AWSButton                                  │
│    - code → UserValue / CodeView                            │
│    - blockquote → Alert                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. CloudScape 컴포넌트 렌더링                               │
│    화면에 최종 UI 표시                                       │
└─────────────────────────────────────────────────────────────┘
```

### 4-2. 커스텀 문법 처리

#### 버튼 문법

| 마크다운 | 전처리 후 | 컴포넌트 | 스타일 |
|---------|----------|---------|--------|
| `[[Create]]` | `<awsbutton>Create</awsbutton>` | `AWSButton` | Primary (오렌지) |
| `{{Upload}}` | `<awsbutton-normal>Upload</awsbutton-normal>` | `AWSButton` | Normal (흰색) |
| `((Cancel))` | `<awsbutton-secondary>Cancel</awsbutton-secondary>` | `AWSButton` | Link (회색) |

#### 복사 가능한 값

| 마크다운 | 컴포넌트 | 기능 |
|---------|---------|------|
| `` `my-bucket` `` | `UserValue` | 클릭 시 복사 |

#### Alert 박스

| 마크다운 | 컴포넌트 | 아이콘 | 색상 |
|---------|---------|--------|------|
| `> [!WARNING]` | `Alert` | status-warning | 노란색 |
| `> [!NOTE]` | `Alert` | status-info | 파란색 |
| `> [!TIP]` | `Alert` | status-positive | 초록색 |
| `> [!CONCEPT]` | `InfoCard` | status-info | 파란색 카드 |
| `> [!DOWNLOAD]` | `FileDownload` | download | 파란색 |

### 4-3. 코드 예시: 전처리 함수

**파일**: `src/components/markdown/MarkdownRenderer.tsx`

```typescript
const preprocessContent = (text: string): string => {
  return text
    // Primary 버튼: [[버튼명]]
    .replace(/\[\[([^\]]+)\]\]/g, '<awsbutton>$1</awsbutton>')
    
    // Normal 버튼: {{버튼명}}
    .replace(/\{\{([^\}]+)\}\}/g, '<awsbutton-normal>$1</awsbutton-normal>')
    
    // Link 버튼: ((버튼명))
    .replace(/\(\(([^\)]+)\)\)/g, '<awsbutton-secondary>$1</awsbutton-secondary>')
}
```

### 4-4. 코드 예시: 컴포넌트 매핑

```typescript
const components = {
  // 커스텀 태그 → React 컴포넌트
  awsbutton: ({ children }: any) => (
    <AWSButton variant="primary">{children}</AWSButton>
  ),
  
  'awsbutton-normal': ({ children }: any) => (
    <AWSButton variant="normal">{children}</AWSButton>
  ),
  
  // 인라인 코드 → UserValue
  code: ({ inline, children }: any) => {
    if (inline) {
      return <UserValue copyable={true}>{children}</UserValue>
    }
    return <CodeView content={children} language="bash" />
  },
  
  // 블록쿼트 → Alert
  blockquote: ({ children }: any) => {
    const content = extractText(children)
    
    if (content.includes('[!WARNING]')) {
      return <Alert type="warning">{cleanContent(content)}</Alert>
    }
    
    if (content.includes('[!NOTE]')) {
      return <Alert type="info">{cleanContent(content)}</Alert>
    }
    
    // 기본 인용구
    return <blockquote>{children}</blockquote>
  },
  
  // 이미지 → 반응형 이미지 컴포넌트
  img: ({ src, alt }: any) => (
    <Box margin={{ vertical: 'm' }}>
      <img 
        src={src} 
        alt={alt}
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '8px',
          border: '1px solid var(--color-border-divider-default)',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
        }}
        loading="lazy"
      />
      {alt && (
        <Box 
          variant="small" 
          color="text-body-secondary"
          margin={{ top: 'xs' }}
        >
          {alt}
        </Box>
      )}
    </Box>
  )
}
```

### 4-5. 이미지 처리 파이프라인

#### 이미지 저장 구조

```
public/images/
├── week1/
│   ├── 1-1-step1-s3-search.png
│   ├── 1-1-step2-create-bucket.png
│   └── 1-1-step3-bucket-name.png
├── week2/
│   ├── 2-1-step1-iam-console.png
│   └── 2-1-step2-create-policy.png
└── week3/
    └── 3-1-step1-vpc-console.png
```

#### 이미지 최적화 자동화

**파일**: `scripts/optimize-images.sh` (추가 예정)

```bash
#!/bin/bash
# 이미지 최적화 스크립트

# PNG 최적화 (pngquant 사용)
find public/images -name "*.png" -exec pngquant --quality=65-80 --ext .png --force {} \;

# JPG 최적화 (jpegoptim 사용)
find public/images -name "*.jpg" -exec jpegoptim --max=85 --strip-all {} \;

echo "✅ 이미지 최적화 완료"
```

#### 이미지 검증 규칙

**파일**: `scripts/validate-images.js` (추가 예정)

```javascript
// 이미지 파일 검증
const validateImages = (imagePath) => {
  const issues = []
  
  // 1. 파일 크기 검증 (500KB 이하)
  const stats = fs.statSync(imagePath)
  if (stats.size > 500 * 1024) {
    issues.push(`파일 크기 초과: ${(stats.size / 1024).toFixed(0)}KB > 500KB`)
  }
  
  // 2. 파일명 규칙 검증
  const filename = path.basename(imagePath)
  const pattern = /^\d+-\d+-step\d+-[a-z0-9-]+\.(png|jpg)$/
  if (!pattern.test(filename)) {
    issues.push(`파일명 규칙 위반: ${filename}`)
  }
  
  // 3. 이미지 해상도 검증
  const dimensions = sizeOf(imagePath)
  if (dimensions.width > 1920) {
    issues.push(`이미지 너비 초과: ${dimensions.width}px > 1920px`)
  }
  
  return issues
}
```

#### 이미지 렌더링 최적화

> [!NOTE]
> 이미지 사용에 대한 상세한 가이드라인은 `.kiro/steering/markdown-guide/09-image-guidelines.md`를 참조하세요.
> 
> **주요 내용**:
> - 📸 언제 이미지를 사용해야 하는가
> - 📐 이미지 캡처 방법 (범위, 강조, 개인정보 제거)
> - 📁 파일 명명 규칙 및 저장 위치
> - 🎨 이미지 최적화 (형식, 크기, 압축)
> - ♿ 접근성 (대체 텍스트, 색상 대비)

**지연 로딩 (Lazy Loading)**:
```typescript
// MarkdownRenderer.tsx
img: ({ src, alt }: any) => (
  <img 
    src={src} 
    alt={alt}
    loading="lazy"  // 브라우저 네이티브 지연 로딩
    decoding="async"  // 비동기 디코딩
  />
)
```

**반응형 이미지**:
```typescript
// 다양한 화면 크기에 대응
img: ({ src, alt }: any) => {
  const srcSet = `
    ${src} 1x,
    ${src.replace('.png', '@2x.png')} 2x
  `
  
  return (
    <img 
      src={src}
      srcSet={srcSet}
      alt={alt}
      loading="lazy"
    />
  )
}
```

#### 다크모드 이미지 지원

```typescript
// 다크모드에서 이미지 테두리 색상 자동 조정
img: ({ src, alt }: any) => (
  <Box 
    className="markdown-image"
    margin={{ vertical: 'm' }}
  >
    <img 
      src={src} 
      alt={alt}
      style={{
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
        border: '1px solid var(--color-border-divider-default)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
      }}
    />
  </Box>
)
```

**CSS**:
```css
/* markdown.css */
.markdown-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid var(--color-border-divider-default);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

[data-theme="dark"] .markdown-image img {
  border-color: var(--color-border-divider-default-dark);
  box-shadow: 0 1px 4px rgba(255, 255, 255, 0.05);
}

/* 이미지 호버 효과 */
.markdown-image img:hover {
  cursor: zoom-in;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

#### 이미지 라이트박스 (확대 보기)

**파일**: `src/components/markdown/ImageLightbox.tsx` (추가 예정)

```typescript
import React, { useState } from 'react'
import { Modal, Box } from '@cloudscape-design/components'

interface ImageLightboxProps {
  src: string
  alt: string
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <img 
        src={src}
        alt={alt}
        onClick={() => setIsOpen(true)}
        style={{ cursor: 'zoom-in' }}
      />
      
      <Modal
        visible={isOpen}
        onDismiss={() => setIsOpen(false)}
        size="max"
        header={alt}
      >
        <Box textAlign="center">
          <img 
            src={src}
            alt={alt}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>
      </Modal>
    </>
  )
}
```


---

## 5. 검증 시스템 사용하기

### 5-1. 검증 시스템 개요

이 프로젝트는 **2단계 검증 시스템**을 사용합니다:

1. **기본 검증** (`validate-markdown-guide.js`) - 18개 규칙
2. **고급 검증** (`validate-advanced.js`) - 30개 규칙

### 5-2. 기본 검증 (18개 규칙)

**실행**:
```bash
npm run validate:all
# 또는
node scripts/validate-markdown-guide.js public/content
```

**검증 항목**:
- Front Matter 필수 필드
- 표준 문구 준수 (24개 규칙)
- 버튼 문법 사용
- 청유형 금지
- 마침표 종결
- 등...

**출력 예시**:
```
📄 검증 중: public/content/week2/2-1-iam-role.md

📊 검증 결과:
   오류: 3
   경고: 1

❌ 오류 (3):

1. 줄 45:
   청유형 금지: "~하세요" → "~합니다"
   > 2. IAM 콘솔로 이동하세요.

2. 줄 67:
   버튼 문법 사용: Create bucket → [[Create bucket]]
   > 3. Create bucket 버튼을 클릭합니다.

⚠️ 경고 (1):

1. 줄 89:
   권장: 복사 가능한 값은 백틱 사용
   > Bucket name에 my-bucket을 입력합니다.
```

### 5-3. 고급 검증 (30개 규칙)

**실행**:
```bash
npm run validate:advanced
# 또는
node scripts/validate-advanced.js public/content
```

**검증 카테고리**:

| 카테고리 | 규칙 수 | 설명 |
|---------|--------|------|
| **A. 구조 및 완성도** | 8개 | Front Matter, 섹션 구조, 완료 메시지 |
| **B. 일관성 검증** | 10개 | 강조 스타일, 완료 표시, 버튼 문법 |
| **C. 페이지 구조** | 6개 | 실습 vs 데모, 섹션 순서, 참고 섹션 |
| **D. 콘텐츠 품질** | 4개 | 실습 환경 정보, Prerequisites, 리소스 정리 |
| **E. 다운로드 파일** | 2개 | 파일 설명, 관련 태스크 |

**출력 예시**:
```
📊 고급 검증 결과

총 파일: 1
발견된 항목: 12
  - 오류: 2
  - 경고: 3
  - 정보: 7

📁 Front Matter (2개)
❌ 1-1-well-architected-tool-demo.md:1
   오류: Front Matter 필수 필드 누락 - prerequisites

📁 강조 스타일 (3개)
ℹ️ 1-1-well-architected-tool-demo.md:30
   일관성: 필드명은 굵게(**) 사용 권장, 기울임(*) 대신

📁 완료 표시 (1개)
ℹ️ 1-1-well-architected-tool-demo.md:1
   일관성: 완료 표시 혼용 - standard(6회), other(3회)
   → "✅ **태스크 완료**:" 사용 권장
```

### 5-4. 특정 파일 검증

```bash
# 기본 검증
npm run validate:file public/content/week2/2-1-iam-role.md

# 고급 검증
npm run validate:advanced:file public/content/week2/2-1-iam-role.md
```

### 5-5. 특정 주차 검증

```bash
# Week 2 전체 검증
node scripts/validate-advanced.js public/content/week2

# Week 11 전체 검증
node scripts/validate-advanced.js public/content/week11
```

### 5-6. 진행률 확인

```bash
./scripts/check-progress.sh
```

**출력 예시**:
```
📊 검증 진행률
총 파일: 25
통과 파일: 18
진행률: 72%

주차별 현황:
Week 1: 2/2 (100%) ✅
Week 2: 2/2 (100%) ✅
Week 3: 2/2 (100%) ✅
Week 4: 1/3 (33%) 🔄
Week 5: 0/2 (0%) ❌
```


---

## 6. 새로운 표준 규칙 추가하기

### 6-1. 워크플로우

```
1. 표준 정의 (.kiro/steering/markdown-guide.md)
   ↓
2. 검증 규칙 구현 (scripts/validate-advanced.js)
   ↓
3. 테스트 (test-samples/)
   ↓
4. 전체 검증 (npm run validate:advanced)
   ↓
5. 문서 업데이트
```

### 6-2. 예시: "콘솔 이동" 표준 추가

#### Step 1: 표준 정의

**파일**: `.kiro/steering/markdown-guide.md`

```markdown
#### 3. 콘솔 이동
**표준 형식**: `~로 이동합니다` (통일)

**예시**:
\`\`\`markdown
✅ VPC 콘솔로 이동합니다.
✅ S3 콘솔로 이동합니다.

❌ VPC 콘솔로 돌아갑니다. ("이동합니다"로 통일)
\`\`\`
```

#### Step 2: 검증 규칙 구현

**파일**: `scripts/validate-advanced.js`

```javascript
// 규칙 추가
consoleNavigation: {
    check: (content, filePath) => {
        const issues = [];
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
            if (line.match(/콘솔로\s+돌아갑니다/)) {
                issues.push({
                    file: filePath,
                    line: index + 1,
                    message: '표준: "돌아갑니다"를 "이동합니다"로 변경',
                    severity: 'warning',
                    category: '콘솔 이동'
                });
            }
        });
        
        return issues;
    }
}
```

#### Step 3: 테스트

```bash
# 테스트 파일 생성
cat > test-samples/test-console-nav.md << 'EOF'
---
title: "테스트"
week: 99
session: 99
---

1. VPC 콘솔로 이동합니다. ✅
2. S3 콘솔로 돌아갑니다. ❌
EOF

# 검증 실행
node scripts/validate-advanced.js test-samples/test-console-nav.md
```

#### Step 4: 전체 검증

```bash
npm run validate:advanced
```

### 6-3. 검증 규칙 템플릿

```javascript
ruleName: {
    check: (content, filePath) => {
        const issues = [];
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
            // 검증 로직
            if (/* 조건 */) {
                issues.push({
                    file: filePath,
                    line: index + 1,
                    message: '오류 메시지',
                    severity: 'error', // 'error' | 'warning' | 'info'
                    category: '카테고리명'
                });
            }
        });
        
        return issues;
    }
}
```


---

## 7. 커스텀 문법 추가하기

### 7-1. 새로운 버튼 스타일 추가

**요구사항**: `<<Delete>>` 문법으로 위험한 액션 버튼 (빨간색) 추가

#### Step 1: 전처리 함수 수정

**파일**: `src/components/markdown/MarkdownRenderer.tsx`

```typescript
const preprocessContent = (text: string): string => {
  return text
    .replace(/\[\[([^\]]+)\]\]/g, '<awsbutton>$1</awsbutton>')
    .replace(/\{\{([^\}]+)\}\}/g, '<awsbutton-normal>$1</awsbutton-normal>')
    .replace(/\(\(([^\)]+)\)\)/g, '<awsbutton-secondary>$1</awsbutton-secondary>')
    // 새로운 문법 추가
    .replace(/<<([^>]+)>>/g, '<awsbutton-danger>$1</awsbutton-danger>')
}
```

#### Step 2: 컴포넌트 매핑 추가

```typescript
const components = {
  // 기존 컴포넌트...
  
  'awsbutton-danger': ({ children }: any) => (
    <span style={{ display: 'inline-block', margin: '0 2px' }}>
      <Button variant="primary" className="danger-button">
        {children}
      </Button>
    </span>
  )
}
```

#### Step 3: 스타일 추가

**파일**: `src/styles/aws-buttons.css`

```css
.danger-button {
  background-color: #d13212 !important;
  color: #ffffff !important;
}

.danger-button:hover {
  background-color: #a82a0c !important;
}
```

#### Step 4: 테스트

```markdown
1. <<Delete bucket>> 버튼을 클릭합니다.
```

### 7-2. 새로운 Alert 타입 추가

**요구사항**: `[!COST]` Alert 타입 추가

#### Step 1: Alert 감지 로직 추가

**파일**: `src/components/markdown/MarkdownRenderer.tsx`

```typescript
blockquote: ({ children }: any) => {
  const content = extractText(children)
  
  // 새로운 타입 추가
  if (content.includes('[!COST]')) {
    const cleanContent = content.replace('[!COST]', '').trim()
    return (
      <Alert type="warning" header="비용 안내">
        {cleanContent}
      </Alert>
    )
  }
  
  // 기존 로직...
}
```

#### Step 2: 스타일 추가 (선택사항)

**파일**: `src/styles/info-boxes.css`

```css
.info-box--cost {
  background-color: #fff8e1;
  border-left: 4px solid #ffc107;
}

.info-box--cost .info-box-icon {
  color: #f57c00;
}
```

#### Step 3: 마크다운 가이드 업데이트

**파일**: `.kiro/steering/markdown-guide.md`

```markdown
### 5. Alert 박스

**타입**:
- `[!COST]` → 비용 안내 (노란색, warning)
```


---

## 8. 검증 보고서 생성하기

### 8-1. 보고서 생성

```bash
# 검증 보고서 생성
./scripts/generate-validation-report.sh

# 생성된 파일: VALIDATION_REPORT.md
```

### 8-2. 보고서 내용

생성된 보고서에는 다음 정보가 포함됩니다:

1. **전체 요약**
   - 총 파일 수
   - 오류/경고/정보 개수
   - 통과율

2. **주차별 검증 결과**
   - 각 주차의 파일 수
   - 오류/경고/정보 개수
   - 상태 (✅ 통과 / ⚠️ 경고 / ❌ 오류)

3. **카테고리별 검증 결과**
   - 구조 및 완성도
   - 일관성 검증
   - 페이지 구조
   - 콘텐츠 품질

4. **상세 검증 결과**
   - 주차별 상세 오류 목록
   - 파일별 오류 위치 및 메시지

5. **권장 사항**
   - 우선순위별 수정 방법
   - 일반적인 오류 패턴
   - 자동 수정 스크립트 안내

### 8-3. 현재 검증 상태 (2026-01-28 기준)

**전체 요약**:
- 총 파일: 25개
- 오류: 3개
- 경고: 77개
- 정보: 294개

**주차별 상태**:
- Week 1: 2/2 파일 (경고 1개, 정보 14개)
- Week 2: 2/2 파일 (경고 6개, 정보 23개)
- Week 3: 2/2 파일 (경고 13개, 정보 17개)
- Week 4: 3/3 파일 (오류 1개, 경고 4개, 정보 50개)
- Week 5-14: 진행 중

**주요 개선 사항**:
1. ✅ Week 1 첫 번째 파일 완전 표준화 완료
2. 🔄 검증 스크립트 정규식 개선 (규칙 16, 18)
3. 📝 다운로드 블록 형식 표준화 (규칙 30)

### 8-4. 보고서 활용 방법

#### 1. 우선순위 결정

```bash
# 오류가 있는 파일 찾기
grep "오류:" VALIDATION_REPORT.md

# 경고가 많은 주차 찾기
grep "경고:" VALIDATION_REPORT.md | sort -t'|' -k4 -nr
```

#### 2. 진행률 추적

```bash
# 주차별 진행률 확인
./scripts/check-progress.sh
```

#### 3. 정기적인 보고서 생성

```bash
# 매주 월요일 보고서 생성 (cron 예시)
0 9 * * 1 cd /path/to/project && ./scripts/generate-validation-report.sh
```


---

## 9. 문제 해결

### 9-1. 일반적인 문제

#### 문제 1: 마크다운 문법이 렌더링되지 않음

**증상**: `[[Create]]`가 버튼이 아닌 텍스트로 표시됨

**원인**: 전처리 함수가 실행되지 않음

**해결**:
```typescript
// MarkdownRenderer.tsx에서 디버깅
const processedContent = preprocessContent(content)
console.log('Original:', content)
console.log('Processed:', processedContent)
```

#### 문제 2: Alert 박스가 표시되지 않음

**증상**: `> [!WARNING]`이 일반 인용구로 표시됨

**원인**: blockquote 컴포넌트 매핑 오류

**해결**:
```typescript
blockquote: ({ children }: any) => {
  const content = extractText(children)
  console.log('Blockquote content:', content) // 디버깅
  
  if (content.includes('[!WARNING]')) {
    return <Alert type="warning">{cleanContent(content)}</Alert>
  }
}
```

#### 문제 3: 스타일이 적용되지 않음

**증상**: 컴포넌트는 렌더링되지만 스타일이 없음

**원인**: CSS 파일 임포트 누락

**해결**:
```typescript
// MarkdownRenderer.tsx 상단에 추가
import '@/styles/markdown.css'
import '@/styles/user-value.css'
import '@/styles/info-boxes.css'
import '@/styles/aws-buttons.css'
```

#### 문제 4: 검증 스크립트 오류

**증상**: `npm run validate:advanced` 실행 시 오류

**원인**: Node.js 버전 또는 의존성 문제

**해결**:
```bash
# Node.js 버전 확인
node --version  # 18.x 이상 필요

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

### 9-2. 디버깅 팁

#### 1. 마크다운 렌더링 디버깅

```typescript
// MarkdownRenderer.tsx
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const processedContent = preprocessContent(content)
  
  // 디버깅 모드
  if (import.meta.env.DEV) {
    console.group('Markdown Rendering')
    console.log('Original:', content.substring(0, 200))
    console.log('Processed:', processedContent.substring(0, 200))
    console.groupEnd()
  }
  
  return <ReactMarkdown>{processedContent}</ReactMarkdown>
}
```

#### 2. 검증 규칙 디버깅

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

#### 3. React DevTools 활용

```bash
# React DevTools 설치
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools

# 개발 서버 실행
npm run dev

# 브라우저에서 F12 → React 탭
# 컴포넌트 트리 및 Props 확인
```

### 9-3. 성능 최적화

#### 1. 메모이제이션

```typescript
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = React.memo(({ content }) => {
  const processedContent = useMemo(() => preprocessContent(content), [content])
  
  return <ReactMarkdown>{processedContent}</ReactMarkdown>
})
```

#### 2. 코드 스플리팅

```typescript
// App.tsx
const SessionGuide = lazy(() => import('./pages/SessionGuide'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/week/:week/:session" element={<SessionGuide />} />
      </Routes>
    </Suspense>
  )
}
```


---

## 10. 배포하기

### 10-1. 프로덕션 빌드

```bash
# 1. 타입 체크
npm run type-check

# 2. 린트 검사
npm run lint

# 3. 검증 실행
npm run validate:advanced

# 4. 빌드
npm run build

# 5. 빌드 결과 확인
npm run preview
```

### 10-2. 빌드 결과

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── content/
    └── week*/
```

### 10-3. 배포 옵션

프로젝트는 다양한 호스팅 플랫폼에 배포할 수 있습니다:

#### 옵션 1: AWS Amplify (검토 중)
- **장점**: AWS 통합, 자동 배포, CDN 포함
- **단점**: AWS 계정 필요, 비용 발생 가능

#### 옵션 2: Vercel
- **장점**: 무료 티어, 자동 배포, 빠른 설정
- **단점**: 대역폭 제한

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel --prod
```

#### 옵션 3: Netlify
- **장점**: 무료 티어, 간단한 설정
- **단점**: 빌드 시간 제한

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 배포
netlify deploy --prod --dir=dist
```

#### 옵션 4: GitHub Pages
- **장점**: 완전 무료, GitHub 통합
- **단점**: 정적 사이트만 지원

```bash
# gh-pages 패키지 설치
npm install -D gh-pages

# package.json에 스크립트 추가
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}

# 배포
npm run deploy
```

### 10-4. 환경 변수 설정

#### 개발 환경 (`.env.development`)
```bash
VITE_ENVIRONMENT=development
VITE_API_URL=http://localhost:3000
VITE_ENABLE_DEBUG=true
```

#### 프로덕션 환경 (`.env.production`)
```bash
VITE_ENVIRONMENT=production
VITE_API_URL=https://api.university-lab-guide.com
VITE_ENABLE_DEBUG=false
# 배포 플랫폼에 따라 추가 설정
```

#### 환경 변수 사용 예시
```typescript
// 환경 변수 접근
const apiUrl = import.meta.env.VITE_API_URL
const isDebug = import.meta.env.VITE_ENABLE_DEBUG === 'true'

// 조건부 로깅
if (isDebug) {
  console.log('API URL:', apiUrl)
}
```

### 10-5. CI/CD 파이프라인 (선택사항)

배포 플랫폼이 결정되면 자동 배포 파이프라인을 설정할 수 있습니다.

**GitHub Actions 예시** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Validate markdown
        run: npm run validate:advanced
      
      - name: Build
        run: npm run build
      
      # 배포 플랫폼에 따라 추가 단계 설정
```

---

## 11. 리소스 태그 관리 시스템

### 11-1. 리소스 태그 시스템 개요

이 프로젝트는 **AWS Tag Editor 기반 리소스 관리 시스템**을 사용합니다.

**목적**:
- Week 1-1에서 Tag Editor 실습을 통해 학생들이 리소스 태그 개념 학습
- 이후 모든 실습에서 태그를 활용하여 리소스 추적 및 정리
- 불필요한 비용 발생 방지

**핵심 원칙**:
- 모든 수동 생성 리소스에 표준 태그 3개 추가
- Tag Editor로 실습에서 생성한 모든 리소스를 한 번에 찾기
- CloudFormation 스택 태그 자동 전파 활용

### 11-2. 표준 태그 정의

모든 실습 리소스에 다음 3개 태그를 필수로 추가합니다:

| Tag Key | Tag Value | 설명 | 예시 |
|---------|-----------|------|------|
| `Project` | `AWS-Lab` | 프로젝트 식별자 (고정값) | `AWS-Lab` |
| `Week` | `{주차}-{세션}` | 주차 및 세션 번호 | `5-3`, `10-1` |
| `CreatedBy` | `Student` | 생성자 구분 (고정값) | `Student` |

### 11-3. 마크다운 작성 표준

#### 태그 추가 단계 (표 형식)

```markdown
X. **Tags - optional** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `{주차}-{세션}` |
| `CreatedBy` | `Student` |
```

#### 리소스 정리 섹션 표준

모든 실습 가이드에 3가지 방법 제공:

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

### 방법 3: 수동 삭제

[각 리소스를 개별적으로 삭제하는 단계]

✅ **실습 종료**: 모든 리소스가 정리되었습니다.
```

### 11-4. CloudFormation 스택 태그 자동 전파

CloudFormation 스택에 태그를 추가하면 스택이 생성하는 모든 리소스에 자동으로 전파됩니다.

**마크다운 예시**:
```markdown
9. **Tags - optional** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `{주차}-{세션}` |
| `CreatedBy` | `Student` |

> [!NOTE]
> 이 태그들은 CloudFormation 스택이 생성하는 모든 리소스에 자동으로 전파됩니다.

10. [[Create stack]] 버튼을 클릭합니다.
```

### 11-5. 검증 규칙

리소스 태그 규칙 준수 여부를 검증하는 규칙이 포함되어 있습니다.

**검증 항목**:
- ✅ 필수 태그 3개 모두 포함
- ✅ 태그 추가 표준 형식 사용
- ✅ Tag Editor 방법 포함
- ✅ CloudFormation 스택 삭제 방법 포함
- ✅ WARNING Alert 문구 표준 준수

**검증 실행**:
```bash
npm run validate:advanced
```

### 11-6. 참고 문서

- **리소스 태그 규칙**: `.kiro/steering/markdown-guide/11-resource-tagging-rules.md`
- **최종 보고서**: `docs/reports/RESOURCE_TAGGING_FINAL_REPORT.md`
- **프로젝트 요약**: `docs/reports/RESOURCE_TAGGING_PROJECT_SUMMARY.md`
- **기준 가이드**: `public/content/week1/1-1-tag-editor-lab.md`

---

## 📚 추가 리소스

### 공식 문서

- [CloudScape Design System](https://cloudscape.design/)
- [React 공식 문서](https://react.dev/)
- [Vite 공식 문서](https://vitejs.dev/)
- [react-markdown](https://github.com/remarkjs/react-markdown)

### 프로젝트 문서

- [교수용 가이드](docs/professors/PROFESSOR_GUIDE.md)
- [검증 가이드](docs/VALIDATION_GUIDE.md)
- [마크다운 작성 표준](.kiro/steering/markdown-guide/)
  - [이미지 가이드라인](.kiro/steering/markdown-guide/09-image-guidelines.md)
  - [리소스 태그 규칙](.kiro/steering/markdown-guide/11-resource-tagging-rules.md)
- [스크립트 사용법](scripts/README.md)

### 검증 보고서

- [최신 검증 보고서](VALIDATION_REPORT.md)
- [리소스 태그 최종 보고서](docs/reports/RESOURCE_TAGGING_FINAL_REPORT.md)

---

## 🤝 기여하기

### 1. 새로운 기능 추가

1. 이슈 생성
2. 브랜치 생성 (`feature/new-feature`)
3. 개발 및 테스트
4. Pull Request 생성

### 2. 버그 수정

1. 이슈 생성
2. 브랜치 생성 (`fix/bug-description`)
3. 수정 및 테스트
4. Pull Request 생성

### 3. 문서 개선

1. 브랜치 생성 (`docs/improvement`)
2. 문서 수정
3. Pull Request 생성

---

## 📞 지원

### 문제 보고

- GitHub Issues: [프로젝트 이슈 페이지]
- 이메일: [support@example.com]

### 질문 및 토론

- GitHub Discussions: [프로젝트 토론 페이지]
- Slack: [팀 Slack 채널]

---

## 📝 변경 이력

### v2.0.0 (2026-01-28)

**추가**:
- 고급 검증 시스템 (30개 규칙)
- 검증 보고서 자동 생성
- 다운로드 블록 형식 표준화
- Kiro 스티어링 문서 통합

**개선**:
- 검증 스크립트 정규식 개선
- 완료 표시 일관성 검증
- 강조 스타일 검증 정확도 향상

**수정**:
- Week 1 첫 번째 파일 완전 표준화
- 검증 규칙 16, 18, 30 개선

### v1.0.0 (2025-12-01)

**초기 릴리스**:
- 마크다운 기반 실습 가이드 시스템
- CloudScape 통합
- 기본 검증 시스템 (18개 규칙)

---

**마지막 업데이트**: 2026-01-28  
**버전**: 2.0.0  
**작성자**: Development Team
