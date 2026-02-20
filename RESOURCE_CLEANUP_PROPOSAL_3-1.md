# Week 3-1 리소스 정리 섹션 제안

## 리소스 정리

> [!WARNING]
> 다음 단계를 **반드시 수행**하여 불필요한 비용을 방지하세요.

---

### 1. Tag Editor로 생성된 리소스 확인

실습에서 생성한 모든 리소스를 Tag Editor로 확인합니다.

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Resource Groups & Tag Editor`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `ap-northeast-2`를 선택합니다.
4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Week`
   - **Tag value**: `3-1`
6. [[Search resources]] 버튼을 클릭합니다.

> [!NOTE]
> 이 실습에서 생성한 Amazon VPC Endpoint 4개가 표시됩니다. Tag Editor는 리소스 확인 용도로만 사용하며, 실제 삭제는 다음 단계에서 수행합니다.

---

### 2. 리소스 삭제

다음 두 가지 방법 중 하나를 선택하여 리소스를 삭제할 수 있습니다.

#### 옵션 1: AWS 콘솔에서 수동 삭제 (권장)

**Amazon VPC Endpoint 삭제**

1. Amazon VPC 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **Endpoints**를 선택합니다.
3. 다음 4개의 엔드포인트를 모두 선택합니다:
   - `week3-1-ssm-endpoint`
   - `week3-1-ssmmessages-endpoint`
   - `week3-1-ec2messages-endpoint`
   - `week3-1-s3-endpoint`

> [!NOTE]
> 4개의 엔드포인트를 모두 선택하려면 각 엔드포인트의 체크박스를 클릭합니다. 모두 선택되면 상단의 **Actions** 버튼이 활성화됩니다.

4. **Actions** > `Delete VPC endpoints`를 선택합니다.
5. 확인 창에서 `delete`를 입력하고 [[Delete]] 버튼을 클릭합니다.

> [!NOTE]
> Amazon VPC Endpoint 삭제는 즉시 완료됩니다. Interface Endpoint 3개와 Gateway Endpoint 1개가 모두 삭제됩니다.

#### 옵션 2: AWS CloudShell 스크립트로 일괄 삭제

AWS CloudShell을 사용하여 태그 기반으로 리소스를 자동 삭제할 수 있습니다.

1. AWS Management Console 상단의 CloudShell 아이콘을 클릭합니다.
2. CloudShell이 열리면 다음 명령어를 실행합니다:

```bash
# Week 3-1 태그가 있는 VPC Endpoint 찾기
ENDPOINT_IDS=$(aws ec2 describe-vpc-endpoints \
  --region ap-northeast-2 \
  --filters "Name=tag:Week,Values=3-1" \
  --query 'VpcEndpoints[*].VpcEndpointId' \
  --output text)

# VPC Endpoint 삭제
if [ -n "$ENDPOINT_IDS" ]; then
  echo "삭제할 VPC Endpoints: $ENDPOINT_IDS"
  aws ec2 delete-vpc-endpoints \
    --region ap-northeast-2 \
    --vpc-endpoint-ids $ENDPOINT_IDS
  echo "VPC Endpoints 삭제 완료"
else
  echo "삭제할 VPC Endpoint가 없습니다"
fi
```

> [!NOTE]
> 스크립트는 `Week=3-1` 태그가 있는 모든 Amazon VPC Endpoint를 자동으로 찾아 삭제합니다. 삭제는 즉시 완료됩니다.

---

### 3. 삭제 확인 (Tag Editor 활용)

리소스가 정상적으로 삭제되었는지 Tag Editor로 확인합니다.

1. AWS Management Console에서 `Resource Groups & Tag Editor`로 이동합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `ap-northeast-2`를 선택합니다.
4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Week`
   - **Tag value**: `3-1`
6. [[Search resources]] 버튼을 클릭합니다.

> [!NOTE]
> 검색 결과에 리소스가 표시되지 않으면 모든 Amazon VPC Endpoint가 성공적으로 삭제된 것입니다.

---

### 4. CloudFormation 스택 삭제

마지막으로 CloudFormation 스택을 삭제하여 나머지 모든 리소스를 정리합니다.

1. AWS Management Console에 로그인한 후 상단 검색창에서 `CloudFormation`을 검색하고 선택합니다.
2. 스택 목록에서 `week3-1-vpc-stack` 스택을 검색합니다.
3. `week3-1-vpc-stack` 스택의 체크박스를 선택합니다.

> [!NOTE]
> 스택이 선택되면 체크박스에 체크 표시가 나타나고, 상단의 [[Delete]] 버튼이 활성화됩니다.

4. [[Delete]] 버튼을 클릭합니다.
5. 확인 창에서 [[Delete]] 버튼을 다시 클릭하여 삭제를 확인합니다.

> [!NOTE]
> 확인 후 스택 목록 페이지로 돌아갑니다.

6. `week3-1-vpc-stack` 스택의 **Status** 열을 확인합니다.

> [!NOTE]
> 스택 삭제가 시작되면 **Status**가 "DELETE_IN_PROGRESS"로 표시됩니다. CloudFormation이 생성한 모든 리소스를 역순으로 삭제합니다.

7. 스택을 클릭하여 상세 페이지로 이동합니다.
8. **Events** 탭을 선택합니다.

> [!NOTE]
> **Events** 탭에는 리소스 삭제 과정이 실시간으로 표시됩니다. Amazon EC2 인스턴스, NAT Gateway, 서브넷, Amazon VPC 등이 순차적으로 삭제됩니다. 삭제에 5-7분이 소요됩니다.

9. 스택 삭제가 완료될 때까지 기다립니다.

> [!NOTE]
> 스택이 완전히 삭제되면 스택 목록에서 사라집니다. 만약 "DELETE_FAILED"가 표시되면 **Events** 탭에서 오류 원인을 확인하고, 수동으로 리소스를 삭제한 후 스택 삭제를 다시 시도합니다.

✅ **실습 종료**: 모든 리소스가 정리되었습니다.

---

## 주요 변경 사항

1. **구조 개선**: 4단계로 명확하게 구분
   - 1단계: Tag Editor로 리소스 확인
   - 2단계: 리소스 삭제 (옵션 1: 콘솔 / 옵션 2: CloudShell)
   - 3단계: 삭제 확인 (Tag Editor)
   - 4단계: CloudFormation 스택 삭제

2. **CloudShell 스크립트 추가**: 태그 기반 자동 삭제 옵션 제공

3. **삭제 확인 단계 추가**: Tag Editor로 삭제 완료 검증

4. **번호 매기기**: 각 단계를 명확하게 번호로 구분 (1, 2, 3, 4)
