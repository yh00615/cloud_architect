---
title: 'AWS Secrets Manager와 AWS Systems Manager를 활용한 자격증명 관리'
week: 12
session: 1
awsServices:
  - AWS Systems Manager
  - AWS Secrets Manager
learningObjectives:
  - AWS Systems Manager Parameter Store에 데이터베이스 연결 정보를 저장할 수 있습니다
  - AWS Secrets Manager에 Amazon RDS 자격증명을 저장하고 자동 로테이션을 설정할 수 있습니다
  - AWS Lambda 함수에서 Parameter Store와 Secrets Manager를 조회할 수 있습니다
  - 하드코딩된 자격증명을 제거하고 보안을 강화할 수 있습니다
prerequisites:
  - AWS IAM 기본 개념 이해.
  - AWS Lambda 기본 사용 경험.
  - 암호화 기본 개념 이해.
---

이 실습에서는 AWS Secrets Manager와 AWS Systems Manager Parameter Store를 활용하여 애플리케이션 자격증명을 안전하게 관리하는 방법을 학습합니다. 먼저 AWS KMS로 암호화 키를 생성하고, Secrets Manager에 데이터베이스 자격증명을 저장합니다. 그런 다음 Parameter Store에 애플리케이션 설정값을 저장하고, AWS Lambda 함수에서 저장된 자격증명을 안전하게 조회하는 방법을 실습합니다.

이 실습을 시작하기 전에 AWS 콘솔 우측 상단에서 리전이 **Asia Pacific (Seoul) ap-northeast-2**로 설정되어 있는지 확인합니다.

> [!WARNING]
> **실습 보안 주의사항 및 비용 정보**:
>
> 이 실습은 교육 목적으로 설계되었으며, 다음 사항에 유의합니다:
>
> - **더미 자격증명 사용**: 실습에서 사용하는 비밀번호와 API 키는 더미 값입니다. 실제 환경에서는 절대 가이드에 자격증명을 기록하지 않습니다.
> - **로그 출력 금지**: Lambda 함수 코드는 실습 목적으로 자격증명을 CloudWatch Logs에 출력합니다. 프로덕션 환경에서는 절대로 자격증명을 로그에 출력하지 않습니다.
> - **즉시 삭제 필요**: 실습 종료 후 모든 시크릿과 리소스를 즉시 삭제해야 합니다.
>
> 이 실습에서 생성하는 리소스는 실습 종료 후 반드시 삭제해야 합니다.
>
> **예상 비용** (ap-northeast-2 리전 기준):
>
> | 리소스          | 타입                  | 월 비용           |
> | --------------- | --------------------- | ----------------- |
> | Secrets Manager | 시크릿 2개            | 약 $0.80          |
> | KMS 키          | 고객 관리형           | 약 $1.00          |
> | Lambda 함수     | 실행 비용             | 프리 티어 범위 내 |
> | Parameter Store | Standard 파라미터 2개 | 무료              |
> | CloudWatch Logs | 로그 저장             | 프리 티어 범위 내 |
> | **총 예상**     |                       | **약 $1.80**      |
>
> **추가 비용**:
>
> - Secrets Manager API 호출: $0.05/10,000건
> - KMS API 호출: $0.03/10,000건
>
> **중요**: KMS 키는 삭제 예약 시 즉시 비용 청구가 중단됩니다. Secrets Manager 시크릿은 삭제 대기 기간(7일) 동안 비용이 계속 발생하므로 AWS CloudShell에서 즉시 삭제하는 것을 권장합니다.

> [!DOWNLOAD]
> [week12-1-credentials-management.zip](/files/week12/week12-1-credentials-management.zip)
>
> - `lambda_function.py` - Secrets Manager와 Parameter Store 조회 AWS Lambda 함수 코드
> - `lambda-iam-policy.json` - AWS Lambda 함수 AWS IAM 정책 (Secrets Manager, Parameter Store, KMS 접근 권한)
> - `README.txt` - 파일 사용 방법 및 주의사항
>
> **파일 용도**: 이 zip 파일에는 태스크 5에서 사용할 AWS Lambda 함수 코드와 AWS IAM 정책이 포함되어 있습니다. 실습에서는 AWS 콘솔에서 직접 코드를 입력하지만, 참고용으로 제공됩니다.
>
> **관련 태스크:**
>
> - 태스크 5: AWS Lambda 함수에서 시크릿 사용 (lambda_function.py를 AWS Lambda 코드 편집기에 붙여넣고, lambda-iam-policy.json을 AWS IAM 인라인 정책으로 추가)

## 태스크 1: KMS 키 생성

이 태스크에서는 시크릿을 암호화하기 위한 KMS 고객 관리형 키를 생성합니다. KMS 키는 Secrets Manager와 Parameter Store에서 데이터를 암호화하는 데 사용됩니다.

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Key Management Service`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Customer managed keys**를 선택합니다.
3. [[Create key]] 버튼을 클릭합니다.
4. **Key type**에서 `Symmetric`을 선택합니다.
5. **Key usage**에서 `Encrypt and decrypt`를 선택합니다.
6. [[Next]] 버튼을 클릭합니다.
7. **Alias**에 `secrets-encryption-key`를 입력합니다.
8. **Description**에 `Key for encrypting secrets and parameters`를 입력합니다.
9. [[Next]] 버튼을 클릭합니다.
10. **Key administrators** 섹션에서 현재 로그인한 IAM 사용자 또는 역할을 선택합니다.

> [!NOTE]
> **현재 로그인 정보 확인 방법**:
>
> 1. AWS 콘솔 우측 상단 계정명 클릭
> 2. "Security credentials" 선택
> 3. 현재 사용자/역할 ARN 확인
>
> **환경별 검색 방법**:
>
> - **IAM 사용자**: 사용자 이름 (예: student01)
> - **IAM 역할**: 역할 이름 (예: LabRole, voclabs)
> - **AWS SSO**: 권한 세트 이름
>
> ⚠️ 아무것도 선택하지 않으면 키 관리자가 없어 나중에 키를 수정하거나 삭제할 수 없습니다. 반드시 현재 사용 중인 자격증명을 선택하세요.

11. [[Next]] 버튼을 클릭합니다.
12. **Key users** 섹션에서 현재 로그인한 IAM 사용자 또는 역할을 선택합니다.
13. [[Next]] 버튼을 클릭합니다.
14. 설정을 검토합니다.
15. [[Finish]] 버튼을 클릭합니다.
16. 생성된 KMS 키를 선택합니다.
17. **Key ARN**을 복사합니다.

이 KMS 키 ARN은 태스크 5에서 Lambda IAM 정책에 사용되므로 메모장에 저장합니다.

18. **Tags** 탭을 선택합니다.
19. [[Edit]] 버튼을 클릭합니다.
20. [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key         | Value     |
| ----------- | --------- |
| `Project`   | `AWS-Lab` |
| `Week`      | `12-1`    |
| `CreatedBy` | `Student` |

21. [[Save changes]] 버튼을 클릭합니다.

✅ **태스크 완료**: KMS 키가 생성되었습니다.

## 태스크 2: Secrets Manager에 데이터베이스 자격증명 저장

이 태스크에서는 Secrets Manager에 데이터베이스 자격증명을 안전하게 저장합니다. Secrets Manager는 자격증명을 암호화하여 저장하고, 자동 로테이션 기능을 제공하여 보안을 강화합니다.

1. 상단 검색창에서 `Secrets Manager`를 검색하고 선택합니다.
2. [[Store a new secret]] 버튼을 클릭합니다.
3. **Secret type**에서 `Other type of secret`을 선택합니다.
4. **Key/value pairs**에서 다음을 입력합니다:
   - Key: `username`, Value: `admin`
5. [[Add row]] 버튼을 클릭합니다.
6. 추가 행에 다음을 입력합니다:
   - Key: `password`, Value: `MySecurePassword123!`

> [!WARNING]
> 이 비밀번호는 실습용 예시입니다. 실제 환경에서는 강력한 랜덤 비밀번호를 사용하고 가이드에 기록하지 않습니다.

7. **Encryption key**에서 `alias/secrets-encryption-key`를 선택합니다.
8. [[Next]] 버튼을 클릭합니다.
9. **Secret name**에 `prod/db/mysql/credentials`를 입력합니다.
10. **Description**에 `Production MySQL database credentials`를 입력합니다.
11. **Tags - optional** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key         | Value     |
| ----------- | --------- |
| `Project`   | `AWS-Lab` |
| `Week`      | `12-1`    |
| `CreatedBy` | `Student` |

12. [[Next]] 버튼을 클릭합니다.
13. **Automatic rotation**에서 `Disable automatic rotation`을 선택합니다.
14. [[Next]] 버튼을 클릭합니다.
15. 설정을 검토합니다.
16. [[Store]] 버튼을 클릭합니다.

✅ **태스크 완료**: 데이터베이스 자격증명이 저장되었습니다.

## 태스크 3: 추가 시크릿 생성

이 태스크에서는 API 키와 같은 다른 유형의 시크릿을 저장합니다. Key/Value 형식으로 여러 개의 자격증명을 하나의 시크릿에 저장할 수 있습니다.

1. [[Store a new secret]] 버튼을 클릭합니다.
2. **Secret type**에서 `Other type of secret`을 선택합니다.
3. **Key/value pairs**에서 다음을 입력합니다:
   - Key: `api_key`, Value: `sk-1234567890abcdef`
4. [[Add row]] 버튼을 클릭합니다.
5. 추가 행에 다음을 입력합니다:
   - Key: `api_secret`, Value: `secret-abcdef1234567890`
6. **Encryption key**에서 `alias/secrets-encryption-key`를 선택합니다.
7. [[Next]] 버튼을 클릭합니다.
8. **Secret name**에 `prod/api/external-service`를 입력합니다.
9. **Description**에 `External service API credentials`를 입력합니다.
10. **Tags - optional** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key         | Value     |
| ----------- | --------- |
| `Project`   | `AWS-Lab` |
| `Week`      | `12-1`    |
| `CreatedBy` | `Student` |

11. [[Next]] 버튼을 클릭합니다.
12. **Automatic rotation**에서 `Disable`을 선택합니다.
13. [[Next]] 버튼을 클릭합니다.
14. [[Store]] 버튼을 클릭합니다.

✅ **태스크 완료**: API 키가 저장되었습니다.

## 태스크 4: Parameter Store에 설정 저장

이 태스크에서는 Systems Manager Parameter Store에 애플리케이션 설정값을 저장합니다. Parameter Store는 일반 문자열과 암호화된 문자열(SecureString)을 모두 지원하며, 계층적 구조로 파라미터를 관리할 수 있습니다.

1. 상단 검색창에서 `Systems Manager`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Parameter Store**를 선택합니다.
3. [[Create parameter]] 버튼을 클릭합니다.
4. **Name**에 `/prod/app/config/region`을 입력합니다.
5. **Description**에 `AWS region for production`을 입력합니다.
6. **Tier**에서 `Standard`를 선택합니다.
7. **Type**에서 `String`을 선택합니다.
8. **Value**에 `ap-northeast-2`를 입력합니다.
9. **Tags - optional** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key         | Value     |
| ----------- | --------- |
| `Project`   | `AWS-Lab` |
| `Week`      | `12-1`    |
| `CreatedBy` | `Student` |

10. [[Create parameter]] 버튼을 클릭합니다.
11. [[Create parameter]] 버튼을 다시 클릭합니다.
12. **Name**에 `/prod/app/config/db-connection-string`을 입력합니다.
13. **Description**에 `Database connection string`을 입력합니다.
14. **Tier**에서 `Standard`를 선택합니다.
15. **Type**에서 `SecureString`을 선택합니다.
16. **KMS key source**에서 `My current account`를 선택합니다.
17. **KMS Key ID**에서 `alias/secrets-encryption-key`를 선택합니다.
18. **Value**에 `mysql://admin:password@db.example.com:3306/mydb`를 입력합니다.

> [!WARNING]
> 이 연결 문자열은 실습용 예시입니다. 실제 환경에서는 비밀번호를 하드코딩하지 말고 Secrets Manager에서 가져와야 합니다.

Parameter Store에서 파라미터를 조회할 때 `with_decryption` 파라미터의 동작은 파라미터 타입에 따라 다릅니다:

| 파라미터 타입 | with_decryption | 반환값                     |
| ------------- | --------------- | -------------------------- |
| String        | 해당 없음       | 평문 값 (암호화되지 않음)  |
| SecureString  | True            | 복호화된 평문 값 ✅        |
| SecureString  | False           | 암호화된 값 (사용 불가) ❌ |

String 타입은 애초에 암호화되지 않으므로 `with_decryption` 값에 관계없이 항상 평문으로 반환됩니다. SecureString 타입은 반드시 `with_decryption=True`로 조회해야 사용 가능한 값을 얻을 수 있습니다. Lambda 코드에서 `/prod/app/config/db-connection-string`은 SecureString이므로 `with_decryption=True`(기본값)로 조회합니다.

19. **Tags - optional** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key         | Value     |
| ----------- | --------- |
| `Project`   | `AWS-Lab` |
| `Week`      | `12-1`    |
| `CreatedBy` | `Student` |

20. [[Create parameter]] 버튼을 클릭합니다.

✅ **태스크 완료**: 애플리케이션 설정이 Parameter Store에 저장되었습니다.

## 태스크 5: AWS Lambda 함수에서 시크릿 사용

이 태스크에서는 AWS Lambda 함수를 생성하고 Secrets Manager와 Parameter Store에 저장된 자격증명을 안전하게 조회하는 방법을 실습합니다. AWS Lambda 함수에 적절한 AWS IAM 권한을 부여하여 시크릿과 파라미터에 접근할 수 있도록 설정합니다.

1. 상단 검색창에서 `AWS Lambda`를 검색하고 선택합니다.
2. [[Create function]] 버튼을 클릭합니다.
3. **Function name**에 `access-secrets-demo`를 입력합니다.
4. **Runtime**에서 `Python 3.12`를 선택합니다.
5. [[Create function]] 버튼을 클릭합니다.

> [!NOTE]
> Lambda 함수 생성 시 기본 실행 역할이 자동으로 생성됩니다. 역할 이름은 `access-secrets-demo-role-xxxxx` 형식으로 생성되며, 나중에 이 역할에 추가 권한을 부여합니다.

6. **Code** 탭을 선택합니다.
7. 다음 코드를 입력합니다:

```python
"""
AWS Lambda 함수: Secrets Manager와 Parameter Store 조회 데모

이 Lambda 함수는 AWS Secrets Manager와 AWS Systems Manager Parameter Store에서
자격증명과 설정값을 안전하게 조회하는 방법을 시연합니다.

환경 변수:
    없음 (시크릿 이름과 파라미터 경로는 코드에 하드코딩)

트리거:
    수동 테스트 (Test 이벤트)
"""

import json
import boto3
from botocore.exceptions import ClientError

# AWS 클라이언트 초기화 (리전 명시)
secrets_client = boto3.client('secretsmanager', region_name='ap-northeast-2')
ssm_client = boto3.client('ssm', region_name='ap-northeast-2')

def get_secret(secret_name):
    """
    Secrets Manager에서 시크릿 조회

    Args:
        secret_name (str): 시크릿 이름 (예: prod/db/mysql/credentials)

    Returns:
        dict: 시크릿 값 (JSON 파싱됨)
    """
    try:
        response = secrets_client.get_secret_value(SecretId=secret_name)
        return json.loads(response['SecretString'])
    except ClientError as e:
        print(f"Error retrieving secret: {e}")
        raise e

def get_parameter(parameter_name, with_decryption=True):
    """
    Parameter Store에서 파라미터 조회

    Args:
        parameter_name (str): 파라미터 이름 (예: /prod/app/config/region)
        with_decryption (bool): SecureString 복호화 여부

    Returns:
        str: 파라미터 값
    """
    try:
        response = ssm_client.get_parameter(
            Name=parameter_name,
            WithDecryption=with_decryption
        )
        return response['Parameter']['Value']
    except ClientError as e:
        print(f"Error retrieving parameter: {e}")
        raise e

def get_parameters_by_path(path, with_decryption=True):
    """
    경로로 여러 파라미터 조회

    Args:
        path (str): 파라미터 경로 (예: /prod/app/config)
        with_decryption (bool): SecureString 복호화 여부

    Returns:
        dict: 파라미터 이름과 값의 딕셔너리
    """
    try:
        response = ssm_client.get_parameters_by_path(
            Path=path,
            Recursive=True,
            WithDecryption=with_decryption
        )
        return {p['Name']: p['Value'] for p in response['Parameters']}
    except ClientError as e:
        print(f"Error retrieving parameters: {e}")
        raise e

def mask_value(value, visible_chars=3):
    """
    자격증명 마스킹 함수

    Args:
        value (str): 마스킹할 값
        visible_chars (int): 표시할 앞자리 수 (기본값: 3)

    Returns:
        str: 마스킹된 값 (예: "adm***")
    """
    if not value or len(value) <= visible_chars:
        return "***"
    return value[:visible_chars] + "*" * (len(value) - visible_chars)

def lambda_handler(event, context):
    """
    Lambda 핸들러 함수

    Args:
        event (dict): Lambda 이벤트
        context (LambdaContext): Lambda 실행 컨텍스트

    Returns:
        dict: HTTP 응답 형식
    """
    try:
        # 1. 데이터베이스 자격증명 조회
        db_credentials = get_secret('prod/db/mysql/credentials')
        # ✅ 보안 모범 사례: 자격증명 존재 여부만 확인 (값 출력 금지)
        print(f"DB credentials retrieved: {'username' in db_credentials and 'password' in db_credentials}")

        # 2. API 키 조회
        api_credentials = get_secret('prod/api/external-service')
        # ✅ 보안 모범 사례: 자격증명 존재 여부만 확인
        print(f"API credentials retrieved: {'api_key' in api_credentials and 'api_secret' in api_credentials}")

        # 3. 개별 파라미터 조회 (암호화되지 않은 값)
        region = get_parameter('/prod/app/config/region', with_decryption=False)
        print(f"Region: {region}")  # 리전은 민감정보 아님 - 출력 가능

        # 4. 암호화된 파라미터 조회
        db_connection = get_parameter('/prod/app/config/db-connection-string')
        # ✅ 보안 모범 사례: 연결 문자열 앞부분만 마스킹하여 표시
        print(f"DB Connection prefix: {mask_value(db_connection, 8)}")

        # 5. 경로로 모든 설정 조회
        all_configs = get_parameters_by_path('/prod/app/config')
        print(f"All configs: {list(all_configs.keys())}")

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Successfully retrieved all secrets and parameters',
                'region': region,
                'config_count': len(all_configs)
            })
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

8. {{Deploy}} 버튼을 클릭합니다.
9. **Configuration** 탭을 선택합니다.
10. 왼쪽 메뉴에서 **General configuration**을 선택합니다.
11. [[Edit]] 버튼을 클릭합니다.
12. **Timeout**을 `30`초로 변경합니다.

> [!NOTE]
> **Lambda Timeout 설정 이유**:
>
> - Lambda 기본 Timeout은 3초입니다
> - Secrets Manager API 호출: 평균 50-200ms
> - Parameter Store API 호출: 평균 50-200ms
> - 콜드 스타트: 최대 1-2초
> - 총 예상 실행 시간: 1-3초
> - 안전 마진 포함: 30초 권장

13. [[Save]] 버튼을 클릭합니다.
14. [[Manage tags]] 버튼을 클릭합니다.
15. [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key         | Value     |
| ----------- | --------- |
| `Project`   | `AWS-Lab` |
| `Week`      | `12-1`    |
| `CreatedBy` | `Student` |

13. [[Save]] 버튼을 클릭합니다.

> [!NOTE]
> **이 실습 vs 실제 프로덕션 환경**:
>
> **이 실습**: Lambda가 VPC 외부에서 실행 → 인터넷을 통해 Secrets Manager/Parameter Store에 직접 접근 → 별도 네트워크 설정 불필요
>
> **실제 프로덕션 환경** (VPC 내부 Lambda):
>
> - **방법 1: VPC Endpoint 생성 (권장)**
>   - `secretsmanager`용 Interface Endpoint
>   - `ssm`용 Interface Endpoint
>   - `kms`용 Interface Endpoint
>   - Week 3-1 실습에서 VPC Endpoint를 학습했습니다
> - **방법 2: NAT Gateway를 통한 인터넷 접근**
>   - 비용 발생: $0.045/시간 + 데이터 전송 비용

14. 왼쪽 메뉴에서 **Permissions**를 선택합니다.
15. **Execution role** 아래의 역할 이름 링크를 클릭합니다.

> [!NOTE]
> 역할 이름을 클릭하면 새 브라우저 탭에서 IAM 콘솔이 열립니다. Lambda 콘솔 탭은 그대로 유지됩니다.

16. IAM 콘솔에서 [[Add permissions]] > `Create inline policy`를 선택합니다.
17. **JSON** 탭을 선택합니다.
18. 다음 정책을 입력합니다:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["secretsmanager:GetSecretValue"],
      "Resource": [
        "arn:aws:secretsmanager:ap-northeast-2:123456789012:secret:prod/db/mysql/credentials-*",
        "arn:aws:secretsmanager:ap-northeast-2:123456789012:secret:prod/api/external-service-*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter",
        "ssm:GetParameters",
        "ssm:GetParametersByPath"
      ],
      "Resource": ["arn:aws:ssm:ap-northeast-2:123456789012:parameter/prod/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["kms:Decrypt"],
      "Resource": "arn:aws:kms:ap-northeast-2:123456789012:key/12345678-1234-1234-1234-123456789012"
    }
  ]
}
```

> [!IMPORTANT]
> **ARN 교체 필수**:
>
> - **KMS 키 ARN**: `Resource` 필드의 KMS 키 ARN을 태스크 1에서 복사한 실제 ARN으로 교체합니다.
> - **계정 ID**: Secrets Manager와 Parameter Store ARN의 `123456789012` 부분을 본인의 AWS 계정 ID로 교체합니다.
>
> **예시**:
>
> - KMS: `arn:aws:kms:ap-northeast-2:123456789012:key/12345678-...`
> - Secrets Manager: `arn:aws:secretsmanager:ap-northeast-2:123456789012:secret:prod/*`
> - Parameter Store: `arn:aws:ssm:ap-northeast-2:123456789012:parameter/prod/*`

> [!NOTE]
> **정책 설명**:
>
> - **Secrets Manager**: `prod/` 경로의 시크릿만 접근 가능. Secrets Manager ARN에는 6자리 랜덤 접미사가 자동으로 붙으므로 (예: `prod/db/mysql/credentials-AbCdEf`) 각 시크릿별로 `-*` 와일드카드를 사용합니다. `prod/*`만 사용하면 접미사를 포함하지 못해 권한이 적용되지 않습니다.
> - **Parameter Store**: `prod/` 경로의 파라미터만 접근 가능.
> - **KMS Decrypt**: 특정 KMS 키만 사용하여 복호화 가능. 이 권한은 Secrets Manager 시크릿 복호화와 Parameter Store SecureString 파라미터 복호화 모두에 사용됩니다. 보안 모범 사례에 따라 와일드카드(`*`) 대신 특정 키 ARN을 사용합니다.

19. [[Next]] 버튼을 클릭합니다.
20. **Policy name**에 `SecretsAndParametersAccess`를 입력합니다.
21. [[Create policy]] 버튼을 클릭합니다.

✅ **태스크 완료**: AWS Lambda 함수가 생성되고 IAM 정책이 추가되었습니다.

## 태스크 5-1: KMS Key users에 Lambda 역할 추가

이 태스크에서는 Lambda 실행 역할을 KMS 키의 Key users에 추가합니다. KMS 키는 이중 권한 구조를 사용하므로 IAM 정책에 `kms:Decrypt` 권한을 추가하는 것만으로는 충분하지 않습니다. 반드시 KMS 키 정책에서도 Lambda 역할을 Key users로 추가해야 암호화된 시크릿과 파라미터를 복호화할 수 있습니다.

> [!IMPORTANT]
> 이 단계를 건너뛰면 태스크 6에서 Lambda 함수 실행 시 AccessDeniedException 오류가 발생합니다. KMS 키는 키 정책(Key Policy)과 IAM 정책 모두에서 허용되어야 접근 가능합니다.

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Key Management Service`를 검색하고 선택합니다.
2. `secrets-encryption-key`를 선택합니다.
3. **Key users** 탭을 선택합니다.
4. [[Add]] 버튼을 클릭합니다.
5. `access-secrets-demo-role-xxxxx` 역할을 검색하여 선택합니다.

> [!NOTE]
> Lambda 역할 이름의 정확한 형식을 확인하려면 IAM 콘솔 > Roles에서 `access-secrets-demo`로 검색합니다.

6. [[Add]] 버튼을 클릭합니다.

✅ **태스크 완료**: Lambda 역할이 KMS Key users에 추가되었습니다.

## 태스크 6: AWS Lambda 함수 테스트

이 태스크에서는 AWS Lambda 함수를 테스트하여 Secrets Manager와 Parameter Store에서 자격증명을 성공적으로 조회하는지 확인합니다. 실행 결과를 통해 모든 시크릿과 파라미터가 올바르게 조회되는지 검증합니다.

> [!IMPORTANT]
> 테스트 전에 태스크 5-1에서 KMS Key users에 Lambda 역할을 추가했는지 확인합니다. 추가하지 않았으면 AccessDeniedException이 발생합니다.

1. Lambda 콘솔로 이동합니다.
2. `access-secrets-demo` 함수를 선택합니다.
3. **Test** 탭을 선택합니다.
4. **Event name**에 `TestEvent`를 입력합니다.
5. 이벤트 JSON은 기본값을 유지합니다.
6. [[Save]] 버튼을 클릭합니다.
7. {{Test}} 버튼을 클릭합니다.
8. **Execution results**에서 로그를 확인합니다.

> [!OUTPUT]
>
> ```
> DB credentials retrieved: True
> API credentials retrieved: True
> Region: ap-northeast-2
> DB Connection prefix: mysql://a***
> All configs: ['/prod/app/config/region', '/prod/app/config/db-connection-string']
> ```

✅ **태스크 완료**: AWS Lambda 함수가 성공적으로 시크릿과 파라미터를 조회했습니다.

## 마무리

다음을 성공적으로 수행했습니다:

- KMS 키로 데이터를 암호화했습니다
- Secrets Manager에 데이터베이스 자격증명을 안전하게 저장했습니다
- Parameter Store에 애플리케이션 설정을 관리했습니다
- AWS Lambda 함수에서 안전하게 자격증명을 조회했습니다

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
   - **Tag value**: `12-1`
6. [[Search resources]] 버튼을 클릭합니다.
7. 이 실습에서 생성한 리소스(Secrets Manager 시크릿 2개, Parameter Store 파라미터 2개, Lambda 함수 1개, KMS 키 1개)가 표시됩니다.

> [!NOTE]
> Tag Editor는 리소스를 찾는 용도로만 사용됩니다. 실제 삭제는 각 서비스 콘솔에서 수행해야 합니다. IAM 역할은 태그를 추가하지 않았으므로 Tag Editor에 표시되지 않습니다.

### 방법 2: 수동 삭제

#### Secrets Manager 시크릿 삭제

**옵션 A: AWS CloudShell로 즉시 삭제 (권장)**

> [!TIP]
> AWS CloudShell을 사용하면 브라우저에서 바로 명령어를 실행하여 시크릿을 즉시 삭제할 수 있습니다. AWS CLI 설치나 자격 증명 설정이 필요 없으며, 7일 대기 기간 없이 즉시 삭제되어 비용을 절감할 수 있습니다.

1. AWS Management Console 상단 오른쪽의 CloudShell 아이콘을 클릭합니다.
2. CloudShell이 열리면 다음 명령어를 실행합니다:

```bash
# 데이터베이스 자격증명 시크릿 즉시 삭제
aws secretsmanager delete-secret \
  --secret-id prod/db/mysql/credentials \
  --force-delete-without-recovery \
  --region ap-northeast-2

# API 키 시크릿 즉시 삭제
aws secretsmanager delete-secret \
  --secret-id prod/api/external-service \
  --force-delete-without-recovery \
  --region ap-northeast-2
```

> [!NOTE]
> CloudShell은 AWS Management Console에서 제공하는 브라우저 기반 셸 환경입니다. AWS CLI가 사전 설치되어 있고 자격 증명이 자동으로 구성되므로 별도 설정이 필요 없습니다.

> [!OUTPUT]
>
> ```json
> {
>   "ARN": "arn:aws:secretsmanager:ap-northeast-2:123456789012:secret:prod/db/mysql/credentials-AbCdEf",
>   "Name": "prod/db/mysql/credentials",
>   "DeletionDate": 1234567890.0
> }
> ```

**옵션 B: 콘솔에서 예약 삭제 (7일 대기)**

1. Secrets Manager 콘솔로 이동합니다.
2. `prod/db/mysql/credentials` 시크릿을 선택합니다.
3. **Actions** > `Delete secret`을 선택합니다.
4. **Schedule secret deletion**에서 `7`일을 입력합니다 (최소값).
5. [[Schedule deletion]] 버튼을 클릭합니다.
6. 같은 방법으로 `prod/api/external-service` 시크릿도 삭제합니다.

> [!WARNING]
> **비용 주의**: Secrets Manager 시크릿은 삭제 대기 기간(최소 7일) 동안 시크릿당 $0.40/월 비용이 계속 발생합니다. 즉시 삭제(옵션 A)를 사용하면 비용을 절감할 수 있습니다.

#### Parameter Store 파라미터 삭제

1. Systems Manager 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **Parameter Store**를 선택합니다.
3. `/prod/app/config/region` 파라미터를 선택합니다.
4. [[Delete]] 버튼을 클릭합니다.
5. 확인 창에서 [[Delete parameters]] 버튼을 클릭합니다.
6. 같은 방법으로 `/prod/app/config/db-connection-string` 파라미터도 삭제합니다.

#### KMS 키 삭제

1. KMS 콘솔로 이동합니다.
2. `secrets-encryption-key`를 선택합니다.
3. **Key actions** > `Schedule key deletion`을 선택합니다.
4. **Waiting period**에 `7`일을 입력합니다 (최소값).
5. [[Schedule deletion]] 버튼을 클릭합니다.

> [!NOTE]
> **KMS 키 삭제 대기 기간**: KMS 키는 즉시 삭제되지 않으며, 최소 7일의 대기 기간이 필요합니다. 이 기간 동안 실수로 삭제한 키를 복구할 수 있습니다. 삭제 예약 시 즉시 비용 청구가 중단되므로 추가 비용이 발생하지 않습니다.

> [!IMPORTANT]
> **안전한 삭제 순서**:
>
> - **권장 순서**: Secrets Manager 시크릿 즉시 삭제(옵션 A) → Parameter Store 파라미터 삭제 → KMS 키 삭제 예약
> - **이유**: 시크릿이 이미 삭제되었으므로 KMS 키를 안전하게 삭제 예약할 수 있습니다
>
> **옵션 B(콘솔 예약 삭제) 사용 시 주의**:
>
> - 시크릿과 KMS 키 모두 7일 대기 기간이 있습니다
> - 시크릿이 삭제 대기 중인 상태에서 KMS 키도 삭제 대기에 들어가면 시크릿 복호화가 불가능해집니다
> - 시크릿 복구 가능성이 없다면 즉시 삭제(옵션 A)를 사용하거나, 시크릿 삭제 대기 기간(7일)이 완전히 끝난 후 KMS 키를 삭제 예약하세요

#### AWS Lambda 함수 삭제

1. Lambda 콘솔로 이동합니다.
2. `access-secrets-demo` 함수를 선택합니다.
3. **Actions** > `Delete`를 선택합니다.
4. 확인 창에서 `delete`를 입력합니다.
5. [[Delete]] 버튼을 클릭합니다.

#### CloudWatch Log Group 삭제

1. CloudWatch 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **Log groups**를 선택합니다.
3. `/aws/lambda/access-secrets-demo` 로그 그룹을 선택합니다.
4. **Actions** > `Delete log group(s)`를 선택합니다.
5. 확인 창에서 [[Delete]] 버튼을 클릭합니다.

> [!NOTE]
> Lambda 함수를 삭제하면 연결된 CloudWatch Log Group은 자동으로 삭제되지 않습니다. Lambda 삭제 후 CloudWatch Log Group을 수동으로 삭제해야 합니다.

#### AWS IAM 역할 삭제

1. IAM 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **Roles**를 선택합니다.
3. 검색창에 `access-secrets-demo`를 입력하여 역할을 찾습니다.
4. `access-secrets-demo-role-xxxxx` 역할을 선택합니다.

> [!NOTE]
> Lambda 함수 생성 시 자동으로 생성된 역할 이름은 `access-secrets-demo-role-` 뒤에 랜덤 문자열이 붙습니다. 검색으로 정확한 이름을 확인합니다.

5. [[Delete]] 버튼을 클릭합니다.
6. 확인 창에서 역할 이름을 입력합니다.
7. [[Delete]] 버튼을 클릭합니다.

✅ **실습 종료**: 모든 리소스가 정리되었습니다.

## 📚 참고: 자격증명 관리 핵심 개념

### Secrets Manager vs Parameter Store

**AWS Secrets Manager**:

- 자격증명 전용 관리 서비스입니다
- 자동 로테이션 기능을 제공합니다 (RDS, Redshift, DocumentDB, ElastiCache, Redshift Serverless 지원)
- 시크릿당 $0.40/월 + API 호출당 $0.05/10,000건
- JSON 형식으로 여러 키-값 쌍을 하나의 시크릿에 저장합니다
- 버전 관리 및 롤백 기능을 제공합니다

**AWS Systems Manager Parameter Store**:

- 일반 설정값 및 자격증명 모두 저장 가능합니다
- Standard 파라미터는 무료입니다 (최대 10,000개)
- Advanced 파라미터는 $0.05/월 (4KB 이상, 정책 지원)
- 계층적 구조로 파라미터를 관리합니다 (`/prod/app/config/region`)
- SecureString 타입으로 KMS 암호화를 지원합니다

**선택 기준**:

- **데이터베이스 자격증명**: Secrets Manager (자동 로테이션 필요)
- **API 키**: Secrets Manager (민감한 정보)
- **애플리케이션 설정**: Parameter Store (비용 효율적)
- **환경 변수**: Parameter Store (계층적 관리)

### KMS 암호화 원리

**대칭 키 암호화**:

- 하나의 키로 암호화와 복호화를 모두 수행합니다
- AWS 서비스 통합에 최적화되어 있습니다
- 키는 AWS KMS 내부에서만 사용되며 외부로 노출되지 않습니다

**봉투 암호화 (Envelope Encryption)**:

1. KMS가 데이터 키(Data Key)를 생성합니다
2. 데이터 키로 실제 데이터를 암호화합니다
3. KMS 마스터 키로 데이터 키를 암호화합니다
4. 암호화된 데이터와 암호화된 데이터 키를 함께 저장합니다

**이중 권한 구조**:

- **키 정책 (Key Policy)**: KMS 키 자체의 접근 제어
- **IAM 정책**: 사용자/역할의 KMS 작업 권한
- 두 정책 모두에서 허용되어야 접근 가능합니다

### 시크릿 로테이션 개념

**자동 로테이션**:

- Secrets Manager가 주기적으로 자격증명을 변경합니다
- Lambda 함수를 사용하여 로테이션 로직을 구현합니다
- AWS가 기본 제공 로테이션 함수를 지원하는 서비스: Amazon RDS, Amazon Redshift, Amazon DocumentDB, Amazon ElastiCache, Amazon Redshift Serverless

> [!NOTE]
> **기본 제공 로테이션 함수**: AWS가 미리 작성한 Lambda 함수를 제공하여 별도 코드 작성 없이 자동 로테이션을 설정할 수 있습니다. 다른 서비스는 사용자 정의 Lambda 함수를 작성해야 합니다.

**로테이션 프로세스**:

1. **createSecret**: 새 자격증명 생성
2. **setSecret**: 데이터베이스에 새 자격증명 설정
3. **testSecret**: 새 자격증명으로 연결 테스트 (선택적 단계)
4. **finishSecret**: 이전 자격증명 비활성화

> [!NOTE]
> **testSecret 단계**: AWS 공식 문서에서는 testSecret을 선택적 단계로 정의합니다. 로테이션 함수 구현 시 이 단계를 생략할 수 있으며, 생략하면 setSecret 후 바로 finishSecret이 실행됩니다.

**로테이션 주기**:

- 권장: 30-90일
- 규정 준수: 조직 정책에 따라 설정
- 자동 로테이션 시 애플리케이션 재시작 불필요 (Secrets Manager에서 자동 조회)

### 보안 모범 사례

**최소 권한 원칙**:

- IAM 정책에서 특정 시크릿/파라미터만 접근 허용합니다
- 와일드카드(`*`) 사용을 최소화합니다
- 리소스 ARN을 명시적으로 지정합니다

**암호화 키 관리**:

- 고객 관리형 키(CMK)를 사용하여 암호화를 제어합니다
- 키 정책에서 Key users를 명시적으로 지정합니다
- 키 로테이션을 활성화합니다 (1년 주기 권장)

**감사 및 모니터링**:

- CloudTrail로 시크릿 접근 로그를 기록합니다
- CloudWatch Alarms로 비정상 접근을 감지합니다
- AWS Config로 시크릿 설정 변경을 추적합니다

**애플리케이션 통합**:

- 환경 변수에 시크릿을 하드코딩하지 않습니다
- 런타임에 Secrets Manager/Parameter Store에서 조회합니다
- 캐싱을 사용하여 API 호출 비용을 절감합니다 (TTL 5-60분 권장)

### Secrets Manager 캐싱 구현

**AWS 공식 캐싱 라이브러리**:

```python
# pip install aws-secretsmanager-caching
from aws_secretsmanager_caching import SecretCache, SecretCacheConfig

# 캐시 설정 (기본 TTL: 1시간)
cache_config = SecretCacheConfig(
    max_cache_size=1000,
    secret_version_stage_refresh_interval=3600  # 1시간 (초 단위)
)
cache = SecretCache(config=cache_config)

# 캐시에서 시크릿 조회 (첫 호출 후 캐시 사용)
secret = cache.get_secret_string('prod/db/mysql/credentials')
```

> [!NOTE]
> **파라미터 설명**:
>
> - `max_cache_size`: 캐시할 최대 시크릿 수 (기본값: 1000)
> - `secret_version_stage_refresh_interval`: 캐시 갱신 주기 (초 단위, 기본값: 3600초 = 1시간)
> - 공식 라이브러리는 자동으로 만료된 캐시를 갱신하고 버전 관리를 처리합니다

**수동 캐싱 (Lambda 전역 변수 활용)**:

```python
_secret_cache = {}

def get_secret_cached(secret_name, ttl_seconds=3600):
    """
    시크릿 캐싱 함수

    Args:
        secret_name (str): 시크릿 이름
        ttl_seconds (int): 캐시 유효 시간 (초)

    Returns:
        dict: 시크릿 값
    """
    import time
    now = time.time()

    # 캐시 확인
    if secret_name in _secret_cache:
        value, timestamp = _secret_cache[secret_name]
        if now - timestamp < ttl_seconds:
            return value  # 캐시 히트

    # 캐시 미스: Secrets Manager에서 조회
    value = get_secret(secret_name)
    _secret_cache[secret_name] = (value, now)
    return value
```

**캐싱 모범 사례**:

- **TTL 설정**: 5-60분 권장 (보안과 비용의 균형)
- **Lambda 전역 변수**: 컨테이너 재사용 시 캐시 유지
- **로테이션 고려**: 로테이션 주기보다 짧은 TTL 설정
- **비용 절감**: API 호출 횟수를 90% 이상 감소

## 추가 학습 리소스

- [AWS Secrets Manager 모범 사례](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)
- [Parameter Store 사용 설명서](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)
- [AWS KMS 개발자 가이드](https://docs.aws.amazon.com/kms/latest/developerguide/)
