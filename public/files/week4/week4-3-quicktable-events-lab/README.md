

# Amazon EventBridge 기반 레스토랑 예약 처리 시스템 실습 파일

이 패키지는 Amazon EventBridge를 사용하여 QuickTable 레스토랑 예약 시스템의 이벤트 기반 아키텍처를 구축하는 실습을 위한 파일들입니다.

## 📦 포함된 파일

- `week4-3-quicktable-events-lab.yaml` - CloudFormation 템플릿 (DynamoDB, EventBridge, Lambda, SNS 자동 생성)
- `reservation_processor.py` - 예약 생성 Lambda 함수 코드 (참고용)
- `table_availability_checker.py` - 테이블 재고 확인 Lambda 함수 코드 (참고용)
- `notification_sender.py` - 알림 발송 Lambda 함수 코드 (참고용)
- `README.md` - 이 파일

## 🏗️ 아키텍처 개요

```
ReservationProcessor (예약 생성)
    ↓ DynamoDB 저장
    ↓ EventBridge 이벤트 발행
EventBridge (ReservationCreated 이벤트)
    ↓ 규칙 매칭
TableAvailabilityChecker (테이블 재고 확인)
    ↓ DynamoDB 조회
    ↓ EventBridge 이벤트 발행 (슬롯 부족 시)
EventBridge (TableUnavailable 이벤트)
    ↓ 규칙 매칭
NotificationSender (SNS 알림 발송)
```

## 🚀 CloudFormation 스택 생성

### 자동 생성되는 리소스

CloudFormation 스택은 다음 리소스를 자동으로 생성합니다:

| 리소스 타입 | 리소스 이름 | 설명 |
|------------|------------|------|
| DynamoDB 테이블 | `Reservations` | 예약 데이터 저장 |
| DynamoDB 테이블 | `RestaurantAvailability` | 레스토랑별 시간대별 예약 가능 슬롯 저장 |
| EventBridge Event Bus | `ReservationEventBus` | 이벤트 라우팅 |
| Lambda 함수 | `ReservationProcessor` | 예약 생성 및 이벤트 발행 |
| Lambda 함수 | `TableAvailabilityChecker` | 테이블 재고 확인 |
| Lambda 함수 | `NotificationSender` | 알림 발송 |
| IAM 역할 | `Lambda-ExecutionRole` | Lambda 함수 실행 권한 |
| SNS Topic | `ReservationNotifications` | 알림 발송 |
| CloudWatch Logs Groups | 3개 | Lambda 함수 로그 저장 |

### 스택 생성 단계

1. CloudFormation 콘솔에서 [[Create stack]] 클릭
2. `week4-3-quicktable-events-lab.yaml` 파일 업로드
3. Stack name: `week4-3-quicktable-events-lab-stack`
4. Parameters: 기본값 유지 (`week4-3-quicktable-events-lab`)
5. Tags 추가:
   - `Project=AWS-Lab`
   - `Week=4-3`
   - `CreatedBy=Student`
6. Capabilities 체크: `I acknowledge that AWS CloudFormation might create IAM resources`
7. [[Submit]] 클릭
8. 스택 생성 완료 대기 (3-5분 소요)

### Outputs 확인

스택 생성 완료 후 **Outputs** 탭에서 다음 값을 복사합니다:

| Output Key | 설명 | 예시 값 |
|-----------|------|---------|
| `ReservationsTableName` | Reservations 테이블 이름 | `week4-3-quicktable-events-lab-Reservations` |
| `RestaurantAvailabilityTableName` | RestaurantAvailability 테이블 이름 | `week4-3-quicktable-events-lab-RestaurantAvailability` |
| `ReservationEventBusName` | Event Bus 이름 | `week4-3-quicktable-events-lab-ReservationEventBus` |
| `LambdaExecutionRoleArn` | Lambda 실행 역할 ARN | `arn:aws:iam::123456789012:role/...` |
| `ReservationNotificationTopicArn` | SNS Topic ARN | `arn:aws:sns:ap-northeast-2:123456789012:...` |

## 📊 초기 데이터

CloudFormation 스택은 RestaurantAvailability 테이블에 다음 초기 데이터를 자동으로 삽입합니다:

| 레스토랑 ID | 시간대 | 예약 가능 슬롯 | 용도 |
|-----------|--------|---------------|------|
| `restaurant-001` | `2026-03-20#18:00` | 5개 | 예약 가능 테스트 |
| `restaurant-001` | `2026-03-20#19:00` | 5개 | 예약 가능 테스트 |
| `restaurant-001` | `2026-03-20#20:00` | 5개 | 예약 가능 테스트 |
| `restaurant-002` | `2026-03-20#18:00` | 8개 | 예약 가능 테스트 |
| `restaurant-002` | `2026-03-20#19:00` | 8개 | 예약 가능 테스트 |
| `restaurant-002` | `2026-03-20#20:00` | 8개 | 예약 가능 테스트 |
| `restaurant-003` | `2026-03-20#18:00` | 3개 | 예약 불가 테스트 |
| `restaurant-003` | `2026-03-20#19:00` | 3개 | 예약 불가 테스트 |
| `restaurant-003` | `2026-03-20#20:00` | 3개 | 예약 불가 테스트 |
| `restaurant-004` | `2026-03-20#18:00` | 10개 | 예약 가능 테스트 |
| `restaurant-004` | `2026-03-20#19:00` | 10개 | 예약 가능 테스트 |
| `restaurant-004` | `2026-03-20#20:00` | 10개 | 예약 가능 테스트 |

> [!NOTE]
> timeSlot 형식은 `날짜#시간` (예: `2026-03-20#19:00`)입니다.

## 🧪 테스트 방법

### 1. 예약 가능 시나리오 테스트

**테스트 이벤트**:
```json
{
  "reservationId": "res-001",
  "userId": "user-123",
  "restaurantId": "restaurant-001",
  "date": "2026-03-20",
  "time": "19:00",
  "partySize": 2,
  "phoneNumber": "010-1234-5678"
}
```

**예상 결과**:
- ReservationProcessor: 예약 데이터 DynamoDB 저장 + ReservationCreated 이벤트 발행
- TableAvailabilityChecker: 자동 실행 → 예약 가능 (partySize=2 < availableSlots=5)
- NotificationSender: 실행되지 않음 (TableUnavailable 이벤트 발행 안 됨)

### 2. 예약 불가 시나리오 테스트

**테스트 이벤트**:
```json
{
  "reservationId": "res-002",
  "userId": "user-456",
  "restaurantId": "restaurant-003",
  "date": "2026-03-20",
  "time": "19:00",
  "partySize": 4,
  "phoneNumber": "010-9876-5432"
}
```

**예상 결과**:
- ReservationProcessor: 예약 데이터 DynamoDB 저장 + ReservationCreated 이벤트 발행
- TableAvailabilityChecker: 자동 실행 → 예약 불가 (partySize=4 > availableSlots=3) → TableUnavailable 이벤트 발행
- NotificationSender: 자동 실행 → SNS 알림 발송

## 📋 이벤트 패턴

### ReservationCreated 이벤트

```json
{
  "source": "reservation.service",
  "detail-type": "ReservationCreated",
  "detail": {
    "reservationId": "res-001",
    "userId": "user-123",
    "restaurantId": "restaurant-001",
    "date": "2026-03-20",
    "time": "19:00",
    "timeSlot": "2026-03-20#19:00",
    "partySize": 2,
    "phoneNumber": "010-1234-5678",
    "status": "pending",
    "createdAt": "2024-02-15T10:30:00.123456"
  }
}
```

### TableUnavailable 이벤트

```json
{
  "source": "availability.service",
  "detail-type": "TableUnavailable",
  "detail": {
    "restaurantId": "restaurant-003",
    "reservationId": "res-002",
    "timeSlot": "2026-03-20#19:00",
    "partySize": 4,
    "availableSlots": 3,
    "timestamp": "2024-02-15T10:30:05.123456"
  }
}
```

## 🔍 Lambda 함수 코드 설명

### reservation_processor.py

**주요 기능**:
1. 예약 데이터를 DynamoDB Reservations 테이블에 저장
2. `date`와 `time` 필드를 `timeSlot` 형식으로 변환 (`날짜#시간`)
3. EventBridge에 ReservationCreated 이벤트 발행

**환경 변수**:
- `RESERVATIONS_TABLE`: DynamoDB Reservations 테이블 이름
- `EVENT_BUS_NAME`: EventBridge Event Bus 이름

### table_availability_checker.py

**주요 기능**:
1. EventBridge에서 ReservationCreated 이벤트 수신
2. DynamoDB RestaurantAvailability 테이블에서 예약 가능 슬롯 조회
3. `partySize` vs `availableSlots` 비교
4. 슬롯 부족 시 TableUnavailable 이벤트 발행

**환경 변수**:
- `RESTAURANT_AVAILABILITY_TABLE`: DynamoDB RestaurantAvailability 테이블 이름
- `EVENT_BUS_NAME`: EventBridge Event Bus 이름

### notification_sender.py

**주요 기능**:
1. EventBridge에서 TableUnavailable 이벤트 수신
2. SNS Topic을 통해 예약 불가 알림 발송
3. `timeSlot`을 날짜와 시간으로 분리하여 메시지 생성

**환경 변수**:
- `SNS_TOPIC_ARN`: SNS Topic ARN

## 🔗 EventBridge 규칙 생성

CloudFormation 스택은 Lambda 함수만 생성하며, EventBridge 규칙은 학생이 직접 생성합니다.

### ReservationCreatedRule

**이벤트 패턴**:
```json
{
  "source": ["reservation.service"],
  "detail-type": ["ReservationCreated"]
}
```

**타겟**: `TableAvailabilityChecker` Lambda 함수

### TableUnavailableRule

**이벤트 패턴**:
```json
{
  "source": ["availability.service"],
  "detail-type": ["TableUnavailable"]
}
```

**타겟**: `NotificationSender` Lambda 함수

## 🔍 트러블슈팅

### TableAvailabilityChecker가 자동 실행되지 않음

**원인**: EventBridge 규칙에 Lambda 함수가 연결되지 않음

**해결**:
1. EventBridge 콘솔에서 `ReservationCreatedRule` 규칙 선택
2. **Targets** 섹션에서 `TableAvailabilityChecker` 함수 연결 확인
3. 없으면 [[Edit]] → [[Add target]] → `TableAvailabilityChecker` 선택

### NotificationSender가 실행되지 않음

**원인**: 재고가 충분하여 TableUnavailable 이벤트가 발행되지 않음

**해결**: 테스트 시 `partySize`를 크게 설정 (예: `restaurant-003`에 `partySize=4`)

### SNS 알림이 수신되지 않음

**원인**: SNS Topic에 구독이 없음

**해결**:
1. SNS 콘솔에서 `week4-3-quicktable-events-lab-ReservationNotifications` Topic 선택
2. [[Create subscription]] 클릭
3. Protocol: `Email`
4. Endpoint: 이메일 주소 입력
5. 이메일 확인 후 구독 승인

## 📚 학습 포인트

1. **이벤트 기반 아키텍처**: 서비스 간 느슨한 결합 구현
2. **EventBridge Event Bus**: 이벤트 라우팅 및 필터링
3. **이벤트 패턴 매칭**: `source`, `detail-type` 기반 필터링
4. **Lambda 통합**: EventBridge 트리거 및 이벤트 발행
5. **비동기 처리**: 예약 생성 → 재고 확인 → 알림 발송 (각 단계 독립적)

## 🧹 리소스 정리

### EventBridge 규칙 삭제

1. EventBridge 콘솔로 이동
2. Event bus: `week4-3-quicktable-events-lab-ReservationEventBus` 선택
3. `ReservationCreatedRule` 규칙 선택 → [[Delete]]
4. `TableUnavailableRule` 규칙 선택 → [[Delete]]

### CloudFormation 스택 삭제

1. CloudFormation 콘솔로 이동
2. `week4-3-quicktable-events-lab-stack` 스택 선택
3. [[Delete]] 버튼 클릭
4. 스택 삭제 완료 대기 (2-3분 소요)

> [!NOTE]
> CloudFormation 스택을 삭제하면 DynamoDB 테이블, EventBridge Event Bus, Lambda 함수, IAM 역할, SNS Topic 등 모든 리소스가 자동으로 삭제됩니다.

## 🔗 추가 학습 리소스

- [Amazon EventBridge 개발자 가이드](https://docs.aws.amazon.com/eventbridge/latest/userguide/what-is-amazon-eventbridge.html)
- [이벤트 기반 아키텍처 패턴](https://aws.amazon.com/event-driven-architecture/)
- [EventBridge 이벤트 패턴](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html)
- [Lambda와 EventBridge 통합](https://docs.aws.amazon.com/lambda/latest/dg/with-eventbridge.html)
