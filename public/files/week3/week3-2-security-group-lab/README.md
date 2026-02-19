# Week 3-2: Security Group & NACL Lab Files

## 📦 포함된 파일

### vpc-3tier-environment.yaml
3-Tier 아키텍처를 위한 VPC 환경 CloudFormation 템플릿

**생성되는 리소스**:
- VPC (10.0.0.0/16)
- Public Subnet x2 (ALB Tier)
- Private Subnet x4 (Web Tier x2, App Tier x2)
- Private Subnet x2 (DB Tier)
- Internet Gateway
- NAT Gateway x2 (고가용성)
- Route Tables (Public x1, Private x2)

**생성되지 않는 리소스** (학생이 실습에서 생성):
- Security Groups (ALB, Web, App, DB)
- Network ACLs
- EC2 Instances

## 🚀 사용 방법

### 1. CloudFormation 스택 생성

#### AWS Console 사용
1. AWS Management Console에 로그인
2. CloudFormation 서비스로 이동
3. **Create stack** > **With new resources** 선택
4. **Template is ready** 선택
5. **Upload a template file** 선택
6. `vpc-3tier-environment.yaml` 파일 업로드
7. **Next** 클릭

#### 스택 세부 정보
- **Stack name**: `week3-2-vpc-environment`
- **Parameters**: 기본값 사용 (필요시 수정 가능)
  - EnvironmentName: `Lab` (기본값)
  - VpcCIDR: `10.0.0.0/16` (기본값)
  - 각 서브넷 CIDR (기본값 사용 권장)

8. **Next** 클릭
9. **Next** 클릭 (Configure stack options)
10. **I acknowledge...** 체크
11. **Submit** 클릭

#### AWS CLI 사용
```bash
aws cloudformation create-stack \
  --stack-name week3-2-vpc-environment \
  --template-body file://vpc-3tier-environment.yaml \
  --region ap-northeast-2
```

### 2. 스택 생성 확인

스택 생성에 약 5-7분 소요됩니다.

**상태 확인**:
- CloudFormation 콘솔에서 스택 상태가 `CREATE_COMPLETE`가 될 때까지 대기
- **Outputs** 탭에서 생성된 리소스 ID 확인

**생성된 리소스 확인**:
1. VPC 콘솔로 이동
2. **Your VPCs**에서 `Lab-VPC` 확인
3. **Subnets**에서 8개 서브넷 확인:
   - Lab-Public-Subnet-1 (ALB)
   - Lab-Public-Subnet-2 (ALB)
   - Lab-Private-Subnet-1 (Web)
   - Lab-Private-Subnet-2 (Web)
   - Lab-Private-Subnet-3 (App)
   - Lab-Private-Subnet-4 (App)
   - Lab-Private-Subnet-5 (DB)
   - Lab-Private-Subnet-6 (DB)

### 3. 실습 진행

VPC 환경이 준비되었으므로 Week 3-2 실습 가이드를 따라 진행합니다:
1. ALB 보안 그룹 생성
2. Web Tier 보안 그룹 생성
3. App Tier 보안 그룹 생성
4. DB Tier 보안 그룹 생성
5. 보안 그룹 체인 검증
6. Network ACL 설정

## 📊 아키텍처 구조

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ┌────▼────┐
                    │   IGW   │
                    └────┬────┘
                         │
        ┌────────────────┴────────────────┐
        │         Public Subnets          │
        │  (ALB Tier - 2 AZs)            │
        │  10.0.1.0/24, 10.0.2.0/24      │
        └────────────────┬────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │      NAT Gateways (x2)          │
        └────────────────┬────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │      Private Subnets (Web)      │
        │  10.0.11.0/24, 10.0.12.0/24    │
        └────────────────┬────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │      Private Subnets (App)      │
        │  10.0.21.0/24, 10.0.22.0/24    │
        └────────────────┬────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │      Private Subnets (DB)       │
        │  10.0.31.0/24, 10.0.32.0/24    │
        └─────────────────────────────────┘
```

## 💰 비용 정보

**예상 비용** (ap-northeast-2 리전 기준):
- NAT Gateway x2: 시간당 약 $0.09 (약 $65/월)
- Elastic IP x2: 사용 중일 때 무료
- VPC, Subnets, Route Tables: 무료

**비용 절감 팁**:
- 실습 종료 후 즉시 스택 삭제
- NAT Gateway가 주요 비용 발생 요소

## 🧹 리소스 정리

### CloudFormation 스택 삭제

#### AWS Console 사용
1. CloudFormation 콘솔로 이동
2. `week3-2-vpc-environment` 스택 선택
3. **Delete** 버튼 클릭
4. **Delete stack** 확인

#### AWS CLI 사용
```bash
aws cloudformation delete-stack \
  --stack-name week3-2-vpc-environment \
  --region ap-northeast-2
```

### 삭제 전 확인사항

**다음 리소스를 먼저 삭제해야 합니다**:
1. Security Groups (실습에서 생성한 것)
2. Network ACLs (실습에서 생성한 것)
3. EC2 Instances (실습에서 생성한 것)

**주의**: 위 리소스가 남아있으면 스택 삭제가 실패합니다.

## 🔍 트러블슈팅

### 스택 생성 실패

**문제**: `CREATE_FAILED` 상태
**원인**: 
- 리전에 가용 영역이 부족
- NAT Gateway EIP 할당량 초과

**해결**:
1. CloudFormation 콘솔에서 **Events** 탭 확인
2. 오류 메시지 확인
3. 필요시 리전 변경 또는 AWS Support 문의

### 스택 삭제 실패

**문제**: `DELETE_FAILED` 상태
**원인**: 
- Security Groups가 남아있음
- EC2 Instances가 실행 중
- ENI(Elastic Network Interface)가 연결됨

**해결**:
1. VPC 콘솔에서 Security Groups 삭제
2. EC2 콘솔에서 인스턴스 종료
3. ENI 확인 및 삭제
4. 스택 삭제 재시도

## 📚 추가 리소스

- [AWS VPC 사용 설명서](https://docs.aws.amazon.com/vpc/)
- [CloudFormation VPC 템플릿 예시](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html)
- [3-Tier 아키텍처 모범 사례](https://aws.amazon.com/architecture/)

## ❓ 자주 묻는 질문

**Q: VPC CIDR를 변경할 수 있나요?**
A: 네, CloudFormation 파라미터에서 VpcCIDR 값을 변경할 수 있습니다. 단, 서브넷 CIDR도 함께 조정해야 합니다.

**Q: NAT Gateway를 1개만 사용할 수 있나요?**
A: 가능하지만 고가용성이 보장되지 않습니다. 비용 절감을 위해서는 실습 후 즉시 삭제하는 것을 권장합니다.

**Q: 다른 리전에서 사용할 수 있나요?**
A: 네, 모든 AWS 리전에서 사용 가능합니다. CloudFormation 스택 생성 시 원하는 리전을 선택하세요.
