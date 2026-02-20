# 리소스 정리 가이드 (Resource Cleanup Guide)

## 개요

실습 가이드의 리소스 정리 섹션 작성 표준입니다.
학생들이 실습 후 모든 AWS 리소스를 완전히 삭제하여 불필요한 비용 발생을 방지하도록 안내합니다.

---

## 핵심 원칙

### 1. Tag Editor 활용

**삭제 전/후 리소스 확인을 위해 Tag Editor를 적극 활용합니다.**

- 삭제 전: 어떤 리소스가 생성되었는지 확인
- 삭제 후: 모든 리소스가 정리되었는지 최종 검증

### 2. 옵션 제공 (수동 vs CLI)

**학생의 숙련도에 따라 두 가지 삭제 방법을 제공합니다.**

- **옵션 1**: AWS 콘솔에서 수동 삭제 (권장, 초보자)
- **옵션 2**: AWS CloudShell 스크립트로 일괄 삭제 (숙련자)

### 3. CloudFormation 우선 원칙

**태스크 0에서 CloudFormation으로 생성한 리소스는 스택 삭제로 정리합니다.**

- 수동 생성 리소스 먼저 삭제
- CloudFormation 스택 마지막에 삭제
- 스택 삭제 실패 시 상세한 문제 해결 방법 제공

---

## 표준 구조

### 기본 템플릿 (4단계)

```markdown
## 리소스 정리

> [!WARNING]
> 다음 단계를 **반드시 수행**하여 불필요한 비용을 방지하세요.

---

### 1. Tag Editor로 생성된 리소스 확인

[리소스 확인 단계]

---

### 2. 리소스 삭제

[옵션 1/옵션 2 제공]

---

### 3. CloudFormation 스택 삭제

[스택 삭제 단계]

---

### 4. 최종 삭제 확인 (Tag Editor 활용)

[Tag Editor로 최종 검증]

✅ **실습 종료**: 모든 리소스가 정리되었습니다.
```

### 필수 포함 요소

1. **WARNING Alert**: 리소스 정리 섹션 시작 부분에 필수
2. **구분선 (`---`)**: 각 주요 단계 사이에 삽입
3. **Tag Editor 확인**: 삭제 전/후 리소스 확인
4. **옵션 1/옵션 2**: 수동 삭제 vs CLI 스크립트
5. **CloudFormation 스택 삭제**: 상세한 단계별 안내
6. **완료 메시지**: `✅ **실습 종료**: 모든 리소스가 정리되었습니다.`

---

## 리소스별 삭제 순서

### 원칙: 의존성 역순 삭제

**의존하는 리소스 → 의존되는 리소스 순서로 삭제**

### 일반적인 삭제 순서

1. **애플리케이션 계층**
   - Lambda 함수
   - API Gateway
   - Load Balancer

2. **컴퓨팅 계층**
   - EC2 인스턴스 (수동 생성)
   - Auto Scaling 그룹
   - EKS 클러스터

3. **데이터 계층**
   - RDS 인스턴스 (수동 생성)
   - DynamoDB 테이블 (수동 생성)
   - ElastiCache 클러스터 (수동 생성)
   - S3 버킷 (비어 있어야 함)

4. **네트워크 계층 (수동 생성만)**
   - VPC Endpoint
   - NAT Gateway (수동 생성)
   - Elastic IP (수동 생성)

5. **CloudFormation 스택** (마지막)
   - 태스크 0에서 생성한 모든 리소스 자동 삭제

---

## 시나리오별 예시

### 시나리오 1: CloudFormation + 수동 리소스 (표준)

**구성**: 태스크 0 (CloudFormation) + 태스크 1-3 (수동 생성)

**예시**: Lambda 함수, API Gateway를 수동으로 생성하고, DynamoDB와 IAM 역할은 CloudFormation으로 생성

**해당 차시**:

- 3-1: Amazon VPC Endpoint 생성 (VPC/EC2는 CloudFormation, Endpoint는 수동)
- 3-2: 보안 그룹 및 NACL 구성 (VPC는 CloudFormation, 보안 그룹은 수동)
- 4-2: Amazon API Gateway 인증 구성 (DynamoDB는 CloudFormation, Lambda/API Gateway는 수동)
- 4-3: Amazon EventBridge 기반 예약 처리 (DynamoDB는 CloudFormation, Lambda/EventBridge는 수동)
- 5-3: Amazon DynamoDB 테이블 생성 (DynamoDB 테이블 수동 생성)
- 10-2: Amazon ElastiCache 캐싱 (RDS는 CloudFormation, ElastiCache는 수동)
- 11-2: AWS Glue Crawler 설정 (S3는 CloudFormation, Glue는 수동)
- 11-3: AWS Glue 데이터 파이프라인 (S3는 CloudFormation, Glue ETL은 수동)
- 12-1: 자격증명 관리 (EC2는 CloudFormation, Secrets Manager는 수동)

**특수 케이스**:

- 12-2: AWS Config 규칙 생성 - 복잡한 의존성으로 인해 순차적 단계별 삭제 사용 (옵션 1/2 패턴 대신)

````markdown
## 리소스 정리

> [!WARNING]
> 다음 단계를 **반드시 수행**하여 불필요한 비용을 방지하세요.

---

### 1. Tag Editor로 생성된 리소스 확인

실습에서 생성한 모든 리소스를 Tag Editor로 확인합니다.

#### 수동으로 생성한 리소스 확인 (Week 태그)

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Resource Groups & Tag Editor`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `ap-northeast-2`를 선택합니다.
4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Week`
   - **Tag value**: `{X}-{Y}`
6. [[Search resources]] 버튼을 클릭합니다.

> [!NOTE]
> 이 실습에서 수동으로 생성한 리소스들이 표시됩니다. (예: Lambda 함수, API Gateway 등)

#### CloudFormation으로 생성한 리소스 확인 (Name 태그)

1. **Tags** 섹션을 초기화하고 다음을 입력합니다:
   - **Tag key**: `Name`
   - **Optional tag value**에 `week{X}-{Y}`을 입력합니다.
2. [[Search resources]] 버튼을 클릭합니다.

> [!NOTE]
> CloudFormation 스택으로 생성된 모든 리소스가 표시됩니다. 리소스 이름이 `week{X}-{Y}-`로 시작하는 것들이 이 실습에서 생성된 리소스입니다.

> [!TIP]
> Tag Editor는 리소스 확인 용도로만 사용하며, 실제 삭제는 다음 단계에서 수행합니다. 두 가지 태그 검색을 통해 수동 생성 리소스와 CloudFormation 생성 리소스를 모두 파악할 수 있습니다.

---

### 2. 리소스 삭제

다음 두 가지 방법 중 하나를 선택하여 리소스를 삭제할 수 있습니다.

### 옵션 1: AWS 콘솔에서 수동 삭제 (권장)

> [!TIP]
> AWS 관리 콘솔 방식을 선호하거나 각 단계를 확인하면서 삭제하고 싶은 경우 이 방법을 권장합니다.
>
> AWS CLI 명령어에 익숙한 경우 아래 [옵션 2](#옵션-2-aws-cloudshell-스크립트로-일괄-삭제)를 사용하면 더 빠르게 삭제할 수 있습니다.

**Lambda 함수 삭제**

1. AWS Management Console에 로그인한 후 상단 검색창에서 `AWS Lambda`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Functions**를 선택합니다.
3. `QuickTableCreateReservation` 함수를 선택합니다.
4. **Actions** > `Delete`를 선택합니다.
5. 확인 창에서 `delete`를 입력합니다.
6. [[Delete]] 버튼을 클릭합니다.
7. 나머지 Lambda 함수들도 동일한 방법으로 삭제합니다.

> [!NOTE]
> Lambda 함수 삭제는 즉시 완료됩니다.

**API Gateway 삭제**

1. AWS Management Console 상단 검색창에서 `Amazon API Gateway`를 검색하고 선택합니다.
2. `QuickTableAPI`를 선택합니다.
3. **Actions** > `Delete`를 선택합니다.
4. 확인 창에서 API 이름을 입력합니다.
5. [[Delete]] 버튼을 클릭합니다.

> [!NOTE]
> API Gateway 삭제에 1-2분이 소요됩니다.

### 옵션 2: AWS CloudShell 스크립트로 일괄 삭제

> [!TIP]
> AWS CLI 명령어에 익숙하거나 빠른 삭제를 원하는 경우 이 방법을 사용하세요.
>
> 콘솔 방식이 더 편하다면 위 [옵션 1](#옵션-1-aws-콘솔에서-수동-삭제-권장)을 참고하세요.

1. AWS Management Console 상단의 CloudShell 아이콘을 클릭합니다.
2. CloudShell이 열리면 다음 명령어를 실행합니다:

```bash
# Week {X}-{Y} 태그가 있는 Lambda 함수 찾기 및 삭제
FUNCTION_NAMES=$(aws lambda list-functions \
  --region ap-northeast-2 \
  --query 'Functions[?Tags.Week==`{X}-{Y}`].FunctionName' \
  --output text)

if [ -n "$FUNCTION_NAMES" ]; then
  for FUNCTION in $FUNCTION_NAMES; do
    echo "삭제 중: $FUNCTION"
    aws lambda delete-function \
      --region ap-northeast-2 \
      --function-name $FUNCTION
  done
  echo "Lambda 함수 삭제 완료"
else
  echo "삭제할 Lambda 함수가 없습니다"
fi

# API Gateway 삭제 (태그로 찾기)
API_IDS=$(aws apigateway get-rest-apis \
  --region ap-northeast-2 \
  --query 'items[?tags.Week==`{X}-{Y}`].id' \
  --output text)

if [ -n "$API_IDS" ]; then
  for API_ID in $API_IDS; do
    echo "삭제 중: API Gateway $API_ID"
    aws apigateway delete-rest-api \
      --region ap-northeast-2 \
      --rest-api-id $API_ID
  done
  echo "API Gateway 삭제 완료"
else
  echo "삭제할 API Gateway가 없습니다"
fi
```
````

> [!NOTE]
> 스크립트는 `Week={X}-{Y}` 태그가 있는 모든 리소스를 자동으로 찾아 삭제합니다. 삭제는 즉시 완료됩니다.

---

### 3. CloudFormation 스택 삭제

마지막으로 CloudFormation 스택을 삭제하여 나머지 모든 리소스를 정리합니다.

1. AWS Management Console에 로그인한 후 상단 검색창에서 `CloudFormation`을 검색하고 선택합니다.
2. 스택 목록에서 `week{X}-{Y}-lab-stack` 스택을 검색합니다.
3. `week{X}-{Y}-lab-stack` 스택의 체크박스를 선택합니다.

> [!NOTE]
> 스택이 선택되면 체크박스에 체크 표시가 나타나고, 상단의 [[Delete]] 버튼이 활성화됩니다.

4. [[Delete]] 버튼을 클릭합니다.
5. 확인 창에서 [[Delete]] 버튼을 다시 클릭하여 삭제를 확인합니다.

> [!NOTE]
> 확인 후 스택 목록 페이지로 돌아갑니다.

6. `week{X}-{Y}-lab-stack` 스택의 **Status** 열을 확인합니다.

> [!NOTE]
> 스택 삭제가 시작되면 **Status**가 "DELETE_IN_PROGRESS"로 표시됩니다. CloudFormation이 생성한 모든 리소스를 역순으로 삭제합니다.

7. 스택을 클릭하여 상세 페이지로 이동합니다.
8. **Events** 탭을 선택합니다.

> [!NOTE]
> **Events** 탭에는 리소스 삭제 과정이 실시간으로 표시됩니다. DynamoDB 테이블, IAM 역할 등이 순차적으로 삭제됩니다. 삭제에 3-5분이 소요됩니다.

9. 스택 삭제가 완료될 때까지 기다립니다.

> [!NOTE]
> 스택이 완전히 삭제되면 스택 목록에서 사라집니다. 만약 "DELETE_FAILED"가 표시되면 **Events** 탭에서 오류 원인을 확인하고, 수동으로 리소스를 삭제한 후 스택 삭제를 다시 시도합니다.

10. 스택 목록 페이지로 돌아가서 `week{X}-{Y}-lab-stack` 스택이 목록에서 사라졌는지 확인합니다.

> [!NOTE]
> 스택이 목록에 표시되지 않으면 성공적으로 삭제된 것입니다.

---

### 4. 최종 삭제 확인 (Tag Editor 활용)

모든 리소스가 정상적으로 삭제되었는지 Tag Editor로 최종 확인합니다.

1. AWS Management Console에서 `Resource Groups & Tag Editor`로 이동합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `ap-northeast-2`를 선택합니다.
4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Week`
   - **Tag value**: `{X}-{Y}`
6. [[Search resources]] 버튼을 클릭합니다.

> [!NOTE]
> 검색 결과에 리소스가 표시되지 않으면 모든 리소스가 성공적으로 삭제된 것입니다. CloudFormation 스택 삭제로 DynamoDB 테이블, IAM 역할 등 모든 리소스가 자동으로 정리되었습니다.

✅ **실습 종료**: 모든 리소스가 정리되었습니다.

```

---
```

### 시나리오 2: CloudFormation만 사용

**구성**: 태스크 0 (CloudFormation) + 태스크 1-3 (CloudFormation 리소스 사용)

**예시**: 모든 리소스가 CloudFormation으로 생성됨

**해당 차시**:

- 1-2: AWS Well-Architected Tool 워크로드 평가 (모든 리소스 CloudFormation)
- 2-1: AWS IAM 정책 Condition 요소 활용 (IAM 사용자, S3 버킷 CloudFormation)
- 2-2: AWS STS AssumeRole 활용 (IAM 역할, S3 버킷 CloudFormation)
- 6-2: AWS CloudFormation 템플릿 분석 (VPC 리소스 CloudFormation)
- 6-3: AWS Infrastructure Composer 활용 (서버리스 리소스 CloudFormation)

```markdown
## 리소스 정리

> [!WARNING]
> 다음 단계를 **반드시 수행**하여 불필요한 비용을 방지하세요.

---

### 1. CloudFormation 스택 삭제

이 실습에서는 모든 리소스가 CloudFormation으로 생성되었으므로 스택 삭제만으로 모든 리소스를 정리할 수 있습니다.

1. AWS Management Console에 로그인한 후 상단 검색창에서 `CloudFormation`을 검색하고 선택합니다.
2. 스택 목록에서 `week{X}-{Y}-lab-stack` 스택을 검색합니다.
3. `week{X}-{Y}-lab-stack` 스택의 체크박스를 선택합니다.
4. [[Delete]] 버튼을 클릭합니다.
5. 확인 창에서 [[Delete]] 버튼을 다시 클릭하여 삭제를 확인합니다.
6. 스택 삭제가 완료될 때까지 기다립니다.

> [!NOTE]
> CloudFormation 스택을 삭제하면 모든 리소스(VPC, 서브넷, EC2, VPC Endpoint 등)가 자동으로 삭제됩니다.
> 스택 삭제에 5-10분이 소요될 수 있습니다.

---

### 2. 최종 삭제 확인 (Tag Editor 활용)

모든 리소스가 정상적으로 삭제되었는지 Tag Editor로 최종 확인합니다.

1. AWS Management Console에서 `Resource Groups & Tag Editor`로 이동합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `ap-northeast-2`를 선택합니다.
4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Name`
   - **Optional tag value**에 `week{X}-{Y}`을 입력합니다.
6. [[Search resources]] 버튼을 클릭합니다.

> [!NOTE]
> 검색 결과에 리소스가 표시되지 않으면 모든 리소스가 성공적으로 삭제된 것입니다.

✅ **실습 종료**: 모든 리소스가 정리되었습니다.
```

---

### 시나리오 3: 수동 생성만 (CloudFormation 없음)

**구성**: 모든 리소스를 콘솔에서 수동 생성

**예시**: 간단한 실습으로 DynamoDB 테이블과 IAM 역할만 생성

**해당 차시**:

- 1-1: AWS Resource Groups & Tag Editor 활용 (태그만 추가, 리소스 생성 없음)
- 1-3: draw.io로 HA 아키텍처 다이어그램 작성 (AWS 리소스 생성 없음)
- 5-1: Amazon RDS Multi-AZ 고가용성 구성 (데모, RDS 수동 생성)
- 6-1: AWS CloudFormation 스택 생명주기 관리 (데모, CloudFormation 학습)
- 9-2: AWS CodeBuild로 컨테이너 이미지 빌드 (CodeBuild, ECR 수동 생성)
- 9-3: AWS CodePipeline으로 S3 정적 웹사이트 배포 (CodePipeline, S3 수동 생성)
- 10-3: Amazon CloudFront CDN 배포 (S3, CloudFront 수동 생성)
- 12-3: Amazon GuardDuty와 Lambda 자동 대응 (데모, GuardDuty 수동 활성화)
- 13-2: AWS X-Ray를 활용한 서버리스 추적 (Lambda, X-Ray 수동 구성)
- 14-1: Amazon Bedrock 프롬프트 엔지니어링 (Bedrock만 사용)
- 14-2: Amazon Bedrock Knowledge Bases 기반 RAG (데모, Bedrock 사용)
- 14-3: Amazon Bedrock Agents 기반 챗봇 (Bedrock Agent 수동 생성)

```markdown
## 리소스 정리

> [!WARNING]
> 다음 단계를 **반드시 수행**하여 불필요한 비용을 방지하세요.

---

### 1. DynamoDB 테이블 삭제

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Amazon DynamoDB`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Tables**를 선택합니다.
3. `QuickTableReservations` 테이블을 선택합니다.
4. [[Delete]] 버튼을 클릭합니다.
5. 확인 창에서 `delete`를 입력합니다.
6. [[Delete]] 버튼을 클릭합니다.

> [!NOTE]
> DynamoDB 테이블 삭제에 1-2분이 소요됩니다.

---

### 2. IAM 역할 삭제

1. AWS Management Console 상단 검색창에서 `AWS IAM`을 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Roles**를 선택합니다.
3. `QuickTableLambdaExecutionRole`을 선택합니다.
4. [[Delete]] 버튼을 클릭합니다.
5. 확인 창에서 역할 이름을 입력합니다.
6. [[Delete]] 버튼을 클릭합니다.

> [!NOTE]
> IAM 역할 삭제는 즉시 완료됩니다.

---

### 3. 최종 삭제 확인 (Tag Editor 활용)

모든 리소스가 정상적으로 삭제되었는지 Tag Editor로 최종 확인합니다.

1. AWS Management Console에서 `Resource Groups & Tag Editor`로 이동합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `ap-northeast-2`를 선택합니다.
4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Week`
   - **Tag value**: `{X}-{Y}`
6. [[Search resources]] 버튼을 클릭합니다.

> [!NOTE]
> 검색 결과에 리소스가 표시되지 않으면 모든 리소스가 성공적으로 삭제된 것입니다.

✅ **실습 종료**: 모든 리소스가 정리되었습니다.
```

---

### 시나리오 4: S3 버킷 포함

**구성**: S3 버킷이 포함된 실습

**주의**: S3 버킷은 비어 있어야 삭제 가능

**해당 차시**:

- 2-1: AWS IAM 정책 Condition 요소 활용 (S3 버킷 포함)
- 2-2: AWS STS AssumeRole 활용 (S3 버킷 포함)
- 3-1: Amazon VPC Endpoint 생성 (S3 Gateway Endpoint 테스트용 버킷)
- 9-3: AWS CodePipeline으로 S3 정적 웹사이트 배포 (S3 정적 웹사이트)
- 10-3: Amazon CloudFront CDN 배포 (S3 오리진 버킷)
- 11-2: AWS Glue Crawler 설정 (S3 데이터 레이크)
- 11-3: AWS Glue 데이터 파이프라인 (S3 데이터 레이크)

```markdown
## 리소스 정리

> [!WARNING]
> 다음 단계를 **반드시 수행**하여 불필요한 비용을 방지하세요.

---

### 1. S3 버킷 비우기

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Amazon S3`를 검색하고 선택합니다.
2. `my-lab-bucket-{계정ID}` 버킷을 선택합니다.
3. [[Empty]] 버튼을 클릭합니다.
4. 확인 창에서 `permanently delete`를 입력합니다.
5. [[Empty]] 버튼을 클릭합니다.
6. 버킷이 비워질 때까지 기다립니다.

> [!NOTE]
> 버킷에 많은 객체가 있는 경우 비우는 데 시간이 소요될 수 있습니다.

---

### 2. S3 버킷 삭제

1. S3 콘솔에서 `my-lab-bucket-{계정ID}` 버킷을 선택합니다.
2. [[Delete]] 버튼을 클릭합니다.
3. 확인 창에서 버킷 이름을 입력합니다.
4. [[Delete bucket]] 버튼을 클릭합니다.

> [!NOTE]
> S3 버킷 삭제는 즉시 완료됩니다.

---

### 3. CloudFormation 스택 삭제

1. AWS Management Console 상단 검색창에서 `CloudFormation`을 검색하고 선택합니다.
2. `week{X}-{Y}-lab-stack` 스택을 선택합니다.
3. [[Delete]] 버튼을 클릭합니다.
4. 확인 창에서 [[Delete]] 버튼을 클릭합니다.
5. 스택 삭제가 완료될 때까지 기다립니다.

> [!NOTE]
> CloudFormation 스택을 삭제하면 나머지 모든 리소스가 자동으로 삭제됩니다.
> 스택 삭제에 3-5분이 소요될 수 있습니다.

---

### 4. 최종 삭제 확인 (Tag Editor 활용)

모든 리소스가 정상적으로 삭제되었는지 Tag Editor로 최종 확인합니다.

1. AWS Management Console에서 `Resource Groups & Tag Editor`로 이동합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `ap-northeast-2`를 선택합니다.
4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Week`
   - **Tag value**: `{X}-{Y}`
6. [[Search resources]] 버튼을 클릭합니다.

> [!NOTE]
> 검색 결과에 리소스가 표시되지 않으면 모든 리소스가 성공적으로 삭제된 것입니다.

✅ **실습 종료**: 모든 리소스가 정리되었습니다.
```

---

### 시나리오 5: EKS 클러스터 포함

**구성**: Amazon EKS 클러스터가 포함된 실습

**주의**: EKS 클러스터 삭제는 시간이 오래 걸림 (10-15분)

**해당 차시**:

- 7-3: kubectl을 활용한 Amazon EKS 클러스터 운영 (EKS 클러스터 생성)
- 13-3: Amazon CloudWatch Container Insights로 EKS 모니터링 (데모, EKS 클러스터 사용)

````markdown
## 리소스 정리

> [!WARNING]
> 다음 단계를 **반드시 수행**하여 불필요한 비용을 방지하세요.
>
> **Amazon EKS 클러스터 삭제에 10-15분이 소요**되므로, 삭제 명령어 실행 후 반드시 완료를 확인한 후 퇴실하세요.

---

### 1. 샘플 애플리케이션 삭제

1. AWS CloudShell로 이동합니다.
2. 다음 명령어를 실행합니다:

```bash
kubectl delete -f sample-app.yaml
```
````

> [!NOTE]
> LoadBalancer 서비스가 삭제되면서 Classic Load Balancer도 자동으로 삭제됩니다. 2-3분이 소요될 수 있습니다.

---

### 2. Amazon EKS 클러스터 삭제

1. CloudShell에서 다음 명령어를 실행합니다:

```bash
eksctl delete cluster --name my-cluster --region ap-northeast-2
```

> [!IMPORTANT]
> 클러스터 삭제에 10-15분이 소요됩니다. 다음 메시지가 표시될 때까지 기다립니다:
>
> ```
> [✓]  all cluster resources were deleted
> ```
>
> **eksctl delete cluster 명령어는 다음을 자동으로 삭제합니다**:
>
> - Amazon EKS 클러스터 (컨트롤 플레인)
> - 관리형 노드 그룹 (EC2 인스턴스)
> - VPC 및 네트워크 리소스
> - 보안 그룹
> - CloudFormation 스택

2. 삭제 완료를 확인합니다:

```bash
eksctl get cluster --name my-cluster --region ap-northeast-2
```

> [!OUTPUT]
>
> ```
> No clusters found
> ```

---

### 3. 최종 삭제 확인 (Tag Editor 활용)

모든 리소스가 정상적으로 삭제되었는지 Tag Editor로 최종 확인합니다.

1. AWS Management Console에서 `Resource Groups & Tag Editor`로 이동합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `ap-northeast-2`를 선택합니다.
4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Week`
   - **Tag value**: `{X}-{Y}`
6. [[Search resources]] 버튼을 클릭합니다.

> [!NOTE]
> 검색 결과에 리소스가 표시되지 않으면 모든 리소스가 성공적으로 삭제된 것입니다.

✅ **실습 종료**: 모든 리소스가 정리되었습니다.

````

---

## 특수 케이스

### 1. 복잡한 의존성으로 인한 순차적 삭제

**해당 차시**: Week 12-2 (AWS Config)

일부 AWS 서비스는 리소스 간 복잡한 의존성이 있어 "옵션 1/옵션 2" 패턴 대신 순차적 단계별 삭제가 더 적합합니다.

**예시: AWS Config 리소스 정리**

```markdown
## 리소스 정리

> [!WARNING]
> 다음 단계를 **반드시 수행**하여 불필요한 비용을 방지합니다.

---

## 1단계: Tag Editor로 리소스 찾기

[Tag Editor로 태그된 리소스 확인]

---

## 2단계: Conformance Pack 삭제

[Conformance Pack 삭제 단계]

---

## 3단계: AWS Config Rules 삭제

> [!IMPORTANT]
> Remediation 설정이 활성화된 상태에서 Config Rule을 삭제하면 오류가 발생할 수 있습니다. 반드시 Remediation을 먼저 제거한 후 Rule을 삭제해야 합니다.

[Config Rules 삭제 단계]

---

## 4단계: Configuration Recorder 중지 및 삭제

[Recorder 중지 후 CLI로 삭제]

---

## 5단계: 테스트 버킷 삭제

[S3 버킷 비우기 및 삭제]

---

## 6단계: Amazon S3 버킷 삭제 (Config 데이터)

[Config 데이터 버킷 삭제]

---

## 7단계: Amazon SNS 토픽 및 구독 삭제

[SNS 토픽 삭제]

---

## 8단계: Remediation IAM 역할 삭제 (선택사항)

[IAM 역할 삭제]

---

## 9단계: CloudWatch Log Group 삭제 (선택사항)

[Log Group 삭제]

✅ **실습 종료**: 모든 리소스가 정리되었습니다.
```

**특징**:
- 의존성 순서대로 단계별 삭제
- 각 단계마다 명확한 지침 제공
- CLI와 콘솔 혼용 (필요에 따라)
- 선택사항 명시 (8단계, 9단계)

---

### 2. CloudFormation 스택 삭제 실패 시 대응

```markdown
### 문제 해결: CloudFormation 스택 삭제 실패

스택 삭제가 실패하는 경우 다음을 확인합니다:

#### 1단계: 오류 원인 확인

1. CloudFormation 콘솔에서 실패한 스택을 선택합니다.
2. **Events** 탭을 선택합니다.
3. **Status**가 "DELETE_FAILED"인 리소스를 찾습니다.
4. **Status reason** 열에서 오류 메시지를 확인합니다.

> [!NOTE]
> 일반적인 오류 원인:
> - 수동으로 생성한 리소스가 CloudFormation 리소스를 참조
> - 리소스가 다른 서비스에서 사용 중
> - 리소스 삭제 권한 부족

#### 2단계: 의존성 리소스 수동 삭제

1. 오류 메시지에서 삭제 실패한 리소스를 확인합니다.
2. 해당 리소스를 참조하는 다른 리소스를 먼저 삭제합니다.
3. CloudFormation 스택 삭제를 다시 시도합니다.

**예시: VPC 삭제 실패**

````

오류: The vpc 'vpc-xxxxx' has dependencies and cannot be deleted.

```

**해결 방법**:
1. VPC Endpoint, NAT Gateway 등 VPC에 연결된 리소스를 먼저 삭제
2. CloudFormation 스택 삭제 재시도

#### 3단계: 스택 보존 옵션으로 삭제

일부 리소스만 보존하고 나머지를 삭제하려는 경우:

1. CloudFormation 콘솔에서 스택을 선택합니다.
2. [[Delete]] 버튼을 클릭합니다.
3. 확인 창에서 **Deletion policy** 섹션을 확인합니다.
4. 보존할 리소스를 선택합니다.
5. [[Delete]] 버튼을 클릭합니다.

> [!WARNING]
> 이 방법은 특정 리소스(예: 데이터베이스 스냅샷)를 보존하고 싶을 때만 사용하세요. 일반적으로는 모든 리소스를 삭제하는 것이 좋습니다.

#### 4단계: 강제 삭제 (최후의 수단)

위 방법으로도 해결되지 않는 경우:

1. CloudFormation 콘솔에서 스택을 선택합니다.
2. **Actions** > `Delete stack`을 선택합니다.
3. 확인 창에서 **Retain resources** 옵션을 체크합니다.
4. 삭제 실패한 리소스를 선택합니다.
5. [[Delete]] 버튼을 클릭합니다.

> [!IMPORTANT]
> 이 방법은 선택한 리소스를 AWS 계정에 남겨두고 스택만 삭제합니다. 남은 리소스는 수동으로 삭제해야 하며, 비용이 계속 발생할 수 있습니다.

6. 스택 삭제 후 남은 리소스를 Tag Editor로 확인합니다.
7. 남은 리소스를 수동으로 삭제합니다.
```

---

### 2. 비용 발생 리소스 우선 삭제

```markdown
> [!IMPORTANT]
> 다음 리소스는 시간당 비용이 발생하므로 우선 삭제하세요:
>
> - NAT Gateway (시간당 $0.059)
> - RDS 인스턴스 (시간당 $0.017)
> - ElastiCache 클러스터 (시간당 $0.017)
> - EKS 클러스터 (시간당 $0.10)
```

---

### 3. 데이터 백업 안내 (필요시)

```markdown
> [!NOTE]
> 실습 결과를 보관하려면 다음을 백업하세요:
>
> - DynamoDB 테이블: Export to S3
> - RDS 스냅샷: 수동 스냅샷 생성
> - S3 버킷: 로컬로 다운로드
>
> 백업 후 원본 리소스는 반드시 삭제하세요.
```

---

## 검증 방법 안내

### Tag Editor로 리소스 확인

```markdown
### 리소스 정리 확인

모든 리소스가 삭제되었는지 확인합니다:

1. AWS Management Console 상단 검색창에서 `Resource Groups & Tag Editor`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `ap-northeast-2`를 선택합니다.
4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Week`
   - **Tag value**: `{X}-{Y}`
6. [[Search resources]] 버튼을 클릭합니다.
7. 검색 결과가 비어 있으면 모든 리소스가 정리된 것입니다.

> [!NOTE]
> 리소스 삭제 후 Tag Editor에 반영되기까지 1-2분이 소요될 수 있습니다.
```

---

## 작성 규칙

### 1. WARNING Alert 필수

```markdown
> [!WARNING]
> 다음 단계를 **반드시 수행**하여 불필요한 비용을 방지하세요.
```

- 리소스 정리 섹션 시작 부분에 필수
- "반드시 수행" 강조

### 2. 구분선 사용

- 각 주요 단계 사이에 `---` 삽입
- 가독성 향상

### 3. 삭제 순서 명확화

- 번호 매기기: `## 1단계: Lambda 함수 삭제`
- 의존성 역순으로 배치
- 각 리소스 타입별로 섹션 분리

**표준 형식**: `## 1단계:`, `## 2단계:`, `## 3단계:` (헤더 레벨 2 + 숫자 + "단계" + 콜론)

**금지 형식**:

- ❌ `### 1.` (헤더 레벨 너무 작음)
- ❌ `### 단계 1:` (단어 순서 잘못됨)
- ❌ `### 1단계:` (헤더 레벨 너무 작음)

### 4. 삭제 확인 단계 포함

- 확인 창에서 입력해야 하는 텍스트 명시
- 삭제 완료 확인 방법 안내
- NOTE Alert로 소요 시간 안내

### 5. 옵션 제공

- 옵션 1: AWS 콘솔 (권장)
- 옵션 2: AWS CloudShell 스크립트
- TIP Alert로 선택 가이드 제공

### 6. Tag Editor 활용

- 삭제 전: 리소스 확인
- 삭제 후: 최종 검증
- 두 가지 태그 검색 (Week, Name)

### 7. 완료 메시지

```markdown
✅ **실습 종료**: 모든 리소스가 정리되었습니다.
```

- 리소스 정리 섹션 마지막에 필수
- 학생들에게 완료 확신 제공

---

## 체크리스트

### 작성 시 확인 사항

- [ ] WARNING Alert로 시작
- [ ] 구분선 (`---`) 사용
- [ ] Tag Editor 확인 단계 (삭제 전)
- [ ] 옵션 1/옵션 2 제공
- [ ] 삭제 순서가 의존성 역순인지 확인
- [ ] CloudFormation 스택 삭제 단계 포함 (해당 시)
- [ ] 각 리소스 삭제 단계가 명확한지 확인
- [ ] 삭제 확인 입력값 명시
- [ ] NOTE Alert로 소요 시간 안내
- [ ] Tag Editor 최종 확인 단계
- [ ] 완료 메시지 포함 (✅ **실습 종료**)
- [ ] 고비용 리소스 우선 삭제 안내 (해당 시)
- [ ] EKS 등 장시간 소요 리소스 IMPORTANT Alert (해당 시)

---

## 금지 사항

### ❌ 하지 말아야 할 것

- 삭제 순서 생략 금지 → 의존성 고려 필수
- WARNING Alert 누락 금지 → 비용 방지 강조
- 삭제 확인 단계 생략 금지 → 실수 방지
- "알아서 삭제하세요" 금지 → 구체적 단계 제공
- CloudFormation 자동 삭제 설명 누락 금지 → 학생 혼란 방지
- Tag Editor 확인 단계 누락 금지 → 최종 검증 필수
- 옵션 제공 없이 한 가지 방법만 제시 금지 → 학생 선택권 보장

---

## 참고: AWS 리소스 삭제 시간

| 리소스               | 예상 삭제 시간              |
| -------------------- | --------------------------- |
| Lambda 함수          | 즉시                        |
| API Gateway          | 1-2분                       |
| DynamoDB 테이블      | 1-2분                       |
| S3 버킷 (비어 있음)  | 즉시                        |
| EC2 인스턴스         | 1-2분                       |
| RDS 인스턴스         | 5-10분                      |
| NAT Gateway          | 2-3분                       |
| VPC                  | 1-2분 (의존 리소스 없을 때) |
| CloudFormation 스택  | 3-10분                      |
| EKS 클러스터         | 10-15분                     |
| ElastiCache 클러스터 | 5-10분                      |
| VPC Endpoint         | 즉시                        |

---

**마지막 업데이트**: 2025-02-20  
**버전**: 2.0.0
