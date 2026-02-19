# Week 4-2: QuickTable API with Lambda, API Gateway, and DynamoDB

## 📋 개요

이 CloudFormation 템플릿은 Week 4-2 실습 "Amazon API Gateway 인증 구성"을 위한 사전 인프라를 자동으로 생성합니다.

**학습 목표**: 이 실습에서는 Cognito User Pool 생성과 API Gateway Authorizer 설정에 집중합니다. DynamoDB, Lambda, API Gateway는 이미 구축되어 있으므로 인증 구성에만 집중할 수 있습니다.

## 🏗️ 아키텍처

### 생성되는 리소스

이 템플릿은 다음 리소스를 자동으로 생성합니다:

```
┌─────────────────────────────────────────────────────────────┐
│                    QuickTable API 아키텍처                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                                          │
│  │   Client     │                                          │
│  │  (CloudShell)│                                          │
│  └──────┬───────┘                                          │
│         │ HTTP Request                                     │
│         │ (Authorization: IdToken)                         │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────┐          │
│  │         Amazon API Gateway                   │          │
│  │  ┌────────────────────────────────────────┐  │          │
│  │  │  POST /reservations                    │  │          │
│  │  │  GET  /reservations                    │  │          │
│  │  │  (AuthorizationType: NONE → Cognito)   │  │          │
│  │  └────────────────────────────────────────┘  │          │
│  └──────────────┬───────────────────────────────┘          │
│                 │ Lambda Proxy Integration                 │
│                 ▼                                           │
│  ┌──────────────────────────────────────────────┐          │
│  │           AWS Lambda Functions               │          │
│  │  ┌────────────────────────────────────────┐  │          │
│  │  │  CreateReservation (Python 3.11)       │  │          │
│  │  │  - Cognito userId 추출                 │  │          │
│  │  │  - 예약 데이터 생성 및 저장            │  │          │
│  │  └────────────────────────────────────────┘  │          │
│  │  ┌────────────────────────────────────────┐  │          │
│  │  │  GetReservations (Python 3.11)         │  │          │
│  │  │  - Cognito userId 추출                 │  │          │
│  │  │  - 사용자별 예약 목록 조회             │  │          │
│  │  └────────────────────────────────────────┘  │          │
│  └──────────────┬───────────────────────────────┘          │
│                 │ DynamoDB Query/PutItem                   │
│                 ▼                                           │
│  ┌──────────────────────────────────────────────┐          │
│  │         Amazon DynamoDB                      │          │
│  │  ┌────────────────────────────────────────┐  │          │
│  │  │  QuickTableReservations                │  │          │
│  │  │  - Partition Key: userId (String)      │  │          │
│  │  │  - Sort Key: reservationId (String)    │  │          │
│  │  │  - Attributes: camelCase 형식          │  │          │
│  │  └────────────────────────────────────────┘  │          │
│  └──────────────────────────────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1. Amazon DynamoDB 테이블

**테이블명**: `QuickTableReservations`

**키 스키마**:
- **Partition Key**: `userId` (String) - Cognito 사용자 ID
- **Sort Key**: `reservationId` (String) - UUID 형식 예약 ID

**속성** (camelCase 형식):
- `userId`: Cognito 사용자 고유 ID
- `reservationId`: 예약 고유 ID (UUID)
- `restaurantName`: 레스토랑 이름
- `date`: 예약 날짜 (YYYY-MM-DD)
- `time`: 예약 시간 (HH:MM)
- `partySize`: 인원 수
- `phoneNumber`: 전화번호
- `status`: 예약 상태 (pending, confirmed, cancelled)
- `createdAt`: 생성 시간 (ISO 8601 형식)

**빌링 모드**: PAY_PER_REQUEST (온디맨드)

### 2. AWS Lambda 함수

#### CreateReservation 함수

**함수명**: `Week4-2-CreateReservation`
**런타임**: Python 3.11
**타임아웃**: 30초

**주요 기능**:
1. Cognito Authorizer에서 사용자 ID 추출 (`event['requestContext']['authorizer']['claims']['sub']`)
2. 요청 본문에서 예약 정보 파싱
3. UUID 형식의 예약 ID 자동 생성
4. DynamoDB에 예약 데이터 저장 (camelCase 속성)
5. 생성된 예약 정보 반환

**환경 변수**:
- `TABLE_NAME`: DynamoDB 테이블 이름

#### GetReservations 함수

**함수명**: `Week4-2-GetReservations`
**런타임**: Python 3.11
**타임아웃**: 30초

**주요 기능**:
1. Cognito Authorizer에서 사용자 ID 추출
2. DynamoDB에서 해당 사용자의 모든 예약 조회 (Query 사용)
3. 예약 목록 반환

**환경 변수**:
- `TABLE_NAME`: DynamoDB 테이블 이름

### 3. Amazon API Gateway

**API명**: `Week4-2-QuickTableAPI`
**타입**: REST API
**스테이지**: `prod`

**리소스 및 메서드**:
- `POST /reservations`: 예약 생성 (CreateReservation Lambda 호출)
- `GET /reservations`: 예약 목록 조회 (GetReservations Lambda 호출)

**통합 타입**: AWS_PROXY (Lambda 프록시 통합)

**인증**: 
- 초기 상태: `AuthorizationType: NONE`
- 실습 중 변경: `AuthorizationType: COGNITO` (Cognito Authorizer 연결)

### 4. IAM 역할

**역할명**: `week4-2-quicktable-api-Lambda-ExecutionRole`

**신뢰 정책**: Lambda 서비스가 역할을 맡을 수 있음

**권한**:
- `AWSLambdaBasicExecutionRole`: CloudWatch Logs 쓰기 권한
- **DynamoDB 권한**:
  - `dynamodb:PutItem`: 예약 생성
  - `dynamodb:GetItem`: 예약 조회
  - `dynamodb:Query`: 사용자별 예약 목록 조회
  - `dynamodb:Scan`: 전체 스캔 (필요시)
  - `dynamodb:UpdateItem`: 예약 수정
  - `dynamodb:DeleteItem`: 예약 삭제

## 📦 배포 방법

### 1. AWS Management Console 사용

1. AWS Management Console에 로그인합니다.
2. CloudFormation 서비스로 이동합니다.
3. [[Create stack]] 버튼을 클릭합니다.
4. **Upload a template file**을 선택하고 `week4-2-quicktable-api-lab.yaml` 파일을 업로드합니다.
5. **Stack name**에 `week4-2-quicktable-api-lab-stack`을 입력합니다.
6. **Parameters**는 기본값을 사용합니다.
7. **Capabilities**에서 `I acknowledge that AWS CloudFormation might create IAM resources`를 체크합니다.
8. [[Submit]] 버튼을 클릭합니다.
9. 스택 생성이 완료될 때까지 기다립니다 (약 2-3분).

### 2. AWS CLI 사용

```bash
aws cloudformation create-stack \
  --stack-name week4-2-quicktable-api-lab-stack \
  --template-body file://week4-2-quicktable-api-lab.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region ap-northeast-2
```

**스택 생성 상태 확인**:
```bash
aws cloudformation describe-stacks \
  --stack-name week4-2-quicktable-api-lab-stack \
  --region ap-northeast-2 \
  --query 'Stacks[0].StackStatus'
```

**Outputs 확인**:
```bash
aws cloudformation describe-stacks \
  --stack-name week4-2-quicktable-api-lab-stack \
  --region ap-northeast-2 \
  --query 'Stacks[0].Outputs'
```

## 📤 Outputs

스택 생성 완료 후 다음 출력값을 확인할 수 있습니다:

| Output Key | 설명 | 예시 값 |
|-----------|------|---------|
| `ApiGatewayInvokeUrl` | API Gateway Invoke URL | `https://abc123.execute-api.ap-northeast-2.amazonaws.com/prod` |
| `ApiGatewayId` | API Gateway REST API ID | `abc123def4` |
| `DynamoDBTableName` | DynamoDB 테이블 이름 | `QuickTableReservations` |
| `LambdaExecutionRoleArn` | Lambda 실행 역할 ARN | `arn:aws:iam::123456789012:role/week4-2-quicktable-api-Lambda-ExecutionRole` |

**Outputs 사용 방법**:
1. CloudFormation 콘솔에서 스택을 선택합니다.
2. **Outputs** 탭을 클릭합니다.
3. 각 값을 복사하여 메모장에 저장합니다.
4. 실습 가이드의 태스크에서 이 값들을 사용합니다.

## 🎓 실습에서 수행할 작업

이 템플릿으로 인프라를 구축한 후, 실습 가이드에서는 다음 작업을 수행합니다:

### 태스크 1: Cognito User Pool 생성
- User Pool 생성 및 설정
- App Client 생성
- 인증 흐름 설정 (USER_PASSWORD_AUTH)

### 태스크 2: User Pool ID 및 Client ID 확인
- User Pool ID 복사
- App Client ID 복사

### 태스크 3: API Gateway Authorizer 생성 및 메서드 연결
- Cognito Authorizer 생성
- POST /reservations 메서드에 Authorizer 연결
- GET /reservations 메서드에 Authorizer 연결
- API 재배포

### 태스크 4: Cognito 사용자 생성 및 인증 토큰 획득
- CloudShell에서 사용자 생성 (`sign-up`)
- 사용자 확인 (`admin-confirm-sign-up`)
- 로그인하여 IdToken 획득 (`initiate-auth`)

### 태스크 5: 인증된 API 호출 테스트
- 예약 생성 테스트 (POST /reservations)
- 예약 목록 조회 테스트 (GET /reservations)
- 인증 없이 API 호출 테스트 (401 Unauthorized 확인)

## 🔍 Lambda 함수 코드 설명

### CreateReservation 함수

**Cognito 사용자 ID 추출**:
```python
user_id = event['requestContext']['authorizer']['claims']['sub']
```

**예약 데이터 생성** (camelCase 속성):
```python
item = {
    'userId': user_id,
    'reservationId': str(uuid.uuid4()),
    'restaurantName': body['restaurantName'],
    'date': body['date'],
    'time': body['time'],
    'partySize': int(body['partySize']),
    'phoneNumber': body.get('phoneNumber', ''),
    'status': 'pending',
    'createdAt': datetime.utcnow().isoformat() + 'Z'
}
```

### GetReservations 함수

**사용자별 예약 조회** (Query 사용):
```python
response = table.query(
    KeyConditionExpression='userId = :userId',
    ExpressionAttributeValues={
        ':userId': user_id
    }
)
```

## 🗑️ 리소스 정리

### CloudFormation 스택 삭제

**AWS Management Console**:
1. CloudFormation 콘솔로 이동합니다.
2. `week4-2-quicktable-api-lab-stack` 스택을 선택합니다.
3. [[Delete]] 버튼을 클릭합니다.
4. 확인 창에서 [[Delete]] 버튼을 클릭합니다.

**AWS CLI**:
```bash
aws cloudformation delete-stack \
  --stack-name week4-2-quicktable-api-lab-stack \
  --region ap-northeast-2
```

**삭제 완료 대기**:
```bash
aws cloudformation wait stack-delete-complete \
  --stack-name week4-2-quicktable-api-lab-stack \
  --region ap-northeast-2
```

### 자동 삭제되는 리소스

CloudFormation 스택을 삭제하면 다음 리소스가 자동으로 삭제됩니다:
- DynamoDB 테이블 (`QuickTableReservations`)
- Lambda 함수 (`Week4-2-CreateReservation`, `Week4-2-GetReservations`)
- API Gateway (`Week4-2-QuickTableAPI`)
- IAM 역할 (`week4-2-quicktable-api-Lambda-ExecutionRole`)
- Lambda 권한 (API Gateway 호출 권한)

### 수동 삭제가 필요한 리소스

다음 리소스는 실습 중 수동으로 생성되므로 별도로 삭제해야 합니다:
- **Cognito User Pool** (`QuickTableUserPool`)
- **CloudWatch Log Groups**:
  - `/aws/lambda/Week4-2-CreateReservation`
  - `/aws/lambda/Week4-2-GetReservations`

## 💡 주요 특징

### 1. camelCase 명명 규칙

DynamoDB 속성은 JavaScript/TypeScript 프론트엔드와의 일관성을 위해 camelCase를 사용합니다:
- ✅ `userId`, `reservationId`, `restaurantName`, `createdAt`
- ❌ `user_id`, `reservation_id`, `restaurant_name`, `created_at`

### 2. 사용자별 데이터 격리

- Cognito 사용자 ID를 Partition Key로 사용하여 사용자별 데이터를 자동으로 격리합니다.
- Lambda 함수가 Cognito Authorizer에서 사용자 ID를 추출하여 DynamoDB 쿼리에 사용합니다.
- 사용자는 자신의 예약만 조회/수정할 수 있습니다.

### 3. 상세한 한국어 주석

Lambda 함수 코드에는 다음이 포함되어 있습니다:
- 모듈 레벨 DocString (함수 목적, 주요 기능, 환경 변수, 트리거)
- 함수 레벨 DocString (Args, Returns, 설명)
- 각 코드 라인에 한국어 주석

### 4. 보안 모범 사례

- IAM 역할은 최소 권한 원칙을 따릅니다 (DynamoDB 테이블에만 접근).
- Lambda 함수는 환경 변수를 통해 테이블 이름을 받습니다 (하드코딩 방지).
- API Gateway는 CORS를 지원하여 프론트엔드 통합이 용이합니다.

## 📚 참고 자료

- [AWS Lambda 개발자 가이드](https://docs.aws.amazon.com/lambda/latest/dg/)
- [Amazon API Gateway 개발자 가이드](https://docs.aws.amazon.com/apigateway/latest/developerguide/)
- [Amazon DynamoDB 개발자 가이드](https://docs.aws.amazon.com/dynamodb/latest/developerguide/)
- [Amazon Cognito 개발자 가이드](https://docs.aws.amazon.com/cognito/latest/developerguide/)
- [CloudFormation 사용자 가이드](https://docs.aws.amazon.com/cloudformation/)

## ❓ 문제 해결

### 스택 생성 실패

**문제**: IAM 권한 부족
```
User is not authorized to perform: iam:CreateRole
```

**해결**: `--capabilities CAPABILITY_NAMED_IAM` 플래그를 추가하거나 Console에서 Capabilities를 체크합니다.

### Lambda 함수 실행 오류

**문제**: DynamoDB 접근 권한 오류
```
User is not authorized to perform: dynamodb:PutItem
```

**해결**: IAM 역할에 DynamoDB 권한이 올바르게 설정되어 있는지 확인합니다. CloudFormation 템플릿에는 이미 포함되어 있습니다.

### API Gateway 호출 실패

**문제**: CORS 오류
```
Access-Control-Allow-Origin header is missing
```

**해결**: Lambda 함수 응답에 CORS 헤더가 포함되어 있습니다. 브라우저에서 호출 시 확인합니다.

---

**작성일**: 2026-02-18  
**버전**: 1.0.0  
**실습 주차**: Week 4-2
