---
inclusion: auto
description: 커리큘럼 데이터 비교 규칙 - curriculum.ts와 Excel 데이터 일치성 검증
---

# 커리큘럼 데이터 비교 규칙

## 🚨 최우선 규칙: curriculum.ts는 절대 수정 금지

**curriculum.ts는 진실의 원천(Source of Truth)입니다.**

### 절대 금지 사항
- ❌ **curriculum.ts를 수정하지 마세요** (명시적인 지시가 없는 한)
- ❌ session type 변경 금지 ('lab' ↔ 'demo' 등)
- ❌ title 변경 금지
- ❌ markdownPath 변경 금지
- ❌ awsServices 변경 금지

### 불일치 발견 시 올바른 대응
- ✅ **마크다운 파일을 curriculum.ts에 맞춰 수정**
- ✅ **파일명을 curriculum.ts에 맞춰 변경**
- ✅ **Front Matter를 curriculum.ts에 맞춰 수정**
- ❌ curriculum.ts를 마크다운에 맞춰 수정 (절대 금지)

### 예시: 잘못된 대응 vs 올바른 대응

**상황**: curriculum.ts에 `type: 'lab'`인데 파일명이 `-demo.md`

❌ **잘못된 대응**:
```typescript
// curriculum.ts 수정 (금지!)
type: 'demo'  // ← 이렇게 하면 안 됨!
```

✅ **올바른 대응**:
```bash
# 파일명 변경
mv 1-2-well-architected-tool-demo.md 1-2-well-architected-tool-lab.md

# curriculum.ts의 markdownPath도 확인 및 수정 (파일명 변경 시)
markdownPath: '/content/week1/1-2-well-architected-tool-lab.md'
```

---

## 응답 언어
- **모든 응답은 한국어로만 작성합니다**
- 영어 응답 금지
- 기술 용어는 한국어 우선, 필요시 영어 병기 (예: "파운데이션 모델(Foundation Model)")

## 데이터 소스
- **엑셀 파일**: 실습 계획서 원본 (교수 제공)
- **curriculum.ts**: 코드에서 사용하는 커리큘럼 데이터

## 비교 결과 요약

### ✅ 일치하는 항목
1. **주차 구조**: 15주차 (1-7주차, 8주차 중간고사, 9-14주차, 15주차 기말고사)
2. **주차별 제목**: 모든 주차 제목 일치
3. **세션 타입**: theory, lab, demo, none 일치
4. **세션 제목**: 대부분 일치

### ⚠️ 차이점

#### 1. Week 1-2 (엑셀: "AWS Well-Architected Framework" / curriculum.ts: "AWS Well-Architected Tool 워크로드 평가")
- **엑셀**: "AWS Well-Architected Framework"
- **curriculum.ts**: "AWS Well-Architected Tool 워크로드 평가"
- **판단**: curriculum.ts가 더 구체적이고 정확함 (실제 실습 내용 반영)

#### 2. Week 1-3 (엑셀: "AWS 클라우드 아키텍처 패턴" / curriculum.ts: "draw.io로 HA 아키텍처 다이어그램 작성")
- **엑셀**: "AWS 클라우드 아키텍처 패턴"
- **curriculum.ts**: "draw.io로 HA 아키텍처 다이어그램 작성"
- **판단**: curriculum.ts가 더 구체적이고 정확함 (실제 실습 내용 반영)

#### 3. Week 4-2 (엑셀: "API 기반 아키텍처 설계" / curriculum.ts: "Amazon API Gateway 인증 구성")
- **엑셀**: "API 기반 아키텍처 설계"
- **curriculum.ts**: "Amazon API Gateway 인증 구성"
- **판단**: curriculum.ts가 더 구체적 (실제 실습 내용 반영)

#### 4. Week 6-3 (엑셀: "AWS IaC 도구 비교와 활용" / curriculum.ts: "Infrastructure Composer를 활용한 템플릿 설계")
- **엑셀**: "AWS IaC 도구 비교와 활용"
- **curriculum.ts**: "Infrastructure Composer를 활용한 템플릿 설계"
- **판단**: curriculum.ts가 더 구체적 (실제 실습 내용 반영)

#### 5. Week 10-2 (엑셀: "Amazon ElastiCache 캐싱" / curriculum.ts: "캐싱 전략 및 무효화 패턴")
- **엑셀**: "Amazon ElastiCache 캐싱"
- **curriculum.ts**: "캐싱 전략 및 무효화 패턴"
- **판단**: 엑셀이 더 명확함 (서비스 중심)

#### 6. Week 11-1 (엑셀: "데이터 유형과 파이프라인 개요" / curriculum.ts: "데이터 레이크 기초")
- **엑셀**: "데이터 유형과 파이프라인 개요"
- **curriculum.ts**: "데이터 레이크 기초"
- **판단**: 엑셀이 더 구체적

#### 7. Week 11-2 (엑셀: "AWS 데이터 레이크 구성" / curriculum.ts: "AWS Glue Crawler 설정 및 Amazon Athena 쿼리")
- **엑셀**: "AWS 데이터 레이크 구성"
- **curriculum.ts**: "AWS Glue Crawler 설정 및 Amazon Athena 쿼리"
- **판단**: curriculum.ts가 더 구체적 (실제 실습 내용 반영)

#### 8. Week 11-3 (엑셀: "AWS 데이터 파이프라인 구축" / curriculum.ts: "AWS Glue를 활용한 데이터 파이프라인 구축")
- **엑셀**: "AWS 데이터 파이프라인 구축"
- **curriculum.ts**: "AWS Glue를 활용한 데이터 파이프라인 구축"
- **판단**: curriculum.ts가 더 구체적

#### 9. Week 14-3 (엑셀: "AI 에이전트 자동화 서비스" / curriculum.ts: "Amazon Bedrock Agent 기반 고객 지원 챗봇")
- **엑셀**: "AI 에이전트 자동화 서비스"
- **curriculum.ts**: "Amazon Bedrock Agent 기반 고객 지원 챗봇"
- **판단**: curriculum.ts가 더 구체적 (실제 실습 내용 반영)

## 작업 규칙

### 1. 제목 수정 시
- **curriculum.ts를 기준으로 합니다** (실제 구현된 내용 반영)
- 마크다운 파일의 Front Matter `title` 필드도 curriculum.ts와 일치시킵니다
- 엑셀은 참고용이며, curriculum.ts가 더 구체적이고 정확합니다

### 2. 제목 작성 원칙
- **구체적이고 실습 내용을 반영**: "AWS Well-Architected Tool 워크로드 평가" (O) vs "AWS Well-Architected Framework" (X)
- **서비스명 명시**: "Amazon API Gateway 인증 구성" (O) vs "API 기반 아키텍처 설계" (X)
- **실습 도구 명시**: "draw.io로 HA 아키텍처 다이어그램 작성" (O) vs "AWS 클라우드 아키텍처 패턴" (X)

### 3. 검증 순서
1. curriculum.ts 확인 (최우선)
2. 마크다운 파일 Front Matter 확인
3. 엑셀 데이터 참고 (보조)

### 4. 불일치 발견 시
- curriculum.ts를 정답으로 간주
- 마크다운 파일을 curriculum.ts에 맞춰 수정
- 엑셀은 업데이트하지 않음 (참고용)

## 예시

### ❌ 잘못된 제목 (엑셀 기준)
```yaml
---
title: "AWS Well-Architected Framework"
week: 1
session: 2
---
```

### ✅ 올바른 제목 (curriculum.ts 기준)
```yaml
---
title: "AWS Well-Architected Tool 워크로드 평가"
week: 1
session: 2
---
```

## 주의사항
- 엑셀 데이터는 초기 계획서이며, curriculum.ts는 실제 구현된 내용입니다
- 실습 가이드 작성 시 curriculum.ts를 기준으로 합니다
- 제목 불일치 발견 시 curriculum.ts에 맞춰 수정합니다
