# Tasks

## Overview

이 문서는 Cost Alert Generation System의 구현 작업을 정의합니다. 각 태스크는 requirements.md와 design.md에 정의된 사양을 구현하는 구체적인 작업입니다.

## Task Status Legend

- ⬜ **pending**: 작업 대기 중
- 🟦 **in_progress**: 작업 진행 중
- ✅ **completed**: 작업 완료
- ❌ **blocked**: 작업 차단됨

---

## Task 1: 프로젝트 구조 및 의존성 설정

**Status**: ⬜ pending

**Description**: TypeScript 프로젝트 초기 설정 및 필요한 라이브러리 설치

**Requirements**: N/A (Infrastructure)

**Acceptance Criteria**:

- [ ] TypeScript 프로젝트 초기화 (tsconfig.json)
- [ ] 필요한 npm 패키지 설치:
  - `js-yaml`: CloudFormation YAML 파싱
  - `marked`: Markdown 파싱
  - `fast-check`: Property-based testing
  - `jest`: Unit testing
  - `@types/*`: TypeScript 타입 정의
- [ ] 프로젝트 폴더 구조 생성:
  ```
  src/
    parsers/
      cloudformation-parser.ts
      guide-parser.ts
      cost-alert-parser.ts
    generators/
      alert-generator.ts
      pretty-printer.ts
    database/
      pricing-database.ts
    batch/
      batch-processor.ts
    types/
      index.ts
    utils/
      file-utils.ts
  tests/
    unit/
    property/
  data/
    pricing/
      ap-northeast-2.json
      us-east-1.json
  ```
- [ ] package.json 스크립트 설정 (build, test, lint)

**Estimated Time**: 1-2 hours

---

## Task 2: 타입 정의 작성

**Status**: ⬜ pending

**Description**: 시스템 전체에서 사용할 TypeScript 인터페이스 및 타입 정의

**Requirements**: All (타입은 모든 요구사항의 기반)

**Design Reference**: Data Models 섹션

**Acceptance Criteria**:

- [ ] `SessionInfo` 인터페이스 정의
- [ ] `Resource` 인터페이스 정의
- [ ] `PriceInfo` 인터페이스 정의 (다중 컴포넌트 지원)
- [ ] `CostAlert` 인터페이스 정의
- [ ] `ResourceRow` 인터페이스 정의 (유연한 비용 단위)
- [ ] `BatchResult` 인터페이스 정의
- [ ] `ValidationResult` 인터페이스 정의
- [ ] `Region` 타입 정의 ("ap-northeast-2" | "us-east-1")
- [ ] `PricingUnit` 타입 정의 ("시간" | "1K 토큰" | "100만 요청" | "GB/월")
- [ ] 모든 타입에 JSDoc 주석 추가

**Estimated Time**: 2-3 hours

**Dependencies**: Task 1

---

## Task 3: CloudFormation YAML 파서 구현

**Status**: ⬜ pending

**Description**: CloudFormation 템플릿을 파싱하여 IaC 리소스 추출

**Requirements**: Requirement 1 (CloudFormation 템플릿 분석)

**Design Reference**: Component 2 (CloudFormation Parser), Algorithm 2

**Acceptance Criteria**:

- [ ] YAML 파일 읽기 및 파싱
- [ ] Resources 섹션에서 모든 리소스 추출
- [ ] CloudFormation 타입을 AWS 서비스명으로 매핑:
  - `AWS::EC2::Instance` → `Amazon EC2`
  - `AWS::RDS::DBInstance` → `Amazon RDS`
  - `AWS::Lambda::Function` → `AWS Lambda`
  - `AWS::DynamoDB::Table` → `Amazon DynamoDB`
  - `AWS::ElastiCache::CacheCluster` → `Amazon ElastiCache`
  - 기타 일반적인 서비스 타입 (최소 20개)
- [ ] Properties에서 사양 추출 (InstanceType, DBInstanceClass 등)
- [ ] 파싱 오류 시 graceful degradation (빈 배열 반환 + 로그)
- [ ] 모든 추출된 리소스에 `isIaC: true` 설정

**Test Coverage**:

- Unit tests: 최소 5개 (EC2, RDS, Lambda, DynamoDB, 오류 케이스)
- Property test: CloudFormation YAML round-trip (Property 1)

**Estimated Time**: 4-6 hours

**Dependencies**: Task 2

---

## Task 4: 가이드 Markdown 파서 구현

**Status**: ⬜ pending

**Description**: 가이드 마크다운 파일에서 수동 생성 리소스 추출

**Requirements**: Requirement 2 (가이드 파일 분석)

**Design Reference**: Component 3 (Guide Parser), Algorithm 3

**Acceptance Criteria**:

- [ ] Markdown 파일 읽기 및 파싱
- [ ] 태스크 섹션 추출 (## 태스크 1, ## 태스크 2 등)
- [ ] 적극적 접근: AWS 서비스 언급 시 추출
- [ ] 서비스 패턴 매칭 (정규식):
  - Amazon EC2, RDS, S3, DynamoDB, ElastiCache, Bedrock, CloudFront
  - AWS Lambda, IAM, CloudFormation, Glue, Config, X-Ray
  - NAT Gateway, VPC Endpoint, API Gateway, EventBridge
  - CodeBuild, CodePipeline, GuardDuty, Secrets Manager
- [ ] 컨텍스트에서 사양 추출 (200자 반경):
  - 인스턴스 타입: t3.micro, db.t3.micro, cache.t3.micro
  - Bedrock 모델: Claude 3 Haiku, Claude 3 Sonnet
  - 스토리지 크기: 8GB, 100GB
- [ ] 중복 제거 (동일 서비스 + 사양)
- [ ] 모든 추출된 리소스에 `isIaC: false` 설정

**Test Coverage**:

- Unit tests: 최소 5개 (다양한 서비스, 사양 추출, 중복 제거)
- Property test: 완전한 리소스 추출 (Property 4)

**Estimated Time**: 6-8 hours

**Dependencies**: Task 2

---

## Task 5: 가격 데이터베이스 구축

**Status**: ⬜ pending

**Description**: ap-northeast-2 및 us-east-1 리전의 AWS 온디맨드 가격 정보 수집 및 데이터베이스 구축

**Requirements**: Requirement 3 (AWS 요금 정보 수집)

**Design Reference**: Component 4 (Pricing Database)

**Acceptance Criteria**:

- [ ] ap-northeast-2 가격 데이터 수집 (JSON 파일):
  - Amazon EC2 (t3.nano, t3.micro, t3.small, t3.medium, t3.large)
  - Amazon RDS MySQL (db.t3.micro, db.t3.small, db.t3.medium)
  - Amazon ElastiCache Redis (cache.t3.micro, cache.t3.small)
  - NAT Gateway (시간당 + 데이터 처리)
  - AWS Lambda (요청 + GB-초)
  - Amazon DynamoDB (무료 티어)
  - Amazon S3 (GB/월)
  - 기타 일반적인 서비스 (최소 15개 서비스)
- [ ] us-east-1 가격 데이터 수집 (JSON 파일):
  - Amazon Bedrock (Claude 3 Haiku, Sonnet - 입력/출력 토큰)
  - 기타 서비스 (ap-northeast-2와 동일)
- [ ] 가격 조회 함수 구현:
  - `getPrice(serviceName, specification, region): PriceInfo`
  - `getPricingUrl(serviceName): string`
- [ ] 다중 컴포넌트 리소스 지원 (Bedrock 입력/출력)
- [ ] 무료 티어 리소스 표시
- [ ] 알 수 없는 리소스 처리 (플래그 + 로그)

**Data Sources**:

- [AWS Pricing Calculator](https://calculator.aws/)
- [Amazon EC2 Pricing](https://aws.amazon.com/ec2/pricing/)
- [Amazon RDS Pricing](https://aws.amazon.com/rds/pricing/)
- [Amazon Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)
- 기타 서비스별 공식 요금 페이지

**Test Coverage**:

- Unit tests: 최소 10개 (각 서비스별 가격 조회, 무료 티어, 오류 케이스)
- Property test: 가격 조회 정확성 (Property 6), 무료 티어 식별 (Property 7)

**Estimated Time**: 8-12 hours (데이터 수집 시간 포함)

**Dependencies**: Task 2

---

## Task 6: Alert Generator 구현

**Status**: ⬜ pending

**Description**: 리소스 및 가격 정보를 기반으로 표준 형식의 비용 Alert 생성

**Requirements**: Requirement 4 (비용 Alert 생성), Requirement 5 (실무 팁 생성), Requirement 6 (표준 형식 준수)

**Design Reference**: Component 5 (Alert Generator), Algorithm 5

**Acceptance Criteria**:

- [ ] Alert 제목 생성 (리전 포함)
- [ ] 다중 컴포넌트 리소스 확장 (Bedrock 입력/출력 분리)
- [ ] 리소스 테이블 생성:
  - 컬럼: 리소스명 | 타입/사양 | IaC | 비용
  - IaC 마커: ✅ (CloudFormation) / ❌ (수동)
  - 유연한 비용 형식: `$0.0126/시간`, `$0.00025/1K 토큰`
- [ ] 시간당 총 비용 계산 (시간당 과금 리소스만)
- [ ] 예상 실습 시간 포함 (기본 1-2시간)
- [ ] 무료 플랜 안내 포함
- [ ] 실무 팁 생성:
  - NAT Gateway: VPC Endpoint 대안 제안
  - RDS/ElastiCache: 사용하지 않을 때 중지 권장
  - Bedrock: 토큰 사용 최적화 팁
  - Lambda: 실행 시간 최적화 팁
- [ ] 인스턴스 타입 경고 (EC2/RDS/ElastiCache 사용 시)
- [ ] 리전별 가격 차이 면책 조항
- [ ] AWS 요금 페이지 링크 포함

**Test Coverage**:

- Unit tests: 최소 8개 (IaC only, 수동 only, 혼합, 고비용 팁, 특수 케이스)
- Property tests:
  - Alert 마크다운 생성 (Property 8)
  - IaC 마커 정확성 (Property 9)
  - 총 비용 계산 (Property 10)
  - 완전한 Alert 구조 (Property 11)
  - 고비용 리소스 팁 (Property 12)
  - 테이블 컬럼 정렬 (Property 15)

**Estimated Time**: 6-8 hours

**Dependencies**: Task 2, Task 5

---

## Task 7: Cost Alert Parser 구현

**Status**: ⬜ pending

**Description**: 생성된 비용 Alert 마크다운을 구조화된 데이터로 파싱

**Requirements**: Requirement 9 (Parser와 Pretty Printer)

**Design Reference**: Component 6 (Cost Alert Parser), Algorithm 6

**Acceptance Criteria**:

- [ ] 마크다운 파싱:
  - Alert 제목 및 리전 추출
  - 리소스 테이블 파싱 (유연한 비용 형식 지원)
  - 메타데이터 추출 (예상 시간, 총 비용)
  - 팁 및 경고 추출
  - 면책 조항 및 링크 추출
- [ ] `CostAlert` 객체 생성
- [ ] 파싱 오류 시 상세한 에러 메시지 (라인 번호 포함)
- [ ] 유효성 검증:
  - 필수 섹션 존재 여부
  - 테이블 형식 정확성
  - 비용 형식 정확성

**Test Coverage**:

- Unit tests: 최소 5개 (유효한 Alert, 누락된 섹션, 잘못된 형식)
- Property test: Round-trip (Property 21)

**Estimated Time**: 4-6 hours

**Dependencies**: Task 2, Task 6

---

## Task 8: Pretty Printer 구현

**Status**: ⬜ pending

**Description**: `CostAlert` 객체를 표준 형식의 마크다운으로 출력

**Requirements**: Requirement 9 (Parser와 Pretty Printer)

**Design Reference**: Component 6 (Pretty Printer), Algorithm 7

**Acceptance Criteria**:

- [ ] `CostAlert` 객체를 마크다운으로 변환
- [ ] 표준 형식 준수:
  - `> [!COST]` Alert 타입
  - 제목 및 리전
  - 테이블 (정렬: left, left, center, right)
  - 메타데이터 (예상 시간, 총 비용)
  - 무료 플랜, 팁, 경고, 면책 조항, 링크
- [ ] 유연한 비용 형식 지원 (시간당, 토큰당 등)
- [ ] Round-trip 속성 보장: `parse(print(alert)) ≈ alert`

**Test Coverage**:

- Unit tests: 최소 3개 (표준 리소스, 토큰 기반, 혼합)
- Property test: Round-trip (Property 21)

**Estimated Time**: 3-4 hours

**Dependencies**: Task 2, Task 7

---

## Task 9: Batch Processor 구현

**Status**: ⬜ pending

**Description**: 32개 세션을 순차적으로 처리하는 배치 프로세서

**Requirements**: Requirement 7 (배치 처리)

**Design Reference**: Component 1 (Batch Processor), Algorithm 1

**Acceptance Criteria**:

- [ ] 세션 메타데이터 로드 (week, session, title, region, 파일 경로)
- [ ] 32개 세션 순차 처리 (Week 1-1 ~ Week 14-3)
- [ ] 각 세션별 처리:
  - CloudFormation 파싱 (있는 경우)
  - 가이드 파싱 (있는 경우)
  - 리소스 병합
  - 가격 정보 추가
  - Alert 생성
  - 검증
  - 출력 (파일 또는 콘솔)
- [ ] Graceful degradation:
  - CloudFormation 파싱 실패 → 가이드만 사용
  - 가이드 파싱 실패 → CloudFormation만 사용
  - 둘 다 실패 → 오류 로그 + 다음 세션 계속
- [ ] 배치 결과 리포트:
  - 총 처리 세션 수
  - 성공/실패 수
  - 수동 검토 필요 세션 목록
  - 오류 목록
  - 리소스 통계 (총 리소스, IaC, 수동, 무료, 유료)
- [ ] 진행 상황 로깅 (콘솔 출력)

**Test Coverage**:

- Unit tests: 최소 5개 (단일 세션, 누락 파일, 오류 처리)
- Property tests:
  - 배치 처리 완전성 (Property 16)
  - 누락 파일 처리 (Property 17)

**Estimated Time**: 6-8 hours

**Dependencies**: Task 3, Task 4, Task 5, Task 6

---

## Task 10: 검증 시스템 구현

**Status**: ⬜ pending

**Description**: 생성된 Alert의 정확성 및 완전성 검증

**Requirements**: Requirement 8 (데이터 검증)

**Design Reference**: Error Handling 섹션

**Acceptance Criteria**:

- [ ] Pre-generation 검증:
  - 모든 리소스 타입이 인식된 AWS 서비스인지 확인
  - 모든 리소스에 가격 정보가 있는지 확인
  - 모든 리소스에 IaC 플래그가 설정되었는지 확인
- [ ] Post-generation 검증:
  - Alert 마크다운 문법 유효성
  - 필수 섹션 존재 여부
  - 테이블 형식 정확성
  - 비용 계산 정확성 (명시된 총 비용 = 계산된 총 비용)
  - IaC 마커 정확성 (✅ 또는 ❌)
- [ ] 검증 결과 리포트:
  - 오류 목록 (세션 ID, 오류 타입, 메시지)
  - 경고 목록 (수동 검토 필요)
  - 검증 통과 여부
- [ ] 검증 실패 시 액션:
  - Critical: 처리 중단, Alert 출력 안 함
  - Warning: Alert 출력 + 수동 검토 플래그
  - Info: 로그만 기록

**Test Coverage**:

- Unit tests: 최소 8개 (각 검증 규칙별)
- Property tests:
  - 검증 완전성 (Property 18)
  - 비용 계산 검증 (Property 19)

**Estimated Time**: 4-6 hours

**Dependencies**: Task 6, Task 7

---

## Task 11: Unit Tests 작성

**Status**: ⬜ pending

**Description**: 모든 컴포넌트에 대한 단위 테스트 작성

**Requirements**: All

**Design Reference**: Testing Strategy 섹션

**Acceptance Criteria**:

- [ ] CloudFormation Parser: 최소 5개 테스트
- [ ] Guide Parser: 최소 5개 테스트
- [ ] Pricing Database: 최소 10개 테스트
- [ ] Alert Generator: 최소 8개 테스트
- [ ] Cost Alert Parser: 최소 5개 테스트
- [ ] Pretty Printer: 최소 3개 테스트
- [ ] Batch Processor: 최소 5개 테스트
- [ ] Validation: 최소 8개 테스트
- [ ] 총 최소 49개 unit tests
- [ ] Line coverage: 80% 이상
- [ ] Branch coverage: 75% 이상
- [ ] Critical path coverage: 100%

**Estimated Time**: 8-12 hours

**Dependencies**: Task 3-10

---

## Task 12: Property-Based Tests 작성

**Status**: ⬜ pending

**Description**: fast-check를 사용한 속성 기반 테스트 작성

**Requirements**: All

**Design Reference**: Testing Strategy 섹션, Correctness Properties

**Acceptance Criteria**:

- [ ] Property 1: CloudFormation YAML round-trip
- [ ] Property 2: 완전한 리소스 추출 (CloudFormation)
- [ ] Property 4: 완전한 리소스 추출 (가이드)
- [ ] Property 6: 가격 조회 정확성
- [ ] Property 7: 무료 티어 식별
- [ ] Property 8: Alert 마크다운 생성
- [ ] Property 9: IaC 마커 정확성
- [ ] Property 10: 총 비용 계산
- [ ] Property 11: 완전한 Alert 구조
- [ ] Property 12: 고비용 리소스 팁
- [ ] Property 15: 테이블 컬럼 정렬
- [ ] Property 16: 배치 처리 완전성
- [ ] Property 17: 누락 파일 처리
- [ ] Property 18: 검증 완전성
- [ ] Property 19: 비용 계산 검증
- [ ] Property 21: Cost Alert round-trip
- [ ] Property 23: Bedrock 리전 감지
- [ ] Property 24: 리전별 가격
- [ ] 각 property test: 최소 100회 반복
- [ ] 모든 테스트에 Feature 및 Property 태그 포함

**Estimated Time**: 10-15 hours

**Dependencies**: Task 3-10

---

## Task 13: 32개 세션 비용 Alert 생성

**Status**: ⬜ pending

**Description**: 모든 세션에 대해 비용 Alert를 생성하고 검증

**Requirements**: All

**Acceptance Criteria**:

- [ ] 세션 메타데이터 파일 생성 (sessions.json):
  - Week 1-1 ~ Week 14-3 (32개 세션)
  - 각 세션: week, session, title, region, 파일 경로
- [ ] Batch Processor 실행
- [ ] 생성된 Alert 검토:
  - 각 Alert가 표준 형식을 따르는지 확인
  - 가격 정보가 정확한지 확인
  - 팁 및 경고가 적절한지 확인
- [ ] 수동 검토 필요 세션 처리:
  - 알 수 없는 리소스 타입 확인
  - 누락된 가격 정보 추가
  - Alert 수정 및 재생성
- [ ] 최종 Alert 파일 출력:
  - 각 세션별 개별 파일 또는
  - 통합 리포트 파일
- [ ] 배치 처리 리포트 생성:
  - 성공/실패 통계
  - 리소스 통계
  - 비용 통계 (평균, 최소, 최대)

**Estimated Time**: 4-6 hours (수동 검토 시간 포함)

**Dependencies**: Task 9, Task 10, Task 11, Task 12

---

## Task 14: 문서화 및 README 작성

**Status**: ⬜ pending

**Description**: 시스템 사용법 및 유지보수 가이드 작성

**Acceptance Criteria**:

- [ ] README.md 작성:
  - 프로젝트 개요
  - 설치 방법
  - 사용 방법 (배치 처리 실행)
  - 가격 데이터 업데이트 방법
  - 새로운 AWS 서비스 추가 방법
- [ ] API 문서 생성 (TypeDoc 또는 JSDoc)
- [ ] 예제 코드 제공
- [ ] 문제 해결 가이드
- [ ] 기여 가이드 (새로운 서비스 추가, 버그 리포트)

**Estimated Time**: 3-4 hours

**Dependencies**: Task 13

---

## Task 15: 14-1 가이드 비용 Alert 업데이트

**Status**: ⬜ pending

**Description**: Week 14-1 가이드의 비용 Alert를 표 형식으로 변경

**Requirements**: Requirement 4 (비용 Alert 생성)

**Acceptance Criteria**:

- [ ] 기존 불릿 포인트 형식 제거
- [ ] 표 형식으로 변경:
  ```markdown
  | 리소스명 | 타입/사양 | IaC | 비용 |
  | Amazon Bedrock | Claude 3 Haiku (입력) | ❌ | $0.00025/1K 토큰 |
  | Amazon Bedrock | Claude 3 Haiku (출력) | ❌ | $0.00125/1K 토큰 |
  ```
- [ ] 제목 업데이트: "리소스 운영 비용 가이드 (us-east-1 기준, 온디맨드 요금 기준)"
- [ ] 실무 팁 유지
- [ ] 면책 조항 업데이트: "**리전별로 요금이 다를 수 있습니다. 최신 요금은 아래 링크에서 확인하세요.**"
- [ ] 서비스별 요금 링크 추가 (Amazon Bedrock)
- [ ] 가이드 검증 (마크다운 문법, 내용 정확성)

**Estimated Time**: 1 hour

**Dependencies**: Task 13

---

## Task 16: 원본 비용 Alert 가이드 업데이트

**Status**: ⬜ pending

**Description**: `.kiro/steering/markdown-guide/10-cost-alert-guide.md` 파일을 새로운 표 형식 표준으로 업데이트

**Requirements**: All

**Acceptance Criteria**:

- [ ] 표준 형식을 불릿 포인트에서 표 형식으로 변경
- [ ] IaC 컬럼 설명 추가
- [ ] 제목 형식 업데이트: "리소스 운영 비용 가이드 (리전 기준, 온디맨드 요금 기준)"
- [ ] 비용 표기 형식 업데이트: "$0.017/시간" (금액 먼저)
- [ ] 다중 컴포넌트 리소스 예시 추가 (Bedrock)
- [ ] 면책 조항 형식 업데이트 (굵은 글씨 + 서비스별 링크)
- [ ] 모든 예시를 새로운 표 형식으로 변경
- [ ] 작성 규칙 섹션 업데이트
- [ ] 체크리스트 업데이트
- [ ] 배치 위치 가이드라인 유지
- [ ] 톤 및 스타일 가이드 유지

**Estimated Time**: 2-3 hours

**Dependencies**: Task 13

---

## Summary

**Total Tasks**: 16
**Estimated Total Time**: 72-103 hours

**Critical Path**:

1. Task 1 (프로젝트 설정)
2. Task 2 (타입 정의)
3. Task 3, 4, 5 (파서 및 데이터베이스) - 병렬 가능
4. Task 6 (Alert Generator)
5. Task 7, 8 (Parser & Pretty Printer) - 병렬 가능
6. Task 9 (Batch Processor)
7. Task 10 (검증)
8. Task 11, 12 (테스트) - 병렬 가능
9. Task 13 (Alert 생성)
10. Task 14, 15, 16 (문서화 및 가이드 업데이트) - 병렬 가능

**Recommended Order**:

- Phase 1 (Foundation): Task 1, 2
- Phase 2 (Core Components): Task 3, 4, 5 (병렬)
- Phase 3 (Generation): Task 6, 7, 8 (일부 병렬)
- Phase 4 (Integration): Task 9, 10
- Phase 5 (Testing): Task 11, 12 (병렬)
- Phase 6 (Production): Task 13, 14, 15, 16 (일부 병렬)

**Next Steps**:

1. 스펙 검토 및 승인
2. Task 1부터 순차적으로 구현 시작
3. 각 태스크 완료 시 status를 ✅ completed로 업데이트
4. 문제 발생 시 ❌ blocked로 표시하고 해결 방법 논의
