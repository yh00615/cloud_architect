---
title: "Amazon ElastiCache 캐싱"
week: 10
session: 2
awsServices:
  - Amazon ElastiCache
learningObjectives:
  - 캐싱의 개념과 다양한 캐싱 전략을 이해할 수 있습니다
  - Redis와 Memcached의 차이점과 사용 사례를 비교할 수 있습니다
  - Amazon ElastiCache를 활용하여 API 응답을 캐싱할 수 있습니다
  - 세션 스토어를 Amazon ElastiCache로 구현할 수 있습니다
  - 캐시 무효화 패턴과 TTL 설정 전략을 이해할 수 있습니다
  - Amazon CloudFront의 동작 원리와 캐시 정책을 설명할 수 있습니다
  - Amazon CloudFront Functions로 엣지 로케이션에서 요청을 처리할 수 있습니다
prerequisites:
  - Week 5-1 Amazon RDS Multi-AZ 실습 완료 (MySQL 기본 지식)
  - Week 4-3 QuickTable 예약 API 실습 완료 (Amazon DynamoDB 기본 지식)
  - Python 기본 문법 이해
---

이 실습에서는 Amazon ElastiCache for Redis를 사용하여 QuickTable 레스토랑 예약 시스템의 성능을 향상시킵니다.
Cache-Aside 패턴을 구현하여 데이터베이스 조회 속도를 10-50배 빠르게 만들고, 캐시 히트율을 측정하여 캐싱 효과를 정량적으로 확인합니다.

> [!DOWNLOAD]
> [week10-2-elasticache-lab.zip](/files/week10/week10-2-elasticache-lab.zip)
> - `app.py` - FastAPI 애플리케이션 (Cache-Aside 패턴 구현)
> - `requirements.txt` - Python 의존성 패키지
> - `.env.example` - 환경 변수 설정 예제
> - `init_db.sql` - 데이터베이스 초기화 스크립트
> - `benchmark.py` - 성능 벤치마크 스크립트
> - `README.md` - 실행 방법 및 문제 해결
> 
> **관련 태스크:**
> 
> - 태스크 5: 실전 애플리케이션으로 Cache-Aside 패턴 테스트 (app.py를 Amazon EC2에서 실행하여 캐시 성능 측정)
> - 태스크 6: Cache-Aside 패턴 코드 분석 (app.py 코드를 단계별로 분석하여 캐싱 로직 이해)

> [!WARNING]
> 이 실습에서 생성하는 리소스는 실습 종료 후 **반드시 삭제해야 합니다**.
> 
> **예상 비용** (ap-northeast-2 리전 기준):
> 
> | 리소스 | 타입 | 시간당 비용 |
> |--------|------|------------|
> | Amazon ElastiCache 클러스터 | cache.t3.micro | 약 $0.017 |
> | Amazon EC2 인스턴스 | t2.micro | 약 $0.0116 |
> | NAT Gateway | - | 약 $0.045 |
> | **총 예상** | - | **약 $0.074** |


## 태스크 0: 실습 환경 구축

이 태스크에서는 AWS CloudFormation을 사용하여 실습에 필요한 기본 인프라를 자동으로 생성합니다.

### 환경 구성 요소

AWS CloudFormation 스택은 다음 리소스를 생성합니다:

- **Amazon VPC 및 네트워크**: Amazon VPC, 퍼블릭/프라이빗 서브넷, 인터넷 게이트웨이, NAT Gateway
- **보안 그룹**: Amazon ElastiCache 보안 그룹, Amazon EC2 보안 그룹
- **Amazon ElastiCache Subnet Group**: Redis 클러스터 배치를 위한 서브넷 그룹
- **Amazon DynamoDB 테이블**: QuickTable 예약 데이터 저장용 테이블

### 상세 단계

> [!NOTE]
> AWS CloudFormation 콘솔 UI는 주기적으로 업데이트됩니다.  
> 버튼명이나 화면 구성이 가이드와 다를 수 있으나, 전체 흐름(템플릿 업로드 → 스택 이름 입력 → 태그 추가 → 생성)은 동일합니다.

1. AWS Management Console에 로그인한 후 상단 검색창에서 `AWS CloudFormation`을 검색하고 선택합니다.
2. [[Create stack]] 드롭다운을 클릭한 후 **With new resources (standard)**를 선택합니다.
3. **Prerequisite - Prepare template**에서 `Choose an existing template`를 선택합니다.
4. **Specify template**에서 `Upload a template file`을 선택합니다.
5. [[Choose file]] 버튼을 클릭한 후 다운로드한 `week10-2-elasticache-lab.yaml` 파일을 선택합니다.
6. [[Next]] 버튼을 클릭합니다.
7. **Stack name**에 `week10-2-quicktable-cache-stack`을 입력합니다.
8. **Parameters** 섹션에서 기본값을 확인합니다.
9. [[Next]] 버튼을 클릭합니다.
10. **Configure stack options** 페이지에서 아래로 스크롤하여 **Tags** 섹션을 찾습니다.
11. [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `10-2` |
| `CreatedBy` | `Student` |

12. **Capabilities** 섹션에서 `I acknowledge that AWS CloudFormation might create AWS IAM resources`를 체크합니다.
13. [[Next]] 버튼을 클릭합니다.
14. **Review** 페이지에서 설정을 확인합니다.
15. [[Submit]] 버튼을 클릭합니다.
16. 스택 생성이 시작됩니다. 상태가 "CREATE_IN_PROGRESS"로 표시됩니다.

> [!NOTE]
> 스택 생성에 5-7분이 소요됩니다. **Events** 탭에서 생성 과정을 확인할 수 있습니다.
> 대기하는 동안 다음 태스크를 미리 읽어보세요.

17. 상태가 "**CREATE_COMPLETE**"로 변경될 때까지 기다립니다.
> Amazon VPC, 서브넷, NAT Gateway, 보안 그룹, Amazon ElastiCache Subnet Group, Amazon DynamoDB 테이블이 순차적으로 생성됩니다.
> 스택 생성에 5-7분이 소요됩니다. 대기하는 동안 이전 차시 내용을 복습하거나 다음 태스크를 미리 읽어보세요.

17. **Outputs** 탭을 선택합니다.
18. 출력값들을 확인하고 메모장에 복사합니다:
    - `VpcId`: Amazon VPC ID (예: vpc-0123456789abcdef0)
    - `PrivateSubnetAId`: 프라이빗 서브넷 A ID (예: subnet-0a1b2c3d4e5f6g7h8)
    - `PrivateSubnetCId`: 프라이빗 서브넷 C ID (예: subnet-9i8h7g6f5e4d3c2b1)
    - `ElastiCacheSecurityGroupId`: Amazon ElastiCache 보안 그룹 ID (예: sg-0123456789abcdef0)
    - `EC2SecurityGroupId`: Amazon EC2 보안 그룹 ID (예: sg-9876543210fedcba0)
    - `ElastiCacheSubnetGroupName`: Amazon ElastiCache 서브넷 그룹 이름
    - `DynamoDBTableName`: Amazon DynamoDB 테이블 이름

> [!IMPORTANT]
> 이 출력값들은 다음 태스크에서 사용됩니다. 반드시 메모장에 저장하세요.

✅ **태스크 완료**: 실습 환경이 준비되었습니다.


## 태스크 1: Amazon ElastiCache Redis 클러스터 생성

### 태스크 설명

이 태스크에서는 Amazon ElastiCache for Redis 클러스터를 생성합니다.
Redis는 인메모리 데이터 저장소로, 데이터베이스 조회 결과를 캐싱하여 애플리케이션 성능을 크게 향상시킬 수 있습니다.

### 상세 단계

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Amazon ElastiCache`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Redis OSS caches**를 선택합니다.
3. [[Create Redis OSS cache]] 버튼을 클릭합니다.
4. **Deployment option**에서 `Design your own cache`를 선택합니다.
5. **Creation method**에서 `Easy create`를 선택합니다.
6. **Cluster settings** 섹션에서 다음을 입력합니다:
   - **Name**: `quicktable-cache`
   - **Description**: `QuickTable reservation cache`
7. **Location**에서 `AWS Cloud`를 선택합니다.
8. **Cluster settings** 섹션에서 다음을 설정합니다:
   - **Engine version**: `7.1` (최신 버전)
   - **Port**: `6379` (기본값)
   - **Parameter group**: `default.redis7` (기본값)
   - **Node type**: `cache.t3.micro`
   - **Number of replicas**: `0`
9. **Connectivity** 섹션에서 다음을 설정합니다:
   - **Network type**: `IPv4`
   - **Amazon VPC**: 태스크 0에서 생성한 Amazon VPC 선택
   - **Subnet group**: 태스크 0에서 생성한 서브넷 그룹 선택
   - **Selected subnets**: 프라이빗 서브넷 2개가 자동 선택됨
10. **Availability zone placements**에서 `No preference`를 선택합니다.
11. **Security** 섹션에서 다음을 설정합니다:
    - **Security groups**: 태스크 0에서 생성한 `week10-2-elasticache-sg` 보안 그룹 선택
    - **Encryption at rest**: 체크 해제 (실습 환경)
    - **Encryption in-transit**: 체크 해제 (실습 환경)
12. **Logs** 섹션에서 모두 체크 해제합니다.
13. **Backup** 섹션에서 `Enable automatic backups`를 체크 해제합니다.
14. **Maintenance** 섹션에서 기본값을 유지합니다.
15. **Tags** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `10-2` |
| `CreatedBy` | `Student` |

16. [[Next]] 버튼을 클릭합니다.
17. **Review and create** 페이지에서 설정을 확인합니다.
18. [[Create]] 버튼을 클릭합니다.
19. 클러스터 생성이 시작됩니다.
20. 상태가 "Available"로 변경될 때까지 기다립니다.

> [!NOTE]
> 클러스터 생성에 5-10분이 소요됩니다. 페이지를 새로고침하여 상태를 확인합니다.

> [!TIP]
> 프로덕션 환경에서는 다음을 권장합니다:
> - **Number of replicas**: 1개 이상 (고가용성)
> - **Encryption at rest**: 활성화 (데이터 보안)
> - **Encryption in-transit**: 활성화 (전송 보안)
> - **Automatic backups**: 활성화 (데이터 복구)
> - **Multi-AZ**: 활성화 (장애 대응)

✅ **태스크 완료**: Amazon ElastiCache Redis 클러스터가 생성되었습니다.


## 태스크 2: Redis 엔드포인트 확인

### 태스크 설명

이 태스크에서는 생성된 Redis 클러스터의 Primary endpoint를 확인하고 복사합니다.
이 엔드포인트는 애플리케이션에서 Redis에 연결할 때 사용됩니다.

### 상세 단계

1. Amazon ElastiCache 콘솔에서 `quicktable-cache` 클러스터를 선택합니다.
2. **Cluster details** 섹션에서 **Primary endpoint**를 확인합니다.
3. Primary endpoint 값을 복사하여 메모장에 저장합니다.

> [!NOTE]
> Primary endpoint 형식은 `quicktable-cache.xxxxx.ng.0001.apne2.cache.amazonaws.com:6379`입니다.
> 포트 번호(`:6379`)를 제외한 호스트명만 복사합니다.

> [!IMPORTANT]
> 이 엔드포인트는 태스크 5에서 FastAPI 애플리케이션 환경 변수로 사용됩니다.

✅ **태스크 완료**: Redis 엔드포인트를 확인했습니다.


## 태스크 3: Amazon EC2 인스턴스 생성 및 Redis CLI 설치

### 태스크 설명

이 태스크에서는 Redis CLI를 설치할 Amazon EC2 인스턴스를 생성하고, Session Manager를 통해 접속합니다.
Redis CLI를 사용하여 기본 명령어를 실습하고 캐싱 동작을 이해합니다.

### 상세 단계

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Amazon EC2`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Instances**를 선택합니다.
3. [[Launch instances]] 버튼을 클릭합니다.
4. **Name**에 `quicktable-cache-client`를 입력합니다.
5. **Application and OS Images**에서 `Amazon Linux 2023 AMI`를 선택합니다.
6. **Instance type**에서 `t2.micro`를 선택합니다.
7. **Key pair**에서 `Proceed without a key pair`를 선택합니다.
8. **Network settings**에서 Edit 버튼을 클릭한 후 다음을 설정합니다:
   - **Amazon VPC**: 태스크 0에서 생성한 Amazon VPC 선택
   - **Subnet**: 프라이빗 서브넷 중 하나 선택
   - **Auto-assign public IP**: Disable
   - **Firewall (security groups)**: Select existing security group
   - **Security groups**: 태스크 0에서 생성한 `week10-2-ec2-sg` 보안 그룹 선택
9. **Advanced details** 섹션을 확장합니다.
10. **AWS IAM instance profile**에서 `SSMInstanceProfile`을 선택합니다.
11. **Tags** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `10-2` |
| `CreatedBy` | `Student` |

12. [[Launch instance]] 버튼을 클릭합니다.
13. 인스턴스 생성이 완료될 때까지 기다립니다.
14. 상태가 "Running"으로 변경되면 인스턴스를 선택합니다.
15. [[Connect]] 버튼을 클릭합니다.
16. **Session Manager** 탭을 선택합니다.
17. [[Connect]] 버튼을 클릭합니다.

> [!NOTE]
> Session Manager는 SSH 키 없이 안전하게 Amazon EC2 인스턴스에 접속할 수 있는 AWS Systems Manager 기능입니다.
> AWS IAM 역할을 통해 인증되므로 별도의 키 관리가 필요 없습니다.

18. Session Manager 터미널이 열리면 다음 명령어를 실행하여 Redis CLI를 설치합니다:

```bash
sudo yum install -y gcc make
cd /tmp
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
sudo cp src/redis-cli /usr/local/bin/
```

19. Redis CLI 설치를 확인합니다:

```bash
redis-cli --version
```

> [!OUTPUT]
> ```
> redis-cli 7.2.4
> ```

20. Redis 클러스터에 연결합니다:

```bash
redis-cli -h <Primary-Endpoint> -p 6379
```

> [!NOTE]
> `<Primary-Endpoint>`를 태스크 2에서 복사한 엔드포인트로 대체합니다.
> 예: `redis-cli -h quicktable-cache.xxxxx.ng.0001.apne2.cache.amazonaws.com -p 6379`

21. 연결이 성공하면 Redis CLI 프롬프트가 표시됩니다:

> [!OUTPUT]
> ```
> quicktable-cache.xxxxx.ng.0001.apne2.cache.amazonaws.com:6379>
> ```

22. PING 명령어로 연결을 테스트합니다:

```bash
PING
```

> [!OUTPUT]
> ```
> PONG
> ```

✅ **태스크 완료**: Amazon EC2 인스턴스를 생성하고 Redis CLI를 설치했습니다.


## 태스크 4: 기본 Redis 명령어 실습

### 태스크 설명

이 태스크에서는 Redis CLI를 사용하여 기본 명령어를 실습합니다.
String, Hash, List 데이터 타입과 TTL 설정 방법을 학습합니다.

### 상세 단계

1. Redis CLI 프롬프트에서 다음 명령어들을 실행합니다.

#### String 타입 (SET/GET)

2. 키-값 쌍을 저장합니다:

```bash
SET user:1:name "John Doe"
SET user:1:email "john@example.com"
```

3. 저장된 값을 조회합니다:

```bash
GET user:1:name
GET user:1:email
```

> [!OUTPUT]
> ```
> "John Doe"
> "john@example.com"
> ```

#### TTL 설정 (SETEX)

4. TTL(Time To Live)을 설정하여 30분 후 자동 삭제되는 데이터를 저장합니다:

```bash
SETEX session:abc123 1800 "user_session_data"
```

5. 남은 TTL을 확인합니다:

```bash
TTL session:abc123
```

> [!OUTPUT]
> ```
> (integer) 1795
> ```

> [!NOTE]
> TTL 값은 초 단위로 표시됩니다. 1800초 = 30분입니다.
> 시간이 지나면 값이 감소하며, -1은 TTL이 설정되지 않음, -2는 키가 존재하지 않음을 의미합니다.

#### Hash 타입 (HSET/HGETALL)

6. Hash 데이터 구조로 사용자 정보를 저장합니다:

```bash
HSET user:2 name "Jane Smith" email "jane@example.com" age "28"
```

7. Hash의 모든 필드를 조회합니다:

```bash
HGETALL user:2
```

> [!OUTPUT]
> ```
> 1) "name"
> 2) "Jane Smith"
> 3) "email"
> 4) "jane@example.com"
> 5) "age"
> 6) "28"
> ```

#### List 타입 (LPUSH/LRANGE)

8. List에 예약 ID를 추가합니다:

```bash
LPUSH reservations:recent "res001" "res002" "res003"
```

9. List의 모든 요소를 조회합니다:

```bash
LRANGE reservations:recent 0 -1
```

> [!OUTPUT]
> ```
> 1) "res003"
> 2) "res002"
> 3) "res001"
> ```

> [!NOTE]
> LPUSH는 리스트의 왼쪽(앞)에 요소를 추가하므로 역순으로 저장됩니다.

#### 키 삭제 및 존재 확인 (DEL/EXISTS)

10. 키를 삭제합니다:

```bash
DEL user:1:name
```

11. 키가 존재하는지 확인합니다:

```bash
EXISTS user:1:name
EXISTS user:1:email
```

> [!OUTPUT]
> ```
> (integer) 0
> (integer) 1
> ```

EXISTS는 키가 존재하면 1, 존재하지 않으면 0을 반환합니다.

12. Redis CLI를 종료합니다:

```bash
exit
```

✅ **태스크 완료**: Redis 기본 명령어를 실습했습니다.


## 태스크 5: 실전 애플리케이션으로 Cache-Aside 패턴 테스트

### 태스크 설명

이 태스크에서는 FastAPI 애플리케이션을 실행하여 Cache-Aside 패턴을 실전에서 테스트합니다.
Amazon DynamoDB 테이블을 초기화하고, API를 호출하여 캐시 성능을 측정합니다.

### 상세 단계

1. Session Manager 터미널에서 다음 명령어를 실행하여 실습 파일을 다운로드합니다:

```bash
cd /home/ec2-user
curl -O https://your-s3-bucket/week10-2-elasticache-lab.zip
unzip week10-2-elasticache-lab.zip
cd elasticache-lab
```

> [!NOTE]
> 실제 환경에서는 Amazon S3 버킷 URL을 사용하거나, CloudShell을 통해 파일을 전송할 수 있습니다.

2. Python 3와 pip를 설치합니다:

```bash
sudo yum install -y python3 python3-pip
```

3. 필요한 Python 패키지를 설치합니다:

```bash
pip3 install -r requirements.txt
```

4. 환경 변수를 설정합니다:

```bash
export REDIS_HOST=<Primary-Endpoint>
export REDIS_PORT=6379
export AWS_DEFAULT_REGION=ap-northeast-2
```

> [!NOTE]
> `<Primary-Endpoint>`를 태스크 2에서 복사한 엔드포인트로 대체합니다.

5. Amazon DynamoDB 테이블을 초기화합니다:

```bash
python3 init_dynamodb.py
```

> [!OUTPUT]
> ```
> Amazon DynamoDB 테이블 초기화 중...
> 10개의 예약 데이터가 추가되었습니다.
> ```

6. FastAPI 애플리케이션을 백그라운드로 실행합니다:

```bash
nohup uvicorn app:app --host 0.0.0.0 --port 5000 > app.log 2>&1 &
```

> [!NOTE]
> FastAPI는 자동으로 API 문서를 생성합니다:
> - Swagger UI: `http://<Amazon EC2-IP>:5000/docs`
> - ReDoc: `http://<Amazon EC2-IP>:5000/redoc`

7. 애플리케이션이 정상적으로 실행되는지 확인합니다:

```bash
curl http://localhost:5000/health
```

> [!OUTPUT]
> ```json
> {
>   "redis": "connected",
>   "database": "connected"
> }
> ```

8. 캐시 없이 예약 정보를 조회합니다 (첫 번째 요청):

```bash
curl http://localhost:5000/reservation/user123/res001/nocache
```

> [!OUTPUT]
> ```json
> {
>   "source": "database",
>   "data": {
>     "userId": "user123",
>     "reservationId": "res001",
>     "restaurantName": "Seoul BBQ",
>     "date": "2024-02-20",
>     "time": "19:00",
>     "partySize": 4
>   },
>   "responseTimeMs": 45.23
> }
> ```

9. 캐시를 사용하여 동일한 예약 정보를 조회합니다 (첫 번째 요청 - 캐시 미스):

```bash
curl http://localhost:5000/reservation/user123/res001
```

> [!OUTPUT]
> ```json
> {
>   "source": "database",
>   "data": {
>     "userId": "user123",
>     "reservationId": "res001",
>     "restaurantName": "Seoul BBQ",
>     "date": "2024-02-20",
>     "time": "19:00",
>     "partySize": 4
>   },
>   "responseTimeMs": 43.87
> }
> ```

10. 동일한 요청을 다시 실행합니다 (두 번째 요청 - 캐시 히트):

```bash
curl http://localhost:5000/reservation/user123/res001
```

> [!OUTPUT]
> ```json
> {
>   "source": "cache",
>   "data": {
>     "userId": "user123",
>     "reservationId": "res001",
>     "restaurantName": "Seoul BBQ",
>     "date": "2024-02-20",
>     "time": "19:00",
>     "partySize": 4
>   },
>   "responseTimeMs": 2.15
> }
> ```

> [!TIP]
> 캐시를 사용하면 응답 시간이 약 20배 빨라집니다 (43.87ms → 2.15ms).
> 실제 프로덕션 환경에서는 10-50배의 성능 향상을 기대할 수 있습니다.

11. 캐시 통계를 확인합니다:

```bash
curl http://localhost:5000/cache/stats
```

> [!OUTPUT]
> ```json
> {
>   "totalConnections": 15,
>   "totalCommands": 42,
>   "keyspaceHits": 8,
>   "keyspaceMisses": 3,
>   "hitRate": 72.73
> }
> ```

12. 성능 벤치마크를 실행합니다:

```bash
python3 benchmark.py
```

> [!OUTPUT]
> ```
> 성능 벤치마크 실행 중...
> 
> 캐시 없이 100회 요청:
> - 평균 응답 시간: 42.5ms
> - 총 소요 시간: 4.25초
> 
> 캐시 사용 100회 요청:
> - 평균 응답 시간: 2.1ms
> - 총 소요 시간: 0.21초
> - 캐시 히트율: 98.0%
> 
> 성능 향상: 20.2배
> ```

> [!SUCCESS]
> 캐시를 사용하면 응답 시간이 20배 이상 빨라지고, 캐시 히트율은 98%에 달합니다.

✅ **태스크 완료**: FastAPI 애플리케이션으로 Cache-Aside 패턴을 테스트했습니다.
