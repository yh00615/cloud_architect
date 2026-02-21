# 비용 Alert 최종 형태 예시

이 문서는 Cost Alert Generation System이 생성할 비용 Alert의 최종 형태를 보여줍니다.
각 시나리오별로 실제 마크다운 가이드에 삽입될 형태 그대로 제시합니다.

---

## 시나리오 1: 표준 시간당 과금 리소스 (CloudFormation + 수동)

**적용 차시**: Week 3-1 (Amazon VPC Endpoint 생성)

**리소스 구성**:

- CloudFormation: VPC, 서브넷, EC2, NAT Gateway
- 수동 생성: VPC Endpoint

### 최종 형태

```markdown
> [!COST]
> **리소스 운영 비용 가이드 (ap-northeast-2 기준, 온디맨드 요금 기준)**
>
> | 리소스명               | 타입/사양 | IaC |         비용 |
> | ---------------------- | --------- | :-: | -----------: |
> | Amazon VPC             | N/A       | ✅  |         무료 |
> | 퍼블릭 서브넷          | N/A       | ✅  |         무료 |
> | 프라이빗 서브넷        | N/A       | ✅  |         무료 |
> | Amazon EC2             | t3.micro  | ✅  | $0.0126/시간 |
> | NAT Gateway            | N/A       | ✅  |  $0.059/시간 |
> | VPC Endpoint (Gateway) | S3        | ❌  |         무료 |
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

---

## 시나리오 2: 토큰 기반 과금 (Bedrock)

**적용 차시**: Week 14-1 (Amazon Bedrock 프롬프트 엔지니어링)

**리소스 구성**:

- 수동 생성: Amazon Bedrock (Claude 3 Haiku)

### 최종 형태

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

---

## 시나리오 3: 데이터베이스 실습 (RDS + ElastiCache)

**적용 차시**: Week 10-2 (Amazon ElastiCache 캐싱)

**리소스 구성**:

- CloudFormation: VPC, 서브넷, EC2, RDS MySQL
- 수동 생성: ElastiCache Redis

### 최종 형태

```markdown
> [!COST]
> **리소스 운영 비용 가이드 (ap-northeast-2 기준, 온디맨드 요금 기준)**
>
> | 리소스명           | 타입/사양              | IaC |         비용 |
> | ------------------ | ---------------------- | :-: | -----------: |
> | Amazon VPC         | N/A                    | ✅  |         무료 |
> | 프라이빗 서브넷    | N/A                    | ✅  |         무료 |
> | Amazon EC2         | t3.micro               | ✅  | $0.0126/시간 |
> | Amazon RDS         | db.t3.micro (MySQL)    | ✅  |  $0.017/시간 |
> | Amazon ElastiCache | cache.t3.micro (Redis) | ❌  |  $0.017/시간 |
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

## 시나리오 4: 서버리스 실습 (Lambda + DynamoDB + API Gateway)

**적용 차시**: Week 4-2 (Amazon API Gateway 인증 구성)

**리소스 구성**:

- CloudFormation: DynamoDB, IAM 역할
- 수동 생성: Lambda 함수, API Gateway

### 최종 형태

```markdown
> [!COST]
> **리소스 운영 비용 가이드 (ap-northeast-2 기준, 온디맨드 요금 기준)**
>
> | 리소스명           | 타입/사양     | IaC |                비용 |
> | ------------------ | ------------- | :-: | ------------------: |
> | Amazon DynamoDB    | 25GB 스토리지 | ✅  |                무료 |
> | AWS IAM            | 역할 및 정책  | ✅  |                무료 |
> | AWS Lambda         | Python 3.12   | ❌  |    $0.20/100만 요청 |
> | AWS Lambda         | 컴퓨팅 시간   | ❌  | $0.0000166667/GB-초 |
> | Amazon API Gateway | REST API      | ❌  |    $3.50/100만 요청 |
>
> - **예상 실습 시간**: 1-2시간
> - **예상 총 비용**: 약 $0.01-0.02 (실무 환경 온디맨드 기준, 실습 규모 100회 API 호출 기준)
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

---

## 시나리오 5: 수동 생성만 (CloudFormation 없음)

**적용 차시**: Week 5-3 (Amazon DynamoDB 테이블 생성)

**리소스 구성**:

- 수동 생성: DynamoDB 테이블

### 최종 형태

```markdown
> [!COST]
> **리소스 운영 비용 가이드 (ap-northeast-2 기준, 온디맨드 요금 기준)**
>
> | 리소스명        | 타입/사양       | IaC |             비용 |
> | --------------- | --------------- | :-: | ---------------: |
> | Amazon DynamoDB | 온디맨드 테이블 | ❌  |             무료 |
> | Amazon DynamoDB | 읽기 요청       | ❌  | $0.25/100만 요청 |
> | Amazon DynamoDB | 쓰기 요청       | ❌  | $1.25/100만 요청 |
>
> - **예상 실습 시간**: 1시간
> - **예상 총 비용**: 약 $0.01 (실무 환경 온디맨드 기준, 실습 규모 1,000회 읽기/쓰기 기준)
>
> **무료 플랜**
>
> 이 실습 비용은 AWS 가입 후 6개월 내 제공되는 크레딧에서 차감될 수 있습니다.
>
> - Amazon DynamoDB: 25GB 스토리지 무료
> - 읽기 요청: 월 2억 5천만 건 무료
> - 쓰기 요청: 월 2억 5천만 건 무료
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 아래 링크에서 확인하세요.**
>
> 📘 [Amazon DynamoDB 요금](https://aws.amazon.com/dynamodb/pricing/) | 🧮 [AWS 요금 계산기](https://calculator.aws/)
```

---

## 시나리오 6: 복합 과금 모델 (S3 + CloudFront + Lambda@Edge)

**적용 차시**: Week 10-3 (Amazon CloudFront CDN 배포)

**리소스 구성**:

- 수동 생성: S3 버킷, CloudFront 배포

### 최종 형태

```markdown
> [!COST]
> **리소스 운영 비용 가이드 (ap-northeast-2 기준, 온디맨드 요금 기준)**
>
> | 리소스명          | 타입/사양            | IaC |                비용 |
> | ----------------- | -------------------- | :-: | ------------------: |
> | Amazon S3         | 스토리지             | ❌  |        $0.025/GB/월 |
> | Amazon S3         | PUT 요청             | ❌  |   $0.005/1,000 요청 |
> | Amazon S3         | GET 요청             | ❌  |  $0.0004/1,000 요청 |
> | Amazon CloudFront | 데이터 전송 (아시아) | ❌  |           $0.140/GB |
> | Amazon CloudFront | HTTP 요청            | ❌  | $0.0075/10,000 요청 |
>
> - **예상 실습 시간**: 1-2시간
> - **예상 총 비용**: 약 $0.01-0.05 (실습 규모 1GB 스토리지 + 10GB 데이터 전송 기준, 실무 환경 온디맨드 기준)
>
> **무료 플랜**
>
> 이 실습 비용은 AWS 가입 후 6개월 내 제공되는 크레딧에서 차감될 수 있습니다.
>
> **실무 팁**
>
> 💡 CloudFront는 데이터 전송량에 따라 비용이 발생합니다. 캐싱 정책을 최적화하여 오리진(S3) 요청을 줄이면 비용을 절감할 수 있습니다. TTL(Time To Live) 설정을 적절히 조정하세요.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 아래 링크에서 확인하세요.**
>
> 📘 [Amazon S3 요금](https://aws.amazon.com/s3/pricing/) | 📘 [Amazon CloudFront 요금](https://aws.amazon.com/cloudfront/pricing/) | 🧮 [AWS 요금 계산기](https://calculator.aws/)
```

---

## 시나리오 7: EKS 클러스터 (고비용 리소스)

**적용 차시**: Week 7-3 (kubectl을 활용한 Amazon EKS 클러스터 운영)

**리소스 구성**:

- 수동 생성: EKS 클러스터, 관리형 노드 그룹

### 최종 형태

```markdown
> [!COST]
> **리소스 운영 비용 가이드 (ap-northeast-2 기준, 온디맨드 요금 기준)**
>
> | 리소스명              | 타입/사양            | IaC |         비용 |
> | --------------------- | -------------------- | :-: | -----------: |
> | Amazon EKS            | 클러스터             | ❌  |   $0.10/시간 |
> | Amazon EC2            | t3.medium (노드 2개) | ❌  | $0.0504/시간 |
> | Amazon VPC            | N/A                  | ❌  |         무료 |
> | Elastic Load Balancer | Classic LB           | ❌  |  $0.027/시간 |
>
> - **예상 실습 시간**: 1-2시간
> - **예상 총 비용**: 약 $0.18-0.36/시간 (실무 환경 온디맨드 기준, 데이터 전송 비용 별도 발생 가능)
>
> **무료 플랜**
>
> 이 실습 비용은 AWS 가입 후 6개월 내 제공되는 크레딧에서 차감될 수 있습니다.
>
> **실무 팁**
>
> 💡 Amazon EKS 클러스터는 시간당 $0.10의 고정 비용이 발생합니다. 실습 후 반드시 클러스터를 삭제하세요. 클러스터 삭제에 10-15분이 소요되므로 삭제 명령 실행 후 완료를 확인한 후 퇴실하세요.
>
> 💡 노드 그룹의 인스턴스 타입과 개수를 조정하여 비용을 최적화할 수 있습니다. 개발 환경에서는 t3.small 또는 t3.medium을 사용하고, 프로덕션에서는 워크로드에 맞는 인스턴스를 선택하세요.
>
> **참고**
>
> ℹ️ 이 실습에서는 t3.medium 인스턴스 2개를 사용합니다. 인스턴스 타입이나 개수를 변경하면 비용이 크게 증가할 수 있습니다.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 아래 링크에서 확인하세요.**
>
> 📘 [Amazon EKS 요금](https://aws.amazon.com/eks/pricing/) | 📘 [Amazon EC2 요금](https://aws.amazon.com/ec2/pricing/) | 📘 [Elastic Load Balancing 요금](https://aws.amazon.com/elasticloadbalancing/pricing/) | 🧮 [AWS 요금 계산기](https://calculator.aws/)
```

---

## 형식 규칙 요약

### 필수 요소

1. **Alert 타입**: `> [!COST]`
2. **제목**: `**리소스 운영 비용 가이드 (리전 기준, 온디맨드 요금 기준)**`
3. **표 구조**:
   ```
   | 리소스명 | 타입/사양 | IaC | 비용 |
   |---------|----------|:---:|----------:|
   ```
4. **예상 시간 및 총 비용**:
   - `- **예상 실습 시간**: X시간`
   - `- **예상 총 비용**: 약 $X.XX/시간 (실무 환경 온디맨드 기준, 데이터 전송 비용 별도 발생 가능)`
5. **무료 플랜 안내**: 크레딧 차감 문구
6. **면책 조항**: 굵은 글씨 + 서비스별 링크

### 선택 요소

1. **실무 팁**: 고비용 리소스 또는 최적화 기회가 있는 경우
2. **참고**: 인스턴스 타입 경고 (EC2/RDS/ElastiCache 사용 시)
3. **무료 플랜 상세**: 프리티어 범위 내 실습인 경우

### 표기 규칙

- **IaC 마커**: ✅ (CloudFormation) / ❌ (수동)
- **비용 형식**: `$0.0126/시간`, `$0.00025/1K 토큰`, `$0.20/100만 요청`
- **무료 리소스**: `무료`
- **정렬**: 리소스명(left), 타입/사양(left), IaC(center), 비용(right)
- **링크 형식**: 📘 이모지 + 파이프(`|`) 구분자, 요금 계산기는 🧮 이모지
  - 예: `📘 [Amazon EC2 요금](링크) | 📘 [Amazon RDS 요금](링크) | 🧮 [AWS 요금 계산기](링크)`

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

**마지막 업데이트**: 2025-02-21  
**버전**: 1.0.0
