---
title: "AWS Glue를 활용한 데이터 파이프라인 구축"
week: 11
session: 3
awsServices:
  - AWS Glue
  - Amazon Athena
  - Amazon S3
learningObjectives:
  - 데이터 레이크와 데이터 웨어하우스의 차이를 이해할 수 있습니다
  - S3 데이터 레이크의 3계층 구조(Raw/Processed/Curated)를 설명할 수 있습니다
  - S3 스토리지 클래스의 종류와 사용 사례를 이해할 수 있습니다
  - AWS Glue Crawler의 동작 원리와 Data Catalog의 역할을 설명할 수 있습니다
  - Amazon Athena로 서버리스 SQL 쿼리를 실행할 수 있습니다
  - AWS Lambda를 사용하여 데이터를 전처리할 수 있습니다
  - AWS Glue ETL Job으로 데이터를 변환하고 파이프라인을 자동화할 수 있습니다
prerequisites:
  - Amazon S3 기본 개념 이해.
  - SQL 쿼리 기본 지식.
  - CSV/JSON 데이터 형식 이해.
---


이 실습에서는 **AWS Glue**와 **Amazon Athena**를 활용하여 **서버리스 데이터 파이프라인**을 구축합니다.

먼저 **AWS CloudFormation**을 사용하여 **Amazon S3 버킷**, **AWS Glue Database**, **AWS Glue Crawler**, **AWS Glue ETL Job**, **AWS Lambda 함수** 등 파이프라인에 필요한 모든 리소스를 자동으로 생성합니다. 그런 다음 **AWS Glue Crawler**를 실행하여 Amazon S3 데이터의 **메타데이터**를 자동으로 수집하고 **데이터 카탈로그**를 생성합니다.

이후 **AWS Glue ETL Job**을 실행하여 데이터를 변환하고, **Amazon Athena**를 통해 표준 **SQL**로 처리된 데이터를 쿼리하고 분석합니다. 마지막으로 새로운 데이터를 업로드하여 **EventBridge**와 **AWS Lambda 함수**가 자동으로 **Crawler**를 트리거하는 전체 **데이터 처리 흐름**을 확인합니다.

> [!NOTE]
> **이 실습의 자동화 범위**:
> - ✅ **자동**: S3 업로드 → EventBridge → Lambda → Crawler 실행
> - ⚠️ **수동**: ETL Job 실행 (태스크 3에서 직접 실행)
> 
> 완전 자동화를 위해서는 Crawler 완료 후 ETL Job을 트리거하는 추가 Lambda 함수나 Step Functions 워크플로우가 필요합니다.

> [!NOTE]
> 이 실습에서는 **거래 데이터(transactions.csv)**를 사용합니다. 이전 실습(Week 4-2, 5-3)의 QuickTable 예약 데이터와는 다른 데이터셋입니다. 거래 데이터는 일반적인 전자상거래 트랜잭션을 나타내며, 데이터 파이프라인 구축 학습에 더 적합합니다.

> [!WARNING]
> 이 실습에서 생성하는 리소스는 실습 종료 후 반드시 삭제해야 합니다.
> 
> **예상 비용** (ap-northeast-2 리전 기준):
> 
> | 리소스 | 타입 | 시간당 비용 |
> |--------|------|------------|
> | AWS Glue Crawler | - | 약 $0.44/DPU-Hour |
> | AWS Glue ETL Job | - | 약 $0.44/DPU-Hour |
> | Amazon S3 | Standard | 약 $0.025/GB |
> | Amazon Athena | - | 약 $5/TB (스캔 데이터) |
> | **총 예상** | - | **약 $0.50-1.00** |
> 
> AWS Glue Crawler와 ETL Job은 실행 시간에 따라 과금되며, 이 실습에서는 각각 1-2분 정도 실행됩니다.
> [week11-3-data-pipeline-lab.zip](/files/week11/week11-3-data-pipeline-lab.zip)
> - `week11-3-data-pipeline-lab.yaml` - AWS CloudFormation 템플릿 (태스크 0에서 Amazon S3 버킷, AWS Glue Database, Crawler, ETL Job, AWS Lambda 함수 등 모든 리소스 자동 생성)
> - `sales-data.csv` - 추가 테스트 데이터 (태스크 5에서 파이프라인 테스트용으로 업로드)
> - `sales-data-2.csv` - 추가 테스트 데이터 (태스크 5에서 파이프라인 테스트용으로 업로드)
> - `README.txt` - 파일 사용 방법 및 주의사항
> 
> **관련 태스크:**
> 
> - 태스크 0: 실습 환경 구축 (AWS CloudFormation 템플릿으로 Amazon S3, AWS Glue, Lambda 등 모든 리소스 자동 생성 및 샘플 데이터 자동 업로드)
> - 태스크 5: 파이프라인 테스트 (sales-data.csv 또는 sales-data-2.csv를 업로드하여 AWS Lambda 자동 트리거 확인)

## 태스크 0: 실습 환경 구축

이 태스크에서는 CloudFormation을 사용하여 실습에 필요한 모든 리소스를 자동으로 생성합니다.

### 환경 구성 요소

AWS CloudFormation 스택은 다음 리소스를 생성합니다:

- **Amazon S3 버킷 3개**: 데이터 버킷, 스크립트 버킷, 임시 버킷 (학번 기반 고유성)
- **AWS Glue Database**: 데이터 카탈로그 저장소
- **AWS Glue Crawler**: Amazon S3 데이터 메타데이터 자동 수집
- **AWS Glue ETL Job**: 데이터 변환 작업
- **AWS IAM 역할 2개**: AWS Glue 서비스 역할, AWS Lambda 실행 역할
- **AWS Lambda 함수**: 파이프라인 자동 트리거
- **EventBridge 규칙**: Amazon S3 이벤트 감지
- **샘플 데이터**: 거래 데이터 및 ETL 스크립트 자동 업로드

### 상세 단계

1. 다운로드한 `week11-3-data-pipeline-lab.zip` 파일의 압축을 해제합니다.
2. `week11-3-data-pipeline-lab.yaml` 파일을 확인합니다.
3. AWS Management Console에 로그인한 후 상단 검색창에서 `AWS CloudFormation`을 검색하고 선택합니다.
4. [[Create stack]] 드롭다운을 클릭한 후 `With new resources (standard)`를 선택합니다.
5. **Prepare template**에서 `Template is ready`를 선택합니다.
6. **Specify template**에서 `Upload a template file`을 선택합니다.
6. [[Choose file]] 버튼을 클릭한 후 `week11-3-data-pipeline-lab.yaml` 파일을 선택합니다.
7. [[Next]] 버튼을 클릭합니다.
8. **Stack name**에 `week11-3-pipeline-stack`을 입력합니다.
9. **Parameters** 섹션에서 다음을 입력합니다:
    - **StudentId**: 본인의 학번 또는 고유 식별자 (예: `20240001` 또는 `student01`)
    - **EnvironmentName**: `week11-3-pipeline` (기본값 유지)

EnvironmentName은 리소스 이름의 공통 접두사로 사용됩니다. 예를 들어, AWS Glue Database는 `week11_pipeline_{StudentId}`, Crawler는 `week11-pipeline-crawler-{StudentId}` 형식으로 생성됩니다. Outputs 탭에 표시되는 버킷명 예시(`week11-data-{StudentId}-ap-northeast-2`)에서 `week11`은 EnvironmentName(`week11-3-pipeline`)의 축약형이 아니라 CloudFormation 템플릿에 하드코딩된 접두사입니다. 실제 버킷명은 `week11-data-20240001-ap-northeast-2`와 같은 형태가 됩니다.

> [!IMPORTANT]
> StudentId는 소문자, 숫자, 하이픈만 사용 가능하며 5-20자여야 합니다. 이 값은 모든 리소스 이름에 포함되어 고유성을 보장합니다.

10. [[Next]] 버튼을 클릭합니다.
11. **Configure stack options** 페이지에서 아래로 스크롤하여 **Tags** 섹션을 확인합니다.
12. [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `11-3` |
| `CreatedBy` | `Student` |

> [!NOTE]
> 이 태그들은 AWS CloudFormation 스택이 생성하는 모든 리소스(Amazon S3 버킷 3개, AWS Glue Database, AWS Glue Crawler, AWS Glue ETL Job, AWS Lambda 함수, EventBridge 규칙, AWS IAM 역할 2개)에 자동으로 전파됩니다.

13. [[Next]] 버튼을 클릭합니다.
14. **Review** 페이지에서 설정을 확인합니다.
15. **Capabilities** 섹션에서 `I acknowledge that AWS CloudFormation might create AWS IAM resources with custom names`를 체크합니다.
16. [[Submit]] 버튼을 클릭합니다.
17. 스택 생성이 시작됩니다. 상태가 "CREATE_IN_PROGRESS"로 표시됩니다.

> [!NOTE]
> 스택 생성에 3-5분이 소요됩니다. **Events** 탭에서 생성 과정을 확인할 수 있습니다.
> Amazon S3 버킷, AWS Glue Database, Crawler, ETL Job, AWS Lambda 함수 등이 순차적으로 생성됩니다.
> 대기하는 동안 이전 차시 내용을 복습하거나 다음 태스크를 미리 읽어보세요.

18. 상태가 "CREATE_COMPLETE"로 변경될 때까지 기다립니다.
19. **Outputs** 탭을 선택합니다.
20. 출력값들을 확인하고 메모장에 복사합니다:
    - `DataBucketName`: 데이터 버킷 이름 (예: `week11-data-20240001-ap-northeast-2`)
    - `ScriptsBucketName`: 스크립트 버킷 이름 (예: `week11-scripts-20240001-ap-northeast-2`)
    - `GlueDatabaseName`: AWS Glue 데이터베이스 이름 (예: `week11_pipeline_20240001`)
    - `GlueCrawlerName`: AWS Glue Crawler 이름 (예: `week11-pipeline-crawler-20240001`)
    - `GlueETLJobName`: AWS Glue ETL Job 이름 (예: `week11-etl-job-20240001`)
    - `SampleDataLocation`: 샘플 데이터 위치 안내

> [!IMPORTANT]
> 이 출력값들은 다음 태스크에서 사용됩니다. 반드시 메모장에 저장하세요.

> [!NOTE]
> **SetupInstructions** 출력값에서 전체 파이프라인 흐름을 확인할 수 있습니다:
> 1. 새 파일이 데이터 버킷의 `raw/` 폴더에 업로드됨
> 2. EventBridge가 Amazon S3 이벤트 감지
> 3. AWS Lambda 함수가 AWS Glue Crawler 시작
> 4. Crawler가 데이터 카탈로그 업데이트
> 5. AWS Glue ETL Job 실행 (수동)
> 6. 처리된 데이터가 `processed/` 폴더에 저장됨

> [!NOTE]
> 이 실습에서는 **Crawler만 자동으로 실행**됩니다. AWS Glue ETL Job은 태스크 3에서 수동으로 실행합니다. 완전 자동화를 위해서는 Crawler 완료 후 ETL Job을 트리거하는 추가 Lambda 함수나 Step Functions 워크플로우가 필요합니다.

✅ **태스크 완료**: 실습 환경이 준비되었습니다.


## 태스크 1: 자동 생성된 리소스 확인

이 태스크에서는 CloudFormation이 자동으로 생성한 Amazon S3 버킷, AWS Glue Database, Crawler, ETL Job, AWS Lambda 함수 등을 확인합니다.

### 태스크 1.1: Amazon S3 버킷 확인

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Amazon S3`를 검색하고 선택합니다.
2. 다음 3개의 버킷이 생성되었는지 확인합니다:
   - `week11-data-{StudentId}-ap-northeast-2` (데이터 버킷)
   - `week11-scripts-{StudentId}-ap-northeast-2` (스크립트 버킷)
   - `week11-temp-{StudentId}-ap-northeast-2` (임시 버킷)

> [!NOTE]
> `{StudentId}`는 태스크 0에서 입력한 학번 또는 고유 식별자입니다.

3. 데이터 버킷(`week11-data-{StudentId}-ap-northeast-2`)을 클릭합니다.
4. 다음 폴더들이 자동으로 생성되었는지 확인합니다:
   - `raw/` - 원본 데이터 저장
   - `processed/` - 처리된 데이터 저장
5. `raw/` 폴더를 클릭합니다.
6. `transactions.csv` 파일이 자동으로 업로드되었는지 확인합니다.

> [!NOTE]
> CloudFormation이 샘플 데이터를 자동으로 업로드했습니다. 이 파일은 다음 태스크에서 사용됩니다.

7. 스크립트 버킷(`week11-scripts-{StudentId}-ap-northeast-2`)을 클릭합니다.
8. `etl-script.py` 파일이 자동으로 업로드되었는지 확인합니다.

> [!NOTE]
> 이 스크립트는 AWS Glue ETL Job에서 사용되며, 데이터 변환 로직이 포함되어 있습니다. 스크립트는 다음 작업을 수행합니다:
> - 원본 CSV 데이터를 읽어옵니다
> - 날짜 필드에서 연도(year)와 월(month)을 추출합니다
> - 데이터를 Parquet 형식으로 변환합니다
> - 처리된 데이터를 `processed/` 폴더에 저장합니다

9. `etl-script.py` 파일을 선택한 후 [[Download]] 버튼을 클릭하여 로컬에 다운로드합니다.
10. 텍스트 에디터로 파일을 열어 ETL 로직을 확인합니다.

### 태스크 1.2: AWS Glue Database 확인

1. 상단 검색창에서 `AWS Glue`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Data Catalog** > **Databases**를 선택합니다.
3. `week11_pipeline_{StudentId}` 데이터베이스가 생성되었는지 확인합니다.
4. 데이터베이스를 클릭하여 상세 정보를 확인합니다.

### 태스크 1.3: AWS Glue Crawler 확인

1. 왼쪽 메뉴에서 **Crawlers**를 선택합니다.
2. `week11-pipeline-crawler-{StudentId}` Crawler가 생성되었는지 확인합니다.
3. Crawler를 클릭하여 상세 정보를 확인합니다:
   - **Data source**: `s3://week11-data-{StudentId}-ap-northeast-2/raw/`
   - **AWS IAM role**: CloudFormation이 자동 생성한 역할 (예: `week11-3-pipeline-stack-GlueServiceRole-XXXXXXXXXXXX`)
   - **Database**: `week11_pipeline_{StudentId}`

> [!NOTE]
> CloudFormation이 생성하는 IAM 역할의 실제 물리적 이름은 스택명 + 리소스 논리 ID + 랜덤 접미사 형태입니다 (예: `week11-3-pipeline-stack-GlueServiceRole-XXXXXXXXXXXX`). IAM 콘솔에서 "GlueServiceRole"로 검색하여 실제 역할명을 확인할 수 있습니다.

> [!NOTE]
> Crawler는 Amazon S3의 `raw/` 폴더를 스캔하여 데이터 스키마를 자동으로 추론하고 AWS Glue Data Catalog에 테이블을 생성합니다.

### 태스크 1.4: AWS Glue ETL Job 확인

1. 왼쪽 메뉴에서 **ETL jobs**를 선택합니다.
2. `week11-etl-job-{StudentId}` ETL Job이 생성되었는지 확인합니다.
3. ETL Job을 클릭하여 상세 정보를 확인합니다:
   - **Script location**: `s3://week11-scripts-{StudentId}-ap-northeast-2/etl-script.py`
   - **AWS IAM role**: CloudFormation이 자동 생성한 역할 (예: `week11-3-pipeline-stack-GlueServiceRole-XXXXXXXXXXXX`)
   - **Temporary directory**: `s3://week11-temp-{StudentId}-ap-northeast-2/temp/`

> [!NOTE]
> ETL Job은 `etl-script.py` 스크립트를 실행하여 데이터를 변환합니다. Temporary directory는 ETL 작업 중 임시 파일을 저장하는 데 사용됩니다.

### 태스크 1.5: AWS Lambda 함수 확인

1. 상단 검색창에서 `AWS Lambda`를 검색하고 선택합니다.
2. `week11-pipeline-trigger-{StudentId}` 함수가 생성되었는지 확인합니다.
3. 함수를 클릭하여 상세 정보를 확인합니다.
4. **Configuration** 탭을 선택합니다.
5. 왼쪽 메뉴에서 **Triggers**를 선택합니다.
6. EventBridge 규칙이 연결되어 있는지 확인합니다.

> [!NOTE]
> 이 AWS Lambda 함수는 Amazon S3의 `raw/` 폴더에 새 파일이 업로드되면 **EventBridge를 통해 자동으로 트리거**되어 AWS Glue Crawler를 시작합니다.
> 
> **데이터 파이프라인 흐름**: S3 업로드 → EventBridge 이벤트 감지 → Lambda 함수 실행 → Glue Crawler 시작
> 
> CloudFormation 템플릿에서 S3 EventBridge 알림과 EventBridge 규칙이 자동으로 구성됩니다.

✅ **태스크 완료**: 모든 리소스가 자동으로 생성되었음을 확인했습니다.

## 태스크 2: AWS Glue Crawler 실행 및 테이블 생성

이 태스크에서는 AWS Glue Crawler를 실행하여 Amazon S3 데이터를 스캔하고 자동으로 테이블을 생성합니다.

1. AWS Glue 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **Crawlers**를 선택합니다.
3. `week11-pipeline-crawler-{StudentId}` Crawler를 선택합니다.
4. [[Run]] 버튼을 클릭합니다.

> [!NOTE]
> Crawler 실행에 1-2분이 소요됩니다. **Status**가 "Running"에서 "Ready"로 변경될 때까지 기다립니다.
> 대기하는 동안 이전 차시 내용을 복습하거나 다음 태스크를 미리 읽어보세요.
> 페이지를 새로고침하여 최신 상태를 확인할 수 있습니다.

> [!TROUBLESHOOTING]
> **문제**: Crawler를 다시 실행하려고 할 때 "CrawlerRunningException" 오류가 발생합니다
> 
> **원인**: Crawler가 이미 실행 중입니다. 한 번에 하나의 Crawler만 실행할 수 있습니다.
> 
> **해결**: 
> 1. Crawler의 **Status**가 "Ready"로 변경될 때까지 기다립니다
> 2. 페이지를 새로고침하여 최신 상태를 확인합니다
> 3. 상태가 "Ready"가 되면 다시 실행할 수 있습니다

5. **Status**가 "Ready"로 변경될 때까지 기다립니다.
6. **Tables added** 값이 1인지 확인합니다.
7. 왼쪽 메뉴에서 **Data Catalog** > **Tables**를 선택합니다.
8. `raw` 테이블을 클릭합니다.
9. **Schema** 탭에서 자동으로 추론된 컬럼들을 확인합니다:
    - transaction_id (bigint)
    - customer_id (string)
    - product_id (string)
    - amount (double)
    - transaction_date (string)
    - region (string)

> [!NOTE]
> Crawler가 CSV 파일의 헤더를 읽고 자동으로 스키마를 생성했습니다.

✅ **태스크 완료**: Crawler가 실행되고 테이블이 생성되었습니다.

## 태스크 3: AWS Glue ETL Job 실행 및 데이터 변환

이 태스크에서는 AWS Glue ETL Job을 실행하여 원본 데이터를 변환하고 처리된 데이터를 저장합니다.

1. AWS Glue 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **ETL jobs**를 선택합니다.
3. `week11-etl-job-{StudentId}` ETL Job을 선택합니다.
4. [[Run]] 버튼을 클릭합니다.

> [!NOTE]
> ETL Job 실행에 5-10분 이상이 소요됩니다. **Run status**가 "Running"에서 "Succeeded"로 변경될 때까지 기다립니다.
> AWS Glue는 Apache Spark 클러스터를 시작하고, 데이터를 읽고, 변환하고, Parquet 형식으로 저장하는 전체 과정을 수행합니다.
> 대기하는 동안 이전 차시 내용을 복습하거나 다음 태스크를 미리 읽어보세요.
> 페이지를 새로고침하여 최신 상태를 확인할 수 있습니다.

5. **Run status**가 "Succeeded"로 변경될 때까지 기다립니다.
6. Amazon S3 콘솔로 이동합니다.
7. 데이터 버킷(`week11-data-{StudentId}-ap-northeast-2`)을 클릭합니다.
8. `processed/` 폴더를 클릭합니다.
9. 처리된 데이터 파일이 생성되었는지 확인합니다.

> [!NOTE]
> ETL Job이 원본 데이터를 읽고, 변환하여 Parquet 형식으로 저장했습니다.
> Parquet 형식은 컬럼 기반 저장 형식으로 쿼리 성능이 우수하고 압축률이 높습니다.

✅ **태스크 완료**: ETL Job이 실행되고 데이터가 변환되었습니다.

## 태스크 4: Athena로 처리된 데이터 쿼리

이 태스크에서는 Athena를 사용하여 처리된 데이터를 표준 SQL로 쿼리합니다.

### 태스크 4.1: Amazon Athena 쿼리 결과 위치 설정

1. 상단 검색창에서 `Amazon Athena`를 검색하고 선택합니다.
2. **Editor** 탭이 바로 표시되지 않는 경우, 상단 메뉴에서 **Query editor**를 선택합니다.
3. **Settings** 탭을 선택합니다.
4. [[Manage]] 버튼을 클릭합니다.
5. **Query result location**에 `s3://week11-temp-{StudentId}-ap-northeast-2/athena-results/`를 입력합니다.

> [!NOTE]
> `{StudentId}`를 본인의 학번 또는 고유 식별자로 변경합니다.

> [!NOTE]
> 이 실습에서는 **primary 워크그룹**을 사용합니다. Week 11-2에서는 전용 워크그룹(`quicktable-workgroup-{StudentId}`)을 생성했지만, 이번 실습에서는 기본 워크그룹의 설정만 변경하여 사용합니다. 별도 워크그룹 생성 없이도 Athena를 사용할 수 있으며, 간단한 파이프라인 테스트에 적합합니다.

> [!IMPORTANT]
> Athena 쿼리 결과는 별도의 경로에 저장해야 합니다. ETL Job의 Temporary directory(`temp/`)와 다른 경로(`athena-results/`)를 사용하여 파일 충돌을 방지합니다.

> [!NOTE]
> `week11-temp-{StudentId}-ap-northeast-2` 버킷은 AWS Glue ETL Job의 임시 파일(`temp/`)과 Athena 쿼리 결과(`athena-results/`)를 모두 저장합니다. 서로 다른 경로를 사용하여 파일 충돌을 방지합니다.

6. [[Save]] 버튼을 클릭합니다.

### 태스크 4.2: 처리된 데이터 테이블 생성

1. **Editor** 탭을 선택합니다.
2. **Database**에서 `week11_pipeline_{StudentId}`를 선택합니다.
3. 다음 쿼리를 입력합니다:

```sql
CREATE EXTERNAL TABLE processed_transactions (
    transaction_id bigint,
    customer_id string,
    product_id string,
    amount double,
    transaction_date string,
    region string,
    "year" int,
    "month" int
)
STORED AS PARQUET
LOCATION 's3://week11-data-{StudentId}-ap-northeast-2/processed/';
```

> [!IMPORTANT]
> `{StudentId}`를 본인의 학번 또는 고유 식별자로 변경합니다. 예: `s3://week11-data-20240001-ap-northeast-2/processed/`
> 
> 이 값을 변경하지 않으면 쿼리가 실패합니다.

> [!IMPORTANT]
> 이 쿼리는 **EXTERNAL TABLE**을 생성합니다. EXTERNAL TABLE은 데이터를 Amazon S3에 그대로 두고 메타데이터만 AWS Glue Data Catalog에 저장합니다. 테이블을 삭제해도 Amazon S3의 실제 데이터는 삭제되지 않습니다.
> 
> **컬럼 구조 설명**:
> - 원본 컬럼 6개: `transaction_id`, `customer_id`, `product_id`, `amount`, `transaction_date`, `region`
> - ETL Job이 추가한 컬럼 2개: `"year"`, `"month"` (transaction_date에서 추출)
> 
> **예약어 처리**: `year`와 `month`는 Athena(Presto 기반)의 예약어이므로 큰따옴표로 감싸야 합니다. 예약어를 그대로 사용하면 테이블 생성 시 오류가 발생할 수 있습니다.
> 
> **파티셔닝 여부**: 이 실습의 ETL 스크립트는 `year`와 `month`를 **일반 컬럼**으로 추가합니다. 파티션 디렉터리(`year=2024/month=1/`)로 저장하지 않으므로 위 DDL이 올바릅니다.
> 
> 만약 파티셔닝을 사용하려면 ETL 스크립트를 수정하고 DDL도 다음과 같이 변경해야 합니다:
> 
> ```sql
> CREATE EXTERNAL TABLE processed_transactions (
>     transaction_id bigint,
>     customer_id string,
>     product_id string,
>     amount double,
>     transaction_date string,
>     region string
> )
> PARTITIONED BY ("year" int, "month" int)
> STORED AS PARQUET
> LOCATION 's3://week11-data-{StudentId}-ap-northeast-2/processed/';
> ```

> [!NOTE]
> **💡 왜 수동으로 테이블을 생성하나요?**
> 
> 현재 Crawler는 `raw/` 폴더만 스캔합니다. `processed/` 폴더의 Parquet 데이터를 쿼리하려면:
> 
> **방법 1 (이 실습)**: Athena DDL로 수동 테이블 생성
> **방법 2 (권장)**: `processed/` 폴더용 Crawler 추가 생성
> 
> 이 실습에서는 Athena DDL 작성 방법을 학습하기 위해 방법 1을 사용합니다.

4. [[Run]] 버튼을 클릭합니다.

### 태스크 4.3: 데이터 쿼리 및 분석

1. 다음 쿼리를 입력하여 처리된 데이터를 확인합니다:

```sql
SELECT * FROM processed_transactions LIMIT 10;
```

2. [[Run]] 버튼을 클릭합니다.

> [!OUTPUT]
> ```
> transaction_id | customer_id | product_id | amount | transaction_date | region | year | month
> 1              | C001        | P001       | 100.50 | 2024-01-15       | Seoul  | 2024 | 1
> ...
> ```

3. 지역별 매출을 분석하는 쿼리를 실행합니다:

```sql
SELECT 
    region,
    COUNT(*) as transaction_count,
    SUM(amount) as total_sales,
    AVG(amount) as avg_transaction_value
FROM processed_transactions
GROUP BY region
ORDER BY total_sales DESC;
```

4. 월별 매출 추이를 확인하는 쿼리를 실행합니다:

```sql
SELECT 
    "year",
    "month",
    COUNT(*) as transaction_count,
    SUM(amount) as monthly_sales
FROM processed_transactions
GROUP BY "year", "month"
ORDER BY "year", "month";
```

> [!NOTE]
> `year`와 `month`는 Athena(Presto 기반)의 예약어입니다. 컬럼명으로 사용 시 큰따옴표로 감싸야 합니다. 예약어를 그대로 사용하면 "line X:Y: 'year' cannot be resolved" 오류가 발생합니다.
> 
> **예약어 처리 예시**:
> 
> ```sql
> -- 연도별 거래 현황 (year는 예약어이므로 큰따옴표 필수)
> SELECT 
>     "year",
>     "month",
>     COUNT(*) as transaction_count,
>     SUM(amount) as monthly_revenue
> FROM processed_transactions
> GROUP BY "year", "month"
> ORDER BY "year", "month";
> ```
> 
> 예약어를 컬럼명으로 사용할 때는 반드시 큰따옴표로 감싸야 합니다. 별칭(alias)은 예약어가 아니므로 큰따옴표가 필요하지 않습니다.

5. 제품별 판매 실적을 확인하는 쿼리를 실행합니다:

```sql
SELECT 
    product_id,
    COUNT(*) as sales_count,
    SUM(amount) as total_revenue,
    AVG(amount) as avg_price
FROM processed_transactions
GROUP BY product_id
ORDER BY total_revenue DESC;
```

✅ **태스크 완료**: Athena로 처리된 데이터를 쿼리했습니다.

## 태스크 5: 전체 데이터 파이프라인 테스트

이 태스크에서는 새로운 데이터를 업로드하여 전체 파이프라인이 자동으로 동작하는지 확인합니다.

1. Amazon S3 콘솔로 이동합니다.
2. 데이터 버킷(`week11-data-{StudentId}-ap-northeast-2`)을 클릭합니다.
3. `raw/` 폴더를 클릭합니다.
4. [[Upload]] 버튼을 클릭합니다.
5. 다운로드한 ZIP 파일에서 `sales-data.csv` 파일을 선택합니다.

> [!NOTE]
> `sales-data.csv`와 `sales-data-2.csv`는 동일한 스키마를 가진 추가 테스트 데이터입니다. 둘 중 하나를 업로드하여 파이프라인을 테스트할 수 있습니다. 두 파일을 모두 업로드하면 Crawler가 모든 파일을 스캔하여 데이터를 통합합니다.

6. [[Upload]] 버튼을 클릭합니다.

> [!NOTE]
> 파일이 업로드되면 다음 과정이 자동으로 진행됩니다:
> 1. EventBridge가 Amazon S3 이벤트 감지
> 2. AWS Lambda 함수가 자동으로 실행됨
> 3. AWS Lambda 함수가 AWS Glue Crawler 시작
> 4. Crawler가 새 데이터를 스캔하고 카탈로그 업데이트
> 
> 단, **AWS Glue ETL Job은 자동으로 실행되지 않습니다**. 이 실습에서는 Crawler만 자동화되어 있으며, ETL Job은 수동으로 실행해야 합니다. 완전 자동화를 위해서는 Crawler 완료 후 ETL Job을 트리거하는 추가 Lambda 함수나 Step Functions 워크플로우가 필요합니다.

7. AWS Lambda 콘솔로 이동합니다.
8. `week11-pipeline-trigger-{StudentId}` 함수를 선택합니다.
9. **Monitor** 탭을 선택합니다.
10. **Logs**를 클릭하여 Amazon CloudWatch Logs에서 실행 로그를 확인합니다.

> [!NOTE]
> 로그에서 "Starting AWS Glue Crawler" 메시지를 확인할 수 있습니다.

11. AWS Glue 콘솔로 이동합니다.
12. 왼쪽 메뉴에서 **Crawlers**를 선택합니다.
13. `week11-pipeline-crawler-{StudentId}` Crawler를 선택합니다.
14. **Status**가 "Running"인지 확인합니다.

> [!NOTE]
> AWS Lambda 함수가 자동으로 Crawler를 시작했습니다. Crawler는 새로 업로드된 데이터를 스캔하여 스키마 변경 사항을 감지하고 Data Catalog를 업데이트합니다.

> [!IMPORTANT]
> 새로 업로드한 데이터의 스키마가 기존 데이터와 다른 경우(예: 새로운 컬럼 추가), Crawler가 스키마를 업데이트합니다. Athena 쿼리 전에 반드시 Crawler 실행이 완료되어야 최신 스키마로 쿼리할 수 있습니다.

15. **Status**가 "Ready"로 변경될 때까지 기다립니다.

> [!NOTE]
> Crawler가 재실행되면 기존 `raw` 테이블의 스키마를 업데이트합니다. 새로 업로드한 파일에 기존 파일과 다른 컬럼이 있으면 Crawler가 자동으로 감지하여 테이블 스키마에 추가합니다. 테이블이 새로 생성되는 것이 아니라 기존 테이블이 업데이트됩니다.

16. Amazon Athena 콘솔로 이동합니다.
17. **Editor** 탭을 선택합니다.

> [!NOTE]
> **Workgroup 및 Database 재확인**:
> 
> 다른 페이지를 이동한 후 Athena 콘솔로 돌아오면 Workgroup이나 Database 선택이 초기화될 수 있습니다. 쿼리 실행 전 반드시 다음을 확인하세요:
> 
> 1. **Workgroup**: `primary` 선택 확인 (상단 오른쪽)
> 2. **Database**: `week11_pipeline_{StudentId}` 선택 확인 (왼쪽 상단 드롭다운)
> 3. **Tables**: 왼쪽 목록에 `raw` 테이블이 표시되는지 확인
> 
> 테이블이 표시되지 않으면 태스크 2의 Crawler 실행이 완료되었는지 확인하세요.

18. **Database**에서 `week11_pipeline_{StudentId}`를 선택합니다.
19. 왼쪽 **Tables** 목록에서 테이블 이름을 확인합니다.

> [!NOTE]
> Crawler가 생성하는 테이블명은 S3 폴더명 기반이지만, 폴더 경로 구조나 특수문자에 따라 `raw` 또는 다른 이름으로 생성될 수 있습니다. 반드시 실제 테이블명을 확인한 후 쿼리하세요.

20. 다음 쿼리를 실행하여 새 데이터가 포함되었는지 확인합니다 (테이블명을 실제 이름으로 변경):

```sql
SELECT COUNT(*) as total_records FROM raw;
```

> [!NOTE]
> `raw`는 AWS Glue Crawler가 Amazon S3의 `raw/` 폴더를 스캔하여 자동으로 생성한 테이블 이름입니다. Crawler는 폴더 이름을 기반으로 테이블 이름을 지정합니다.

> [!NOTE]
> 레코드 수가 증가했는지 확인합니다. 초기 `transactions.csv` 파일의 레코드 수와 비교하여 새로 업로드한 `sales-data.csv` 또는 `sales-data-2.csv`의 레코드가 추가되었는지 확인할 수 있습니다.

✅ **태스크 완료**: 전체 데이터 파이프라인이 자동으로 동작함을 확인했습니다.

## 마무리

다음을 성공적으로 수행했습니다:

- CloudFormation으로 전체 데이터 파이프라인 인프라를 자동으로 구축했습니다
- AWS Glue Crawler로 자동으로 데이터 카탈로그를 생성했습니다
- AWS Glue ETL Job으로 데이터를 변환하고 Parquet 형식으로 저장했습니다
- Athena로 처리된 데이터를 SQL로 쿼리하고 분석했습니다
- EventBridge와 Lambda로 Crawler 실행을 자동화했습니다
- 전체 파이프라인에서 Crawler가 이벤트 기반으로 자동 실행됨을 확인했습니다

## 리소스 정리

> [!WARNING]
> 다음 단계를 반드시 수행하여 불필요한 비용을 방지하세요.

### 방법 1: Tag Editor로 리소스 찾기 (권장)

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Resource Groups & Tag Editor`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `ap-northeast-2`를 선택합니다.
4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Week`
   - **Tag value**: `11-3`
6. [[Search resources]] 버튼을 클릭합니다.
7. 이 실습에서 생성한 모든 리소스가 표시됩니다.

> [!NOTE]
> Tag Editor는 리소스를 찾는 용도로만 사용됩니다. 실제 삭제는 각 서비스 콘솔에서 수행해야 합니다.

### 방법 2: AWS CloudFormation 스택 삭제

#### 0단계: AWS Glue Crawler 상태 확인 (필수)

> [!IMPORTANT]
> Crawler가 실행 중인 상태에서 CloudFormation 스택 삭제를 시도하면 "DELETE_FAILED" 오류가 발생할 수 있습니다. 반드시 Crawler 상태를 확인하고 완료될 때까지 기다려야 합니다.

1. AWS Glue 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **Crawlers**를 선택합니다.
3. `week11-pipeline-crawler-{StudentId}` Crawler를 선택합니다.
4. **Status**가 "Ready"인지 확인합니다.
5. 상태가 "Running"이면 완료될 때까지 기다립니다 (1-2분 소요).

> [!NOTE]
> Crawler가 "Ready" 상태가 되면 안전하게 스택을 삭제할 수 있습니다.

#### 1단계: Amazon S3 버킷 비우기 (필수)

> [!IMPORTANT]
> Amazon S3 버킷에 객체가 있으면 AWS CloudFormation 스택 삭제가 실패합니다. 반드시 3개 버킷을 모두 비운 후 스택을 삭제해야 합니다.
> 
> **버킷을 비워야 하는 이유**:
> - `week11-data-{StudentId}-ap-northeast-2`: 원본 데이터(`raw/`)와 처리된 데이터(`processed/`)가 저장되어 있습니다
> - `week11-scripts-{StudentId}-ap-northeast-2`: ETL 스크립트(`etl-script.py`)가 저장되어 있습니다
> - `week11-temp-{StudentId}-ap-northeast-2`: ETL Job 임시 파일(`temp/`)과 Athena 쿼리 결과(`athena-results/`)가 저장되어 있습니다

1. Amazon S3 콘솔로 이동합니다.
2. 다음 버킷들을 각각 선택하여 비웁니다:
   - `week11-data-{StudentId}-ap-northeast-2`
   - `week11-scripts-{StudentId}-ap-northeast-2`
   - `week11-temp-{StudentId}-ap-northeast-2`
3. 각 버킷을 선택한 후 [[Empty]] 버튼을 클릭합니다.
4. 확인 창에서 `permanently delete`를 입력하고 [[Empty]] 버튼을 클릭합니다.
5. 3개 버킷 모두 비워질 때까지 반복합니다.

#### 2단계: 수동 생성 리소스 삭제

태스크 4.2에서 Athena로 수동 생성한 테이블을 삭제합니다:

6. Amazon Athena 콘솔로 이동합니다.
7. **Editor** 탭을 선택합니다.
8. **Database**에서 `week11_pipeline_{StudentId}`를 선택합니다.
9. 다음 쿼리를 실행합니다:

```sql
DROP TABLE IF EXISTS processed_transactions;
```

10. [[Run]] 버튼을 클릭합니다.

> [!NOTE]
> 태스크 4.2에서 Athena로 생성한 `processed_transactions` 테이블은 AWS Glue Data Catalog의 메타데이터입니다.
> CloudFormation은 배포 시점에 생성한 리소스만 관리하므로, 실습 중 동적으로 생성된 이 테이블은 수동으로 삭제해야 합니다.
> 테이블을 삭제해도 Amazon S3의 실제 데이터(`processed/` 폴더)는 삭제되지 않습니다 (EXTERNAL TABLE이므로).

#### 3단계: AWS CloudFormation 스택 삭제

11. AWS CloudFormation 콘솔로 이동합니다.
12. `week11-3-pipeline-stack` 스택을 선택합니다.
13. [[Delete]] 버튼을 클릭합니다.
14. 확인 창에서 [[Delete]] 버튼을 클릭합니다.
15. 스택 삭제가 완료될 때까지 기다립니다 (3-5분 소요).



> [!NOTE]
> **S3 버킷 삭제 정책**:
> 
> 이 실습의 CloudFormation 템플릿은 S3 버킷에 **DeletionPolicy: Delete** (기본값)를 사용합니다.
> - **버킷이 비어있으면**: 스택 삭제 시 버킷도 자동으로 삭제됩니다
> - **버킷에 객체가 있으면**: 스택 삭제가 실패합니다 (1단계에서 버킷을 비워야 하는 이유)
> 
> 만약 템플릿에서 **DeletionPolicy: Retain**을 설정했다면:
> - 버킷을 비워도 스택 삭제 시 버킷이 삭제되지 않습니다
> - 수동으로 S3 콘솔에서 버킷을 삭제해야 합니다
> 
> **이 실습에서는 DeletionPolicy: Delete를 사용하므로**, 1단계에서 버킷을 비우면 스택 삭제 시 버킷도 함께 삭제됩니다.

> [!NOTE]
> AWS CloudFormation 스택을 삭제하면 다음 리소스가 자동으로 삭제됩니다:
> - Amazon S3 버킷 3개 (데이터, 스크립트, 임시) - 버킷이 비어있는 경우
> - AWS Glue Database 및 테이블
> - AWS Glue Crawler
> - AWS Glue ETL Job
> - AWS Lambda 함수
> - EventBridge 규칙
> - AWS IAM 역할 2개

> [!TROUBLESHOOTING]
> **문제**: AWS CloudFormation 스택 삭제가 "DELETE_FAILED" 상태로 실패합니다
> 
> **원인**: Amazon S3 버킷에 객체가 남아 있거나, AWS Glue Crawler가 실행 중입니다.
> 
> **해결**:
> 1. Amazon S3 콘솔에서 3개 버킷을 모두 확인하고 Empty 버튼으로 비웁니다
> 2. AWS Glue 콘솔에서 Crawler 상태가 "Ready"인지 확인합니다 (실행 중이면 완료될 때까지 대기)
> 3. AWS CloudFormation 콘솔에서 스택을 다시 선택하고 Delete 버튼을 클릭합니다
> 4. 그래도 실패하면 **Events** 탭에서 실패 원인을 확인하고 해당 리소스를 수동으로 삭제한 후 스택 삭제를 재시도합니다

✅ **실습 종료**: 모든 리소스가 정리되었습니다.

## 추가 학습 리소스

- [AWS Glue 개발자 가이드](https://docs.aws.amazon.com/glue/)
- [Amazon Athena 사용 설명서](https://docs.aws.amazon.com/athena/)
- [데이터 레이크 아키텍처](https://aws.amazon.com/big-data/datalakes-and-analytics/)
- [AWS Lambda 개발자 가이드](https://docs.aws.amazon.com/lambda/)
- [EventBridge 사용 설명서](https://docs.aws.amazon.com/eventbridge/)

## 📚 참고: AWS 데이터 분석 서비스 및 모범 사례

### AWS 데이터 분석 서비스

**Amazon S3 (Simple Storage Service)**
- 무제한 확장 가능한 객체 스토리지
- 데이터 레이크의 기반 스토리지
- 11개의 9(99.999999999%) 내구성
- 다양한 스토리지 클래스로 비용 최적화

**AWS Glue**
- 완전 관리형 ETL(Extract, Transform, Load) 서비스
- 서버리스 데이터 통합
- 자동 스키마 검색 및 카탈로그 관리
- PySpark 및 Python Shell 작업 지원

**Amazon Athena**
- 서버리스 대화형 쿼리 서비스
- 표준 SQL로 Amazon S3 데이터 분석
- Presto 기반 고성능 쿼리 엔진
- 스캔한 데이터량에 따른 과금 ($5/TB)

**AWS Lambda**
- 서버리스 컴퓨팅 서비스
- 이벤트 기반 자동 실행
- 밀리초 단위 과금
- 자동 스케일링

**Amazon EventBridge**
- 서버리스 이벤트 버스 서비스
- AWS 서비스 간 이벤트 라우팅
- 규칙 기반 이벤트 필터링
- 다양한 대상 서비스 지원

### 데이터 파이프라인 모범 사례

**데이터 레이크 계층 구조**
- Bronze (Raw): 원본 데이터 보존
- Silver (Processed): 정제 및 표준화
- Gold (Curated): 비즈니스 로직 적용

**성능 최적화**
- 파티셔닝으로 쿼리 범위 축소
- Parquet 형식으로 압축 및 성능 향상
- 적절한 파일 크기 유지 (128MB-1GB)
- 컬럼 기반 저장 형식 활용

**비용 최적화**
- Amazon S3 Intelligent-Tiering 활용
- Amazon Athena 쿼리 최적화 (필요한 컬럼만 SELECT)
- AWS Lambda 메모리 및 타임아웃 최적화
- AWS Glue DPU(Data Processing Unit) 적절히 설정

**자동화 및 모니터링**
- EventBridge로 이벤트 기반 자동화
- Amazon CloudWatch Logs로 파이프라인 모니터링
- SNS로 실패 알림 설정
- Step Functions로 복잡한 워크플로우 관리

### AWS Glue ETL Job 스크립트 구조

**기본 구조**:
```python
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.dynamicframe import DynamicFrame

# Job 파라미터 가져오기
args = getResolvedOptions(sys.argv, ['JOB_NAME'])

# AWS Glue Context 초기화
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

# 데이터 읽기 (Job 파라미터 사용)
args = getResolvedOptions(sys.argv, ['JOB_NAME', 'DATABASE_NAME'])
datasource = glueContext.create_dynamic_frame.from_catalog(
    database = args['DATABASE_NAME'],
    table_name = "raw"
)

# 데이터 변환 (연도와 월 추출)
from pyspark.sql.functions import year, month, col
df = datasource.toDF()
df = df.withColumn("year", year(col("transaction_date")))
df = df.withColumn("month", month(col("transaction_date")))

# DataFrame을 DynamicFrame으로 변환
transformed = DynamicFrame.fromDF(df, glueContext, "transformed")

# 데이터 쓰기 (Parquet 형식)
glueContext.write_dynamic_frame.from_options(
    frame = transformed,
    connection_type = "s3",
    connection_options = {"path": "s3://week11-data-{StudentId}-ap-northeast-2/processed/"},
    format = "parquet"
)

job.commit()
```

**주요 구성 요소**:
- **SparkContext**: Apache Spark 실행 환경
- **GlueContext**: AWS Glue 전용 컨텍스트
- **DynamicFrame**: AWS Glue의 데이터 구조 (DataFrame과 유사하지만 스키마 유연성 제공)
- **변환 로직**: PySpark SQL 함수로 데이터 변환
- **Parquet 저장**: 컬럼 기반 저장 형식으로 쿼리 성능 향상

> [!IMPORTANT]
> **날짜 타입 변환 주의사항**:
> 
> 위 스크립트 예시에서 `year()`, `month()` 함수는 `DateType` 또는 `TimestampType` 컬럼에만 동작합니다. CSV 파일에서 읽은 `transaction_date`는 `StringType`이므로 먼저 날짜 타입으로 변환해야 합니다.
> 
> **올바른 변환 방법**:
> ```python
> from pyspark.sql.functions import year, month, col, to_date
> 
> # 문자열을 날짜 타입으로 변환
> df = df.withColumn("transaction_date_parsed", to_date(col("transaction_date"), "yyyy-MM-dd"))
> 
> # 날짜 타입에서 연도와 월 추출
> df = df.withColumn("year", year(col("transaction_date_parsed")))
> df = df.withColumn("month", month(col("transaction_date_parsed")))
> 
> # 임시 컬럼 제거
> df = df.drop("transaction_date_parsed")
> ```
> 
> 이렇게 하지 않으면 `year()`, `month()` 함수가 NULL을 반환하거나 오류가 발생할 수 있습니다.

> [!IMPORTANT]
> 위 스크립트 예시에서 `{StudentId}` 부분은 하드코딩되어 있습니다. 실제 프로덕션 환경에서는 **Job 파라미터**를 사용하여 동적으로 값을 전달하는 것이 권장됩니다.
> 
> **Job 파라미터 사용 예시**:
> ```python
> # Job 파라미터 가져오기
> args = getResolvedOptions(sys.argv, ['JOB_NAME', 'STUDENT_ID', 'DATA_BUCKET', 'DATABASE_NAME'])
> 
> # 파라미터 사용
> database = args['DATABASE_NAME']
> output_path = f"s3://{args['DATA_BUCKET']}/processed/"
> ```
> 
> 이렇게 하면 스크립트를 수정하지 않고도 다른 학생이나 환경에서 재사용할 수 있습니다. CloudFormation 템플릿에서 Job 생성 시 `DefaultArguments` 속성으로 파라미터를 전달할 수 있습니다:
> 
> ```yaml
> GlueETLJob:
>   Type: AWS::Glue::Job
>   Properties:
>     DefaultArguments:
>       '--STUDENT_ID': !Ref StudentId
>       '--DATA_BUCKET': !Sub 'week11-data-${StudentId}-${AWS::Region}'
>       '--DATABASE_NAME': !Sub 'week11_pipeline_${StudentId}'
> ```

### Amazon Athena 쿼리 최적화 팁

**파티셔닝 활용 및 파티션 프루닝**:

파티션 프루닝(Partition Pruning)은 쿼리 실행 시 필요한 파티션만 스캔하여 성능을 향상시키고 비용을 절감하는 기법입니다.

```sql
-- 파티션 필터 적용 (파티션 프루닝 발생)
SELECT * FROM processed_transactions
WHERE "year" = 2024 AND "month" = 1;

-- 파티션 필터 미적용 (전체 데이터 스캔)
SELECT * FROM processed_transactions
WHERE region = 'Seoul';
```

**파티션 프루닝 효과 확인 방법**:

1. Athena 쿼리 실행 후 하단의 **Query details**를 확인합니다.
2. **Data scanned** 값을 비교합니다:
   - 파티션 필터 적용 시: 특정 파티션만 스캔 (예: 10 MB)
   - 파티션 필터 미적용 시: 전체 데이터 스캔 (예: 100 MB)

> [!NOTE]
> 이 실습에서는 `year`와 `month`를 일반 컬럼으로 추가했으므로 파티션 프루닝이 발생하지 않습니다. 파티션 프루닝을 활용하려면 ETL 스크립트를 수정하여 `year=2024/month=1/` 형태의 디렉터리 구조로 저장하고, DDL에서 `PARTITIONED BY` 절을 사용해야 합니다.

**컬럼 선택**:
```sql
-- 필요한 컬럼만 선택 (비용 절감)
SELECT col1, col2 FROM table;  -- 권장
SELECT * FROM table;            -- 전체 데이터 확인 시에만 사용
```

**집계 쿼리**:
```sql
-- GROUP BY로 데이터 집계
SELECT region, COUNT(*), SUM(amount)
FROM table
GROUP BY region;
```

### CTAS (CREATE TABLE AS SELECT) 사용 시 주의사항

**CTAS란?**

CTAS(CREATE TABLE AS SELECT)는 쿼리 결과를 새로운 테이블로 저장하는 Athena 기능입니다. 집계 결과나 필터링된 데이터를 별도 테이블로 저장하여 반복 쿼리 성능을 향상시킬 수 있습니다.

**기본 사용 예시**:
```sql
-- 지역별 집계 결과를 새 테이블로 저장
CREATE TABLE region_summary AS
SELECT 
    region,
    COUNT(*) as transaction_count,
    SUM(amount) as total_sales
FROM processed_transactions
GROUP BY region;
```

**컬럼 선택 시 고려사항**:

이 실습에서 `date` 컬럼을 제거한 이유는 다음과 같습니다:

1. **집계 의미 감소 (주된 이유)**:
   - 샘플 데이터가 5건으로 매우 적어 날짜별로 분리하면 통계적 의미가 없습니다
   - 전체 데이터를 하나로 집계해야 지역별 패턴을 명확히 볼 수 있습니다
   - 날짜를 포함하면 각 날짜당 1-2건씩 분산되어 분석이 어렵습니다

2. **CTAS 규칙 제약 (부차적 이유)**:
   - Athena CTAS는 파티션 컬럼이 SELECT 절의 마지막에 위치해야 합니다
   - `date`를 큰따옴표로 감싸고 `status` 앞에 배치하면 기술적으로는 사용 가능합니다
   - 하지만 파티션 컬럼이 아닌 일반 컬럼으로 사용하는 것이므로 순서는 자유롭습니다

**올바른 CTAS 사용 예시**:

```sql
-- ✅ 파티션 없이 집계 (이 실습의 접근)
CREATE TABLE transaction_analysis AS
SELECT 
    region,
    COUNT(*) as count,
    AVG(amount) as avg_amount
FROM processed_transactions
GROUP BY region;

-- ✅ 파티션 컬럼을 마지막에 배치
CREATE TABLE transaction_analysis
WITH (
    partitioned_by = ARRAY['region']
)
AS
SELECT 
    "year",
    "month",
    COUNT(*) as count,
    region  -- 파티션 컬럼은 마지막
FROM processed_transactions
GROUP BY "year", "month", region;

-- ❌ 파티션 컬럼이 중간에 위치 (오류 발생)
CREATE TABLE transaction_analysis
WITH (
    partitioned_by = ARRAY['region']
)
AS
SELECT 
    region,  -- 파티션 컬럼이 중간에 있음
    "year",
    "month",
    COUNT(*) as count
FROM processed_transactions
GROUP BY region, "year", "month";
```

**핵심 정리**:
- 소량 데이터에서는 날짜 컬럼을 제거하고 전체 집계하는 것이 분석에 유리합니다
- CTAS 파티션 사용 시 파티션 컬럼은 반드시 SELECT 절 마지막에 배치해야 합니다
- 일반 컬럼으로 사용하는 경우 순서는 자유롭지만, 집계 목적에 맞게 선택해야 합니다
