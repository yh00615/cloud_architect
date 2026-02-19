---
inclusion: auto
description: CloudScape Design System 통합 및 컴포넌트 사용 가이드 - AWS UI 컴포넌트 개발 표준
keywords: ['CloudScape', 'cloudscape', '@cloudscape-design', 'AWS UI', 'UI', '디자인', '컴포넌트', 'component', '통합', 'integration', 'Container', 'Header', 'Alert', 'Button', 'Box', 'Badge', 'Icon', 'SpaceBetween', '작성', '만들', '생성', '수정', '추가', '변경', '개발', 'develop', 'create', 'build', 'design', '스타일', 'style', 'CSS', '테마', 'theme', '다크모드', 'dark mode', '레이아웃', 'layout', '반응형', 'responsive']
---

# CloudScape Design System 통합 가이드

## 자동 적용 조건
이 가이드는 다음 상황에서 자동으로 적용됩니다:
- TypeScript/React 파일 작업 시
- CloudScape 관련 키워드 언급 시
- AWS UI 컴포넌트 개발 시

## CloudScape 컴포넌트 사용 원칙

### 1. 필수 임포트 및 설정
```typescript
// 글로벌 스타일 임포트 (main.tsx에서)
import '@cloudscape-design/global-styles/index.css'

// 개별 컴포넌트 임포트 (트리 쉐이킹)
import { Container, Header, Button, Alert } from '@cloudscape-design/components'

// ❌ 전체 임포트 금지
// import * as CloudScape from '@cloudscape-design/components'
```

### 2. 테마 설정
```typescript
// 테마 컨텍스트에서 관리
useEffect(() => {
  document.documentElement.setAttribute('data-awsui-theme', theme)
}, [theme])

// CSS 변수 활용
.custom-component {
  background-color: var(--color-background-container-content);
  color: var(--color-text-body-default);
  border: 1px solid var(--color-border-divider-default);
}
```

### 3. 교육용 컴포넌트 패턴
```typescript
// InfoCard 컴포넌트 예시
import { Container, Header, Box, Alert } from '@cloudscape-design/components'

interface InfoCardProps {
  title: string
  type: 'info' | 'warning' | 'success' | 'error'
  children: React.ReactNode
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, type, children }) => {
  return (
    <Container>
      <Header variant="h3">{title}</Header>
      <Alert type={type}>
        <Box>{children}</Box>
      </Alert>
    </Container>
  )
}
```

### 4. 한국어 UI 텍스트 규칙
```typescript
// ✅ 올바른 예시
<Button variant="primary">실습 시작하기</Button>
<Alert type="success">실습이 성공적으로 완료되었습니다!</Alert>

// ❌ 잘못된 예시
<Button variant="primary">Start Lab</Button>
<Alert type="success">Lab completed successfully!</Alert>
```

### 5. 디자인 제한사항
```css
/* ❌ 그라데이션 사용 금지 */
.component {
  background: linear-gradient(135deg, #color1, #color2); /* 금지! */
}

/* ✅ 단색 배경 사용 */
.component {
  background: var(--color-background-container-content);
  border: 1px solid var(--color-border-divider-default);
}

/* ✅ CloudScape 디자인 토큰만 사용 */
.component {
  background-color: var(--color-background-container-content);
  color: var(--color-text-body-default);
  border: 1px solid var(--color-border-divider-default);
}
```

**그라데이션 금지 이유:**
- CloudScape Design System의 일관성 유지
- 접근성 및 색상 대비 문제 방지
- 브랜드 가이드라인 준수
- 다크모드 호환성 보장

### 6. 접근성 준수
```typescript
// ARIA 속성 추가
<Button
  variant="primary"
  ariaLabel="Week 1 AWS 기초 실습 시작하기"
  onClick={handleStartLab}
>
  실습 시작
</Button>

// 키보드 네비게이션 지원
const handleKeyDown = (event: React.KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleStartLab()
  }
}
```

### 7. 반응형 레이아웃
```typescript
// Grid 시스템 활용
import { Grid } from '@cloudscape-design/components'

<Grid
  gridDefinition={[
    { colspan: { default: 12, xs: 6 } },
    { colspan: { default: 12, xs: 6 } }
  ]}
>
  <InfoCard title="실습 개요" type="info">
    {/* 내용 */}
  </InfoCard>
  <InfoCard title="주의사항" type="warning">
    {/* 내용 */}
  </InfoCard>
</Grid>
```

### 7. 태스크 설명 컴포넌트 패턴
```typescript
// 2025-01-03 추가: 태스크 설명을 위한 CloudScape 컴포넌트 조합 패턴
import { Container, Header, Box, SpaceBetween, Badge, Icon } from '@cloudscape-design/components'

interface TaskDescriptionProps {
  taskNumber: number
  title: string
  description: string
  objectives?: string[]
  prerequisites?: string[]
  estimatedSteps?: number
}

export const TaskDescription: React.FC<TaskDescriptionProps> = ({
  taskNumber,
  title,
  description,
  objectives = [],
  prerequisites = [],
  estimatedSteps
}) => {
  return (
    <Container
      header={
        <Header
          variant="h2"
          description={`태스크 ${taskNumber}에서 수행할 주요 작업 내용입니다`}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              {estimatedSteps && (
                <Badge color="blue">
                  <Icon name="status-positive" /> {estimatedSteps}단계
                </Badge>
              )}
              <Badge color="green">
                <Icon name="settings" /> 환경 설정
              </Badge>
            </SpaceBetween>
          }
        >
          <SpaceBetween direction="horizontal" size="s" alignItems="center">
            <Badge color="grey">태스크 {taskNumber}</Badge>
            <span>{title}</span>
          </SpaceBetween>
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        {/* 주요 설명 - 한국어 텍스트 */}
        <Box variant="div" padding={{ vertical: 'm', horizontal: 'l' }}>
          <Box 
            variant="p" 
            fontSize="body-m" 
            color="text-body-default"
            textAlign="left"
          >
            {description}
          </Box>
        </Box>

        {/* 목표 및 사전 요구사항 */}
        {(objectives.length > 0 || prerequisites.length > 0) && (
          <SpaceBetween direction="horizontal" size="l">
            {/* 학습 목표 */}
            {objectives.length > 0 && (
              <Box variant="div" padding="s">
                <Header variant="h4">
                  <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                    <Icon name="status-info" variant="success" />
                    <span>학습 목표</span>
                  </SpaceBetween>
                </Header>
                <Box margin={{ top: 's' }}>
                  <SpaceBetween direction="vertical" size="xs">
                    {objectives.map((objective, index) => (
                      <Box key={index} variant="div">
                        <SpaceBetween direction="horizontal" size="xs" alignItems="start">
                          <Icon name="check" variant="success" />
                          <Box variant="span" fontSize="body-s" color="text-body-secondary">
                            {objective}
                          </Box>
                        </SpaceBetween>
                      </Box>
                    ))}
                  </SpaceBetween>
                </Box>
              </Box>
            )}

            {/* 사전 요구사항 */}
            {prerequisites.length > 0 && (
              <Box variant="div" padding="s">
                <Header variant="h4">
                  <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                    <Icon name="status-warning" variant="warning" />
                    <span>사전 요구사항</span>
                  </SpaceBetween>
                </Header>
                <Box margin={{ top: 's' }}>
                  <SpaceBetween direction="vertical" size="xs">
                    {prerequisites.map((prerequisite, index) => (
                      <Box key={index} variant="div">
                        <SpaceBetween direction="horizontal" size="xs" alignItems="start">
                          <Icon name="arrow-right" />
                          <Box variant="span" fontSize="body-s" color="text-body-secondary">
                            {prerequisite}
                          </Box>
                        </SpaceBetween>
                      </Box>
                    ))}
                  </SpaceBetween>
                </Box>
              </Box>
            )}
          </SpaceBetween>
        )}
      </SpaceBetween>
    </Container>
  )
}
```

**주요 특징:**
- Container와 Header를 활용한 구조화된 레이아웃
- Badge와 Icon으로 시각적 구분 및 정보 전달
- SpaceBetween으로 일관된 간격 관리
- Box 컴포넌트의 다양한 variant와 속성 활용
- 한국어 텍스트와 접근성 고려한 구조
- CloudScape 디자인 토큰 준수 (fontSize, color, padding 등)

### 8. 현대적 태스크 설명 컴포넌트 패턴 (개선된 버전)
```typescript
// 2025-01-03 추가: 더 깔끔하고 현대적인 디자인의 태스크 설명 컴포넌트
import { Box, SpaceBetween, Badge, Icon } from '@cloudscape-design/components'

export const TaskDescription: React.FC<TaskDescriptionProps> = ({
  taskNumber,
  title,
  description,
  objectives = [],
  prerequisites = [],
  estimatedSteps
}) => {
  return (
    <Box 
      variant="div" 
      padding="l"
      className="task-description-modern"
    >
      <SpaceBetween direction="vertical" size="m">
        {/* 헤더 섹션 - 간결하고 깔끔한 디자인 */}
        <Box variant="div" className="task-header">
          <SpaceBetween direction="vertical" size="s">
            <SpaceBetween direction="horizontal" size="s" alignItems="center">
              <Badge color="blue" className="task-number-badge">
                태스크 {taskNumber}
              </Badge>
              {estimatedSteps && (
                <Badge color="grey">
                  <Icon name="status-positive" /> {estimatedSteps}단계
                </Badge>
              )}
            </SpaceBetween>
            
            <Box variant="h2" className="task-title">
              {title}
            </Box>
          </SpaceBetween>
        </Box>

        {/* 설명 섹션 - 좌측 컬러 바와 함께 */}
        <Box 
          variant="div" 
          padding="m"
          className="task-description-content"
        >
          <Box 
            variant="p" 
            fontSize="body-m" 
            color="text-body-default"
          >
            {description}
          </Box>
        </Box>

        {/* 목표 및 사전 요구사항 - 카드 형태로 구분 */}
        {(objectives.length > 0 || prerequisites.length > 0) && (
          <SpaceBetween direction="horizontal" size="l">
            {objectives.length > 0 && (
              <Box variant="div" className="task-objectives">
                <SpaceBetween direction="vertical" size="s">
                  <Box variant="div" className="section-header">
                    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                      <Icon name="status-info" variant="success" />
                      <Box variant="h4" color="text-label">학습 목표</Box>
                    </SpaceBetween>
                  </Box>
                  
                  <Box variant="div" className="objectives-list">
                    <SpaceBetween direction="vertical" size="xs">
                      {objectives.map((objective, index) => (
                        <Box key={index} variant="div" className="objective-item">
                          <SpaceBetween direction="horizontal" size="xs" alignItems="start">
                            <Icon name="check" variant="success" />
                            <Box variant="span" fontSize="body-s" color="text-body-secondary">
                              {objective}
                            </Box>
                          </SpaceBetween>
                        </Box>
                      ))}
                    </SpaceBetween>
                  </Box>
                </SpaceBetween>
              </Box>
            )}
          </SpaceBetween>
        )}
      </SpaceBetween>
    </Box>
  )
}
```

**개선된 디자인 특징:**
- Container 대신 Box 사용으로 더 가벼운 구조
- 상단 그라데이션 바로 시각적 강조
- 호버 효과와 부드러운 애니메이션
- 좌측 컬러 바가 있는 설명 섹션
- 카드 형태의 목표/요구사항 섹션
- 현대적인 그림자와 둥근 모서리
- 반응형 디자인과 다크모드 지원

### 9. 페이지 구조 분리 패턴 (Week11Guide 개선 사례)
```typescript
// 2025-01-03 추가: 헤더와 개요를 분리된 카드로 구성하는 패턴
import { Container, Header, SpaceBetween, Badge, Alert, ColumnLayout, Box } from '@cloudscape-design/components'

// ✅ 올바른 패턴 - 헤더 카드 (독립적)
const HeaderCard: React.FC<{ weekData: WeekData }> = ({ weekData }) => {
  return (
    <Container
      header={
        <Header
          variant="h1"
          description={weekData.description}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Badge color="red">고급</Badge>
              <Badge color="blue">{weekData.estimatedTime}</Badge>
            </SpaceBetween>
          }
        >
          Week {weekData.number}: {weekData.title}
        </Header>
      }
    >
      {/* 중요 공지사항만 포함 */}
      <Alert type="warning" header="실습 주의사항">
        개인 정보는 실습 환경에 입력하지 마십시오.
      </Alert>
    </Container>
  )
}

// ✅ 올바른 패턴 - 개요 카드 (독립적)
const OverviewCard: React.FC<{ weekData: WeekData }> = ({ weekData }) => {
  return (
    <Container
      header={
        <Header
          variant="h2"
          description="실습에 필요한 파일을 다운로드하고 전체 실습 개요를 확인하세요"
        >
          실습 개요
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        {/* 파일 다운로드 섹션 */}
        <Container header={<Header variant="h3">실습 파일 다운로드</Header>}>
          <SpaceBetween direction="vertical" size="m">
            <Box>
              <strong>실습을 시작하기 전에 다음 파일들을 다운로드하세요:</strong>
            </Box>

            <ColumnLayout columns={2}>
              <Box>
                <SpaceBetween direction="vertical" size="s">
                  <Box variant="h4">노트북 파일</Box>
                  <Button
                    variant="primary"
                    iconName="download"
                    href="/files/week11/lab_6.ipynb"
                    download="lab_6.ipynb"
                  >
                    lab_6.ipynb 다운로드
                  </Button>
                  <Box fontSize="body-s" color="text-body-secondary">
                    SageMaker 파이프라인 구축을 위한 Jupyter 노트북 파일입니다.
                  </Box>
                </SpaceBetween>
              </Box>

              <Box>
                <SpaceBetween direction="vertical" size="s">
                  <Box variant="h4">데이터셋</Box>
                  <Button
                    variant="normal"
                    iconName="download"
                    href="/files/week11/customer-churn-dataset.csv"
                    download="customer-churn-dataset.csv"
                  >
                    customer-churn-dataset.csv 다운로드
                  </Button>
                  <Box fontSize="body-s" color="text-body-secondary">
                    고객 이탈 예측을 위한 샘플 데이터셋입니다.
                  </Box>
                </SpaceBetween>
              </Box>
            </ColumnLayout>
          </SpaceBetween>
        </Container>

        {/* 실습 정보 */}
        <ColumnLayout columns={2}>
          <Box>
            <SpaceBetween direction="vertical" size="m">
              <Box variant="h4">사용 AWS 서비스</Box>
              <SpaceBetween direction="vertical" size="xs">
                {weekData.demos[0].awsServices.map((service, index) => (
                  <CopyableCode
                    key={index}
                    term={service}
                    type="config"
                    copyable={false}
                  />
                ))}
              </SpaceBetween>
            </SpaceBetween>
          </Box>

          <Box>
            <KeyPointsChecklist
              title="학습 목표"
              items={weekData.learningObjectives}
              storageKey="week11-objectives"
            />
          </Box>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  )
}

// ✅ 메인 페이지에서 사용
export const Week11Guide: React.FC = () => {
  const week11Data = weeklyData.find(week => week.number === 11)!

  return (
    <Container>
      <SpaceBetween direction="vertical" size="l">
        {/* 1. 헤더 카드 - 독립적 */}
        <HeaderCard weekData={week11Data} />
        
        {/* 2. 개요 카드 - 독립적 */}
        <OverviewCard weekData={week11Data} />
        
        {/* 3. 태스크 카드들 - 각각 독립적 */}
        <TaskCard taskNumber={1} />
        <TaskCard taskNumber={2} />
        {/* ... */}
      </SpaceBetween>
    </Container>
  )
}
```

**카드 분리 패턴의 핵심 원칙:**
1. **단일 책임**: 각 카드는 하나의 명확한 목적만 가짐
2. **독립성**: 카드 간 의존성 최소화
3. **재사용성**: 다른 주차 가이드에서도 활용 가능한 구조
4. **시각적 구분**: 사용자가 쉽게 정보를 구분할 수 있음
5. **유지보수성**: 각 카드를 독립적으로 수정 가능

**❌ 피해야 할 패턴:**
```typescript
// 잘못된 예시 - 모든 내용을 하나의 Container에 포함
<Container>
  <Header>제목</Header>
  <Alert>주의사항</Alert>
  <Box>파일 다운로드</Box>
  <Box>AWS 서비스</Box>
  <Box>학습 목표</Box>
  <Box>태스크 1</Box>
  <Box>태스크 2</Box>
  {/* 너무 많은 내용이 하나의 카드에... */}
</Container>
```

### 10. 파일 다운로드 컴포넌트 패턴
```typescript
// 2025-01-03 추가: 실습 파일 다운로드를 위한 표준 패턴
import { Button, Box, SpaceBetween, ColumnLayout, Alert } from '@cloudscape-design/components'

interface FileDownloadSectionProps {
  files: {
    name: string
    description: string
    href: string
    type: 'primary' | 'normal'
    category: string
  }[]
}

export const FileDownloadSection: React.FC<FileDownloadSectionProps> = ({ files }) => {
  return (
    <SpaceBetween direction="vertical" size="m">
      <Box>
        <strong>실습을 시작하기 전에 다음 파일들을 다운로드하세요:</strong>
      </Box>

      <ColumnLayout columns={2}>
        {files.map((file, index) => (
          <Box key={index}>
            <SpaceBetween direction="vertical" size="s">
              <Box variant="h4">{file.category}</Box>
              <Button
                variant={file.type}
                iconName="download"
                href={file.href}
                download={file.name}
              >
                {file.name} 다운로드
              </Button>
              <Box fontSize="body-s" color="text-body-secondary">
                {file.description}
              </Box>
            </SpaceBetween>
          </Box>
        ))}
      </ColumnLayout>

      <Alert type="info" header="파일 사용 안내">
        <SpaceBetween direction="vertical" size="xs">
          <Box>• 파일들은 실습 환경에서 직접 제공되므로 다운로드는 선택사항입니다</Box>
          <Box>• 로컬에서 실습하는 경우에만 다운로드하여 사용하세요</Box>
        </SpaceBetween>
      </Alert>
    </SpaceBetween>
  )
}
```

### 11. UserValue 컴포넌트 패턴 (개선된 입력 필드 스타일)
```typescript
// 2025-01-04 추가 및 개선: 명확하게 보이는 UserValue 컴포넌트 패턴
import CopyToClipboard from '@cloudscape-design/components/copy-to-clipboard'

interface UserValueProps {
    children: React.ReactNode
    placeholder?: boolean
    className?: string
    copyable?: boolean
}

export const UserValue: React.FC<UserValueProps> = ({
    children,
    placeholder = false,
    className = '',
    copyable = true,
    ...props
}) => {
    const textValue = typeof children === 'string' ? children : String(children)

    return (
        <span
            className="user-value-container"
            role="group"
            aria-label={`사용자 값: ${textValue}`}
            style={{
                display: 'inline-flex',
                alignItems: 'stretch',
                gap: '0',
                maxWidth: 'fit-content',
                borderRadius: '4px',
                overflow: 'hidden',
                verticalAlign: 'middle'
            }}
        >
            {/* 복사 버튼 - 왼쪽 */}
            {copyable && (
                <div
                    style={{
                        backgroundColor: '#f2f3f3',
                        border: '1px solid #d5dbdb',
                        borderRight: 'none',
                        padding: '6px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        borderTopLeftRadius: '4px',
                        borderBottomLeftRadius: '4px',
                        minHeight: '32px'
                    }}
                >
                    <CopyToClipboard
                        copyButtonAriaLabel={`${textValue} 값을 클립보드에 복사`}
                        copyErrorText="복사 실패"
                        copySuccessText="복사 완료"
                        textToCopy={textValue}
                        variant="icon"
                    />
                </div>
            )}

            {/* 텍스트 값 - 오른쪽 */}
            <code
                className={`user-value-text ${placeholder ? 'user-value--placeholder' : ''} ${className}`}
                aria-label={placeholder ? `예시값: ${textValue}` : `사용자 값: ${textValue}`}
                title={textValue}
                style={{
                    backgroundColor: '#fafbfc',
                    color: placeholder ? '#687078' : '#0d1117',
                    border: placeholder ? '1px dashed #d5dbdb' : '1px solid #d5dbdb',
                    borderLeft: copyable ? 'none' : '1px solid #d5dbdb',
                    padding: '6px 12px',
                    fontSize: '1rem',
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontStyle: placeholder ? 'italic' : 'normal',
                    fontWeight: placeholder ? 'normal' : '500',
                    borderTopRightRadius: '4px',
                    borderBottomRightRadius: '4px',
                    borderTopLeftRadius: copyable ? '0' : '4px',
                    borderBottomLeftRadius: copyable ? '0' : '4px',
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: '32px',
                    lineHeight: '1.5'
                }}
                {...props}
            >
                {children}
            </code>
        </span>
    )
}
```

**주요 개선사항 (2025-01-04 업데이트):**
- **명확한 시각적 구분**: 복사 버튼과 텍스트 영역을 별도 배경색으로 구분
- **고정 색상 사용**: CloudScape 변수 대신 명확한 색상값 사용으로 가시성 향상
- **크기 표준화**: 1rem(16px) 폰트 크기로 텍스트 일관성 확보
- **높이 통일**: minHeight 32px로 버튼과 텍스트 영역 높이 통일
- **접근성 개선**: 더 명확한 aria-label과 title 속성
- **레이아웃 안정성**: verticalAlign과 lineHeight로 정렬 개선

**사용 예시:**
```tsx
// 복사 가능한 입력값 (기본)
<UserValue>vpc-endpoint-lab</UserValue>

// 선택만 하는 값 (복사 불가)
<UserValue copyable={false}>Amazon Linux 2023 AMI</UserValue>

// 플레이스홀더 (예시값)
<UserValue placeholder>your-bucket-name</UserValue>
```

**문제 해결:**
- **가시성 문제**: 고정 색상값 사용으로 모든 테마에서 명확하게 표시
- **텍스트 크기 일관성**: 모든 UserValue에서 1rem 폰트 크기 사용
- **레이아웃 정렬**: 복사 버튼과 텍스트가 정확히 정렬되도록 개선

이 가이드를 통해 CloudScape 컴포넌트를 일관되게 사용하여 교육적 가치가 높은 UI를 구축하세요.

---

## 📏 텍스트 크기 표준화 (2025-01-04 추가)

### 기본 텍스트 크기 규칙
모든 컴포넌트에서 일관된 텍스트 크기를 사용해야 합니다:

```css
/* 기본 텍스트 크기 표준 */
.standard-text {
  font-size: 1rem; /* 16px - 기본 본문 텍스트 */
  line-height: 1.6; /* 가독성을 위한 줄 간격 */
}

.small-text {
  font-size: 0.875rem; /* 14px - 보조 정보, 캡션 */
  line-height: 1.5;
}

.large-text {
  font-size: 1.125rem; /* 18px - 강조 텍스트 */
  line-height: 1.4;
}
```

### 컴포넌트별 텍스트 크기 적용

#### 1. 실습 지침 및 설명
```typescript
// LabStep, TaskDescription 등에서 사용
<li style={{
    fontSize: '1rem',        // 16px 표준 크기
    lineHeight: '1.6',       // 가독성 향상
    marginBottom: '1rem'     // 적절한 간격
}}>
    실습 단계 설명
</li>
```

#### 2. UserValue 컴포넌트
```typescript
// 입력값 표시 컴포넌트
<code style={{
    fontSize: '1rem',                    // 16px 표준 크기
    fontFamily: 'Monaco, Menlo, monospace', // 고정폭 폰트
    lineHeight: '1.5'                    // 코드용 줄 간격
}}>
    vpc-endpoint-lab
</code>
```

#### 3. 목록 및 체크리스트
```typescript
// 학습 목표, 사전 요구사항 등
<ol style={{
    fontSize: '1rem',        // 16px 표준 크기
    lineHeight: '1.6',       // 목록용 줄 간격
    paddingLeft: '1.5rem'    // 들여쓰기
}}>
    <li style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
        학습 목표 항목
    </li>
</ol>
```

#### 4. 보조 정보 및 캡션
```typescript
// 작은 크기가 필요한 경우만 사용
<Box fontSize="body-s" style={{ fontSize: '0.875rem' }}>
    보조 설명이나 캡션
</Box>
```

### 금지사항
```typescript
// ❌ 일관되지 않은 텍스트 크기 사용 금지
<div style={{ fontSize: '13px' }}>텍스트</div>     // 비표준 크기
<div style={{ fontSize: '15px' }}>텍스트</div>     // 비표준 크기
<div style={{ fontSize: '0.8rem' }}>텍스트</div>   // 너무 작음

// ✅ 표준 크기만 사용
<div style={{ fontSize: '1rem' }}>텍스트</div>     // 16px 표준
<div style={{ fontSize: '0.875rem' }}>텍스트</div> // 14px 보조
<div style={{ fontSize: '1.125rem' }}>텍스트</div> // 18px 강조
```

### 검증 체크리스트
- [ ] 모든 본문 텍스트가 1rem(16px)인가?
- [ ] 보조 정보만 0.875rem(14px)를 사용하는가?
- [ ] 줄 간격(line-height)이 적절히 설정되었는가?
- [ ] 컴포넌트 간 텍스트 크기가 일관되는가?
- [ ] 비표준 크기(13px, 15px 등)를 사용하지 않았는가?


---

## 🌓 다크모드 지원 필수 규칙 (2025-01-29 추가)

### 기본 원칙
**모든 새로운 컴포넌트와 스타일은 반드시 다크모드를 지원해야 합니다.**

### 1. CSS 파일에서 다크모드 지원

#### ✅ 올바른 방법 - CloudScape 변수 사용
```css
/* 라이트모드 (기본) */
.custom-component {
  background-color: var(--color-background-container-content);
  color: var(--color-text-body-default);
  border: 1px solid var(--color-border-divider-default);
}

/* 다크모드는 자동으로 지원됨 */
```

#### ✅ 하드코딩된 색상 사용 시 - 반드시 다크모드 추가
```css
/* 라이트모드 */
.info-box {
  background-color: #f0f9ff;
  color: #0c4a6e;
  border: 1px solid #0ea5e9;
}

/* 다크모드 - 필수! */
[data-awsui-theme="dark"] .info-box {
  background-color: #0c2d48;
  color: #bae6fd;
  border: 1px solid #0ea5e9;
}
```

#### ❌ 금지 - 다크모드 없이 하드코딩된 색상만 사용
```css
/* 이렇게만 작성하면 다크모드에서 보이지 않음! */
.bad-component {
  background-color: #ffffff;
  color: #000000;
}
```

### 2. 인라인 스타일에서 다크모드 지원

#### ✅ 올바른 방법 - CloudScape 변수 사용
```typescript
<div style={{
  backgroundColor: 'var(--color-background-container-content)',
  color: 'var(--color-text-body-default)',
  border: '1px solid var(--color-border-divider-default)'
}}>
  내용
</div>
```

#### ❌ 금지 - 하드코딩된 색상 사용
```typescript
// 다크모드에서 보이지 않음!
<div style={{
  backgroundColor: '#ffffff',
  color: '#000000'
}}>
  내용
</div>
```

#### ✅ 불가피하게 하드코딩 필요 시 - CSS 클래스로 분리
```typescript
// 컴포넌트
<div className="custom-styled-box">
  내용
</div>

// CSS 파일
.custom-styled-box {
  background-color: #f0f9ff;
  color: #0c4a6e;
}

[data-awsui-theme="dark"] .custom-styled-box {
  background-color: #0c2d48;
  color: #bae6fd;
}
```

### 3. 주요 CloudScape 변수

#### 배경색
```css
var(--color-background-layout-main)           /* 메인 레이아웃 배경 */
var(--color-background-container-content)     /* 컨테이너 내용 배경 */
var(--color-background-container-header)      /* 컨테이너 헤더 배경 */
var(--color-background-code-block)            /* 코드 블록 배경 */
```

#### 텍스트 색상
```css
var(--color-text-body-default)                /* 기본 본문 텍스트 */
var(--color-text-body-secondary)              /* 보조 텍스트 */
var(--color-text-heading-default)             /* 제목 텍스트 */
var(--color-text-label)                       /* 레이블 텍스트 */
```

#### 테두리 색상
```css
var(--color-border-divider-default)           /* 기본 구분선 */
var(--color-border-container-top)             /* 컨테이너 상단 테두리 */
var(--color-border-item-focused)              /* 포커스 테두리 */
```

#### 상태 색상
```css
var(--color-text-status-success)              /* 성공 텍스트 */
var(--color-text-status-error)                /* 오류 텍스트 */
var(--color-text-status-warning)              /* 경고 텍스트 */
var(--color-text-status-info)                 /* 정보 텍스트 */
```

### 4. 다크모드 색상 선택 가이드

라이트모드에서 하드코딩된 색상을 사용했다면, 다크모드에서는 다음 원칙을 따르세요:

#### 배경색
- **밝은 배경** → **어두운 배경**
- `#ffffff` → `#0f1b2a` 또는 `#1a2332`
- `#f0f9ff` → `#0c2d48`
- `#fafbfc` → `#16202e`

#### 텍스트 색상
- **어두운 텍스트** → **밝은 텍스트**
- `#000000` → `#e9ebed` 또는 `#ffffff`
- `#374151` → `#d1d5db`
- `#6b7280` → `#9ca3af`

#### 강조 색상
- **진한 색상** → **밝은 색상**
- `#0ea5e9` → `#38bdf8`
- `#7b1fa2` → `#a78bfa`
- `#d13212` → `#ef6b82`

### 5. 다크모드 테스트 체크리스트

새로운 컴포넌트나 스타일을 추가할 때 반드시 확인:

- [ ] 모든 배경색이 다크모드에서 보이는가?
- [ ] 모든 텍스트가 다크모드에서 읽을 수 있는가?
- [ ] 테두리와 구분선이 다크모드에서 보이는가?
- [ ] 호버/포커스 상태가 다크모드에서 작동하는가?
- [ ] 아이콘과 이미지가 다크모드에서 적절한가?
- [ ] 색상 대비가 충분한가? (WCAG AA 기준 4.5:1 이상)

### 6. 일반적인 실수와 해결 방법

#### 실수 1: 인라인 스타일에 하드코딩
```typescript
// ❌ 잘못됨
<div style={{ color: '#000000' }}>텍스트</div>

// ✅ 올바름
<div style={{ color: 'var(--color-text-body-default)' }}>텍스트</div>
```

#### 실수 2: CSS에서 다크모드 누락
```css
/* ❌ 잘못됨 - 다크모드 없음 */
.box {
  background: #ffffff;
  color: #000000;
}

/* ✅ 올바름 - 다크모드 포함 */
.box {
  background: #ffffff;
  color: #000000;
}

[data-awsui-theme="dark"] .box {
  background: #0f1b2a;
  color: #e9ebed;
}
```

#### 실수 3: 불충분한 색상 대비
```css
/* ❌ 잘못됨 - 다크모드에서 대비 부족 */
[data-awsui-theme="dark"] .text {
  color: #555555; /* 너무 어두움 */
}

/* ✅ 올바름 - 충분한 대비 */
[data-awsui-theme="dark"] .text {
  color: #d1d5db; /* 밝고 읽기 쉬움 */
}
```

### 7. 다크모드 우선 개발 권장

새로운 컴포넌트 개발 시:
1. CloudScape 변수를 최대한 활용
2. 하드코딩이 필요하면 즉시 다크모드 스타일도 작성
3. 라이트/다크 모드를 번갈아가며 테스트
4. 색상 대비 도구로 접근성 검증

---

## 📁 파일명 규칙 (2025-01-29 추가)

### 파일 유형별 명명 규칙

#### 1. TypeScript/React 컴포넌트 파일
**규칙**: **PascalCase** (각 단어의 첫 글자 대문자)

```
✅ 올바른 예시:
- SessionGuide.tsx
- ThemeContext.tsx
- WeeklyGuide.tsx
- EnvironmentSetup.tsx
- KeyPointsChecklist.tsx

❌ 잘못된 예시:
- sessionGuide.tsx
- theme-context.tsx
- weekly_guide.tsx
```

#### 2. CSS 파일
**규칙**: **kebab-case** (소문자 + 하이픈)

```
✅ 올바른 예시:
- guide-badges.css
- download-files.css
- info-boxes.css
- lab-step.css
- user-value.css

❌ 잘못된 예시:
- guideBadges.css
- download_files.css
- InfoBoxes.css
```

#### 3. 일반 TypeScript 파일 (유틸리티, 훅 등)
**규칙**: **camelCase** (첫 단어 소문자, 이후 단어 첫 글자 대문자)

```
✅ 올바른 예시:
- curriculum.ts
- useTranslation.ts
- markdownLoader.ts
- dateUtils.ts

❌ 잘못된 예시:
- Curriculum.ts
- use-translation.ts
- markdown_loader.ts
```

#### 4. 설정 파일
**규칙**: **kebab-case** 또는 **점 표기법**

```
✅ 올바른 예시:
- tsconfig.json
- vite.config.ts
- package.json
- .eslintrc.cjs

❌ 잘못된 예시:
- tsConfig.json
- vite_config.ts
```

### 파일명 규칙 요약표

| 파일 유형 | 규칙 | 예시 |
|----------|------|------|
| React 컴포넌트 | PascalCase | `SessionGuide.tsx` |
| Context | PascalCase | `ThemeContext.tsx` |
| 페이지 | PascalCase | `Dashboard.tsx` |
| CSS 파일 | kebab-case | `guide-badges.css` |
| 훅 (Hooks) | camelCase | `useTranslation.ts` |
| 유틸리티 | camelCase | `markdownLoader.ts` |
| 데이터 파일 | camelCase | `curriculum.ts` |
| 설정 파일 | kebab-case | `vite.config.ts` |

### 디렉토리 구조와 파일명

```
src/
├── components/          # PascalCase 컴포넌트
│   ├── education/
│   │   ├── InfoCard.tsx
│   │   └── KeyPointsChecklist.tsx
│   └── ui/
│       ├── AWSButton.tsx
│       └── GuideBadge.tsx
├── contexts/           # PascalCase Context
│   ├── ThemeContext.tsx
│   └── ProgressContext.tsx
├── hooks/             # camelCase 훅
│   └── useTranslation.ts
├── pages/             # PascalCase 페이지
│   ├── Dashboard.tsx
│   └── SessionGuide.tsx
├── styles/            # kebab-case CSS
│   ├── guide-badges.css
│   └── info-boxes.css
└── utils/             # camelCase 유틸리티
    └── markdownLoader.ts
```

### 일관성 유지 체크리스트

새 파일 생성 시 확인:
- [ ] 컴포넌트 파일은 PascalCase인가?
- [ ] CSS 파일은 kebab-case인가?
- [ ] 유틸리티/훅 파일은 camelCase인가?
- [ ] 파일명이 내용을 명확히 설명하는가?
- [ ] 기존 파일명 패턴과 일치하는가?
