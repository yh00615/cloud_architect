---
문서 타입: Specification
작성일: 2025-02-11
버전: 1.0.0
---

# 컴포넌트 명세 (Component Specifications)

**문서 타입**: Specification  
**목적**: 구현해야 할 컴포넌트 목록 및 우선순위 정의

---

## 📋 개요

이 문서는 대학교 AWS 실습 가이드 시스템의 **어떤 컴포넌트를 만들지**에 대한 명세입니다.
- 컴포넌트 분류 및 목록
- 개발 우선순위
- 각 컴포넌트의 역할 및 기능

**작업 방법**은 `.kiro/steering/development-guide.md`를 참조하세요.

---

## 🎯 컴포넌트 분류

### 1. 교육용 컴포넌트 (Educational Components)

교육 목적에 특화된 컴포넌트들입니다.

#### InfoCard
- **목적**: 중요 정보를 시각적으로 강조
- **타입**: info, warning, success, error
- **사용처**: 개념 설명, 주의사항, 팁

#### KeyPointsChecklist
- **목적**: 학습 목표 및 완료 항목 체크
- **기능**: 로컬 스토리지 저장, 진도 추적
- **사용처**: 학습 목표, 사전 요구사항, 완료 확인

#### TaskDescription
- **목적**: 태스크 정보 표시
- **포함 정보**: 태스크 번호, 제목, 설명, 목표, 사전 요구사항
- **사용처**: 각 태스크 시작 부분

#### ProgressTracker
- **목적**: 전체 실습 진도 시각화
- **기능**: 주차별 완료 상태, 전체 진행률
- **사용처**: 대시보드, 사이드바

### 2. UI 컴포넌트 (UI Components)

범용 사용자 인터페이스 컴포넌트들입니다.

#### AdvancedSearchTerm
- **목적**: 복사 가능한 검색어 표시
- **기능**: 클릭 시 자동 복사, 시각적 피드백
- **사용처**: AWS 콘솔 검색 단계

#### SmartInputValue
- **목적**: 복사 가능한 입력값 표시
- **기능**: 클릭 시 자동 복사, 플레이스홀더 지원
- **사용처**: 버킷명, 리소스 ID 등

#### UserValue
- **목적**: 사용자가 입력해야 할 값 강조
- **스타일**: 빨간색 배경, 점선 테두리
- **사용처**: 마크다운 인라인 코드 변환

#### CodeView
- **목적**: 코드 블록 표시 및 복사
- **기능**: 신택스 하이라이팅, 줄 번호, 복사 버튼
- **지원 언어**: bash, python, javascript, json, yaml

### 3. AWS 컴포넌트 (AWS Components)

AWS 서비스 통합 컴포넌트들입니다.

#### CloudFormationTemplate
- **목적**: CloudFormation 템플릿 뷰어
- **기능**: YAML/JSON 표시, 다운로드, 검증
- **사용처**: 태스크 0 환경 구축

#### AWSButton
- **목적**: AWS 콘솔 직접 링크
- **기능**: 서비스별 콘솔 URL 생성
- **사용처**: 빠른 콘솔 접근

#### AWSServiceBadge
- **목적**: AWS 서비스 배지 표시
- **기능**: 서비스별 색상 코딩
- **사용처**: 실습 개요, 헤더

### 4. 레이아웃 컴포넌트 (Layout Components)

페이지 구조 및 네비게이션 컴포넌트들입니다.

#### AppLayout
- **목적**: 전체 애플리케이션 레이아웃
- **포함**: 헤더, 사이드바, 메인 콘텐츠, 푸터
- **기능**: 반응형, 다크모드 지원

#### Navigation
- **목적**: 주차별 네비게이션
- **기능**: 현재 위치 표시, 진도 표시
- **사용처**: 사이드바

#### Breadcrumbs
- **목적**: 현재 위치 표시
- **기능**: 클릭 가능한 경로
- **사용처**: 페이지 상단

---

## 📅 개발 우선순위

### Phase 1: 핵심 컴포넌트 (높음)

**목표**: 기본 실습 가이드 표시 가능

1. **UserValue** - 마크다운 변환 필수
2. **CodeView** - 코드 블록 표시 필수
3. **InfoCard** - 정보 강조 필수
4. **KeyPointsChecklist** - 학습 목표 표시

**완료 기준**: Week 1 실습 가이드 렌더링 가능

### Phase 2: 교육 기능 (높음)

**목표**: 인터랙티브 학습 기능 추가

1. **AdvancedSearchTerm** - 복사 기능
2. **SmartInputValue** - 입력값 복사
3. **TaskDescription** - 태스크 정보 표시
4. **ProgressTracker** - 진도 추적

**완료 기준**: 학생이 실습을 따라하며 진도 체크 가능

### Phase 3: AWS 통합 (보통)

**목표**: AWS 서비스 통합

1. **CloudFormationTemplate** - 템플릿 뷰어
2. **AWSButton** - 콘솔 링크
3. **AWSServiceBadge** - 서비스 배지

**완료 기준**: AWS 리소스 생성 가이드 완성

### Phase 4: 레이아웃 (보통)

**목표**: 전체 애플리케이션 구조

1. **AppLayout** - 전체 레이아웃
2. **Navigation** - 네비게이션
3. **Breadcrumbs** - 경로 표시

**완료 기준**: 전체 15주차 네비게이션 가능

### Phase 5: 고급 기능 (낮음)

**목표**: 사용자 경험 향상

1. **테마 시스템** - 라이트/다크 모드
2. **검색 기능** - 실습 검색
3. **북마크** - 즐겨찾기
4. **인쇄 최적화** - PDF 출력

**완료 기준**: 프로덕션 배포 준비

---

## 🔧 컴포넌트 개발 체크리스트

각 컴포넌트 개발 시 다음을 확인하세요:

### 기본 요구사항
- [ ] TypeScript 인터페이스 정의
- [ ] Props 타입 명시
- [ ] 기본값 설정
- [ ] 에러 처리

### 스타일링
- [ ] CSS 파일 생성 (인라인 스타일 금지)
- [ ] CloudScape CSS 변수 사용
- [ ] 다크모드 지원
- [ ] 반응형 디자인

### 접근성
- [ ] ARIA 속성 추가
- [ ] 키보드 네비게이션
- [ ] 스크린 리더 지원
- [ ] 색상 대비 4.5:1 이상

### 테스트
- [ ] 단위 테스트 작성
- [ ] 렌더링 테스트
- [ ] 접근성 테스트
- [ ] 속성 기반 테스트 (필요시)

### 문서화
- [ ] JSDoc 주석
- [ ] 사용 예시
- [ ] Props 설명
- [ ] Storybook 스토리 (선택)

---

## 📊 컴포넌트 복잡도

### 간단 (1-2일)
- UserValue
- AWSServiceBadge
- Breadcrumbs

### 보통 (3-5일)
- InfoCard
- AdvancedSearchTerm
- SmartInputValue
- TaskDescription

### 복잡 (1주)
- CodeView
- KeyPointsChecklist
- ProgressTracker
- Navigation

### 매우복잡 (2주)
- CloudFormationTemplate
- AppLayout
- 테마 시스템

---

## 🔗 관련 문서

### Steering 문서 (작업 방법)
- `.kiro/steering/development-guide.md` - 개발 가이드
- `.kiro/steering/cloudscape-integration.md` - CloudScape 통합
- `.kiro/steering/code-review-system.md` - 검증 시스템

### 다른 Specs 문서
- `project-architecture-specification.md` - 프로젝트 구조
- `lab-files-specification.md` - 실습 파일 목록
- `content-completion-status.md` - 작성 현황

---

**마지막 업데이트**: 2025-02-11  
**버전**: 1.0.0
