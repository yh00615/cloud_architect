# QuickTable 애플리케이션 개발자 가이드

## 목차
1. [애플리케이션 개요](#애플리케이션-개요)
2. [전체 아키텍처](#전체-아키텍처)
3. [주차별 구현 내용](#주차별-구현-내용)
4. [AWS 서비스 사용 현황](#aws-서비스-사용-현황)
5. [데이터 모델](#데이터-모델)
6. [API 엔드포인트](#api-엔드포인트)
7. [명명 규칙 및 태그 표준](#명명-규칙-및-태그-표준)
8. [개발 가이드라인](#개발-가이드라인)

---

## 애플리케이션 개요

### 프로젝트 목적
QuickTable은 레스토랑 예약 시스템으로, AWS 클라우드 서비스를 활용하여 확장 가능하고 안정적인 예약 관리 플랫폼을 제공합니다.

### 주요 기능
- 사용자 인증 및 권한 관리 (Cognito)
- 레스토랑 예약 생성, 조회, 수정, 취소
- 실시간 예약 가능 시간 확인
- 예약 상태 변경 이벤트 처리
- 예약 확인 이메일 발송
- 캐싱을 통한 성능 최적화
- CDN을 통한 정적 콘텐츠 배포
- 데이터 분석 및 리포팅

### 기술 스택
- **백엔드**: AWS Lambda (Node.js/Python)
- **API**: Amazon API Gateway
- **인증**: Amazon Cognito
- **데이터베이스**: Amazon DynamoDB
- **이벤트 처리**: Amazon EventBridge
- **캐싱**: Amazon ElastiCache (Redis)
- **CDN**: Amazon CloudFront
- **스토리지**: Amazon S3
- **데이터 분석**: AWS Glue, Amazon Athena
- **알림**: Amazon SNS, Amazon SES

---

## 전체 아키텍처

### 시스템 구성도
```
[사용자] 
   ↓
[CloudFront CDN]
   ↓
[API Gateway]
   ↓
[Lambda Authorizer (Cognito)]
   ↓
[Lambda Functions]
   ↓
[ElastiCache Redis] ← → [DynamoDB]
   ↓
[EventBridge]
   ↓
[Lambda (이벤트 처리)]
   ↓
[SNS/SES (알림)]

[S3] → [Glue] → [Athena] (데이터 분석)
```

### 주요 컴포넌트

#### 1. API Layer
- **API Gateway**: RESTful API 엔드포인트 제공
- **Lambda Authorizer**: Cognito 토큰 기반 인증
- **CORS 설정**: 크로스 오리진 요청 지원

#### 2. 비즈니스 로직 Layer
- **Lambda Functions**: 서버리스 비즈니스 로직 실행
- **EventBridge**: 이벤트 기반 아키텍처
- **Step Functions**: 복잡한 워크플로우 오케스트레이션

#### 3. 데이터 Layer
- **DynamoDB**: NoSQL 데이터베이스 (예약, 레스토랑, 메뉴 정보)
- **ElastiCache Redis**: 인메모리 캐싱
- **S3**: 정적 파일 및 데이터 레이크 스토리지

#### 4. 프론트엔드 Layer
- **CloudFront**: CDN을 통한 정적 콘텐츠 배포
- **S3**: 정적 웹사이트 호스팅

---

## 주차별 구현 내용

### Week 4-2: Lambda + API Gateway + Cognito 인증

#### 구현 내용
- Lambda 함수를 통한 예약 CRUD API 구현
- API Gateway REST API 설정
- Cognito User Pool 생성 및 인증 구현
- Lambda Authorizer를 통한 토큰 검증

#### 주요 Lambda 함수
- `QuickTableCreateReservation`: 예약 생성
- `QuickTableGetReservations`: 예약 조회
- `QuickTableUpdateReservation`: 예약 수정
- `QuickTableCancelReservation`: 예약 취소
- `QuickTableAuthorizer`: Cognito 토큰 검증

#### API 엔드포인트
- `POST /reservations` - 예약 생성
- `GET /reservations` - 사용자 예약 목록 조회
- `GET /reservations/{id}` - 특정 예약 조회
- `PUT /reservations/{id}` - 예약 수정
- `DELETE /reservations/{id}` - 예약 취소

#### 인증 흐름
1. 사용자가 Cognito를 통해 로그인
2. ID Token 발급
3. API 요청 시 Authorization 헤더에 토큰 포함
4. Lambda Authorizer가 토큰 검증
5. 검증 성공 시 Lambda 함수 실행

---

### Week 4-3: EventBridge 이벤트 처리

#### 구현 내용
- EventBridge를 통한 예약 상태 변경 이벤트 처리
- 예약 확인 이메일 자동 발송
- 이벤트 기반 아키텍처 구현

#### 이벤트 타입
```json
{
  "source": "quicktable.reservations",
  "detail-type": "Reservation Status Changed",
  "detail": {
    "reservationId": "string",
    "userId": "string",
    "restaurantId": "string",
    "status": "confirmed|cancelled|completed",
    "timestamp": "ISO-8601"
  }
}
```

#### 이벤트 처리 Lambda
- `QuickTableSendConfirmation`: 예약 확인 이메일 발송
- `QuickTableUpdateAnalytics`: 분석 데이터 업데이트
- `QuickTableNotifyRestaurant`: 레스토랑 알림 발송

#### EventBridge Rule
- **Rule Name**: `QuickTableReservationEvents`
- **Event Pattern**: `quicktable.reservations` 소스의 모든 이벤트
- **Targets**: Lambda 함수, SNS 토픽

---

### Week 5-3: DynamoDB 테이블 설계

#### QuickTableReservations 테이블

**기본 키 구조**
- **Partition Key**: `userId` (String) - 사용자 ID
- **Sort Key**: `reservationId` (String) - 예약 ID (UUID)

**속성**
- `restaurantId` (String) - 레스토랑 ID
- `date` (String) - 예약 날짜 (YYYY-MM-DD)
- `time` (String) - 예약 시간 (HH:MM)
- `partySize` (Number) - 인원 수
- `status` (String) - 예약 상태 (pending, confirmed, cancelled, completed)
- `customerName` (String) - 고객 이름
- `customerPhone` (String) - 고객 전화번호
- `specialRequests` (String) - 특별 요청사항
- `createdAt` (String) - 생성 시간 (ISO-8601)
- `updatedAt` (String) - 수정 시간 (ISO-8601)

**Global Secondary Index (GSI)**
- **Index Name**: `restaurantId-date-index`
- **Partition Key**: `restaurantId` (String)
- **Sort Key**: `date` (String)
- **Projection**: ALL
- **용도**: 특정 레스토랑의 날짜별 예약 조회

#### 쿼리 패턴

| 쿼리 목적 | 사용 인덱스 | 파티션 키 | 정렬 키 | 예시 |
|-----------|------------|----------|---------|------|
| 사용자의 모든 예약 조회 | 기본 테이블 | userId | - | user123의 모든 예약 |
| 사용자의 특정 예약 조회 | 기본 테이블 | userId | reservationId | user123의 res456 예약 |
| 레스토랑의 날짜별 예약 조회 | GSI | restaurantId | date | rest789의 2024-01-15 예약 |

---

### Week 10-2: ElastiCache Redis 캐싱

#### 구현 내용
- Redis 클러스터 생성 및 설정
- Lambda 함수에서 Redis 연결
- 예약 데이터 캐싱 전략 구현
- 캐시 무효화 로직 구현

#### 캐싱 전략

**캐시 키 패턴**
```
reservation:{reservationId}           # 개별 예약
user:{userId}:reservations            # 사용자 예약 목록
restaurant:{restaurantId}:date:{date} # 레스토랑 날짜별 예약
available-slots:{restaurantId}:{date} # 예약 가능 시간
```

**TTL (Time To Live)**
- 개별 예약: 1시간 (3600초)
- 예약 목록: 5분 (300초)
- 예약 가능 시간: 1분 (60초)

**캐시 무효화 시나리오**
- 예약 생성 시: 해당 레스토랑/날짜 캐시 삭제
- 예약 수정 시: 개별 예약 및 관련 목록 캐시 삭제
- 예약 취소 시: 개별 예약 및 관련 목록 캐시 삭제

---

### Week 10-3: CloudFront CDN 배포

#### 구현 내용
- CloudFront 배포 생성
- S3 버킷을 오리진으로 설정
- 정적 웹사이트 콘텐츠 배포
- 캐싱 정책 설정

#### CloudFront 설정

**오리진 설정**
- **Origin Domain**: `quicktable-frontend.s3.amazonaws.com`
- **Origin Access**: Origin Access Control (OAC)
- **Protocol**: HTTPS only

**캐싱 정책**
- **HTML 파일**: 5분 (no-cache 헤더)
- **CSS/JS 파일**: 1년 (버전 관리)
- **이미지 파일**: 1년
- **API 요청**: 캐싱 안 함

---

### Week 11-2: S3 + Glue + Athena 데이터 레이크

#### 구현 내용
- S3 데이터 레이크 구축
- AWS Glue 크롤러 설정
- Athena를 통한 SQL 쿼리
- 예약 데이터 분석 파이프라인

#### S3 버킷 구조
```
quicktable-datalake/
├── raw/
│   └── reservations/
│       └── year=2024/
│           └── month=01/
│               └── day=15/
│                   └── reservations.json
├── processed/
│   └── reservations/
│       └── year=2024/
│           └── month=01/
│               └── reservations.parquet
└── analytics/
    └── reports/
        └── daily-summary.csv
```

---

## AWS 서비스 사용 현황

### 컴퓨팅
- **AWS Lambda**: 서버리스 함수 실행
  - 예약 CRUD 작업
  - 이벤트 처리
  - 데이터 변환

### API 및 인증
- **Amazon API Gateway**: RESTful API 제공
- **Amazon Cognito**: 사용자 인증 및 권한 관리

### 데이터베이스 및 스토리지
- **Amazon DynamoDB**: NoSQL 데이터베이스
  - QuickTableReservations 테이블
  - QuickTableRestaurants 테이블
  - QuickTableMenus 테이블
- **Amazon ElastiCache (Redis)**: 인메모리 캐싱
- **Amazon S3**: 객체 스토리지
  - 정적 웹사이트 호스팅
  - 데이터 레이크

### 네트워킹 및 콘텐츠 배포
- **Amazon CloudFront**: CDN 서비스
- **Amazon VPC**: 네트워크 격리

### 통합 및 메시징
- **Amazon EventBridge**: 이벤트 버스
- **Amazon SNS**: 푸시 알림
- **Amazon SES**: 이메일 발송

### 분석 및 모니터링
- **AWS Glue**: 데이터 카탈로그 및 ETL
- **Amazon Athena**: 서버리스 쿼리 서비스
- **Amazon CloudWatch**: 로그 및 메트릭 모니터링

---

## 데이터 모델

### QuickTableReservations

```json
{
  "userId": "user-123",
  "reservationId": "res-456",
  "restaurantId": "rest-789",
  "date": "2024-01-15",
  "time": "19:00",
  "partySize": 4,
  "status": "confirmed",
  "customerName": "홍길동",
  "customerPhone": "+82-10-1234-5678",
  "specialRequests": "창가 자리 선호",
  "createdAt": "2024-01-10T10:30:00Z",
  "updatedAt": "2024-01-10T10:30:00Z"
}
```

### QuickTableRestaurants

```json
{
  "restaurantId": "rest-789",
  "name": "맛있는 레스토랑",
  "address": "서울시 강남구 테헤란로 123",
  "phone": "+82-2-1234-5678",
  "cuisine": "한식",
  "capacity": 50,
  "rating": 4.5
}
```

---

## API 엔드포인트

### 인증 API

#### 회원가입
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "홍길동",
  "phone": "+82-10-1234-5678"
}

Response: 200 OK
{
  "message": "회원가입이 완료되었습니다. 이메일을 확인해주세요."
}
```

#### 로그인
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "idToken": "eyJraWQiOiI...",
  "accessToken": "eyJraWQiOiI...",
  "refreshToken": "eyJjdHkiOiI...",
  "expiresIn": 3600
}
```

### 예약 API

#### 예약 생성
```http
POST /reservations
Authorization: Bearer {idToken}
Content-Type: application/json

{
  "restaurantId": "rest-789",
  "date": "2024-01-15",
  "time": "19:00",
  "partySize": 4,
  "customerName": "홍길동",
  "customerPhone": "+82-10-1234-5678",
  "specialRequests": "창가 자리 선호"
}

Response: 201 Created
{
  "reservationId": "res-456",
  "status": "pending",
  "message": "예약이 생성되었습니다."
}
```

#### 예약 목록 조회
```http
GET /reservations?status=confirmed&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {idToken}

Response: 200 OK
{
  "reservations": [
    {
      "reservationId": "res-456",
      "restaurantId": "rest-789",
      "restaurantName": "맛있는 레스토랑",
      "date": "2024-01-15",
      "time": "19:00",
      "partySize": 4,
      "status": "confirmed"
    }
  ],
  "count": 1
}
```

#### 예약 상세 조회
```http
GET /reservations/{reservationId}
Authorization: Bearer {idToken}

Response: 200 OK
{
  "reservationId": "res-456",
  "userId": "user-123",
  "restaurantId": "rest-789",
  "date": "2024-01-15",
  "time": "19:00",
  "partySize": 4,
  "status": "confirmed",
  "customerName": "홍길동",
  "customerPhone": "+82-10-1234-5678",
  "specialRequests": "창가 자리 선호",
  "createdAt": "2024-01-10T10:30:00Z",
  "updatedAt": "2024-01-10T10:30:00Z"
}
```

#### 예약 수정
```http
PUT /reservations/{reservationId}
Authorization: Bearer {idToken}
Content-Type: application/json

{
  "date": "2024-01-16",
  "time": "20:00",
  "partySize": 6,
  "specialRequests": "조용한 자리 선호"
}

Response: 200 OK
{
  "message": "예약이 수정되었습니다.",
  "reservation": { ... }
}
```

#### 예약 취소
```http
DELETE /reservations/{reservationId}
Authorization: Bearer {idToken}

Response: 200 OK
{
  "message": "예약이 취소되었습니다."
}
```

### 레스토랑 API

#### 레스토랑 목록 조회
```http
GET /restaurants?cuisine=한식&location=강남구

Response: 200 OK
{
  "restaurants": [
    {
      "restaurantId": "rest-789",
      "name": "맛있는 레스토랑",
      "cuisine": "한식",
      "rating": 4.5,
      "imageUrl": "https://cdn.quicktable.com/restaurants/rest-789.jpg"
    }
  ],
  "count": 1
}
```

#### 예약 가능 시간 조회
```http
GET /restaurants/{restaurantId}/available-slots?date=2024-01-15&partySize=4

Response: 200 OK
{
  "date": "2024-01-15",
  "availableSlots": [
    "11:00", "11:30", "12:00", "18:00", "18:30", "19:00", "19:30", "20:00"
  ]
}
```

---

## 명명 규칙 및 태그 표준

상세 내용은 [QuickTable 명명 규칙](../markdown-guide/12-quicktable-naming-standards.md)을 참조하세요.

### 리소스 명명 규칙

#### Lambda 함수
- **패턴**: `QuickTable{동작}{엔티티}`
- **예시**: `QuickTableCreateReservation`, `QuickTableGetReservations`

#### DynamoDB 테이블
- **패턴**: `QuickTable{엔티티명}`
- **예시**: `QuickTableReservations`, `QuickTableRestaurants`

#### API Gateway
- **패턴**: `QuickTableAPI`
- **Stage**: `prod`

#### S3 버킷
- **패턴**: `quicktable-{용도}-{계정ID}`
- **예시**: `quicktable-website-123456789012`, `quicktable-datalake-123456789012`

#### ElastiCache 클러스터
- **패턴**: `quicktable-{용도}-cache`
- **예시**: `quicktable-api-cache`

### 태그 표준

모든 QuickTable 리소스에 다음 태그를 추가합니다:

| Tag Key | Tag Value | 설명 |
|---------|-----------|------|
| `Project` | `QuickTable` | 프로젝트 식별자 |
| `Week` | `{주차}-{세션}` | 주차 및 세션 번호 |
| `CreatedBy` | `Student` | 생성자 구분 |
| `Component` | `{컴포넌트명}` | 시스템 컴포넌트 |

**Component 값**:
- `API` - Lambda, API Gateway
- `Frontend` - S3, CloudFront
- `Database` - DynamoDB
- `Cache` - ElastiCache
- `Analytics` - Glue, Athena
- `Messaging` - SNS, SES

---

## 개발 가이드라인

### 코드 작성 표준

#### Lambda 함수 구조
```javascript
// 환경 변수
const TABLE_NAME = process.env.TABLE_NAME;
const REDIS_ENDPOINT = process.env.REDIS_ENDPOINT;

// AWS SDK 클라이언트
const dynamodb = new AWS.DynamoDB.DocumentClient();
const redis = new Redis({ host: REDIS_ENDPOINT });

// 메인 핸들러
exports.handler = async (event) => {
  try {
    // 1. 입력 검증
    const body = JSON.parse(event.body);
    validateInput(body);
    
    // 2. 캐시 확인
    const cached = await getFromCache(key);
    if (cached) return response(200, cached);
    
    // 3. 비즈니스 로직
    const result = await processRequest(body);
    
    // 4. 캐시 저장
    await setCache(key, result);
    
    // 5. 응답 반환
    return response(200, result);
  } catch (error) {
    console.error('Error:', error);
    return response(500, { message: 'Internal server error' });
  }
};
```

#### 에러 처리
```javascript
// 표준 에러 응답
const errorResponse = (statusCode, message) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify({
    error: message,
    timestamp: new Date().toISOString()
  })
});

// 에러 타입별 처리
try {
  // 비즈니스 로직
} catch (error) {
  if (error.code === 'ConditionalCheckFailedException') {
    return errorResponse(409, '예약이 이미 존재합니다.');
  }
  if (error.code === 'ValidationException') {
    return errorResponse(400, '입력값이 올바르지 않습니다.');
  }
  return errorResponse(500, '서버 오류가 발생했습니다.');
}
```

#### 입력 검증
```javascript
const validateReservation = (data) => {
  const required = ['restaurantId', 'date', 'time', 'partySize'];
  
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`${field}는 필수 항목입니다.`);
    }
  }
  
  // 날짜 형식 검증 (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    throw new Error('날짜 형식이 올바르지 않습니다.');
  }
  
  // 시간 형식 검증 (HH:MM)
  if (!/^\d{2}:\d{2}$/.test(data.time)) {
    throw new Error('시간 형식이 올바르지 않습니다.');
  }
  
  // 인원 수 검증 (1-20)
  if (data.partySize < 1 || data.partySize > 20) {
    throw new Error('인원 수는 1-20명이어야 합니다.');
  }
};
```

### DynamoDB 쿼리 패턴

#### 기본 테이블 쿼리 (사용자의 예약 조회)
```javascript
const params = {
  TableName: TABLE_NAME,
  KeyConditionExpression: 'userId = :userId',
  ExpressionAttributeValues: {
    ':userId': userId
  }
};

const result = await dynamodb.query(params).promise();
```

#### GSI 쿼리 (레스토랑의 날짜별 예약 조회)
```javascript
const params = {
  TableName: TABLE_NAME,
  IndexName: 'restaurantId-date-index',
  KeyConditionExpression: 'restaurantId = :restaurantId AND #date = :date',
  ExpressionAttributeNames: {
    '#date': 'date'
  },
  ExpressionAttributeValues: {
    ':restaurantId': restaurantId,
    ':date': date
  }
};

const result = await dynamodb.query(params).promise();
```

#### 조건부 쓰기 (중복 방지)
```javascript
const params = {
  TableName: TABLE_NAME,
  Item: {
    userId,
    reservationId,
    ...reservationData
  },
  ConditionExpression: 'attribute_not_exists(reservationId)'
};

try {
  await dynamodb.put(params).promise();
} catch (error) {
  if (error.code === 'ConditionalCheckFailedException') {
    throw new Error('예약이 이미 존재합니다.');
  }
  throw error;
}
```

### 캐싱 전략

#### 캐시 우선 읽기 (Cache-Aside)
```javascript
async function getReservation(reservationId) {
  // 1. 캐시 확인
  const cacheKey = `reservation:${reservationId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    console.log('Cache hit');
    return JSON.parse(cached);
  }
  
  // 2. DynamoDB 조회
  console.log('Cache miss');
  const params = {
    TableName: TABLE_NAME,
    Key: { userId, reservationId }
  };
  
  const result = await dynamodb.get(params).promise();
  
  // 3. 캐시 저장
  if (result.Item) {
    await redis.setex(cacheKey, 3600, JSON.stringify(result.Item));
  }
  
  return result.Item;
}
```

#### 쓰기 시 캐시 무효화 (Write-Through)
```javascript
async function updateReservation(userId, reservationId, updates) {
  // 1. DynamoDB 업데이트
  const params = {
    TableName: TABLE_NAME,
    Key: { userId, reservationId },
    UpdateExpression: 'SET #date = :date, #time = :time',
    ExpressionAttributeNames: {
      '#date': 'date',
      '#time': 'time'
    },
    ExpressionAttributeValues: {
      ':date': updates.date,
      ':time': updates.time
    },
    ReturnValues: 'ALL_NEW'
  };
  
  const result = await dynamodb.update(params).promise();
  
  // 2. 캐시 무효화
  const cacheKeys = [
    `reservation:${reservationId}`,
    `user:${userId}:reservations`,
    `restaurant:${result.Attributes.restaurantId}:date:${updates.date}`
  ];
  
  await redis.del(...cacheKeys);
  
  return result.Attributes;
}
```

### 이벤트 발행

#### EventBridge 이벤트 발행
```javascript
const eventbridge = new AWS.EventBridge();

async function publishReservationEvent(eventType, reservation) {
  const params = {
    Entries: [{
      Source: 'quicktable.reservations',
      DetailType: eventType,
      Detail: JSON.stringify({
        reservationId: reservation.reservationId,
        userId: reservation.userId,
        restaurantId: reservation.restaurantId,
        status: reservation.status,
        timestamp: new Date().toISOString()
      })
    }]
  };
  
  await eventbridge.putEvents(params).promise();
  console.log(`Event published: ${eventType}`);
}

// 사용 예시
await publishReservationEvent('Reservation Created', reservation);
await publishReservationEvent('Reservation Cancelled', reservation);
```

### 보안 모범 사례

#### 1. 환경 변수 사용
```javascript
// ✅ 올바른 방법
const TABLE_NAME = process.env.TABLE_NAME;
const API_KEY = process.env.API_KEY;

// ❌ 잘못된 방법
const TABLE_NAME = 'QuickTableReservations'; // 하드코딩 금지
```

#### 2. IAM 최소 권한 원칙
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Query"
    ],
    "Resource": "arn:aws:dynamodb:ap-northeast-2:*:table/QuickTableReservations"
  }]
}
```

#### 3. 입력 검증 및 살균
```javascript
// XSS 방지
const sanitize = (input) => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// SQL Injection 방지 (DynamoDB는 자동 방어)
// NoSQL Injection 방지
const validateInput = (input) => {
  if (typeof input !== 'string') {
    throw new Error('Invalid input type');
  }
  if (input.includes('$') || input.includes('{')) {
    throw new Error('Invalid characters detected');
  }
};
```

#### 4. CORS 설정
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'https://quicktable.example.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};
```

### 로깅 및 모니터링

#### 구조화된 로깅
```javascript
const log = (level, message, data = {}) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data
  }));
};

// 사용 예시
log('INFO', 'Reservation created', {
  reservationId: 'res-456',
  userId: 'user-123',
  restaurantId: 'rest-789'
});

log('ERROR', 'Failed to create reservation', {
  error: error.message,
  stack: error.stack
});
```

#### CloudWatch 메트릭
```javascript
const cloudwatch = new AWS.CloudWatch();

async function publishMetric(metricName, value) {
  const params = {
    Namespace: 'QuickTable',
    MetricData: [{
      MetricName: metricName,
      Value: value,
      Unit: 'Count',
      Timestamp: new Date()
    }]
  };
  
  await cloudwatch.putMetricData(params).promise();
}

// 사용 예시
await publishMetric('ReservationCreated', 1);
await publishMetric('CacheHitRate', 0.85);
```

### 테스트 전략

#### 단위 테스트 예시
```javascript
const { handler } = require('./createReservation');

describe('createReservation', () => {
  test('should create reservation successfully', async () => {
    const event = {
      body: JSON.stringify({
        restaurantId: 'rest-789',
        date: '2024-01-15',
        time: '19:00',
        partySize: 4
      })
    };
    
    const result = await handler(event);
    
    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toHaveProperty('reservationId');
  });
  
  test('should return 400 for invalid input', async () => {
    const event = {
      body: JSON.stringify({
        restaurantId: 'rest-789'
        // 필수 필드 누락
      })
    };
    
    const result = await handler(event);
    
    expect(result.statusCode).toBe(400);
  });
});
```

### 성능 최적화

#### 1. 배치 작업
```javascript
// ✅ 배치 읽기
const params = {
  RequestItems: {
    [TABLE_NAME]: {
      Keys: reservationIds.map(id => ({ userId, reservationId: id }))
    }
  }
};

const result = await dynamodb.batchGet(params).promise();

// ✅ 배치 쓰기
const params = {
  RequestItems: {
    [TABLE_NAME]: reservations.map(item => ({
      PutRequest: { Item: item }
    }))
  }
};

await dynamodb.batchWrite(params).promise();
```

#### 2. 병렬 처리
```javascript
// ✅ Promise.all 사용
const [reservations, restaurants, menus] = await Promise.all([
  getReservations(userId),
  getRestaurants(),
  getMenus(restaurantId)
]);

// ❌ 순차 처리 (느림)
const reservations = await getReservations(userId);
const restaurants = await getRestaurants();
const menus = await getMenus(restaurantId);
```

#### 3. 연결 재사용
```javascript
// ✅ Lambda 외부에서 클라이언트 생성 (재사용)
const dynamodb = new AWS.DynamoDB.DocumentClient();
const redis = new Redis({ host: REDIS_ENDPOINT });

exports.handler = async (event) => {
  // 핸들러 로직
};

// ❌ 핸들러 내부에서 생성 (매번 새로 생성)
exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient(); // 비효율적
};
```

### 배포 전략

#### 1. 환경 분리
```
개발 환경 (dev):
- quicktable-dev-api
- QuickTableReservations-dev
- quicktable-dev-cache

프로덕션 환경 (prod):
- quicktable-prod-api
- QuickTableReservations-prod
- quicktable-prod-cache
```

#### 2. 버전 관리
```javascript
// Lambda 함수 버전 및 별칭
aws lambda publish-version --function-name QuickTableCreateReservation
aws lambda create-alias --function-name QuickTableCreateReservation \
  --name prod --function-version 1

// API Gateway 스테이지
- dev: 개발 환경
- staging: 스테이징 환경
- prod: 프로덕션 환경
```

#### 3. 블루/그린 배포
```yaml
# CodeDeploy 설정
DeploymentConfigName: CodeDeployDefault.LambdaAllAtOnce
# 또는
DeploymentConfigName: CodeDeployDefault.LambdaLinear10PercentEvery1Minute
```

### 문제 해결 가이드

#### 일반적인 오류 및 해결 방법

**1. Lambda 타임아웃**
```
증상: Task timed out after 3.00 seconds
원인: 함수 실행 시간 초과
해결:
- Lambda 타임아웃 설정 증가 (최대 15분)
- 비동기 작업은 Step Functions 사용
- 불필요한 대기 시간 제거
```

**2. DynamoDB ProvisionedThroughputExceededException**
```
증상: Request rate is too high
원인: 읽기/쓰기 용량 초과
해결:
- Auto Scaling 활성화
- On-Demand 모드로 전환
- 배치 작업 사용
- 캐싱 강화
```

**3. Redis 연결 오류**
```
증상: ECONNREFUSED
원인: Redis 엔드포인트 접근 불가
해결:
- 보안 그룹 확인 (포트 6379 허용)
- VPC 설정 확인
- 엔드포인트 주소 확인
```

**4. Cognito 토큰 검증 실패**
```
증상: Invalid token
원인: 만료되었거나 잘못된 토큰
해결:
- 토큰 만료 시간 확인
- Refresh Token으로 갱신
- User Pool ID 및 Client ID 확인
```

---

## 참고 자료

### AWS 공식 문서
- [AWS Lambda 개발자 가이드](https://docs.aws.amazon.com/lambda/)
- [Amazon DynamoDB 개발자 가이드](https://docs.aws.amazon.com/dynamodb/)
- [Amazon API Gateway 개발자 가이드](https://docs.aws.amazon.com/apigateway/)
- [Amazon Cognito 개발자 가이드](https://docs.aws.amazon.com/cognito/)
- [Amazon ElastiCache for Redis](https://docs.aws.amazon.com/elasticache/)

### 내부 문서
- [QuickTable 명명 규칙](../markdown-guide/12-quicktable-naming-standards.md)
- [리소스 태그 규칙](../markdown-guide/11-resource-tagging-rules.md)
- [CloudFormation 표준](cloudformation-standards.md)
- [개발 가이드](development-guide.md)

---

**마지막 업데이트**: 2025-02-18  
**버전**: 1.0.0  
**작성자**: AWS Lab Development Team
