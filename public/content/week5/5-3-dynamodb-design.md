---
title: "Amazon DynamoDB 테이블 생성 및 보조 인덱스 활용"
week: 5
session: 3
awsServices:
  - Amazon DynamoDB
learningObjectives:
  - Amazon RDS Multi-AZ 배포와 Amazon RDS Read Replica를 비교하고 선택할 수 있습니다
  - Amazon RDS의 백업 방식과 스냅샷 활용 방법을 이해할 수 있습니다
  - Amazon RDS Proxy로 데이터베이스 연결을 최적화할 수 있습니다
  - Amazon Aurora의 클러스터 아키텍처 구조와 Amazon RDS와의 차이를 설명할 수 있습니다
  - Amazon Aurora의 고가용성 구조와 장애 조치 방식을 설명할 수 있습니다
  - 파티션 키와 정렬 키 설계 원칙을 이해할 수 있습니다
  - GSI와 LSI를 비교하고 쿼리 요구사항에 맞게 활용할 수 있습니다
prerequisites:
  - NoSQL 데이터베이스 기본 개념 이해
  - AWS Management Console 사용 경험
---


이 실습에서는 Amazon DynamoDB의 NoSQL 데이터 모델링과 테이블 설계 전략을 학습합니다. Week 4에서 구축한 QuickTable 레스토랑 예약 시스템의 데이터 모델을 설계하고, 파티션 키(Partition Key)와 정렬 키(Sort Key)를 선택하여 효율적인 데이터 액세스를 구현합니다. 사용자별 예약 조회, 레스토랑별 예약 조회, 날짜별 예약 조회 등 다양한 쿼리 패턴을 지원하는 테이블을 설계합니다.

LSI(Local Secondary Index)와 GSI(Global Secondary Index)를 모두 생성하여 다양한 쿼리 패턴을 지원하고, 두 인덱스의 차이를 실습을 통해 이해합니다. On-Demand와 Provisioned 용량 모드를 비교하고, Amazon DynamoDB 용량 모드 및 모니터링 방법을 학습합니다.

> [!DOWNLOAD]
> [week5-3-quicktable-reservations-lab.zip](/files/week5/week5-3-quicktable-reservations-lab.zip)
> - `sample_reservations.json` - 예약 샘플 데이터 (10개 예약, AWS CLI batch-write-item 형식)
> - `batch_write_reservations.sh` - AWS CLI 일괄 입력 스크립트
> - `README.md` - AWS CLI/Python 일괄 입력 방법, 쿼리 예시, GSI 설계 가이드
> 
> **관련 태스크:**
> 
> - 태스크 3: 항목 추가 (AWS CLI batch-write-item으로 10개 항목 일괄 입력, 콘솔 입력은 첫 1건만 상세 안내)

> [!WARNING]
> 이 실습에서 생성하는 리소스는 실습 종료 후 **반드시 삭제해야 합니다**.
> 
> **예상 비용** (ap-northeast-2 리전 기준):
> 
> | 리소스 | 모드 | 실습 사용량 | 비용 |
> |--------|------|------------|------|
> | DynamoDB 테이블 | On-Demand | 약 10개 항목, 수십 건 쿼리 | **$0 (프리 티어 범위 내)** |
> 
> **DynamoDB 프리 티어 (Always Free)**:
> - **스토리지**: 25 GB (이 실습: 약 1 KB 미만 사용)
> - **Provisioned 모드**: 25 RCU + 25 WCU (이 실습은 On-Demand 모드 사용)
> - **On-Demand 모드**: 별도 프리 티어 없음 (요청당 과금)
> 
> 이 실습에서는 10개 항목과 수십 건의 쿼리만 수행하므로 On-Demand 모드에서도 비용이 거의 발생하지 않습니다 (예상: $0.01 미만).

## 태스크 1: Amazon DynamoDB 테이블 생성 (LSI 포함)

이 태스크에서는 설계한 스키마를 바탕으로 Amazon DynamoDB 테이블을 생성합니다. 파티션 키와 정렬 키를 설정하고, LSI(Local Secondary Index)를 추가하여 날짜 기반 쿼리를 지원합니다. On-demand 모드는 사용량에 따라 자동으로 확장되어 예측 불가능한 워크로드에 적합하며, Provisioned 모드는 읽기/쓰기 용량을 미리 지정하여 비용을 예측할 수 있습니다. 암호화는 기본적으로 활성화되어 저장 데이터를 보호합니다.

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Amazon DynamoDB`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Tables**를 선택합니다.
3. [[Create table]] 버튼을 클릭합니다.
4. **Table name**에 `QuickTableReservations`를 입력합니다.
5. **Partition key**에 `userId`를 입력한 후 타입에서 `String`을 선택합니다.
6. **Sort key**에 `reservationId`를 입력한 후 타입에서 `String`을 선택합니다.

> [!NOTE]
> 2025년 기준 DynamoDB 콘솔에서는 Sort key 입력 필드가 기본적으로 표시됩니다. 
> 이전 버전의 콘솔에서는 "Sort key" 체크박스를 선택해야 입력 필드가 나타날 수 있습니다.
7. 아래로 스크롤하여 **Secondary indexes** 섹션을 확인합니다.
8. **Secondary indexes** 섹션을 확장합니다.
9. [[Create local index]] 버튼을 클릭합니다.

> [!NOTE]
> LSI(Local Secondary Index)는 테이블 생성 시에만 추가할 수 있습니다. 테이블 생성 후에는 LSI를 추가하거나 삭제할 수 없습니다.

11. **Sort key**에 `date`를 입력한 후 타입에서 `String`을 선택합니다.
12. **Index name**이 `userId-date-index`로 자동 생성되었는지 확인합니다.

> [!NOTE]
> Index name은 파티션 키와 정렬 키를 조합하여 자동으로 생성됩니다. 
> 필요시 다른 이름으로 변경할 수 있지만, 이 실습에서는 자동 생성된 이름을 그대로 사용합니다.

13. **Attribute projections**에서 `All`을 선택합니다.

> [!NOTE]
> Attribute projections의 `All`은 모든 속성을 인덱스에 포함합니다. 이렇게 하면 인덱스 쿼리 시 추가 읽기 없이 모든 데이터를 가져올 수 있습니다.

13. 아래로 스크롤하여 **Table class**에서 `Amazon DynamoDB Standard`를 선택합니다.
14. **Capacity mode**에서 `On-demand`를 선택합니다.
15. **Encryption type**에서 `Owned by Amazon DynamoDB`를 선택합니다 (기본값).
16. 아래로 스크롤하여 **Tags - optional** 섹션을 확인합니다.
17. [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `5-3` |
| `CreatedBy` | `Student` |

18. [[Create table]] 버튼을 클릭합니다.

> [!NOTE]
> 테이블 생성에 1-2분이 소요됩니다. 상태가 "Active"로 변경될 때까지 기다립니다.

✅ **태스크 완료**: Amazon DynamoDB 테이블과 LSI가 생성되었습니다.

## 태스크 2: 항목 추가

이 태스크에서는 Amazon DynamoDB 테이블에 샘플 예약 데이터를 추가합니다. AWS CLI의 batch-write-item 명령어를 사용하여 10개의 샘플 데이터를 일괄 입력합니다.

> [!WARNING]
> **태스크 2.1(AWS CLI 일괄 입력)을 권장합니다.** 태스크 2.2(콘솔 수동 입력)는 1개 항목만 입력하므로 이후 태스크에서 데이터가 부족할 수 있습니다.
> 
> **태스크 2.2를 선택한 경우**: 이후 태스크(3, 4, 6, 7)에서 충분한 데이터가 필요합니다. 최소 5개 이상의 항목을 입력하는 것을 권장합니다.
> 
> **필수 입력 데이터**:
> - **태스크 3**: user-001의 예약 2개 이상 필요 (파티션 키 쿼리 테스트)
> - **태스크 4**: user-001의 다양한 날짜 예약 필요 (LSI 날짜 범위 쿼리 테스트)
> - **태스크 6**: restaurant-001의 예약 여러 개 필요 (GSI 레스토랑별 쿼리 테스트)
> - **태스크 7**: user-002의 res-20260318-001 예약 필요 (항목 업데이트 테스트, **status는 반드시 pending으로 입력**)
> 
> 다운로드한 `sample_reservations.json` 파일에서 각 항목의 속성 값을 참조하여 수동으로 입력할 수 있습니다.

### 태스크 2.1: AWS CLI로 샘플 데이터 일괄 입력 (권장)

1. 다운로드한 `week5-3-quicktable-reservations-lab.zip` 파일의 압축을 해제합니다.
2. AWS CloudShell 아이콘을 클릭합니다.
3. AWS CloudShell 우측 상단의 **Actions** > **Upload file**을 선택합니다.
4. `sample_reservations.json` 파일을 선택하여 업로드합니다.

> [!NOTE]
> CloudShell에 파일이 업로드되면 홈 디렉토리에 저장됩니다.
> 
> **파일 업로드 대안**: CloudShell은 1MB 이하의 파일만 업로드할 수 있습니다. 
> 파일이 크거나 업로드가 불가능한 경우, vi 또는 nano 편집기를 사용하여 파일 내용을 직접 입력할 수 있습니다:
> ```bash
> nano sample_reservations.json
> # 파일 내용을 붙여넣고 Ctrl+X, Y, Enter로 저장
> ```

5. 다음 명령어를 실행합니다:

```bash
aws dynamodb batch-write-item --request-items file://sample_reservations.json
```

> [!NOTE]
> `batch-write-item` 명령어는 한 번에 최대 25개 항목을 처리할 수 있습니다. 
> 이 실습에서는 10개 항목을 입력하므로 한 번의 요청으로 모두 처리됩니다.
> 
> **CloudShell 세션 타임아웃 주의**: CloudShell은 약 20분간 활동이 없으면 세션이 종료됩니다.
> 세션이 종료된 경우 파일을 다시 업로드하고 명령어를 재실행해야 합니다.

> [!OUTPUT]
> ```json
> {
>     "UnprocessedItems": {}
> }
> ```

> [!NOTE]
> `UnprocessedItems`가 비어있으면 모든 항목이 성공적으로 입력되었습니다.
> 10개의 예약 데이터(3명의 사용자, 2개의 레스토랑)가 테이블에 추가되었습니다.

5. Amazon DynamoDB 콘솔로 이동합니다.
6. `QuickTableReservations` 테이블을 선택합니다.
7. **Explore table items** 탭을 선택합니다.
8. **Scan or query items** 섹션에서 `Scan`을 선택합니다.
9. [[Run]] 버튼을 클릭하여 모든 항목을 확인합니다.

> [!NOTE]
> 10개의 예약 항목이 표시됩니다. 이 데이터는 다음 태스크에서 쿼리 및 GSI 테스트에 사용됩니다.

Scan 작업은 테이블의 모든 항목을 읽어오므로 주의가 필요합니다.

> [!WARNING]
> **Scan 사용 주의사항**: Scan은 테이블의 모든 항목을 읽어오므로 대용량 테이블에서는 비용이 많이 발생하고 성능이 저하됩니다.
> 프로덕션 환경에서는 Query를 사용하여 파티션 키로 데이터를 조회하는 것을 권장합니다.
> 이 실습에서는 소량의 데이터(10개)를 확인하기 위해 Scan을 사용합니다.

### 태스크 2.2: 콘솔에서 수동 입력 (선택사항)

> [!WARNING]
> 이 방법은 1개 항목만 입력하므로 이후 태스크(특히 태스크 6)에서 데이터가 부족할 수 있습니다.
> 가능하면 태스크 2.1(AWS CLI 일괄 입력)을 사용하세요.

AWS CLI를 사용할 수 없는 경우 콘솔에서 수동으로 입력할 수 있습니다. 다음은 첫 번째 항목 입력 방법입니다:

1. 생성된 `QuickTableReservations` 테이블을 클릭합니다.
2. **Explore table items** 탭을 선택합니다.
3. [[Create item]] 버튼을 클릭합니다.
4. **userId** (String)에 `user-001`을 입력합니다.
5. **reservationId** (String)에 `res-20260315-001`을 입력합니다.
6. [[Add new attribute]] 버튼을 클릭합니다.
7. **String**을 선택한 후 속성 이름에 `restaurantId`, 값에 `restaurant-001`을 입력합니다.
8. [[Add new attribute]] 버튼을 클릭합니다.
9. **String**을 선택한 후 속성 이름에 `restaurantName`, 값에 `강남 맛집`을 입력합니다.
10. [[Add new attribute]] 버튼을 클릭합니다.
11. **String**을 선택한 후 속성 이름에 `date`, 값에 `2026-03-20`을 입력합니다.
12. [[Add new attribute]] 버튼을 클릭합니다.
13. **String**을 선택한 후 속성 이름에 `time`, 값에 `18:00`을 입력합니다.
14. [[Add new attribute]] 버튼을 클릭합니다.
15. **Number**를 선택한 후 속성 이름에 `partySize`, 값에 `4`를 입력합니다.
16. [[Add new attribute]] 버튼을 클릭합니다.
17. **String**을 선택한 후 속성 이름에 `phoneNumber`, 값에 `010-1234-5678`을 입력합니다.
18. [[Add new attribute]] 버튼을 클릭합니다.
19. **String**을 선택한 후 속성 이름에 `status`, 값에 `confirmed`를 입력합니다.
20. [[Add new attribute]] 버튼을 클릭합니다.
21. **String**을 선택한 후 속성 이름에 `createdAt`, 값에 `2026-02-15T10:30:00.123456`을 입력합니다.
22. [[Create item]] 버튼을 클릭합니다.

> [!NOTE]
> 나머지 9개 항목도 같은 방법으로 추가할 수 있습니다. 
> 다운로드한 `sample_reservations.json` 파일에서 각 항목의 속성 값을 참조하세요.

✅ **태스크 완료**: 샘플 데이터가 추가되었습니다.

## 태스크 3: 데이터 쿼리

이 태스크에서는 Amazon DynamoDB 테이블에서 데이터를 쿼리합니다. Partition Key를 사용하여 특정 사용자의 예약을 조회합니다.

1. **Explore table items** 탭을 선택합니다.
2. **Scan or query items** 섹션에서 `Query`를 선택합니다.
3. **Partition key**에 `user-001`을 입력합니다.
4. [[Run]] 버튼을 클릭합니다.

> [!OUTPUT]
> user-001 사용자의 모든 예약(2개)이 표시됩니다.

이제 Sort key 조건을 추가하여 특정 예약만 조회합니다:

5. **Sort key** 오른쪽의 [[Add condition]] 버튼을 클릭합니다.

> [!NOTE]
> Sort key 조건은 Partition key 입력 필드 바로 아래에 있습니다. 
> [[Add condition]] 버튼을 클릭하면 조건 선택 드롭다운이 나타납니다.

6. 조건 드롭다운에서 `=` (equals)를 선택합니다.
7. 값 입력 필드에 `res-20260315-001`을 입력합니다.
8. [[Run]] 버튼을 클릭합니다.

> [!OUTPUT]
> 특정 예약 1개만 표시됩니다.

✅ **태스크 완료**: 데이터 쿼리를 수행했습니다.

## 태스크 4: LSI를 사용한 날짜 기반 쿼리

이 태스크에서는 태스크 1에서 생성한 LSI(Local Secondary Index)를 사용하여 특정 사용자의 날짜 범위 예약을 조회합니다. LSI는 동일한 파티션 키(userId)를 사용하되, 다른 정렬 키(date)로 데이터를 정렬하여 날짜 기반 쿼리를 효율적으로 지원합니다.

> [!NOTE]
> 태스크 3에서 Sort key 조건을 추가한 경우, 이번 태스크를 시작하기 전에 조건을 초기화해야 합니다.
> 페이지를 새로고침하거나 **Scan or query items** 섹션에서 `Scan`을 선택한 후 다시 `Query`를 선택하면 모든 조건이 초기화됩니다.

1. **Explore table items** 탭을 선택합니다.
2. **Scan or query items** 섹션에서 `Query`를 선택합니다.
3. **Index** 드롭다운에서 `userId-date-index`를 선택합니다.
4. **Partition key** (userId)에 `user-001`을 입력합니다.
5. [[Run]] 버튼을 클릭합니다.

> [!OUTPUT]
> user-001 사용자의 모든 예약이 날짜 순서로 정렬되어 표시됩니다.

6. **Sort key** 오른쪽의 [[Add condition]] 버튼을 클릭합니다.
7. 조건 드롭다운에서 `between`을 선택합니다.
8. 시작 값 입력 필드에 `2026-03-01`을 입력합니다.
9. 종료 값 입력 필드에 `2026-03-31`을 입력합니다.
10. [[Run]] 버튼을 클릭합니다.

> [!OUTPUT]
> user-001 사용자의 2026년 3월 예약만 날짜 순서로 표시됩니다.

LSI는 동일한 파티션 키를 사용하므로 특정 사용자의 데이터만 조회할 수 있습니다.

> [!NOTE]
> LSI는 동일한 파티션 키(userId)를 사용하므로, 특정 사용자의 데이터만 쿼리할 수 있습니다. 
> 다른 사용자의 예약을 조회하려면 파티션 키를 변경해야 합니다.

✅ **태스크 완료**: LSI를 사용한 날짜 기반 쿼리를 수행했습니다.

## 태스크 5: GSI를 생성하여 다양한 쿼리 패턴 지원

이 태스크에서는 GSI(Global Secondary Index)를 생성하여 레스토랑별 예약 조회 패턴을 지원합니다. GSI는 기본 테이블과 다른 파티션 키를 사용할 수 있어, 완전히 다른 쿼리 패턴을 지원합니다.

1. **Indexes** 탭을 선택합니다.
2. [[Create index]] 버튼을 클릭합니다.
3. **Partition key**에 `restaurantId`를 입력한 후 타입에서 `String`을 선택합니다.
4. **Sort key**에 `date`를 입력한 후 타입에서 `String`을 선택합니다.
5. **Index name**이 `restaurantId-date-index`로 자동 생성되었는지 확인합니다.

> [!NOTE]
> Index name은 파티션 키와 정렬 키를 조합하여 자동으로 생성됩니다. 
> 필요시 다른 이름으로 변경할 수 있지만, 이 실습에서는 자동 생성된 이름을 그대로 사용합니다.

6. **Attribute projections**에서 `All`을 선택합니다.

> [!NOTE]
> On-Demand 모드 테이블에서는 GSI 생성 시 읽기/쓰기 용량을 별도로 설정할 필요가 없습니다.
> GSI도 테이블과 동일하게 On-Demand 모드로 자동 설정됩니다.

7. [[Create index]] 버튼을 클릭합니다.

> [!NOTE]
> GSI 생성에 1-2분이 소요됩니다. 상태가 "Active"로 변경될 때까지 기다립니다.

GSI는 테이블 생성 후에도 유연하게 관리할 수 있습니다.

> [!NOTE]
> GSI는 테이블 생성 후에도 언제든지 추가하거나 삭제할 수 있습니다. 이는 LSI와의 주요 차이점입니다.

✅ **태스크 완료**: GSI가 생성되었습니다.

## 태스크 6: GSI를 사용한 쿼리

이 태스크에서는 생성한 GSI를 사용하여 레스토랑별로 데이터를 쿼리합니다. GSI를 통해 다양한 쿼리 패턴을 지원할 수 있습니다.

1. **Explore table items** 탭을 선택합니다.
2. **Scan or query items** 섹션에서 `Query`를 선택합니다.
3. **Index** 드롭다운에서 `restaurantId-date-index`를 선택합니다.
4. **Partition key** (restaurantId)에 `restaurant-001`을 입력합니다.
5. [[Run]] 버튼을 클릭합니다.

> [!OUTPUT]
> restaurant-001 레스토랑의 모든 예약이 표시됩니다.

6. **Sort key** 오른쪽의 [[Add condition]] 버튼을 클릭합니다.

> [!NOTE]
> Sort key 조건은 Partition key 입력 필드 바로 아래에 있습니다. 
> [[Add condition]] 버튼을 클릭하면 조건 선택 드롭다운이 나타납니다.

7. 조건 드롭다운에서 `between`을 선택합니다.
8. 시작 값 입력 필드에 `2026-03-01`을 입력합니다.
9. 종료 값 입력 필드에 `2026-03-31`을 입력합니다.
10. [[Run]] 버튼을 클릭합니다.

> [!OUTPUT]
> 2026년 3월의 restaurant-001 예약만 표시됩니다.

GSI는 다른 파티션 키를 사용하여 더 유연한 쿼리가 가능합니다.

> [!NOTE]
> GSI는 다른 파티션 키(restaurantId)를 사용하므로, 모든 사용자의 예약을 레스토랑별로 조회할 수 있습니다.
> 이는 LSI와의 주요 차이점입니다. LSI는 동일한 파티션 키(userId)만 사용할 수 있습니다.

✅ **태스크 완료**: GSI를 사용한 쿼리를 수행했습니다.

## 태스크 7: 항목 업데이트

이 태스크에서는 Amazon DynamoDB 테이블의 항목을 업데이트합니다. 예약 상태를 변경하여 데이터 수정 방법을 학습합니다.

1. **Explore table items** 탭을 선택합니다.
2. **Scan or query items** 섹션에서 `Query`를 선택합니다.
3. **Partition key**에 `user-002`를 입력합니다.
4. **Sort key** 오른쪽의 [[Add condition]] 버튼을 클릭합니다.
5. 조건 드롭다운에서 `=` (equals)를 선택합니다.
6. 값 입력 필드에 `res-20260318-001`을 입력합니다.
7. [[Run]] 버튼을 클릭합니다.
8. 조회된 항목의 체크박스를 선택합니다.
9. [[Actions]] 드롭다운에서 `Edit item`을 선택합니다.

> [!NOTE]
> 항목 편집 화면이 열립니다. 여기서 속성 값을 직접 수정할 수 있습니다.

10. **status** 속성의 값 필드를 클릭합니다.
11. 값을 `pending`에서 `confirmed`로 변경합니다.
12. [[Save changes]] 버튼을 클릭합니다.

> [!NOTE]
> user-002 사용자의 res-20260318-001 예약 상태를 pending에서 confirmed로 변경했습니다.

✅ **태스크 완료**: 항목이 업데이트되었습니다.

## 마무리

다음을 성공적으로 수행했습니다:

- Amazon DynamoDB 테이블을 설계하고 생성했습니다
- 파티션 키와 정렬 키를 활용한 효율적인 데이터 모델링을 학습했습니다
- LSI(Local Secondary Index)를 생성하여 날짜 기반 쿼리를 지원했습니다
- GSI(Global Secondary Index)를 생성하여 레스토랑별 쿼리 패턴을 지원했습니다
- LSI와 GSI의 차이를 실습을 통해 이해했습니다
- 항목을 추가, 조회, 수정하는 방법을 익혔습니다
- Amazon DynamoDB 설계 모범 사례를 이해했습니다

## 리소스 정리

> [!WARNING]
> 다음 단계를 **반드시 수행**하여 불필요한 비용을 방지합니다.

### 방법 1: Tag Editor로 리소스 찾기 (권장)

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Resource Groups & Tag Editor`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `ap-northeast-2`를 선택합니다.
4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Week`
   - **Tag value**: `5-3`
6. [[Search resources]] 버튼을 클릭합니다.
7. 이 실습에서 생성한 Amazon DynamoDB 테이블이 표시됩니다.

> [!NOTE]
> Tag Editor는 리소스를 찾는 용도로만 사용됩니다. 실제 삭제는 각 서비스 콘솔에서 수행해야 합니다.

### 방법 2: 수동 삭제

#### Amazon DynamoDB 테이블 삭제

1. Amazon DynamoDB 콘솔에서 **Tables**를 선택합니다.
2. `QuickTableReservations` 테이블을 선택합니다.
3. **Actions** 드롭다운에서 `Delete table`을 선택합니다.
4. 확인 창에서 테이블 이름 `QuickTableReservations`를 입력합니다.

> [!NOTE]
> DynamoDB 테이블 삭제 시 확인 입력값은 테이블 이름입니다. 정확히 입력해야 삭제가 진행됩니다.
> 테이블을 삭제하면 모든 GSI와 LSI도 함께 삭제됩니다.

5. [[Delete]] 버튼을 클릭합니다.

✅ **실습 종료**: 모든 리소스가 정리되었습니다.

## 추가 학습 리소스

- [Amazon DynamoDB 데이터 모델링](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html)
- [Amazon DynamoDB GSI 모범 사례](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-indexes.html)
- [Amazon DynamoDB 용량 모드](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html)

## 📚 참고: Amazon DynamoDB 테이블 설계 개요

### 지원해야 할 쿼리 패턴

QuickTable 레스토랑 예약 시스템을 위한 Amazon DynamoDB 테이블을 설계합니다. NoSQL 데이터베이스인 DynamoDB는 관계형 데이터베이스와 달리 쿼리 패턴을 먼저 분석하고 이에 맞춰 테이블을 설계해야 합니다.

**주요 쿼리 패턴**
1. 특정 사용자의 모든 예약 조회
2. 특정 예약의 상세 정보 조회
3. 특정 레스토랑의 특정 날짜 예약 조회
4. 특정 상태의 예약 조회

### 테이블 설계 결정

이 실습에서는 사용자별로 예약을 조회하는 패턴을 지원하기 위해 userId를 파티션 키로, reservationId를 정렬 키로 선택합니다.

**테이블 구조**
- **테이블 이름**: `QuickTableReservations`
- **파티션 키**: `userId` (사용자별로 데이터 분산)
- **정렬 키**: `reservationId` (사용자 내에서 예약 정렬)
- **속성**:
  - `restaurantId` (레스토랑 ID)
  - `restaurantName` (레스토랑 이름)
  - `date` (예약 날짜)
  - `time` (예약 시간)
  - `partySize` (인원 수)
  - `phoneNumber` (연락처)
  - `status` (예약 상태: pending, confirmed, cancelled)
  - `createdAt` (예약 생성 시간)

**설계 이유**

파티션 키(Partition Key)는 데이터를 여러 파티션에 분산하여 확장성을 제공하고, 정렬 키(Sort Key)는 파티션 내에서 데이터를 정렬하여 범위 쿼리를 지원합니다. userId를 파티션 키로 선택하면 사용자별로 데이터가 분산되어 효율적인 조회가 가능합니다.

## 📚 참고: Amazon DynamoDB 설계 모범 사례

### 파티션 키 선택

**좋은 파티션 키**
- 고르게 분산된 값 (userId, restaurantId)
- 높은 카디널리티 (많은 고유 값)
- 액세스 패턴이 균등하게 분산

**나쁜 파티션 키**
- 제한된 값 (status: pending, confirmed, cancelled)
- 날짜만 사용 (특정 날짜에 핫 파티션 발생)
- 낮은 카디널리티 (소수의 고유 값)

**예시**
```
✅ 좋은 예: userId (수천~수백만 개의 고유 값)
❌ 나쁜 예: status (3-5개의 고유 값만 존재)
```

### 정렬 키 활용

정렬 키를 사용하면 다음이 가능합니다:

**범위 쿼리**
- `between`: 특정 범위의 항목 조회
- `begins_with`: 특정 접두사로 시작하는 항목 조회
- `>`, `<`, `>=`, `<=`: 비교 연산자 사용

**파티션 내 정렬**
- 동일한 파티션 키를 가진 항목들이 정렬 키 순서로 저장
- 효율적인 범위 쿼리 가능

**복합 쿼리**
- 파티션 키와 정렬 키를 조합한 복잡한 쿼리 지원

**예시**
```
파티션 키: userId
정렬 키: reservationId

쿼리: "user-001의 특정 예약 조회"
→ userId = "user-001" AND reservationId = "res-20260315-001"

쿼리: "user-001의 2026년 3월 예약 조회 (LSI 사용)"
→ Index: userId-date-index
→ userId = "user-001" AND date BETWEEN "2026-03-01" AND "2026-03-31"
```

> [!NOTE]
> reservationId는 `res-20260315-001` 형식으로 날짜 뒤에 시퀀스 번호가 붙습니다. 
> 날짜 기반 범위 쿼리는 LSI(userId-date-index)를 사용하는 것이 정확합니다.

### GSI(Global Secondary Index) 설계

**GSI 사용 시기**
- 기본 테이블과 다른 쿼리 패턴이 필요한 경우
- 다른 속성을 파티션 키로 사용해야 하는 경우
- 여러 액세스 패턴을 지원해야 하는 경우

**GSI 특징**
- 기본 테이블과 독립적인 읽기/쓰기 용량
- 비동기식 복제 (약간의 지연 발생 가능)
- 최대 20개의 GSI 생성 가능

**Attribute Projection 옵션**
- ALL: 모든 속성 포함 (추가 읽기 불필요, 스토리지 비용 증가)
- KEYS_ONLY: 키만 포함 (스토리지 절약, 추가 읽기 필요)
- INCLUDE: 특정 속성만 포함 (균형잡힌 선택)

### LSI(Local Secondary Index) vs GSI

| 구분 | LSI | GSI |
|------|-----|-----|
| **파티션 키** | 테이블과 동일 | 다른 속성 사용 가능 |
| **정렬 키** | 다른 속성 사용 | 다른 속성 사용 |
| **생성 시점** | 테이블 생성 시만 | 언제든지 추가/삭제 |
| **용량 모드** | 테이블과 공유 | 독립적 |
| **최대 개수** | 5개 | 20개 |
| **일관성** | 강력한 일관성 지원 | 최종 일관성만 지원 |
| **크기 제한** | 파티션당 10GB | 제한 없음 |

**LSI 사용 사례**
- 동일한 파티션 키로 다른 정렬 순서가 필요한 경우
- 강력한 일관성이 필요한 경우
- 예: userId로 예약을 조회하되, reservationId 대신 date로 정렬

**GSI 사용 사례**
- 완전히 다른 쿼리 패턴이 필요한 경우
- 파티션 키를 변경해야 하는 경우
- 예: restaurantId별로 예약을 조회 (파티션 키가 userId에서 restaurantId로 변경)

### 용량 모드 선택

**On-demand 모드**

**장점**
- 자동 확장/축소
- 용량 계획 불필요
- 예측 불가능한 워크로드에 적합

**적합한 경우**
- 새로운 애플리케이션 (트래픽 예측 어려움)
- 트래픽이 급증하는 경우
- 간헐적인 사용 패턴

**비용**
- 요청당 과금 (읽기/쓰기 단위당)
- 일정하지 않은 트래픽에 유리

**Provisioned 모드**

**장점**
- 예측 가능한 비용
- Auto Scaling 설정 가능
- 일정한 트래픽에 비용 효율적

**적합한 경우**
- 예측 가능한 워크로드
- 일정한 트래픽 패턴
- 비용 최적화가 중요한 경우

**비용**
- 시간당 프로비저닝된 용량 과금
- 일정한 트래픽에 유리
