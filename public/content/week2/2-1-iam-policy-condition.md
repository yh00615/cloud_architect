---
title: "AWS IAM 정책 Condition 요소 활용"
week: 2
session: 1
awsServices:
  - AWS IAM
learningObjectives:
  - AWS 인증과 권한의 차이를 이해하고, AWS IAM을 통한 사용자 접근 관리 방법을 설명할 수 있습니다
  - AWS IAM 정책 구조와 평가 로직을 설명할 수 있습니다
  - Condition과 권한 경계를 활용한 고급 권한 제어 기법을 이해할 수 있습니다
  - AWS IAM 역할과 임시 자격증명의 보안 이점을 설명할 수 있습니다
  - 신뢰 정책과 권한 정책의 차이를 이해하고 구성할 수 있습니다
  - AWS STS AssumeRole로 역할을 전환할 수 있습니다
  - AWS Organizations의 멀티 계정 관리 전략을 이해할 수 있습니다
prerequisites:
  - Week 1 완료
  - AWS IAM 정책 기본 문법 이해
  - JSON 형식 이해
---


이 실습에서는 **AWS IAM Policy의 Condition 요소**를 활용하여 **세밀한 권한 제어**를 구현하는 방법을 학습합니다.

먼저 **테스트용 Amazon S3 버킷**을 생성하고, **MFA(Multi-Factor Authentication) 기반 정책**을 구현하여 민감한 작업(삭제, 쓰기)에는 MFA 인증을 필수로 요구하도록 설정합니다. 그런 다음 **IP 주소 기반 정책**을 작성하여 특정 IP에서만 Amazon S3 접근을 허용합니다.

**시간 기반 정책**을 작성하여 특정 기간에만 리소스 접근을 허용하고, 마지막으로 **복합 조건**을 사용하여 여러 조건을 조합한 고급 정책을 작성하며, **최소 권한 원칙**과 **Zero Trust 보안 모델**을 실무에 적용하는 방법을 익힙니다.

> [!DOWNLOAD]
> [week2-1-iam-policy-condition.zip](/files/week2/week2-1-iam-policy-condition.zip)
> - `mfa-policy.json` - MFA 강제 정책 템플릿 (태스크 2에서 Amazon S3 쓰기 작업 시 MFA 인증 필수 정책 작성 참고)
> - `ip-restriction-policy.json` - IP 제한 정책 템플릿 (태스크 3에서 특정 IP 범위만 Amazon S3 접근 허용 정책 작성 참고)
> - `time-based-policy.json` - 시간 기반 정책 템플릿 (태스크 4에서 특정 기간만 Amazon S3 접근 허용 정책 작성 참고)
> - `complex-condition-policy.json` - 복합 조건 정책 템플릿 (태스크 5에서 암호화+IP+MFA 조건 조합 정책 작성 참고)
> - `README.md` - 정책 사용 방법 및 Condition 키 레퍼런스
> 
> **관련 태스크:**
> 
> - **태스크 2: MFA 강제 정책 생성**
>   mfa-policy.json 파일을 참고하여 Amazon S3 객체 삭제 및 버킷 삭제 작업 시 MFA 인증을 필수로 요구하는 정책을 작성하고, BoolIfExists 조건을 사용하여 aws:MultiFactorAuthPresent 키로 MFA 인증 여부를 확인합니다
> - **태스크 3: IP 주소 제한 정책 생성**
>   ip-restriction-policy.json 파일을 참고하여 특정 IP 주소 범위(CIDR 표기법)에서만 Amazon S3 리소스에 접근할 수 있도록 제한하는 정책을 작성하고, IpAddress와 NotIpAddress 조건을 사용하여 허용/차단 IP를 설정합니다
> - **태스크 4: 시간 기반 정책 생성**
>   time-based-policy.json 파일을 참고하여 특정 시간대(업무 시간)에만 Amazon S3 쓰기 작업을 허용하는 정책을 작성하고, DateGreaterThan과 DateLessThan 조건을 사용하여 UTC 기준 시간 범위를 설정합니다
> - **모든 태스크: README.md 참고**
>   README.md 파일에서 AWS IAM Policy Condition 키 레퍼런스와 각 조건 연산자의 사용법을 참고합니다

> [!WARNING]
> 이 실습에서 생성하는 정책은 실습 종료 후 **반드시 삭제해야 합니다**.

## 태스크 0: 실습 환경 구축

이 태스크에서는 AWS CloudFormation을 사용하여 실습에 필요한 AWS IAM 사용자와 Access Key를 자동으로 생성합니다.

### 환경 구성 요소

AWS CloudFormation 스택은 다음 리소스를 생성합니다:

- **AWS IAM 사용자**: `lab-user` (정책 테스트용)
- **Access Key**: AWS CLI 및 API 테스트용
- **기본 정책**: Amazon S3 버킷 목록 조회 권한

### 상세 단계

1. 다운로드한 `week2-1-iam-policy-condition.zip` 파일의 압축을 해제합니다.
2. `week2-1-iam-policy-condition.yaml` 파일을 확인합니다.
3. AWS Management Console에 로그인한 후 상단 검색창에서 `AWS CloudFormation`을 검색하고 선택합니다.
4. [[Create stack]] 버튼을 클릭합니다.
5. **Prerequisite - Prepare template**에서 `Template is ready`를 선택합니다.
6. **Specify template**에서 `Upload a template file`을 선택합니다.
7. [[Choose file]] 버튼을 클릭한 후 `week2-1-iam-policy-condition.yaml` 파일을 선택합니다.
8. [[Next]] 버튼을 클릭합니다.
9. **Stack name**에 `week2-1-iam-policy-stack`을 입력합니다.
10. **Parameters** 섹션에서 기본값을 확인합니다 (변경 불필요).
11. [[Next]] 버튼을 클릭합니다.
12. **Configure stack options** 페이지에서 기본값을 유지하고 [[Next]] 버튼을 클릭합니다.
13. **Review** 페이지에서 설정을 확인합니다.
14. **Capabilities** 섹션에서 `I acknowledge that AWS CloudFormation might create AWS IAM resources`를 체크합니다.
15. [[Submit]] 버튼을 클릭합니다.
16. 스택 생성이 시작됩니다. 상태가 "CREATE_IN_PROGRESS"로 표시됩니다.

> [!NOTE]
> 스택 생성에 1-2분이 소요됩니다. **Events** 탭에서 AWS IAM 사용자와 Access Key가 생성되는 과정을 확인할 수 있습니다.
> 대기하는 동안 이전 차시 내용을 복습하거나 다음 태스크를 미리 읽어보세요.

17. 상태가 "CREATE_COMPLETE"로 변경될 때까지 기다립니다.
18. **Outputs** 탭을 선택합니다.
19. 출력값들을 확인하고 메모장에 복사합니다:
    - `LabUserName`: lab-user
    - `LabUserAccessKeyId`: AKIA로 시작하는 Access Key ID
    - `LabUserSecretAccessKey`: Secret Access Key (한 번만 표시됨)

> [!IMPORTANT]
> 이 출력값들은 태스크 2-5에서 정책 테스트 시 사용됩니다. 반드시 메모장에 저장하세요.

✅ **태스크 완료**: 실습 환경이 준비되었습니다.

## 태스크 1: 테스트용 Amazon S3 버킷 생성

이 태스크에서는 **Condition 정책**을 테스트하기 위한 **Amazon S3 버킷**을 생성합니다. **Amazon S3 버킷**은 다양한 **Condition 키**를 지원하므로 정책 테스트에 적합합니다. **버킷 이름**은 전 세계적으로 고유해야 하므로 본인의 이름이나 고유 식별자를 추가하여 생성합니다.

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Amazon S3`를 검색하고 선택합니다.
2. [[Create bucket]] 버튼을 클릭합니다.
3. **Bucket name**에 `iam-condition-lab-YOUR-INITIALS-12345`를 입력합니다.

> [!TIP]
> **중요**: `YOUR-INITIALS`를 본인의 이니셜(소문자)로, `12345`를 랜덤 숫자로 변경합니다 (예: `iam-condition-lab-jdoe-98765`). Amazon S3 버킷 이름은 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다. **이 이름을 메모해둡니다.** 이후 실습에서 동일한 이름을 계속 사용합니다.

4. **AWS Region**에서 `Asia Pacific (Seoul) ap-northeast-2`를 선택합니다.
5. 나머지 설정은 기본값을 유지합니다.
6. [[Create bucket]] 버튼을 클릭합니다.

> [!NOTE]
> 버킷 생성은 즉시 완료되며 별도의 대기 시간이 없습니다. 버킷 목록 페이지로 자동 이동합니다.

7. 생성한 버킷이 목록에 표시되는지 확인합니다.
8. 버킷 이름 옆에 **리전**이 `ap-northeast-2`로 표시되는지 확인합니다.
9. 생성한 버킷을 클릭합니다.
10. **Properties** 탭을 선택합니다.
11. **Tags** 섹션으로 스크롤합니다.
12. [[Edit]] 버튼을 클릭합니다.
13. [[Add tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `2-1` |
| `CreatedBy` | `Student` |

14. [[Save changes]] 버튼을 클릭합니다.

✅ **태스크 완료**: 테스트용 Amazon S3 버킷이 생성되었습니다.

## 태스크 2: MFA 강제 정책 생성

이 태스크에서는 **MFA(Multi-Factor Authentication)** 인증을 요구하는 정책을 생성합니다. **Condition 요소**의 **aws:MultiFactorAuthPresent** 키를 사용하면 민감한 작업(삭제, 쓰기)에 **MFA 인증**을 필수로 요구할 수 있습니다. 이 정책은 **버킷 목록 조회**는 허용하지만, **객체 업로드**나 **삭제**는 MFA 인증이 있어야만 가능하도록 제한합니다.

> [!CONCEPT] BoolIfExists 조건 연산자
> **BoolIfExists**는 조건 키가 요청 컨텍스트에 존재하지 않을 때도 조건을 평가합니다. **aws:MultiFactorAuthPresent** 키는 MFA 인증으로 로그인했을 때만 요청에 포함되며, AWS IAM 사용자의 장기 자격증명(Access Key)으로 API를 호출하면 이 키 자체가 요청에 포함되지 않습니다.
> 
> **장기 자격증명 설명**: AWS IAM 사용자의 Access Key는 만료되지 않는 장기 자격증명입니다. 이와 달리 AWS STS(Security Token Service)로 발급받은 임시 자격증명은 세션 토큰과 함께 MFA 정보를 포함할 수 있습니다.
> 
> - **Bool**: 키가 없으면 조건 평가를 건너뜁니다 (Deny가 적용되지 않음)
> - **BoolIfExists**: 키가 없어도 조건을 평가합니다 (키가 없으면 false로 간주하여 Deny 적용)
> 
> 따라서 **BoolIfExists**를 사용하면 MFA 없이 Access Key로 API를 호출하는 경우에도 Deny가 적용되어 보안이 강화됩니다.

1. AWS IAM 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **Policies**를 선택합니다.
3. [[Create policy]] 버튼을 클릭합니다.
4. **JSON** 탭을 선택합니다.
5. 기존 정책 코드를 모두 삭제한 후 다음 정책을 입력합니다:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AllowListBucketWithoutMFA",
         "Effect": "Allow",
         "Action": [
           "s3:ListAllMyBuckets",
           "s3:ListBucket",
           "s3:GetBucketLocation"
         ],
         "Resource": "*"
       },
       {
         "Sid": "AllowS3WriteWithMFA",
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:DeleteObject",
           "s3:DeleteBucket"
         ],
         "Resource": "*",
         "Condition": {
           "BoolIfExists": {
             "aws:MultiFactorAuthPresent": "true"
           }
         }
       },
       {
         "Sid": "DenyS3ActionsWithoutMFA",
         "Effect": "Deny",
         "Action": [
           "s3:PutObject",
           "s3:DeleteObject",
           "s3:DeleteBucket"
         ],
         "Resource": "*",
         "Condition": {
           "BoolIfExists": {
             "aws:MultiFactorAuthPresent": "false"
           }
         }
       }
     ]
   }
   ```
   > [!NOTE]
   > 이 정책은 버킷 목록 조회는 허용하고, 객체 업로드/삭제는 MFA 인증이 있을 때만 허용합니다. MFA 없이 쓰기 작업을 시도하면 Deny가 적용됩니다.
   > 
   > **Allow와 Deny 구조 설명**: 
   > - **AllowListBucketWithoutMFA** Statement는 MFA 없이도 버킷 목록 조회를 허용합니다.
   > - **AllowS3WriteWithMFA** Statement는 MFA가 있을 때 Amazon S3 쓰기 작업을 허용합니다. 이 Statement가 없으면 condition-test-user는 다른 Amazon S3 권한이 없으므로 MFA가 있어도 쓰기 작업을 수행할 수 없습니다.
   > - **DenyS3ActionsWithoutMFA** Statement는 다른 정책에서 부여한 Amazon S3 권한도 MFA 없이는 차단합니다.
   > - **Deny는 항상 Allow보다 우선**하므로, 다른 정책이 s3:*를 허용하더라도 MFA 없이는 쓰기 작업이 차단됩니다.
   > - 이 세 Statement를 함께 사용하면 "MFA가 있을 때만 Amazon S3 쓰기 작업이 가능하다"는 강력한 제한을 구현할 수 있습니다.
   > 
   > **이 실습의 테스트 제한사항**: 태스크 7에서는 AWS IAM 사용자의 Access Key(장기 자격증명)를 사용하므로 MFA 세션을 시뮬레이션할 수 없습니다. 따라서 이 실습에서는 "MFA 없이 쓰기 차단"만 테스트하고, "MFA 있을 때 쓰기 허용"은 테스트하지 않습니다. MFA 있을 때의 동작을 테스트하려면 AWS 콘솔에 MFA 인증으로 로그인한 후 Amazon S3 콘솔에서 직접 파일을 업로드해야 합니다.
6. [[Next]] 버튼을 클릭합니다.
7. **Policy name**에 `S3MFARequiredPolicy`를 입력합니다.
8. **Description**에 `Requires MFA for Amazon S3 write operations`를 입력합니다.
9. **Tags - optional** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `2-1` |
| `CreatedBy` | `Student` |

10. [[Create policy]] 버튼을 클릭합니다.
11. 정책 생성이 완료되면 **Policies** 페이지로 자동 이동합니다.
12. 화면 상단에 녹색 배너로 "Policy S3MFARequiredPolicy has been created"라는 성공 메시지가 표시됩니다.
13. 정책 목록에서 `S3MFARequiredPolicy`를 검색하여 생성된 정책을 확인합니다.

> [!NOTE]
> 정책 목록에서 **Policy name** 열에 `S3MFARequiredPolicy`가 표시되고, **Type** 열에 "Customer managed"로 표시됩니다. 이는 사용자가 직접 생성한 정책임을 의미합니다.

✅ **태스크 완료**: MFA 강제 정책이 생성되었습니다.

## 태스크 3: IP 주소 제한 정책 생성

이 태스크에서는 **IP 주소 기반 접근 제어** 정책을 생성합니다. **aws:SourceIp** Condition 키를 사용하면 **특정 네트워크**에서만 AWS 리소스에 접근할 수 있도록 제한합니다. **CIDR 표기법**을 사용하여 **IP 범위**를 지정하며, 여러 IP 범위를 배열로 지정할 수 있습니다. 이를 통해 회사 네트워크나 **VPN IP 범위**만 허용하고 다른 IP는 차단할 수 있습니다.

> [!WARNING]
> **학교/회사 네트워크 IP 제한 주의사항**: 학교나 회사 네트워크에서 실습하는 경우, 네트워크 관리자가 설정한 방화벽이나 프록시로 인해 IP 기반 정책이 예상과 다르게 동작할 수 있습니다. 특히 NAT(Network Address Translation)를 사용하는 환경에서는 여러 사용자가 동일한 공인 IP를 공유하므로, 본인의 IP만 허용하려고 해도 같은 네트워크의 다른 사용자도 접근할 수 있습니다. 또한 학교/회사에서 특정 AWS 서비스나 포트를 차단하는 경우 정책과 무관하게 접근이 불가능할 수 있습니다. 이러한 환경에서는 개인 네트워크(집, 카페 등)에서 테스트하는 것을 권장합니다.

1. 새 브라우저 탭을 엽니다.
2. 주소창에 `https://checkip.amazonaws.com`을 입력하고 Enter를 누릅니다.
3. 표시된 IP 주소를 메모장에 복사합니다.

> [!IMPORTANT]
> 이 IP 주소는 다음 단계에서 정책에 입력해야 합니다. 반드시 메모장에 저장하세요.

4. AWS IAM 콘솔 탭으로 돌아갑니다.
5. [[Create policy]] 버튼을 다시 클릭합니다.
6. **JSON** 탭을 선택합니다.
7. 기존 정책 코드를 모두 삭제한 후 다음 정책을 입력합니다 (`YOUR_IP_ADDRESS`를 메모장의 IP로 변경):

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AllowFromSpecificIP",
         "Effect": "Allow",
         "Action": "s3:*",
         "Resource": "*",
         "Condition": {
           "IpAddress": {
             "aws:SourceIp": [
               "YOUR_IP_ADDRESS/32"
             ]
           }
         }
       },
       {
         "Sid": "DenyFromOtherIPs",
         "Effect": "Deny",
         "Action": "s3:*",
         "Resource": "*",
         "Condition": {
           "NotIpAddress": {
             "aws:SourceIp": [
               "YOUR_IP_ADDRESS/32"
             ]
           }
         }
       }
     ]
   }
   ```

> [!IMPORTANT]
> **필수 확인**: `YOUR_IP_ADDRESS`를 실제 IP 주소로 변경했는지 반드시 확인하세요. 플레이스홀더를 그대로 사용하면 모든 Amazon S3 접근이 차단됩니다.
> 
> **예시**: 본인의 IP가 `1.2.3.4`라면 `"YOUR_IP_ADDRESS/32"`를 `"1.2.3.4/32"`로 변경합니다.
> 
> **CIDR 표기법 설명**: `/32`는 단일 IP 주소를 의미합니다. 여러 IP를 허용하려면 배열로 추가할 수 있습니다: `["1.2.3.4/32", "5.6.7.8/32"]`

   > [!NOTE]
   > **Allow와 Deny 구조 설명**:
   > - **AllowFromSpecificIP** Statement는 지정된 IP에서의 Amazon S3 접근을 허용합니다.
   > - **DenyFromOtherIPs** Statement는 다른 정책에서 부여한 Amazon S3 권한도 지정된 IP 외에서는 차단합니다.
   > - **Deny는 항상 Allow보다 우선**하므로, 다른 정책이 s3:*를 허용하더라도 IP 외부에서는 차단됩니다.
   > - 이 두 Statement를 함께 사용하면 "이 IP에서만 Amazon S3를 사용할 수 있다"는 강력한 제한을 구현할 수 있습니다.

8. [[Next]] 버튼을 클릭합니다.
9. **Policy name**에 `S3IPRestrictionPolicy`를 입력합니다.
10. **Description**에 `Restricts Amazon S3 access to specific IP addresses`를 입력합니다.
11. **Tags - optional** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `2-1` |
| `CreatedBy` | `Student` |

12. [[Create policy]] 버튼을 클릭합니다.
13. 정책 생성이 완료되면 **Policies** 페이지로 자동 이동합니다.
14. 화면 상단에 녹색 배너로 "Policy S3IPRestrictionPolicy has been created"라는 성공 메시지가 표시됩니다.
15. 정책 목록에서 `S3IPRestrictionPolicy`를 검색하여 생성된 정책을 확인합니다.

> [!NOTE]
> 정책 목록에서 **Policy name** 열에 `S3IPRestrictionPolicy`가 표시되고, **Type** 열에 "Customer managed"로 표시됩니다.

✅ **태스크 완료**: IP 주소 제한 정책이 생성되었습니다.

## 태스크 4: 시간 기반 정책 생성

이 태스크에서는 **시간 기반 정책**을 생성합니다. **aws:CurrentTime** Condition 키를 사용하여 **특정 기간**에만 리소스 접근을 허용하며, **UTC 시간대**를 기준으로 합니다. 이를 통해 **특정 날짜 범위**에만 민감한 작업을 허용하고, 기간 외에는 차단하여 **보안**을 강화할 수 있습니다.

> [!CONCEPT] aws:CurrentTime 조건 키와 시간대 처리
> **aws:CurrentTime**은 날짜와 시간을 모두 포함한 전체 타임스탬프를 비교합니다. 이 정책은 **특정 기간**(예: 2026년 1월 1일부터 12월 31일까지)에만 접근을 허용하는 데 적합합니다.
> 
> **시간대 처리**:
> - AWS IAM 정책의 시간 조건은 항상 **UTC(협정 세계시)** 기준입니다
> - 한국 시간(KST)은 UTC+9이므로, 한국 시간 09:00는 UTC 00:00입니다
> - 예: 한국 시간 2026-01-01 09:00 → UTC 2026-01-01 00:00
> - 정책 작성 시 반드시 UTC로 변환하여 입력해야 합니다
> 
> **매일 반복되는 업무 시간 제한의 한계**:
> - **aws:CurrentTime**은 특정 날짜 범위 제한에 적합합니다
> - 매일 반복되는 시간대 제한(예: 매일 09:00-18:00)에는 적합하지 않습니다
> - 이유: 날짜와 시간을 함께 비교하므로, "매일 09:00-18:00"을 표현할 수 없습니다
> - 대안: AWS Lambda 함수 + Amazon EventBridge 스케줄러, AWS Config 규칙, 또는 서드파티 솔루션 사용
> 
> **실무 활용 시나리오**:
> - ✅ 프로젝트 기간 제한 (2026-01-01 ~ 2026-12-31)
> - ✅ 임시 계약직 직원 접근 기간 제한
> - ✅ 특정 이벤트 기간 동안만 리소스 접근 허용
> - ✅ 감사(Audit) 기간 동안 특정 작업 차단
> - ❌ 매일 업무 시간(09:00-18:00)만 접근 허용 (불가능)

1. [[Create policy]] 버튼을 다시 클릭합니다.
2. **JSON** 탭을 선택합니다.
3. 기존 정책 코드를 모두 삭제한 후 다음 정책을 입력합니다 (`YYYY`를 현재 연도로 변경):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AllowDuringSpecificPeriod",
         "Effect": "Allow",
         "Action": "s3:*",
         "Resource": "*",
         "Condition": {
           "DateGreaterThan": {
             "aws:CurrentTime": "YYYY-01-01T00:00:00Z"
           },
           "DateLessThan": {
             "aws:CurrentTime": "YYYY-12-31T23:59:59Z"
           }
         }
       },
       {
         "Sid": "DenyOutsideSpecificPeriod",
         "Effect": "Deny",
         "Action": "s3:*",
         "Resource": "*",
         "Condition": {
           "DateLessThan": {
             "aws:CurrentTime": "YYYY-01-01T00:00:00Z"
           }
         }
       },
       {
         "Sid": "DenyAfterSpecificPeriod",
         "Effect": "Deny",
         "Action": "s3:*",
         "Resource": "*",
         "Condition": {
           "DateGreaterThan": {
             "aws:CurrentTime": "YYYY-12-31T23:59:59Z"
           }
         }
       }
     ]
   }
   ```

> [!IMPORTANT]
> **필수 확인**: `YYYY`를 현재 연도로 변경했는지 반드시 확인하세요. 플레이스홀더를 그대로 사용하면 정책이 작동하지 않습니다.
> 
> **예시**: 2026년에 실습하는 경우 `YYYY-01-01T00:00:00Z`를 `2026-01-01T00:00:00Z`로, `YYYY-12-31T23:59:59Z`를 `2026-12-31T23:59:59Z`로 변경합니다.

   > [!NOTE]
   > 이 정책은 지정된 연도(1월 1일부터 12월 31일까지)에만 Amazon S3 접근을 허용합니다. 기간 외에는 명시적 Deny로 모든 Amazon S3 작업이 차단됩니다.
   > 
   > **Allow와 Deny 구조 설명**:
   > - **AllowDuringSpecificPeriod** Statement는 지정된 기간 내에 Amazon S3 접근을 허용합니다.
   > - **DenyOutsideSpecificPeriod**와 **DenyAfterSpecificPeriod** Statement는 다른 정책에서 부여한 Amazon S3 권한도 기간 외에는 차단합니다.
   > - **Deny는 항상 Allow보다 우선**하므로, 다른 정책이 s3:*를 허용하더라도 기간 외에는 차단됩니다.
   > - 이 세 Statement를 함께 사용하면 "이 기간에만 Amazon S3를 사용할 수 있다"는 강력한 제한을 구현할 수 있습니다.
4. [[Next]] 버튼을 클릭합니다.
5. **Policy name**에 `S3TimeBasedPolicy`를 입력합니다.
6. **Description**에 `Restricts Amazon S3 access to specific date range`를 입력합니다.
7. **Tags - optional** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `2-1` |
| `CreatedBy` | `Student` |

8. [[Create policy]] 버튼을 클릭합니다.
9. 정책 생성이 완료되면 **Policies** 페이지로 자동 이동합니다.
10. 화면 상단에 녹색 배너로 "Policy S3TimeBasedPolicy has been created"라는 성공 메시지가 표시됩니다.
11. 정책 목록에서 `S3TimeBasedPolicy`를 검색하여 생성된 정책을 확인합니다.

> [!NOTE]
> 정책 목록에서 **Policy name** 열에 `S3TimeBasedPolicy`가 표시되고, **Type** 열에 "Customer managed"로 표시됩니다.

✅ **태스크 완료**: 시간 기반 정책이 생성되었습니다.

## 태스크 5: 복합 조건 정책 생성

이 태스크에서는 **복합 조건 정책**을 생성합니다. 여러 **Condition 키**를 동시에 사용하여 매우 세밀한 **권한 제어**를 구현합니다. 모든 조건을 만족해야만 접근이 허용되므로(**AND 조건**), **암호화 필수**, **IP 제한**, **MFA 인증** 등을 조합하여 **Zero Trust 보안 모델**을 구현할 수 있습니다.

> [!CONCEPT] 복합 조건의 AND 연산
> 하나의 Condition 블록 내에 여러 조건 키를 나열하면 **모든 조건을 만족해야** 접근이 허용됩니다(AND 연산). 예를 들어, 암호화 필수 + IP 제한 + MFA 인증을 모두 만족해야만 Amazon S3 접근이 가능합니다.

1. [[Create policy]] 버튼을 다시 클릭합니다.
2. **JSON** 탭을 선택합니다.
3. 기존 정책 코드를 모두 삭제한 후 다음 정책을 입력합니다 (`YOUR_IP_ADDRESS`를 실제 IP로 변경):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AllowS3WithMultipleConditions",
         "Effect": "Allow",
         "Action": "s3:PutObject",
         "Resource": "arn:aws:s3:::iam-condition-lab-*/*",
         "Condition": {
           "StringEquals": {
             "s3:x-amz-server-side-encryption": "AES256"
           },
           "IpAddress": {
             "aws:SourceIp": "YOUR_IP_ADDRESS/32"
           },
           "BoolIfExists": {
             "aws:MultiFactorAuthPresent": "true"
           }
         }
       }
     ]
   }
   ```

> [!IMPORTANT]
> **필수 확인**: `YOUR_IP_ADDRESS`를 실제 IP 주소로 변경했는지 반드시 확인하세요. 현재 IP는 `https://checkip.amazonaws.com`에서 확인할 수 있습니다.

   > [!NOTE]
   > 이 정책은 여러 조건을 동시에 만족해야 Amazon S3 객체 업로드가 가능합니다: 암호화 필수(AES256), 특정 IP 범위, MFA 인증. 모든 조건이 AND 연산으로 결합되어 있습니다.

4. [[Next]] 버튼을 클릭합니다.
5. **Policy name**에 `S3ComplexConditionPolicy`를 입력합니다.
6. **Description**에 `Amazon S3 access with multiple conditions`를 입력합니다.
7. **Tags - optional** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `2-1` |
| `CreatedBy` | `Student` |

8. [[Create policy]] 버튼을 클릭합니다.
9. 정책 생성이 완료되면 **Policies** 페이지로 자동 이동합니다.
10. 화면 상단에 녹색 배너로 "Policy S3ComplexConditionPolicy has been created"라는 성공 메시지가 표시됩니다.
11. 정책 목록에서 `S3ComplexConditionPolicy`를 검색하여 생성된 정책을 확인합니다.

> [!NOTE]
> 정책 목록에서 **Policy name** 열에 `S3ComplexConditionPolicy`가 표시되고, **Type** 열에 "Customer managed"로 표시됩니다. 이제 4개의 Condition 정책이 모두 생성되었습니다.

✅ **태스크 완료**: 복합 조건 정책이 생성되었습니다.

## 태스크 6: 테스트용 AWS IAM 사용자 생성 및 정책 연결

이 태스크에서는 생성한 **Condition 정책**들을 실제로 테스트하기 위해 **테스트용 AWS IAM 사용자**를 생성합니다. 이 사용자에게 **MFA 강제 정책**을 연결하여 정책이 올바르게 작동하는지 확인할 수 있습니다. 실제 환경에서는 기존 사용자에게 정책을 연결하지만, 실습에서는 안전하게 테스트하기 위해 별도의 사용자를 생성합니다.

1. 왼쪽 메뉴에서 **Users**를 선택합니다.
2. [[Create user]] 버튼을 클릭합니다.
3. **User name**에 `condition-test-user`를 입력합니다.
4. **Provide user access to the AWS Management Console** 체크박스는 체크하지 않습니다.

> [!NOTE]
> 이 실습에서는 AWS CLI만 사용하므로 콘솔 로그인 권한이 필요하지 않습니다. Access Key만 생성하여 CLI에서 사용합니다.
> 
> **CloudShell 사용 방식 설명**: 태스크 7에서 AWS CloudShell을 사용하지만, CloudShell은 현재 로그인한 관리자 계정의 자격증명을 사용합니다. condition-test-user의 자격증명은 `--profile condition-test` 옵션으로 별도로 지정하여 테스트하므로, condition-test-user에게 콘솔 접근 권한이 필요하지 않습니다.

5. [[Next]] 버튼을 클릭합니다.
6. **Attach policies directly**를 선택합니다.
7. 검색창에 `S3MFARequiredPolicy`를 입력합니다.
8. 검색 결과에서 `S3MFARequiredPolicy` 정책 왼쪽의 체크박스를 선택합니다.

> [!NOTE]
> 정책이 선택되면 체크박스에 체크 표시가 나타나고, 화면 하단에 "1 policy selected"라고 표시됩니다.

9. [[Next]] 버튼을 클릭합니다.
10. **Review and create** 페이지에서 설정을 확인합니다.
11. **User name**이 `condition-test-user`인지 확인합니다.
12. **Permissions summary** 섹션에서 `S3MFARequiredPolicy`가 연결되어 있는지 확인합니다.
13. [[Create user]] 버튼을 클릭합니다.
14. 사용자 생성이 완료되면 **Users** 페이지로 자동 이동합니다.
15. 화면 상단에 녹색 배너로 "User condition-test-user created successfully"라는 성공 메시지가 표시됩니다.
16. 사용자 목록에서 `condition-test-user`를 검색하여 생성된 사용자를 확인합니다.

> [!NOTE]
> 사용자 목록에서 **User name** 열에 `condition-test-user`가 표시됩니다. 이 사용자를 클릭하면 **Permissions** 탭에서 `S3MFARequiredPolicy`가 연결되어 있는 것을 확인할 수 있습니다.

17. `condition-test-user` 상세 페이지에서 **Tags** 탭을 선택합니다.
18. [[Manage tags]] 버튼을 클릭합니다.
19. [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `2-1` |
| `CreatedBy` | `Student` |

20. [[Save changes]] 버튼을 클릭합니다.

✅ **태스크 완료**: 테스트용 사용자가 생성되었습니다.

## 태스크 7: MFA 정책 동작 테스트

이 태스크에서는 생성한 **MFA 강제 정책**이 올바르게 작동하는지 테스트합니다. **condition-test-user**의 **Access Key**를 생성하고 **AWS CLI 프로파일**로 구성하여, **MFA 인증 없이는 객체 업로드나 삭제가 차단**되는 것을 확인합니다.

### 7-1: Access Key 생성

1. AWS IAM 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **Users**를 선택합니다.
3. 사용자 목록에서 `condition-test-user`를 검색합니다.
4. `condition-test-user`를 클릭합니다.
5. **Security credentials** 탭을 선택합니다.
6. **Access keys** 섹션으로 스크롤합니다.
7. [[Create access key]] 버튼을 클릭합니다.
8. **Use case**에서 `Command Line Interface (CLI)`를 선택합니다.

> [!NOTE]
> AWS 콘솔에서 "We recommend that you don't create access keys for your root user or AWS IAM users. Instead, use AWS IAM Identity Center" 같은 권장 메시지가 표시될 수 있습니다. 이는 AWS가 장기 자격증명(Access Key) 대신 AWS IAM Identity Center 사용을 권장하기 때문입니다. 이 실습에서는 Condition 정책 학습 목적으로 Access Key를 사용하며, 실습 종료 후 반드시 삭제합니다.

9. 하단의 체크박스 `I understand the above recommendation and want to proceed to create an access key`를 체크합니다.
10. [[Next]] 버튼을 클릭합니다.
11. **Description tag**에 `MFA policy test`를 입력합니다.
12. [[Create access key]] 버튼을 클릭합니다.
13. **Access key** 페이지가 표시됩니다.
14. **Access key**와 **Secret access key** 값을 메모장에 복사합니다.

> [!IMPORTANT]
> Secret access key는 이 화면에서만 확인할 수 있습니다. 반드시 메모장에 저장하세요.

> [!WARNING]
> **보안 주의사항**: Access Key와 Secret Access Key를 평문 메모장에 저장하는 것은 보안 위험이 있습니다. 실습 목적으로 불가피하게 메모장을 사용하지만, 실습 종료 후 메모장의 키 정보를 반드시 삭제하세요. 실무에서는 AWS Secrets Manager나 비밀번호 관리자(1Password, LastPass 등)를 사용하여 자격증명을 안전하게 저장해야 합니다.

15. [[Done]] 버튼을 클릭합니다.

### 7-2: AWS CLI 프로파일 구성

1. AWS Management Console 상단 오른쪽의 AWS CloudShell 아이콘을 클릭합니다.

> [!NOTE]
> CloudShell은 AWS CLI가 사전 설치되어 있고 현재 로그인한 AWS IAM 사용자 자격증명이 자동으로 구성된 브라우저 기반 셸 환경입니다. 첫 실행 시 환경 초기화에 1-2분이 소요될 수 있습니다.

> [!WARNING]
> **AWS CloudShell 세션 지속성**: AWS CloudShell 세션은 브라우저 탭을 닫거나 일정 시간(약 20분) 동안 활동이 없으면 자동으로 종료됩니다. 세션이 종료되면 환경 변수(AWS_ACCESS_KEY_ID 등)도 함께 사라집니다. 하지만 홈 디렉토리(/home/cloudshell-user)의 파일과 AWS CLI 프로파일 설정(~/.aws/config, ~/.aws/credentials)은 유지됩니다. 따라서 이 태스크에서 설정한 condition-test 프로파일은 세션이 종료되어도 보존되며, 다음에 CloudShell을 열면 다시 사용할 수 있습니다.

2. 다음 명령어를 실행하여 condition-test-user 프로파일을 구성합니다:

```bash
aws configure --profile condition-test
```

3. 프롬프트가 나타나면 다음 값을 입력합니다:
   - **AWS Access Key ID**: 메모장에 저장한 Access Key 입력
   - **AWS Secret Access Key**: 메모장에 저장한 Secret Access Key 입력
   - **Default region name**: `ap-northeast-2` 입력
   - **Default output format**: `json` 입력

> [!NOTE]
> 각 항목을 입력한 후 Enter 키를 누릅니다.

### 7-3: MFA 없이 권한 테스트

1. 현재 자격증명을 확인합니다:

```bash
aws sts get-caller-identity --profile condition-test
```

> [!OUTPUT]
> ```json
> {
>   "UserId": "AIDAI...",
>   "Account": "123456789012",
>   "Arn": "arn:aws:iam::123456789012:user/condition-test-user"
> }
> ```

2. Amazon S3 버킷 목록을 조회합니다 (읽기 권한 - 성공 예상):

```bash
aws s3 ls --profile condition-test
```

> [!OUTPUT]
> ```
> YYYY-MM-DD HH:MM:SS iam-condition-lab-[이니셜]-[숫자]
> ```

> [!NOTE]
> 날짜와 버킷 목록은 실습 환경에 따라 다를 수 있습니다. 버킷 목록 조회는 MFA 없이도 성공합니다. S3MFARequiredPolicy의 AllowListBucketWithoutMFA Statement가 `s3:ListAllMyBuckets`, `s3:ListBucket`, `s3:GetBucketLocation` 작업을 허용합니다.
> 
> **보안 관점 설명**: `s3:ListAllMyBuckets`는 `Resource: "*"`로 설정되어 있어 계정 내 모든 버킷 목록을 조회할 수 있습니다. 이는 AWS Amazon S3 서비스의 설계상 버킷 목록 조회는 계정 수준 작업이기 때문입니다. 태스크 1에서 생성한 버킷뿐만 아니라 계정에 존재하는 다른 버킷도 모두 표시됩니다. 특정 버킷만 보이도록 제한하려면 버킷별 정책이나 AWS IAM 권한 경계(Permission Boundary)를 사용해야 합니다.

3. 테스트 파일을 생성합니다:

```bash
echo "test content" > test.txt
```

4. 태스크 1에서 생성한 버킷에 파일 업로드를 시도합니다 (본인의 버킷 이름으로 변경):

```bash
aws s3 cp test.txt s3://iam-condition-lab-YOUR-INITIALS-12345/ --profile condition-test
```

> [!OUTPUT]
> ```
> An error occurred (AccessDenied) when calling the PutObject operation: Access Denied
> ```

> [!IMPORTANT]
> **AccessDenied** 오류가 나와야 정상입니다. 이는 S3MFARequiredPolicy의 DenyS3ActionsWithoutMFA Statement가 MFA 없는 쓰기 작업을 차단했음을 의미합니다.

5. 버킷에서 객체 삭제를 시도합니다 (실패 예상):

```bash
aws s3 rm s3://iam-condition-lab-YOUR-INITIALS-12345/test.txt --profile condition-test
```

> [!OUTPUT]
> ```
> An error occurred (AccessDenied) when calling the DeleteObject operation: Access Denied
> ```

> [!NOTE]
> 삭제 작업도 MFA 없이는 차단됩니다. 
> 
> **Amazon S3 보안 설계 설명**: 이전 단계에서 업로드가 실패했으므로 `test.txt` 객체는 버킷에 존재하지 않습니다. 그러나 Amazon S3는 권한이 없는 요청에 대해 객체 존재 여부를 노출하지 않기 위해 항상 `AccessDenied`를 반환합니다. 이는 보안 설계의 일부로, 권한이 없는 사용자가 객체의 존재 여부를 추측하지 못하도록 합니다. 만약 권한이 있는 상태에서 존재하지 않는 객체를 삭제하려고 하면 `NoSuchKey` 또는 `404 Not Found` 오류가 반환됩니다.
> 
> 이로써 MFA 강제 정책이 올바르게 작동함을 확인했습니다.

✅ **태스크 완료**: MFA 정책이 올바르게 작동함을 확인했습니다.

## 태스크 8: IP 제한 정책 동작 테스트

이 태스크에서는 **IP 주소 기반 접근 제어 정책**이 올바르게 작동하는지 테스트합니다. 태스크 3에서 현재 IP를 허용 목록에 추가했으므로, 정책 연결 후 접근 성공과 차단을 모두 확인할 수 있습니다.

### 8-1: IP 제한 정책 연결

1. AWS IAM 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **Users**를 선택합니다.
3. 사용자 목록에서 `condition-test-user`를 검색합니다.
4. `condition-test-user`를 클릭합니다.
5. **Permissions** 탭을 선택합니다.
6. **Add permissions** 드롭다운을 클릭한 후 `Attach policies directly`를 선택합니다.
7. 정책 검색창에 `S3IPRestrictionPolicy`를 입력합니다.
8. `S3IPRestrictionPolicy` 정책 왼쪽의 체크박스를 선택합니다.
9. [[Next]] 버튼을 클릭합니다.
10. [[Add permissions]] 버튼을 클릭합니다.

> [!NOTE]
> 이제 condition-test-user에는 S3MFARequiredPolicy와 S3IPRestrictionPolicy 두 개의 정책이 연결되어 있습니다.

### 8-2: 현재 IP에서 접근 테스트 (성공 예상)

1. AWS CloudShell로 이동합니다.
2. 버킷 목록 조회를 시도합니다:

```bash
aws s3 ls --profile condition-test
```

> [!OUTPUT]
> ```
> YYYY-MM-DD HH:MM:SS iam-condition-lab-[이니셜]-[숫자]
> ```

> [!NOTE]
> 현재 IP가 태스크 3에서 허용 목록에 추가되었으므로 접근이 성공합니다.

### 8-3: IP 제한 정책 분리

1. AWS IAM 콘솔의 `condition-test-user` 페이지로 돌아갑니다.
2. **Permissions** 탭에서 `S3IPRestrictionPolicy` 정책 오른쪽의 **X** 버튼을 클릭합니다.
3. 확인 창에서 [[Remove]] 버튼을 클릭합니다.

> [!NOTE]
> IP 제한 정책 테스트가 완료되었으므로 정책을 분리합니다. 이제 condition-test-user에는 S3MFARequiredPolicy만 남아있습니다.

✅ **태스크 완료**: IP 제한 정책이 올바르게 작동함을 확인했습니다.

## 마무리

다음을 성공적으로 수행했습니다:

- AWS IAM Policy의 Condition 요소 구조를 이해했습니다.
- MFA 강제 정책을 작성하고 테스트했습니다.
- IP 주소 기반 접근 제어 정책을 작성하고 테스트했습니다.
- 시간 기반 정책을 작성했습니다.
- 복합 조건을 사용하는 정책을 작성했습니다.
- 다양한 Condition 키의 사용법을 학습했습니다.

> [!NOTE]
> 이 실습에서는 MFA 정책과 IP 제한 정책을 실제로 테스트했습니다. 시간 기반 정책과 복합 조건 정책은 정책 구조를 학습하기 위해 작성했으며, 실제 동작을 테스트하려면 condition-test-user에 각 정책을 순차적으로 연결/해제하며 확인할 수 있습니다.

## 리소스 정리

> [!WARNING]
> 다음 단계를 **반드시 수행**하여 불필요한 리소스를 정리합니다.

### 단계 1: Tag Editor로 리소스 확인

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Resource Groups & Tag Editor`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `All regions`를 선택합니다.

> [!NOTE]
> AWS IAM 사용자와 정책은 글로벌 리소스이므로 `All regions`를 선택해야 검색 결과에 표시됩니다.

4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Week`
   - **Tag value**: `2-1`
6. [[Search resources]] 버튼을 클릭합니다.
7. 이 실습에서 생성한 Amazon S3 버킷 1개, AWS IAM 사용자 1개, AWS IAM 정책 4개가 표시됩니다.

> [!NOTE]
> Tag Editor는 리소스를 찾는 용도로만 사용됩니다. 실제 삭제는 다음 단계에서 수행합니다.

### 단계 2: Access Key 삭제

1. AWS IAM 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **Users**를 선택합니다.
3. 사용자 목록에서 `condition-test-user`를 검색합니다.
4. `condition-test-user`를 클릭합니다.
5. **Security credentials** 탭을 선택합니다.
6. **Access keys** 섹션으로 스크롤합니다.
7. **Access keys** 섹션에서 생성한 Access Key를 선택합니다.
8. **Actions** > `Deactivate`를 선택합니다.
9. 확인 창에서 [[Deactivate]] 버튼을 클릭합니다.
10. **Actions** > `Delete`를 선택합니다.
11. 확인 창에서 [[Delete]] 버튼을 클릭합니다.

### 단계 3: AWS CLI 프로파일 삭제

1. AWS CloudShell로 이동합니다.
2. 다음 명령어를 실행하여 condition-test 프로파일이 존재하는지 확인합니다:

```bash
aws configure list --profile condition-test
```

> [!NOTE]
> 프로파일이 존재하면 프로파일 정보가 표시됩니다. 다음 단계로 진행하여 프로파일을 삭제합니다.

3. 다음 명령어를 실행하여 credentials 파일에서 프로파일을 삭제합니다:

```bash
sed -i.bak '/^\[condition-test\]/,/^\[/{/^\[condition-test\]/d;/^\[/!d;}' ~/.aws/credentials
```

4. 다음 명령어를 실행하여 config 파일에서 프로파일을 삭제합니다:

```bash
sed -i.bak '/^\[profile condition-test\]/,/^\[/{/^\[profile condition-test\]/d;/^\[/!d;}' ~/.aws/config
```

> [!NOTE]
> 이 명령어는 다음 섹션 헤더(`[`)가 나타날 때까지만 삭제하므로 다른 프로파일이 보존됩니다. `.bak` 파일은 백업 파일입니다.

5. 삭제를 확인합니다:

```bash
aws configure list --profile condition-test
```

> [!OUTPUT]
> ```
> The config profile (condition-test) could not be found
> ```

6. 백업 파일을 삭제합니다:

```bash
rm ~/.aws/credentials.bak ~/.aws/config.bak
```

> [!NOTE]
> AWS CloudShell의 홈 디렉토리는 세션 간 유지되므로, 프로파일을 삭제하지 않으면 다음에 CloudShell을 열었을 때도 condition-test 프로파일이 남아있습니다. 보안을 위해 반드시 삭제해야 합니다.

### 단계 4: AWS IAM 사용자 삭제

1. AWS IAM 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **Users**를 선택합니다.
3. 사용자 목록에서 `condition-test-user`를 검색합니다.
4. `condition-test-user`를 선택합니다.
5. [[Delete]] 버튼을 클릭합니다.
6. 확인 창이 나타나면 입력 필드에 `condition-test-user`를 입력합니다.

> [!NOTE]
> 사용자 이름을 정확히 입력해야 [[Delete]] 버튼이 활성화됩니다. 사용자를 삭제하면 연결된 정책도 자동으로 분리됩니다.

7. [[Delete]] 버튼을 클릭합니다.
8. 화면 상단에 녹색 배너로 "User condition-test-user deleted successfully"라는 성공 메시지가 표시됩니다.

### 단계 5: AWS IAM 정책 삭제

1. 왼쪽 메뉴에서 **Policies**를 선택합니다.
2. 정책 목록에서 `S3MFARequiredPolicy`를 검색합니다.
3. `S3MFARequiredPolicy` 정책 왼쪽의 라디오 버튼을 선택합니다.

> [!NOTE]
> 정책이 선택되면 라디오 버튼에 점이 표시되고, 상단의 **Actions** 버튼이 활성화됩니다.

4. **Actions** > `Delete`를 선택합니다.
5. 확인 창이 나타나면 입력 필드에 `S3MFARequiredPolicy`를 입력합니다.
6. [[Delete]] 버튼을 클릭합니다.
7. 화면 상단에 녹색 배너로 "Policy S3MFARequiredPolicy deleted successfully"라는 성공 메시지가 표시됩니다.
8. 동일한 방법으로 다음 정책들을 각각 삭제합니다:
    - `S3IPRestrictionPolicy`
    - `S3TimeBasedPolicy`
    - `S3ComplexConditionPolicy`

> [!NOTE]
> 각 정책 삭제 시마다 정책 이름을 정확히 입력해야 합니다. 4개의 정책을 모두 삭제하면 정책 목록에서 더 이상 표시되지 않습니다.

### 단계 6: Amazon S3 버킷 삭제

1. Amazon S3 콘솔로 이동합니다.
2. 버킷 목록에서 `iam-condition-lab-YOUR-INITIALS-12345` 버킷을 검색합니다.
3. 버킷 이름 왼쪽의 라디오 버튼을 선택합니다.

> [!NOTE]
> 태스크 7에서 파일 업로드가 실패했으므로 버킷은 비어있습니다. 비어있는 버킷은 Empty 단계 없이 바로 삭제할 수 있습니다. 만약 버킷에 객체가 있다면 다음 단계(4-8)를 수행해야 합니다.

4. 버킷에 객체가 있는 경우: [[Empty]] 버튼을 클릭합니다.
5. 확인 창이 나타나면 입력 필드에 `permanently delete`를 입력합니다.
6. [[Empty]] 버튼을 클릭합니다.
7. 버킷 비우기가 시작됩니다.
8. 화면 상단에 녹색 배너로 "Successfully emptied bucket"이라는 성공 메시지가 표시될 때까지 기다립니다.
9. 버킷 목록에서 `iam-condition-lab-YOUR-INITIALS-12345` 버킷을 다시 선택합니다.
10. [[Delete]] 버튼을 클릭합니다.
11. 확인 창이 나타나면 입력 필드에 버킷 이름 전체를 입력합니다.

> [!NOTE]
> 버킷 이름을 정확히 입력해야 [[Delete bucket]] 버튼이 활성화됩니다.

12. [[Delete bucket]] 버튼을 클릭합니다.
13. 화면 상단에 녹색 배너로 "Successfully deleted bucket"이라는 성공 메시지가 표시됩니다.
14. 버킷 목록에서 해당 버킷이 더 이상 표시되지 않는지 확인합니다.

✅ **실습 종료**: 모든 리소스가 정리되었습니다.

## 추가 학습 리소스

- [AWS IAM JSON 정책 요소: Condition](https://docs.aws.amazon.com/AWS IAM/latest/UserGuide/reference_policies_elements_condition.html)
- [AWS 전역 조건 컨텍스트 키](https://docs.aws.amazon.com/AWS IAM/latest/UserGuide/reference_policies_condition-keys.html)
- [AWS IAM 정책 예제](https://docs.aws.amazon.com/AWS IAM/latest/UserGuide/access_policies_examples.html)

## 📚 참고: Condition 키 종류

다음은 자주 사용되는 Condition 키들입니다:

### 문자열 조건(String Conditions)

```json
"Condition": {
  "StringEquals": {
    "s3:x-amz-server-side-encryption": "AES256"
  },
  "StringLike": {
    "s3:prefix": "documents/*"
  }
}
```

### 숫자 조건(Numeric Conditions)

```json
"Condition": {
  "NumericLessThan": {
    "s3:max-keys": "100"
  },
  "NumericGreaterThanEquals": {
    "aws:MultiFactorAuthAge": "3600"
  }
}
```

### 날짜/시간 조건(Date/Time Conditions)

```json
"Condition": {
  "DateGreaterThan": {
    "aws:CurrentTime": "2026-01-01T00:00:00Z"
  },
  "DateLessThan": {
    "aws:CurrentTime": "2026-12-31T23:59:59Z"
  }
}
```

### Boolean 조건(Boolean Conditions)

```json
"Condition": {
  "BoolIfExists": {
    "aws:SecureTransport": "true",
    "aws:MultiFactorAuthPresent": "true"
  }
}
```

> [!NOTE]
> 태스크 2에서 설명한 것처럼, **aws:MultiFactorAuthPresent** 키는 **BoolIfExists**를 사용해야 합니다. **Bool**을 사용하면 키가 없을 때 조건 평가를 건너뛰므로 보안이 약화됩니다.

### IP 주소 조건(IP Address Conditions)

```json
"Condition": {
  "IpAddress": {
    "aws:SourceIp": [
      "203.0.113.0/24",   // 예시 IP (RFC 5737 문서용)
      "198.51.100.0/24"   // 실제 사용 시 본인의 IP로 변경
    ]
  },
  "NotIpAddress": {
    "aws:SourceIp": "192.0.2.0/24"  // 예시 IP (RFC 5737 문서용)
  }
}
```

> [!NOTE]
> 위 예시의 IP 주소는 RFC 5737 문서용 예시 IP입니다. 실제 정책 작성 시 본인의 IP 주소로 변경해야 합니다.

### 시간 기반 접근 제어 실무 활용

#### 1. 프로젝트 기간 제한

**시나리오**: 외부 컨설턴트에게 프로젝트 기간(3개월)만 AWS 리소스 접근 권한 부여

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "DateGreaterThan": {
          "aws:CurrentTime": "2026-01-01T00:00:00Z"
        },
        "DateLessThan": {
          "aws:CurrentTime": "2026-03-31T23:59:59Z"
        }
      }
    }
  ]
}
```

**장점**: 프로젝트 종료 후 수동으로 권한을 회수할 필요 없이 자동으로 접근이 차단됩니다.

#### 2. 임시 계약직 직원 접근 제한

**시나리오**: 6개월 계약직 직원에게 계약 기간 동안만 특정 Amazon S3 버킷 접근 허용

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::project-bucket",
        "arn:aws:s3:::project-bucket/*"
      ],
      "Condition": {
        "DateGreaterThan": {
          "aws:CurrentTime": "2026-01-01T00:00:00Z"
        },
        "DateLessThan": {
          "aws:CurrentTime": "2026-06-30T23:59:59Z"
        }
      }
    }
  ]
}
```

**모범 사례**: 계약 종료일보다 1-2일 여유를 두고 설정하여 업무 인수인계 시간을 확보합니다.

#### 3. 이벤트 기간 한정 리소스 접근

**시나리오**: 블랙 프라이데이 이벤트 기간(11월 한 달)만 마케팅 팀에게 프로모션 AWS Lambda 함수 실행 권한 부여

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": "arn:aws:lambda:ap-northeast-2:*:function:BlackFridayPromotion",
      "Condition": {
        "DateGreaterThan": {
          "aws:CurrentTime": "2026-11-01T00:00:00Z"
        },
        "DateLessThan": {
          "aws:CurrentTime": "2026-11-30T23:59:59Z"
        }
      }
    }
  ]
}
```

**장점**: 이벤트 종료 후 자동으로 권한이 회수되어 보안 위험을 최소화합니다.

#### 4. 감사 기간 동안 삭제 작업 차단

**시나리오**: 연말 감사 기간(12월 1일~31일) 동안 모든 삭제 작업 차단

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": [
        "s3:DeleteObject",
        "s3:DeleteBucket",
        "dynamodb:DeleteTable",
        "rds:DeleteDBInstance"
      ],
      "Resource": "*",
      "Condition": {
        "DateGreaterThan": {
          "aws:CurrentTime": "2026-12-01T00:00:00Z"
        },
        "DateLessThan": {
          "aws:CurrentTime": "2026-12-31T23:59:59Z"
        }
      }
    }
  ]
}
```

**중요**: Deny는 모든 Allow보다 우선하므로, 관리자 권한이 있어도 감사 기간에는 삭제가 차단됩니다.

#### 5. 시간대 변환 예시

**한국 시간(KST)을 UTC로 변환하는 방법**:

| 한국 시간 (KST, UTC+9) | UTC 시간 | 정책에 입력할 값 |
|----------------------|---------|----------------|
| 2026-01-01 09:00 | 2026-01-01 00:00 | `2026-01-01T00:00:00Z` |
| 2026-01-01 18:00 | 2026-01-01 09:00 | `2026-01-01T09:00:00Z` |
| 2026-12-31 23:59 | 2026-12-31 14:59 | `2026-12-31T14:59:59Z` |

**변환 공식**: UTC 시간 = 한국 시간 - 9시간

**온라인 도구**: [https://www.timeanddate.com/worldclock/converter.html](https://www.timeanddate.com/worldclock/converter.html)

#### 6. 매일 반복되는 업무 시간 제한 (대안 솔루션)

**문제**: AWS IAM 정책만으로는 "매일 09:00-18:00"을 구현할 수 없습니다.

**대안 1: AWS Lambda + Amazon EventBridge**
```python
# AWS Lambda 함수로 매일 09:00에 정책 연결, 18:00에 정책 분리
import boto3

def lambda_handler(event, context):
    iam = boto3.client('iam')
    action = event['action']  # 'attach' or 'detach'
    
    if action == 'attach':
        iam.attach_user_policy(
            UserName='employee-user',
            PolicyArn='arn:aws:iam::123456789012:policy/WorkHoursPolicy'
        )
    elif action == 'detach':
        iam.detach_user_policy(
            UserName='employee-user',
            PolicyArn='arn:aws:iam::123456789012:policy/WorkHoursPolicy'
        )
```

**Amazon EventBridge 규칙**:
- 09:00 KST (00:00 UTC): AWS Lambda 함수 호출 (action=attach)
- 18:00 KST (09:00 UTC): AWS Lambda 함수 호출 (action=detach)

**대안 2: AWS Config 규칙**
- AWS Config로 업무 시간 외 API 호출을 감지하고 알림
- 실시간 차단은 불가능하지만, 사후 감사 및 경고 가능

**대안 3: 서드파티 솔루션**
- HashiCorp Vault: 시간 기반 동적 자격증명 발급
- AWS IAM Identity Center: 세션 시간 제한 설정

#### 7. 시간 기반 정책 모범 사례

**1. 여유 시간 확보**
- 시작 시간: 실제 필요 시간보다 1-2시간 일찍 설정
- 종료 시간: 실제 필요 시간보다 1-2시간 늦게 설정
- 이유: 시간대 변환 오류, 업무 지연 등을 고려

**2. 명시적 Deny 사용**
- Allow만 사용하면 다른 정책의 Allow가 우선될 수 있음
- Deny를 함께 사용하여 기간 외 접근을 확실히 차단

**3. 알림 설정**
- Amazon CloudWatch Events로 정책 만료 7일 전 알림
- AWS Lambda로 자동 연장 또는 관리자 승인 워크플로우 구현

**4. 테스트**
- 정책 적용 전 테스트 사용자로 충분히 테스트
- 시간대 변환이 올바른지 확인
- 기간 시작/종료 시점에 실제 동작 확인

**5. 문서화**
- 정책 Description에 기간 및 목적 명시
- 태그로 만료일 표시 (예: `ExpiryDate=2026-12-31`)
- 정책 검토 주기 설정 (월 1회 권장)


