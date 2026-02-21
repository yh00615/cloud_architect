# 비용 Alert 가이드 (Cost Alert Guide)

## 개요

[!COST] Alert는 실습에서 생성하는 AWS 리소스의 예상 비용을 학생들에게 안내하는 교육용 Alert입니다.
대학생 학습 맥락에 맞춰 부담 없이 비용 정보를 제공하면서, 실무에서 필요한 비용 관리 감각을 기를 수 있도록 설계되었습니다.

---

## 사용 목적

### 교육적 목적

- AWS 리소스별 비용 구조 이해
- 실무에서 필요한 비용 산정 능력 향상
- 클라우드 비용 최적화 개념 학습

### 실용적 목적

- 개인 계정 사용 시 예상 비용 파악
- 실습 후 리소스 정리의 중요성 인식
- 프리티어 범위 확인

---

## Alert 타입

### [!COST] - 리소스 비용

- **색상**: 연한 파란색 (info)
- **아이콘**: `status-info`
- **용도**: 리소스별 시간당/월간 비용 안내
- **톤**: 교육적, 정보 제공

---

## 표준 형식

### 기본 형식 (필수 요소)

```markdown
> [!COST]
> **리소스 운영 비용 가이드 (ap-northeast-2 기준, 온디맨드 요금 기준)**
>
> | 리소스명   | 타입/사양   | IaC |         비용 |
> | ---------- | ----------- | :-: | -----------: |
> | Amazon EC2 | t3.micro    | ✅  | $0.0126/시간 |
> | Amazon RDS | db.t3.micro | ✅  | $0.0170/시간 |
>
> - **예상 실습 시간**: 1-2시간
> - **예상 총 비용**: 약 $0.03-0.06/시간 (실무 환경 온디맨드 기준)
>
> **무료 플랜**
>
> 이 실습 비용은 AWS 가입 후 6개월 내 제공되는 크레딧에서 차감될 수 있습니다.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 아래 링크에서 확인하세요.**
>
> 📘 [Amazon EC2 요금](https://aws.amazon.com/ec2/pricing/) | 📘 [Amazon RDS 요금](https://aws.amazon.com/rds/pricing/) | 🧮 [AWS 요금 계산기](https://calculator.aws/)
```

### 필수 포함 요소

1. **제목 형식**: `**리소스 운영 비용 가이드 (리전 기준, 온디맨드 요금 기준)**`
2. **표 구조**: `| 리소스명 | 타입/사양 | IaC | 비용 |`
3. **IaC 컬럼**: ✅ (CloudFormation) / ❌ (수동)
4. **예상 총 비용**: 실무 환경 온디맨드 기준으로 계산 (프리티어 할인 제외)
5. **무료 플랜 섹션**: 크레딧 및 프리티어 정보 (교육용)
6. **면책 조항**: 굵은 글씨로 강조
7. **요금 링크**: 📘 이모지 + 파이프 구분, 요금 계산기는 🧮 이모지

---

## 사용 예시

### 예시 1: 표준 시간당 과금 리소스

```markdown
> [!COST]
> **리소스 운영 비용 가이드 (ap-northeast-2 기준, 온디맨드 요금 기준)**
>
> | 리소스명     | 타입/사양  | IaC |         비용 |
> | ------------ | ---------- | :-: | -----------: |
> | Amazon EC2   | t3.micro   | ✅  | $0.0126/시간 |
> | NAT Gateway  | N/A        | ✅  | $0.0590/시간 |
> | VPC Endpoint | S3 Gateway | ❌  |         무료 |
>
> - **예상 실습 시간**: 1-2시간
> - **예상 총 비용**: 약 $0.07-0.14/시간 (실무 환경 온디맨드 기준, 데이터 전송 비용 별도 발생 가능)
>
> **무료 플랜**
>
> 이 실습 비용은 AWS 가입 후 6개월 내 제공되는 크레딧에서 차감될 수 있습니다.
>
> **실무 팁**
>
> 💡 NAT Gateway는 비용이 높은 리소스입니다 (시간당 $0.059 + 데이터 처리 GB당 $0.059). 프로덕션 환경에서는 VPC Endpoint를 우선 고려하여 비용을 절감할 수 있습니다.
>
> **참고**
>
> ℹ️ 이 실습에서는 EC2 t3.micro 인스턴스를 사용합니다. 인스턴스 타입을 t3.small 이상으로 변경하면 비용이 2배 이상 증가할 수 있습니다.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 아래 링크에서 확인하세요.**
>
> 📘 [Amazon EC2 요금](https://aws.amazon.com/ec2/pricing/) | 📘 [Amazon VPC 요금](https://aws.amazon.com/vpc/pricing/) | 🧮 [AWS 요금 계산기](https://calculator.aws/)
```

### 예시 2: 토큰 기반 과금 (Bedrock)

```markdown
> [!COST]
> **리소스 운영 비용 가이드 (us-east-1 기준, 온디맨드 요금 기준)**
>
> | 리소스명       | 타입/사양             | IaC |             비용 |
> | -------------- | --------------------- | :-: | ---------------: |
> | Amazon Bedrock | Claude 3 Haiku (입력) | ❌  | $0.00025/1K 토큰 |
> | Amazon Bedrock | Claude 3 Haiku (출력) | ❌  | $0.00125/1K 토큰 |
>
> - **예상 실습 시간**: 30분-1시간
> - **예상 총 비용**: 약 $0.50-1.00 (프롬프트 테스트 20-30회 기준, 실무 환경 온디맨드 기준)
>
> **무료 플랜**
>
> 이 실습 비용은 AWS 가입 후 6개월 내 제공되는 크레딧에서 차감될 수 있습니다.
>
> **실무 팁**
>
> 💡 Amazon Bedrock은 사용한 토큰 수만큼만 비용이 발생합니다. 프롬프트를 간결하게 작성하고 불필요한 반복 테스트를 줄이면 비용을 절감할 수 있습니다.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 아래 링크에서 확인하세요.**
>
> 📘 [Amazon Bedrock 요금](https://aws.amazon.com/bedrock/pricing/) | 🧮 [AWS 요금 계산기](https://calculator.aws/)
```

### 예시 3: 서버리스 실습 (Lambda + DynamoDB)

```markdown
> [!COST]
> **리소스 운영 비용 가이드 (ap-northeast-2 기준, 온디맨드 요금 기준)**
>
> | 리소스명           | 타입/사양       | IaC |                비용 |
> | ------------------ | --------------- | :-: | ------------------: |
> | Amazon DynamoDB    | 온디맨드 테이블 | ✅  |                무료 |
> | Amazon DynamoDB    | 읽기 요청       | ✅  |    $0.25/100만 요청 |
> | Amazon DynamoDB    | 쓰기 요청       | ✅  |    $1.25/100만 요청 |
> | AWS Lambda         | Python 3.12     | ❌  |    $0.20/100만 요청 |
> | AWS Lambda         | 컴퓨팅 시간     | ❌  | $0.0000166667/GB-초 |
> | Amazon API Gateway | REST API        | ❌  |    $3.50/100만 요청 |
>
> - **예상 실습 시간**: 1-2시간
> - **예상 총 비용**: 약 $0.01-0.02 (실습 규모 100회 API 호출 기준, 실무 환경 온디맨드 기준)
>
> **무료 플랜**
>
> 이 실습 비용은 AWS 가입 후 6개월 내 제공되는 크레딧에서 차감될 수 있습니다.
>
> - AWS Lambda: 월 100만 건 요청 무료, 400,000 GB-초 무료
> - Amazon API Gateway: 월 100만 건 API 호출 무료 (12개월)
> - Amazon DynamoDB: 25GB 스토리지 무료
>
> **실무 팁**
>
> 💡 Lambda 함수의 메모리 설정과 실행 시간을 최적화하면 비용을 크게 절감할 수 있습니다. 불필요한 라이브러리 로딩을 줄이고 코드를 효율적으로 작성하세요.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 아래 링크에서 확인하세요.**
>
> 📘 [AWS Lambda 요금](https://aws.amazon.com/lambda/pricing/) | 📘 [Amazon API Gateway 요금](https://aws.amazon.com/api-gateway/pricing/) | 📘 [Amazon DynamoDB 요금](https://aws.amazon.com/dynamodb/pricing/) | 🧮 [AWS 요금 계산기](https://calculator.aws/)
```

### 예시 4: 데이터베이스 실습 (RDS + ElastiCache)

```markdown
> [!COST]
> **리소스 운영 비용 가이드 (ap-northeast-2 기준, 온디맨드 요금 기준)**
>
> | 리소스명           | 타입/사양              | IaC |         비용 |
> | ------------------ | ---------------------- | :-: | -----------: |
> | Amazon VPC         | N/A                    | ✅  |         무료 |
> | 프라이빗 서브넷    | N/A                    | ✅  |         무료 |
> | Amazon EC2         | t3.micro               | ✅  | $0.0126/시간 |
> | Amazon RDS         | db.t3.micro (MySQL)    | ✅  | $0.0170/시간 |
> | Amazon ElastiCache | cache.t3.micro (Redis) | ❌  | $0.0170/시간 |
>
> - **예상 실습 시간**: 1-2시간
> - **예상 총 비용**: 약 $0.05-0.09/시간 (실무 환경 온디맨드 기준, 데이터 전송 비용 별도 발생 가능)
>
> **무료 플랜**
>
> 이 실습 비용은 AWS 가입 후 6개월 내 제공되는 크레딧에서 차감될 수 있습니다.
>
> **실무 팁**
>
> 💡 RDS와 ElastiCache는 시간당 비용이 발생합니다. 개발 환경에서는 사용하지 않을 때 인스턴스를 중지하여 비용을 절감할 수 있습니다. 실습 후 반드시 리소스를 삭제하세요.
>
> **참고**
>
> ℹ️ 이 실습에서는 RDS db.t3.micro와 ElastiCache cache.t3.micro를 사용합니다. 인스턴스 타입을 변경하면 비용이 크게 증가할 수 있습니다.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 아래 링크에서 확인하세요.**
>
> 📘 [Amazon EC2 요금](https://aws.amazon.com/ec2/pricing/) | 📘 [Amazon RDS 요금](https://aws.amazon.com/rds/pricing/) | 📘 [Amazon ElastiCache 요금](https://aws.amazon.com/elasticache/pricing/) | 🧮 [AWS 요금 계산기](https://calculator.aws/)
```

---

## 작성 규칙

### 1. 제목 형식 (필수)

```markdown
**리소스 운영 비용 가이드 (리전 기준, 온디맨드 요금 기준)**
```

- 리전: `ap-northeast-2` 또는 `us-east-1`
- "온디맨드 요금 기준" 명시 필수

### 2. 표 구조 (필수)

```markdown
| 리소스명 | 타입/사양 | IaC | 비용 |
| -------- | --------- | :-: | ---: |
```

- **리소스명**: AWS 서비스 전체 이름 (Amazon S3, AWS Lambda, Amazon DynamoDB)
- **타입/사양**: 인스턴스 타입, 모델명, 또는 N/A
- **IaC**: ✅ (CloudFormation) / ❌ (수동)
- **비용**: 유연한 단위 지원 (`/시간`, `/1K 토큰`, `/100만 요청`, `/GB/월`)

### 3. 비용 형식

- **시간당**: `$0.0126/시간`
- **토큰당**: `$0.00025/1K 토큰`
- **요청당**: `$0.20/100만 요청`
- **스토리지**: `$0.025/GB/월`
- **무료**: `무료`

### 4. 예상 총 비용 계산

- **시간당 과금 리소스만 합산**: EC2, RDS, ElastiCache, NAT Gateway, EKS 등
- **프리티어 할인 제외**: 실무 온디맨드 환경 기준으로 계산
- **토큰/요청 기반 리소스 제외**: 총 비용에 포함하지 않음
- **표기**: `약 $0.05-0.09/시간 (실무 환경 온디맨드 기준)`

### 5. 무료 플랜 섹션

- 크레딧 차감 안내 필수
- 프리티어 상세 정보는 선택사항 (교육용)
- 비용 계산에는 영향 없음 (정보 제공만)

### 6. 실무 팁 (선택)

고비용 리소스 또는 최적화 기회가 있는 경우 추가:

- **고비용 리소스**: NAT Gateway, RDS, ElastiCache, EKS
- **최적화 가능**: Lambda, Bedrock, CloudFront, API Gateway, Glue, X-Ray, CodeBuild

형식: `💡 **실무 팁**: [구체적이고 실행 가능한 조언]`

### 7. 참고 섹션 (선택)

인스턴스 타입 사용 시 추가:

형식: `ℹ️ 이 실습에서는 [인스턴스 타입]을 사용합니다. 인스턴스 타입을 변경하면 비용이 크게 증가할 수 있습니다.`

### 8. 면책 조항 및 링크 (필수)

```markdown
**리전별로 요금이 다를 수 있습니다. 최신 요금은 아래 링크에서 확인하세요.**

📘 [서비스명 요금](링크) | 📘 [서비스명 요금](링크) | 🧮 [AWS 요금 계산기](https://calculator.aws/)
```

- 면책 조항은 굵은 글씨
- 📘 이모지: AWS 서비스별 요금 페이지
- 🧮 이모지: AWS 요금 계산기
- 파이프(`|`)로 구분

---

## 다중 컴포넌트 리소스

### Bedrock 입력/출력 토큰

Bedrock과 같이 입력/출력 토큰 가격이 다른 경우, 별도 행으로 분리:

```markdown
| Amazon Bedrock | Claude 3 Haiku (입력) | ❌ | $0.00025/1K 토큰 |
| Amazon Bedrock | Claude 3 Haiku (출력) | ❌ | $0.00125/1K 토큰 |
```

---

## 배치 위치

### 권장 위치 (Primary)

Front Matter 직후, 실습 개요 전:

```markdown
---
title: '실습 제목'
week: X
session: Y
---

> [!COST]
> **리소스 운영 비용 가이드 ...**

이 실습에서는 ...
```

### 선택 위치 (Optional)

1. **태스크 시작 전**: 특정 고비용 리소스 생성 전 사전 안내
2. **리소스 정리 섹션**: 비용 절감 중요성 강조

---

## 금지 사항

### ❌ 하지 말아야 할 것

- 경고(WARNING) 톤 사용 금지 → 정보(INFO) 톤 사용
- 과도한 비용 강조 금지 → 교육적 맥락 유지
- 정확하지 않은 비용 정보 금지 → AWS 공식 요금 페이지 확인
- 리전 명시 누락 금지 → 항상 리전 포함
- "온디맨드 요금 기준" 누락 금지 → 제목에 필수
- 프리티어 할인을 총 비용에 반영 금지 → 실무 온디맨드 기준
- 불릿 포인트 링크 사용 금지 → 이모지 + 파이프 구분 사용

### ❌ 잘못된 예시

```markdown
> [!WARNING]
> 이 실습은 비용이 많이 발생합니다! 주의하세요!
```

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - RDS: 약간의 비용 발생
> - 총 비용: 조금
```

```markdown
> [!COST]
>
> - [Amazon EC2 요금](링크)
> - [Amazon RDS 요금](링크)
```

---

## 비용 정보 출처

### AWS 공식 요금 페이지

- **Amazon EC2**: https://aws.amazon.com/ec2/pricing/
- **Amazon RDS**: https://aws.amazon.com/rds/pricing/
- **Amazon S3**: https://aws.amazon.com/s3/pricing/
- **AWS Lambda**: https://aws.amazon.com/lambda/pricing/
- **Amazon DynamoDB**: https://aws.amazon.com/dynamodb/pricing/
- **Amazon ElastiCache**: https://aws.amazon.com/elasticache/pricing/
- **Amazon VPC (NAT Gateway)**: https://aws.amazon.com/vpc/pricing/
- **Amazon Bedrock**: https://aws.amazon.com/bedrock/pricing/
- **Amazon EKS**: https://aws.amazon.com/eks/pricing/
- **Amazon CloudFront**: https://aws.amazon.com/cloudfront/pricing/
- **Amazon API Gateway**: https://aws.amazon.com/api-gateway/pricing/

### 비용 계산기

- **AWS Pricing Calculator**: https://calculator.aws/

---

## 체크리스트

### 작성 시 확인 사항

- [ ] 제목 형식: "리소스 운영 비용 가이드 (리전 기준, 온디맨드 요금 기준)"
- [ ] 표 구조 사용 (불릿 포인트 금지)
- [ ] IaC 컬럼 포함 (✅/❌)
- [ ] 리소스별 비용 정확히 표기
- [ ] 예상 총 비용: 실무 온디맨드 기준 (프리티어 할인 제외)
- [ ] 시간당 과금 리소스만 총 비용에 포함
- [ ] 무료 플랜 섹션 포함
- [ ] 면책 조항 굵은 글씨
- [ ] 요금 링크: 📘 이모지 + 파이프 구분
- [ ] AWS 요금 계산기 링크 포함 (🧮 이모지)
- [ ] 비용 정보가 최신인지 확인 (AWS 공식 페이지)
- [ ] 실무 팁 추가 (고비용 또는 최적화 가능 리소스)
- [ ] 참고 섹션 추가 (인스턴스 타입 사용 시)

---

## 실무 연계 팁

### 학생들에게 전달할 메시지

1. **비용 인식**: 클라우드 리소스는 사용한 만큼 비용이 발생합니다
2. **리소스 정리**: 실습 후 반드시 리소스를 삭제하세요
3. **비용 모니터링**: AWS Cost Explorer로 실시간 비용 확인
4. **예산 설정**: AWS Budgets로 예산 초과 알림 설정
5. **최적화**: 적절한 인스턴스 타입과 리전 선택
6. **실무 환경**: 프리티어는 학습용이며, 실무에서는 온디맨드 비용 발생

---

**마지막 업데이트**: 2025-02-21  
**버전**: 2.0.0
