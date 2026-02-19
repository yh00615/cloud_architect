---
문서 타입: Specification
작성일: 2025-02-07
버전: 1.0.0
---

# 프로젝트 아키텍처 명세 (Project Architecture Specification)

**문서 타입**: Specification  
**목적**: 대학교 실습 가이드 시스템의 구조, 철학, 개발 단계를 정의

---

## 📋 개요

이 문서는 대학교 AWS 실습 가이드 시스템의 **무엇을 만들지**에 대한 명세입니다.
- 프로젝트의 핵심 가치와 개발 원칙
- 시스템 아키텍처 및 구조
- 개발 단계별 구현 목록 (Phase 1-5)
- 컴포넌트 개발 우선순위

**작업 방법**은 `.kiro/steering/university-lab-guide-development.md`를 참조하세요.

---

## 🎯 개발 철학 및 원칙

### 핵심 가치

- **교육 우선**: 모든 기능은 학습 효과 극대화를 목표로 설계
- **최소 입력**: 복사-붙여넣기로 실수 없는 실습 환경 제공
- **점진적 학습**: 15주차 체계적 커리큘럼으로 단계별 성장
- **접근성 보장**: 모든 학생이 동등하게 학습할 수 있는 환경
- **한국어 우선**: 모든 사용자 대면 텍스트는 한국어로 작성

### 개발 원칙

1. **컴포넌트 우선 설계**: 재사용 가능한 교육용 컴포넌트 중심
2. **타입 안전성**: TypeScript로 런타임 오류 최소화
3. **성능 최적화**: 3초 이내 로딩으로 학습 집중도 유지
4. **테스트 주도**: 속성 기반 테스트로 정확성 보장

---

## 🏗️ 프로젝트 구조 및 아키텍처

### 디렉토리 구조

```
src/
├── components/
│   ├── educational/     # 교육 전용 컴포넌트
│   │   ├── InfoCard.tsx
│   │   ├── KeyPointsChecklist.tsx
│   │   └── ProgressTracker.tsx
│   ├── ui/             # 범용 UI 컴포넌트
│   │   ├── AdvancedSearchTerm.tsx
│   │   └── SmartInputValue.tsx
│   ├── aws/            # AWS 전용 컴포넌트
│   │   └── CloudFormationTemplate.tsx
│   └── layout/         # 레이아웃 컴포넌트
├── pages/
│   ├── Dashboard.tsx
│   ├── WeeklyGuide.tsx
│   └── weeks/          # 주차별 실습 페이지
├── contexts/           # React Context 상태 관리
├── data/              # 정적 데이터 및 타입 정의
├── hooks/             # 커스텀 훅
├── utils/             # 유틸리티 함수
└── styles/            # 글로벌 스타일
```

### 컴포넌트 명명 규칙

- **교육용 컴포넌트**: 명확한 교육 목적을 나타내는 이름 (InfoCard, KeyPointsChecklist)
- **AWS 컴포넌트**: AWS 서비스명 포함 (CloudFormationTemplate, EC2InstanceCard)
- **UI 컴포넌트**: 기능 중심 명명 (AdvancedSearchTerm, SmartInputValue)

---

## 📅 컴포넌트 개발 순서

1. **교육용 핵심 컴포넌트** (InfoCard, KeyPointsChecklist, AdvancedSearchTerm)
2. **진도 추적 시스템** (ProgressTracker, Dashboard)
3. **주차별 실습 페이지** (WeeklyGuide, 개별 주차 페이지)
4. **AWS 통합 컴포넌트** (CloudFormationTemplate, 배포 가이드)
5. **고급 기능** (테마 시스템, 접근성 향상)

---

## 🚀 개발 단계별 체크리스트

### Phase 1: 기반 구조

- [ ] Vite + React + TypeScript 프로젝트 설정
- [ ] CloudScape Design System 통합
- [ ] 기본 라우팅 및 레이아웃 구성
- [ ] 타입 정의 및 데이터 구조 설계
- [ ] 테스트 환경 설정 (Vitest + React Testing Library)
- [ ] 종합 검토 시스템 설정 (`npm run review` 실행 가능)

**목표**: 프로젝트 기반 인프라 완성

### Phase 2: 핵심 컴포넌트

- [ ] InfoCard 컴포넌트 구현 및 테스트
- [ ] AdvancedSearchTerm 복사 기능 구현
- [ ] KeyPointsChecklist 인터랙티브 기능
- [ ] ProgressTracker 진도 시각화
- [ ] 각 컴포넌트별 속성 기반 테스트 작성

**목표**: 재사용 가능한 교육용 컴포넌트 라이브러리 구축

### Phase 3: 페이지 및 네비게이션

- [ ] Dashboard 메인 페이지 구현
- [ ] WeeklyGuide 템플릿 페이지
- [ ] 주차 간 네비게이션 시스템
- [ ] 진도 추적 Context 구현
- [ ] 테마 시스템 (라이트/다크 모드)

**목표**: 사용자 경험 및 네비게이션 완성

### Phase 4: AWS 통합

- [ ] CloudFormation 템플릿 뷰어
- [ ] AWS 콘솔 링크 생성기
- [ ] 실습 스크립트 다운로드 기능
- [ ] 비용 및 시간 추정 표시
- [ ] 리소스 정리 가이드

**목표**: AWS 실습 환경 통합 완성

### Phase 5: 콘텐츠 및 최적화

- [ ] 15주차 실습 콘텐츠 작성
- [ ] 성능 최적화 (코드 스플리팅, 지연 로딩)
- [ ] 접근성 개선 (WCAG 2.1 AA 준수)
- [ ] 모바일 반응형 최적화
- [ ] E2E 테스트 작성

**목표**: 프로덕션 배포 준비 완료

---

## 📊 작업 분류 기준

### 우선순위

- **높음**: Phase 1-2 (기반 구조 및 핵심 컴포넌트)
- **보통**: Phase 3-4 (페이지 및 AWS 통합)
- **낮음**: Phase 5 (최적화 및 콘텐츠)

### 복잡도

- **간단**: 단일 컴포넌트, 명확한 요구사항
- **보통**: 여러 컴포넌트 통합, 상태 관리 필요
- **복잡**: 시스템 전체 영향, 아키텍처 변경
- **매우복잡**: 외부 시스템 통합, 성능 최적화

### 의존성

각 Phase는 이전 Phase 완료를 전제로 합니다:
- Phase 2 → Phase 1 완료 필요
- Phase 3 → Phase 2 완료 필요
- Phase 4 → Phase 3 완료 필요
- Phase 5 → Phase 4 완료 필요

---

## 🎯 품질 목표

### 배포 준비 기준

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

## 🔗 관련 문서

### Steering 문서 (작업 방법)

- `.kiro/steering/university-lab-guide-development.md` - 개발 가이드 (어떻게 만들지)
- `.kiro/steering/code-review-system.md` - 종합 검토 시스템
- `.kiro/steering/cloudscape-integration.md` - CloudScape 통합 방법
- `.kiro/steering/markdown-guide/` - 마크다운 가이드 작성법
  - `09-image-guidelines.md` - 이미지 및 스크린샷 가이드라인

### 다른 Specs 문서

- `lab-files-specification.md` - 실습 파일 목록 및 구조
- `content-completion-status.md` - 콘텐츠 작성 현황
- `guide-improvement-specification.md` - 가이드 개선 요구사항

---

**마지막 업데이트**: 2025-02-07  
**버전**: 1.0.0
