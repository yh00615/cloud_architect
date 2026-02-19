# 📋 다음 단계 명세 (Next Steps Specification)

**문서 타입**: Specification  
**작성일**: 2025-02-12  
**목적**: 3가지 옵션의 완료 현황 분석 및 다음 작업 우선순위 정의

---

## 📊 3가지 옵션 완료 현황 요약

### 옵션 1: 미작성 가이드 작성 ✅ 100% 완료

**상태**: 모든 가이드 작성 완료

**완료된 가이드 (5개)**:
1. ✅ **9-2**: `9-2-codebuild-container.md`
2. ✅ **12-3**: `12-3-guardduty-lambda-demo.md`
3. ✅ **13-3**: `13-3-container-insights-eks.md`
4. ✅ **14-1**: `14-1-rekognition-analysis.md`
5. ✅ **14-3**: `14-3-bedrock-agent-chatbot.md`

---

### 옵션 2: 기존 가이드 개선 ⚠️ 0% 완료 (명세만 작성됨)

**상태**: 명세 문서만 존재, 실제 개선 작업 미완료

**명세 파일**: `.kiro/specs/guide-improvement-specification.md`

**개선 필요 사항 (5개)**:
1. ❌ **태스크 0 추가** - CloudFormation 환경 구축 자동화
2. ❌ **태스크 수 축소** - 3-1 (10개→3-4개), 5-1 (7개→3-4개)
3. ❌ **계층 구조 적용** - 복잡한 태스크를 하위 단계로 분할
4. ❌ **리소스 정리 간소화** - CloudFormation 스택 삭제로 통합
5. ❌ **CONCEPT Alert 추가** - 4-1 데모 가이드에 개념 설명 추가

**분석 대상 가이드 (5개)**:
- `2-1-iam-role-assumerole.md` (실습) - 8개 태스크
- `3-1-vpc-design-strategy.md` (실습) - 10개 태스크
- `10-3-cloudfront-demo.md` (데모) - 5개 태스크
- `4-1-lambda-api-gateway-demo.md` (데모) - 5개 태스크
- `5-1-rds-multi-az.md` (실습) - 7개 태스크

---

### 옵션 3: UI/UX 개선 ⚠️ 0% 완료 (명세 없음)

**상태**: 명세 문서 없음, 작업 계획 없음

**관련 파일**: `.kiro/specs/ui-validation-next-steps.md` - 비어있음

---

## 🎯 권장 작업 순서

### 1단계: 옵션 2 완료 (기존 가이드 개선) ⭐⭐⭐ 최우선

**이유**:
- 명세가 이미 작성되어 있어 작업 범위가 명확함
- 28개 가이드의 품질을 크게 향상시킬 수 있음
- 학생 실습 시간 50% 단축 효과
- 환경 구축 오류 90% 감소 효과

**작업 내용**:

#### 1.1 CloudFormation 템플릿 작성 (5개)
- [ ] `week3-1-vpc-lab.yaml` - VPC 환경
- [ ] `week5-1-rds-lab.yaml` - VPC + 보안 그룹
- [ ] `week2-1-iam-lab.yaml` - IAM 기본 환경 (선택사항)
- [ ] `week4-1-lambda-lab.yaml` - Lambda 환경 (선택사항)
- [ ] `week10-3-cloudfront-lab.yaml` - S3 버킷 (선택사항)

#### 1.2 가이드 재작성 (5개)
- [ ] `3-1-vpc-design-strategy.md` - 태스크 0 추가, 10개→3-4개 축소
- [ ] `5-1-rds-multi-az.md` - 태스크 0 추가, 리소스 정리 간소화
- [ ] `4-1-lambda-api-gateway-demo.md` - CONCEPT Alert 추가
- [ ] `2-1-iam-role-assumerole.md` - 계층 구조 적용
- [ ] `10-3-cloudfront-demo.md` - 계층 구조 적용

#### 1.3 검증
- [ ] `npm run review:guides` 실행
- [ ] 표준 문구 47개 규칙 준수 확인

**예상 소요 시간**: 2-3일

---

### 2단계: 옵션 3 명세 작성 (UI/UX 개선) ⭐⭐

**작업 내용**:
- [ ] `.kiro/specs/ui-ux-improvement-specification.md` 작성
- [ ] 개선 항목 목록 작성
- [ ] 우선순위 정의

**예상 소요 시간**: 1일

---

### 3단계: 옵션 3 실행 (UI/UX 개선) ⭐

**작업 내용**: 2단계에서 작성한 명세에 따라 진행

---

## 📋 우선순위별 상세 작업

### 우선순위 1: 3-1-vpc-design-strategy.md 개선

**현재**: 10개 태스크, 태스크 0 없음, 리소스 정리 23단계

**개선 후**:
- 태스크 0: CloudFormation으로 VPC, 서브넷, IGW, NAT Gateway 자동 생성
- 태스크 1-3: VPC Endpoint 생성 및 테스트 (핵심 학습 목표)
- 리소스 정리: CloudFormation 스택 삭제 (5단계)

---

### 우선순위 2: 5-1-rds-multi-az.md 개선

**현재**: 7개 태스크, 태스크 0 없음, 리소스 정리 복잡

**개선 후**:
- 태스크 0: CloudFormation으로 VPC, 서브넷, 보안 그룹 자동 생성
- 태스크 1-3: RDS Multi-AZ 생성 및 테스트
- 리소스 정리: CloudFormation 스택 삭제 (간소화)

---

### 우선순위 3: 4-1-lambda-api-gateway-demo.md 개선

**현재**: CONCEPT Alert 없음 (데모인데 개념 설명 부족)

**개선 후**: CONCEPT Alert 추가 (태스크당 1-2개)

---

## 📊 예상 효과

### 옵션 2 완료 시

**학생 측면**:
- ✅ 실습 시간 50% 단축
- ✅ 환경 구축 오류 90% 감소
- ✅ 핵심 학습 목표에 집중
- ✅ 리소스 정리 시간 90% 단축

**교수 측면**:
- ✅ 가이드 품질 향상
- ✅ 학생 질문 감소
- ✅ 실습 진행 원활

---

## 🎯 최종 권장사항

### 즉시 시작 (1-2일 내)
1. **3-1-vpc-design-strategy.md 개선** (최우선)
2. **5-1-rds-multi-az.md 개선**

### 단기 (1주일 내)
3. **4-1-lambda-api-gateway-demo.md 개선**
4. **2-1-iam-role-assumerole.md 개선**
5. **10-3-cloudfront-demo.md 개선**

### 중기 (2주일 내)
6. **옵션 3 명세 작성**
7. **옵션 3 실행**

---

## 📝 체크리스트

### 옵션 1 ✅
- [x] 모든 가이드 작성 완료 (5개)

### 옵션 2 ⚠️
- [ ] CloudFormation 템플릿 작성
- [ ] 가이드 재작성
- [ ] 검증

### 옵션 3 ⚠️
- [ ] 명세 작성
- [ ] 실행

---

**마지막 업데이트**: 2025-02-12  
**버전**: 1.0.0
