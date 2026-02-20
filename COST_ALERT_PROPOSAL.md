# 전체 차시별 비용 Alert 제안서

## 개요

전체 58개 실습/데모 가이드에 대한 비용 Alert 추가 제안입니다.
각 차시를 프리티어 범위 내, 소액 비용, 중간 비용, 고비용으로 분류하고, 표준 형식에 맞춰 비용 Alert를 작성합니다.

---

## 분류 기준

### 프리티어 범위 내 ($0)

- AWS 프리티어 한도 내에서 실습 가능
- 간단한 NOTE Alert로 처리

### 소액 비용 ($0.01-0.50)

- 실습 시간 1시간 기준 $0.50 이하
- 리소스별 비용 불릿 포인트로 명시

### 중간 비용 ($0.50-2.00)

- 실습 시간 1시간 기준 $2.00 이하
- 리소스별 비용 + 실무 팁 포함

### 고비용 ($2.00 이상)

- NAT Gateway, EKS, RDS 등 고비용 리소스
- 리소스별 비용 + 실무 팁 + 비용 절감 방법

---

## Week 1: 클라우드 서비스 디자인 개요

### 1-1: AWS Resource Groups & Tag Editor (데모)

- **분류**: 프리티어 범위 내
- **비용**: $0
- **Alert 타입**: NOTE
- **제안 Alert**:

```markdown
> [!NOTE]
> 이 실습에서는 AWS 리소스를 생성하지 않으므로 비용이 발생하지 않습니다.
```

### 1-2: AWS Well-Architected Tool (실습)

- **분류**: 프리티어 범위 내
- **비용**: $0
- **Alert 타입**: NOTE
- **제안 Alert**:

```markdown
> [!NOTE]
> 이 실습에서는 AWS Well-Architected Tool만 사용하며, 실제 리소스를 생성하지 않으므로 비용이 발생하지 않습니다.
```

### 1-3: draw.io 아키텍처 다이어그램 (실습)

- **분류**: 프리티어 범위 내
- **비용**: $0
- **Alert 타입**: NOTE
- **제안 Alert**:

```markdown
> [!NOTE]
> 이 실습에서는 AWS 리소스를 생성하지 않으므로 비용이 발생하지 않습니다.
```

---

## Week 2: AWS IAM 및 조직 관리 고급 전략

### 2-1: AWS IAM 정책 Condition 요소 (실습)

- **분류**: 프리티어 범위 내
- **비용**: $0
- **Alert 타입**: NOTE
- **제안 Alert**:

```markdown
> [!NOTE]
> 이 실습에서는 IAM 사용자, 정책, S3 버킷을 생성하지만 모두 프리티어 범위 내에서 무료로 사용할 수 있습니다.
```

### 2-2: AWS STS AssumeRole (실습)

- **분류**: 프리티어 범위 내
- **비용**: $0
- **Alert 타입**: NOTE
- **제안 Alert**:

```markdown
> [!NOTE]
> 이 실습에서는 IAM 역할, 정책, S3 버킷을 생성하지만 모두 프리티어 범위 내에서 무료로 사용할 수 있습니다.
```

---

## Week 3: Amazon VPC 고급 네트워킹

### 3-1: Amazon VPC Endpoint (실습)

- **분류**: 소액 비용
- **비용**: 약 $0.05-0.10
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - Amazon EC2 (t3.micro): 시간당 $0.0126 (프리티어: 월 750시간 무료)
> - VPC Gateway Endpoint (S3): 무료
> - 예상 실습 시간: 1시간
> - **예상 총 비용**: 약 $0.01 (프리티어 범위 내 가능)
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/vpc/pricing/)에서 확인하세요.**
```

### 3-2: 보안 그룹 및 NACL (실습)

- **분류**: 소액 비용
- **비용**: 약 $0.05-0.10
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - Amazon EC2 (t3.micro): 시간당 $0.0126 (프리티어: 월 750시간 무료)
> - 보안 그룹, NACL: 무료
> - 예상 실습 시간: 1시간
> - **예상 총 비용**: 약 $0.01 (프리티어 범위 내 가능)
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/vpc/pricing/)에서 확인하세요.**
```

---

## Week 4: 서버리스 및 이벤트 기반 아키텍처

### 4-2: Amazon API Gateway 인증 (실습)

- **분류**: 소액 비용
- **비용**: 약 $0.10-0.20
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - AWS Lambda: 100만 건당 $0.20 (프리티어: 월 100만 건 무료)
> - Amazon API Gateway: 100만 건당 $4.25 (프리티어: 월 100만 건 무료)
> - Amazon Cognito: MAU당 $0.0055 (프리티어: 월 50,000 MAU 무료)
> - Amazon DynamoDB: 25GB 스토리지 무료
> - 예상 실습 시간: 1시간
> - **예상 총 비용**: $0 (프리티어 범위 내)
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/api-gateway/pricing/)에서 확인하세요.**
```

### 4-3: Amazon EventBridge 예약 처리 (실습)

- **분류**: 프리티어 범위 내
- **비용**: $0
- **Alert 타입**: NOTE
- **제안 Alert**:

```markdown
> [!NOTE]
> 이 실습에서는 EventBridge, Lambda, DynamoDB를 사용하지만 모두 프리티어 범위 내에서 무료로 사용할 수 있습니다.
```

---

## Week 5: 고성능 데이터베이스 설계

### 5-1: Amazon RDS Multi-AZ (데모)

- **분류**: 중간 비용
- **비용**: 약 $0.50-1.00
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - Amazon RDS MySQL (db.t3.micro): 시간당 $0.017
> - Amazon RDS Read Replica (db.t3.micro): 시간당 $0.017
> - 스토리지 (20GB gp2): GB당 월 $0.138
> - 예상 실습 시간: 1-2시간
> - **예상 총 비용**: 약 $0.05-0.10
>
> 💡 **실무 팁**: RDS 인스턴스는 시간당 비용이 발생하므로 실습 후 즉시 삭제하는 것을 권장합니다.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/rds/pricing/)에서 확인하세요.**
```

### 5-3: Amazon DynamoDB 테이블 생성 (실습)

- **분류**: 프리티어 범위 내
- **비용**: $0
- **Alert 타입**: NOTE
- **제안 Alert**:

```markdown
> [!NOTE]
> 이 실습에서는 DynamoDB 테이블을 생성하지만 프리티어 범위 내에서 무료로 사용할 수 있습니다 (25GB 스토리지, 월 200만 건 읽기/쓰기).
```

---

## Week 6: IaC 기반 인프라 자동화

### 6-1: AWS CloudFormation 스택 생명주기 (데모)

- **분류**: 프리티어 범위 내
- **비용**: $0
- **Alert 타입**: NOTE
- **제안 Alert**:

```markdown
> [!NOTE]
> 이 실습에서는 CloudFormation으로 VPC 리소스를 생성하지만 VPC 자체는 무료입니다. 생성되는 리소스(VPC, 서브넷, 라우팅 테이블)는 비용이 발생하지 않습니다.
```

### 6-2: AWS CloudFormation 템플릿 분석 (실습)

- **분류**: 프리티어 범위 내
- **비용**: $0
- **Alert 타입**: NOTE
- **제안 Alert**:

```markdown
> [!NOTE]
> 이 실습에서는 CloudFormation으로 VPC 리소스를 생성하지만 모두 무료입니다.
```

### 6-3: AWS Infrastructure Composer (실습)

- **분류**: 프리티어 범위 내
- **비용**: $0
- **Alert 타입**: NOTE
- **제안 Alert**:

```markdown
> [!NOTE]
> 이 실습에서는 Infrastructure Composer로 서버리스 템플릿을 설계하지만 실제 리소스를 배포하지 않으므로 비용이 발생하지 않습니다.
```

---

## Week 7: 컨테이너 기반 아키텍처

### 7-3: kubectl을 활용한 Amazon EKS (실습)

- **분류**: 고비용
- **비용**: 약 $2.00-3.00
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - Amazon EKS 클러스터: 시간당 $0.10
> - Amazon EC2 (t3.medium, 관리형 노드 그룹 2개): 시간당 $0.0504 × 2 = $0.1008
> - 예상 실습 시간: 1-2시간
> - **예상 총 비용**: 약 $0.20-0.40
>
> 💡 **실무 팁**: EKS 클러스터는 시간당 $0.10의 비용이 발생하므로 실습 후 즉시 삭제하는 것을 권장합니다. 클러스터 삭제에 10-15분이 소요되므로 반드시 삭제 완료를 확인하세요.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/eks/pricing/)에서 확인하세요.**
```

---

## Week 9: CI/CD 파이프라인 구축

### 9-2: AWS CodeBuild 컨테이너 이미지 빌드 (실습)

- **분류**: 소액 비용
- **비용**: 약 $0.10-0.20
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - AWS CodeBuild (general1.small): 분당 $0.005
> - Amazon ECR 스토리지: GB당 월 $0.10 (프리티어: 월 500MB 무료)
> - 예상 빌드 시간: 5-10분
> - **예상 총 비용**: 약 $0.03-0.05
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/codebuild/pricing/)에서 확인하세요.**
```

### 9-3: AWS CodePipeline S3 정적 웹사이트 (실습)

- **분류**: 소액 비용
- **비용**: 약 $0.10-0.20
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - AWS CodePipeline: 파이프라인당 월 $1.00 (프리티어: 월 1개 무료)
> - AWS CodeBuild (general1.small): 분당 $0.005
> - Amazon S3 스토리지: GB당 월 $0.025 (프리티어: 5GB 무료)
> - 예상 실습 시간: 1시간
> - **예상 총 비용**: $0 (프리티어 범위 내)
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/codepipeline/pricing/)에서 확인하세요.**
```

---

## Week 10: 캐싱 및 성능 최적화

### 10-2: Amazon ElastiCache 캐싱 (실습)

- **분류**: 중간 비용
- **비용**: 약 $0.50-1.00
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - Amazon ElastiCache Redis (cache.t3.micro): 시간당 $0.017
> - Amazon RDS MySQL (db.t3.micro): 시간당 $0.017
> - AWS Lambda 호출: 100만 건당 $0.20 (실습에서는 무시 가능)
> - 예상 실습 시간: 1-2시간
> - **예상 총 비용**: 약 $0.05-0.10
>
> 💡 **실무 팁**: ElastiCache와 RDS는 시간당 비용이 발생하므로 실습 후 즉시 삭제하는 것을 권장합니다.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/elasticache/pricing/)에서 확인하세요.**
```

### 10-3: Amazon CloudFront CDN 배포 (실습)

- **분류**: 소액 비용
- **비용**: 약 $0.10-0.20
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - Amazon S3 스토리지: GB당 월 $0.025 (프리티어: 5GB 무료)
> - Amazon CloudFront 데이터 전송: GB당 $0.085 (프리티어: 월 1TB 무료)
> - CloudFront 요청: 10,000건당 $0.0075 (프리티어: 월 1,000만 건 무료)
> - 예상 실습 시간: 1시간
> - **예상 총 비용**: $0 (프리티어 범위 내)
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/cloudfront/pricing/)에서 확인하세요.**
```

---

## Week 11: 데이터 레이크 및 분석 파이프라인

### 11-2: AWS Glue Crawler 설정 (실습)

- **분류**: 소액 비용
- **비용**: 약 $0.10-0.30
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - AWS Glue Crawler: 시간당 $0.44 (DPU 기준)
> - AWS Glue Data Catalog: 처음 100만 개 객체 무료
> - Amazon Athena 쿼리: 스캔한 데이터 TB당 $5.00 (프리티어: 월 10GB 무료)
> - Amazon S3 스토리지: GB당 월 $0.025 (프리티어: 5GB 무료)
> - 예상 실습 시간: 1시간
> - **예상 총 비용**: 약 $0.10-0.20
>
> 💡 **실무 팁**: Glue Crawler는 실행 시간에 따라 비용이 발생하므로 필요한 경우에만 실행하세요.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/glue/pricing/)에서 확인하세요.**
```

### 11-3: AWS Glue 데이터 파이프라인 (실습)

- **분류**: 소액 비용
- **비용**: 약 $0.20-0.50
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - AWS Glue ETL Job: DPU-시간당 $0.44
> - Amazon Athena 쿼리: 스캔한 데이터 TB당 $5.00
> - Amazon S3 스토리지: GB당 월 $0.025 (프리티어: 5GB 무료)
> - 예상 실습 시간: 1시간
> - **예상 총 비용**: 약 $0.20-0.40
>
> 💡 **실무 팁**: Glue ETL Job은 DPU 사용량에 따라 비용이 발생하므로 작은 데이터셋으로 테스트하는 것을 권장합니다.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/glue/pricing/)에서 확인하세요.**
```

---

## Week 12: 보안 자동화 및 컴플라이언스

### 12-1: AWS Secrets Manager 자격증명 관리 (실습)

- **분류**: 소액 비용
- **비용**: 약 $0.10-0.20
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - AWS Secrets Manager: 시크릿당 월 $0.40
> - AWS Systems Manager Parameter Store (Standard): 무료
> - 예상 실습 시간: 1시간
> - **예상 총 비용**: 약 $0.01-0.02 (일할 계산)
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/secrets-manager/pricing/)에서 확인하세요.**
```

### 12-2: AWS Config 규칙 생성 (실습)

- **분류**: 소액 비용
- **비용**: 약 $0.10-0.30
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - AWS Config: 규칙당 월 $2.00 (처음 2개 규칙 무료)
> - AWS Config 기록: 항목당 $0.003
> - Amazon S3 스토리지: GB당 월 $0.025 (프리티어: 5GB 무료)
> - 예상 실습 시간: 1시간
> - **예상 총 비용**: 약 $0.05-0.10
>
> 💡 **실무 팁**: AWS Config는 활성화된 시간에 따라 비용이 발생하므로 실습 후 Configuration Recorder를 중지하는 것을 권장합니다.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/config/pricing/)에서 확인하세요.**
```

### 12-3: Amazon GuardDuty와 Lambda 자동 대응 (데모)

- **분류**: 소액 비용
- **비용**: 약 $0.10-0.20
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - Amazon GuardDuty: 처음 30일 무료, 이후 분석된 이벤트 수에 따라 과금
> - AWS Lambda: 100만 건당 $0.20 (프리티어: 월 100만 건 무료)
> - Amazon EventBridge: 무료
> - 예상 실습 시간: 1시간
> - **예상 총 비용**: $0 (프리티어 범위 내)
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/guardduty/pricing/)에서 확인하세요.**
```

---

## Week 13: 관측성 아키텍처 설계

### 13-2: AWS X-Ray 서버리스 추적 (실습)

- **분류**: 프리티어 범위 내
- **비용**: $0
- **Alert 타입**: NOTE
- **제안 Alert**:

```markdown
> [!NOTE]
> 이 실습에서는 AWS X-Ray, Lambda, DynamoDB를 사용하지만 모두 프리티어 범위 내에서 무료로 사용할 수 있습니다 (X-Ray: 월 100,000 트레이스 무료).
```

### 13-3: Amazon CloudWatch Container Insights (데모)

- **분류**: 중간 비용
- **비용**: 약 $1.00-2.00
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (ap-northeast-2 기준)**
>
> - Amazon EKS 클러스터: 시간당 $0.10
> - Amazon EC2 (t3.medium, 관리형 노드 그룹 2개): 시간당 $0.0504 × 2 = $0.1008
> - Amazon CloudWatch Container Insights: 수집된 메트릭에 따라 과금
> - 예상 실습 시간: 1-2시간
> - **예상 총 비용**: 약 $0.20-0.40
>
> 💡 **실무 팁**: EKS 클러스터는 시간당 $0.10의 비용이 발생하므로 실습 후 즉시 삭제하는 것을 권장합니다.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/cloudwatch/pricing/)에서 확인하세요.**
```

---

## Week 14: 지능형 클라우드 서비스 설계

### 14-1: Amazon Bedrock 프롬프트 엔지니어링 (실습)

- **분류**: 중간 비용
- **비용**: 약 $0.50-1.00
- **Alert 타입**: COST (이미 적용됨)
- **현재 상태**: ✅ 이미 비용 Alert가 적용되어 있음

### 14-2: Amazon Bedrock Knowledge Bases RAG (데모)

- **분류**: 중간 비용
- **비용**: 약 $1.00-2.00
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (us-east-1 기준)**
>
> - Claude 3 Haiku: 입력 1,000 토큰당 $0.00025, 출력 1,000 토큰당 $0.00125
> - Amazon OpenSearch Serverless: 시간당 $0.24 (OCU 기준)
> - Amazon S3 스토리지: GB당 월 $0.023 (프리티어: 5GB 무료)
> - 예상 실습 시간: 1-2시간
> - **예상 총 비용**: 약 $0.50-1.00
>
> 💡 **실무 팁**: OpenSearch Serverless는 시간당 비용이 발생하므로 실습 후 즉시 삭제하는 것을 권장합니다.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/bedrock/pricing/)에서 확인하세요.**
```

### 14-3: Amazon Bedrock Agents 챗봇 (실습)

- **분류**: 중간 비용
- **비용**: 약 $0.50-1.00
- **Alert 타입**: COST
- **제안 Alert**:

```markdown
> [!COST]
> **리소스 비용 (us-east-1 기준)**
>
> - Claude 3 Haiku: 입력 1,000 토큰당 $0.00025, 출력 1,000 토큰당 $0.00125
> - Amazon Bedrock Agent: 요청당 $0.00025
> - AWS Lambda: 100만 건당 $0.20 (프리티어: 월 100만 건 무료)
> - Amazon DynamoDB: 25GB 스토리지 무료
> - 예상 실습 시간: 1시간
> - **예상 총 비용**: 약 $0.30-0.50
>
> 💡 **실무 팁**: Bedrock Agent는 요청당 비용이 발생하므로 불필요한 테스트를 줄이면 비용을 절감할 수 있습니다.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 [AWS 요금 페이지](https://aws.amazon.com/bedrock/pricing/)에서 확인하세요.**
```

---

## 요약

### 분류별 차시 수

- **프리티어 범위 내 ($0)**: 15개 차시
  - Week 1: 1-1, 1-2, 1-3
  - Week 2: 2-1, 2-2
  - Week 4: 4-3
  - Week 5: 5-3
  - Week 6: 6-1, 6-2, 6-3
  - Week 9: 9-3
  - Week 10: 10-3
  - Week 12: 12-3
  - Week 13: 13-2

- **소액 비용 ($0.01-0.50)**: 10개 차시
  - Week 3: 3-1, 3-2
  - Week 4: 4-2
  - Week 9: 9-2
  - Week 11: 11-2, 11-3
  - Week 12: 12-1, 12-2

- **중간 비용 ($0.50-2.00)**: 6개 차시
  - Week 5: 5-1
  - Week 10: 10-2
  - Week 13: 13-3
  - Week 14: 14-1, 14-2, 14-3

- **고비용 ($2.00 이상)**: 1개 차시
  - Week 7: 7-3

### 다음 단계

1. 사용자 검토 및 피드백
2. 승인된 차시에 대해 비용 Alert 일괄 적용
3. 각 가이드 파일에 표준 형식에 맞춰 Alert 추가
4. 최종 검증 및 커밋

---

**작성일**: 2025-02-20  
**버전**: 1.0.0
