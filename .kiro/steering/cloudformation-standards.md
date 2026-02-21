---
inclusion: auto
description: CloudFormation 템플릿 표준화 가이드 - AWS 인프라 코드 작성 규칙
keywords:
  [
    'CloudFormation',
    '템플릿',
    '스택',
    '리소스',
    'VPC',
    'EC2',
    'RDS',
    'IAM',
    'Lambda',
    '작성',
    '만들',
    '생성',
    '수정',
    '배포',
    'YAML',
    'Parameters',
    'Outputs',
    '인프라',
  ]
---

# CloudFormation 템플릿 표준화 가이드

## 목적

이 문서는 AWS 클라우드 컴퓨팅 실습 과정의 모든 CloudFormation 템플릿에 대한 표준화 규칙을 정의합니다.

**중요**: CloudFormation 템플릿은 실제 동작하는 코드이며, **진실의 원천(Source of Truth)**입니다. 마크다운 가이드는 템플릿을 문서화하는 것이므로, 가이드가 템플릿에 맞춰져야 합니다.

---

## 1. 파일 및 스택 명명 규칙

### 1.1 템플릿 파일명

**형식**: `week{X}-{Y}-{purpose}-lab.yaml`

- `{X}`: 주차 번호 (1-15)
- `{Y}`: 세션 번호 (1-3)
- `{purpose}`: 실습 목적을 나타내는 간결한 영문 키워드 (kebab-case)
- 확장자: `.yaml` (일관성 유지)

**예시**:

```
week3-1-vpc-lab.yaml
week3-2-security-group-lab.yaml
week4-3-serverless-api-lab.yaml
week5-1-rds-multi-az-lab.yaml
week7-3-eks-cluster-lab.yaml
```

### 1.2 스택 이름

**형식**: `week{X}-{Y}-{purpose}-stack`

- 템플릿 파일명과 동일한 구조
- 마지막에 `-stack` 접미사 추가

**예시**:

```
week3-1-vpc-stack
week3-2-security-group-stack
week4-3-serverless-api-stack
```

**Parameters를 통한 동적 스택 이름**:

```yaml
Parameters:
  EnvironmentName:
    Type: String
    Default: week3-1-vpc
    Description: 환경 이름 (스택 이름의 기본값)
```

---

## 2. 리소스 명명 규칙

### 2.1 IAM 역할 (IAM Role)

**형식 1** (스택 기반): `{StackName}-{Service}-{Purpose}Role`
**형식 2** (환경 기반): `{EnvironmentName}-{Service}{Purpose}Role`

**예시**:

```yaml
# 형식 1
LambdaExecutionRole:
  Type: AWS::IAM::Role
  Properties:
    RoleName: !Sub '${AWS::StackName}-Lambda-ExecutionRole'

# 형식 2
EC2Role:
  Type: AWS::IAM::Role
  Properties:
    RoleName: !Sub '${EnvironmentName}-EC2InstanceRole'
```

**일반적인 Service-Purpose 조합**:

- `Lambda-ExecutionRole`: Lambda 함수 실행 역할
- `EC2-InstanceRole`: EC2 인스턴스 프로파일 역할
- `RDS-MonitoringRole`: RDS 모니터링 역할
- `EKS-ClusterRole`: EKS 클러스터 역할
- `EKS-NodeRole`: EKS 노드 그룹 역할
- `Glue-ServiceRole`: Glue 서비스 역할

### 2.2 보안 그룹 (Security Group)

**형식 1** (스택 기반): `{StackName}-{Purpose}-SG`
**형식 2** (환경 기반): `{EnvironmentName}-{Purpose}-SG`

**예시**:

```yaml
# 형식 1
ALBSecurityGroup:
  Type: AWS::EC2::SecurityGroup
  Properties:
    GroupName: !Sub '${AWS::StackName}-ALB-SG'
    GroupDescription: Security group for Application Load Balancer

# 형식 2
WebSecurityGroup:
  Type: AWS::EC2::SecurityGroup
  Properties:
    GroupName: !Sub '${EnvironmentName}-Web-SG'
    GroupDescription: Security group for Web tier
```

**일반적인 Purpose 값**:

- `ALB-SG`: Application Load Balancer
- `Web-SG`: 웹 계층
- `App-SG`: 애플리케이션 계층
- `DB-SG`: 데이터베이스 계층
- `Lambda-SG`: Lambda 함수
- `EKS-Cluster-SG`: EKS 클러스터
- `EKS-Node-SG`: EKS 노드
- `Cache-SG`: ElastiCache

### 2.3 서브넷 (Subnet)

**형식 1** (스택 기반): `{StackName}-{Tier}-Subnet-{AZ}`
**형식 2** (환경 기반): `{EnvironmentName}-{Tier}-Subnet-{AZ}`

**예시**:

```yaml
# 형식 1
PublicSubnet1:
  Type: AWS::EC2::Subnet
  Properties:
    Tags:
      - Key: Name
        Value: !Sub '${AWS::StackName}-Public-Subnet-A'

# 형식 2
PrivateSubnet1:
  Type: AWS::EC2::Subnet
  Properties:
    Tags:
      - Key: Name
        Value: !Sub '${EnvironmentName}-Private-Subnet-A'
```

**일반적인 Tier 값**:

- `Public`: 퍼블릭 서브넷
- `Private`: 프라이빗 서브넷
- `Web`: 웹 계층 서브넷
- `App`: 애플리케이션 계층 서브넷
- `DB`: 데이터베이스 계층 서브넷

**가용 영역 표기**:

- `A`: ap-northeast-2a
- `C`: ap-northeast-2c

### 2.4 기타 리소스

**VPC**:

```yaml
VPC:
  Type: AWS::EC2::VPC
  Properties:
    Tags:
      - Key: Name
        Value: !Sub '${EnvironmentName}-VPC'
```

**인터넷 게이트웨이**:

```yaml
InternetGateway:
  Type: AWS::EC2::InternetGateway
  Properties:
    Tags:
      - Key: Name
        Value: !Sub '${EnvironmentName}-IGW'
```

**NAT 게이트웨이**:

```yaml
NATGateway1:
  Type: AWS::EC2::NatGateway
  Properties:
    Tags:
      - Key: Name
        Value: !Sub '${EnvironmentName}-NAT-A'
```

**라우트 테이블**:

```yaml
PublicRouteTable:
  Type: AWS::EC2::RouteTable
  Properties:
    Tags:
      - Key: Name
        Value: !Sub '${EnvironmentName}-Public-RT'
```

---

## 3. 공통 설정 표준

### 3.1 EC2 인스턴스

**AMI**: SSM Parameter를 사용하여 최신 Amazon Linux 2023 AMI 자동 선택

```yaml
Parameters:
  LatestAmiId:
    Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
    Default: /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64
    Description: Latest Amazon Linux 2023 AMI ID

Resources:
  EC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      ImageId: !Ref LatestAmiId
      InstanceType: t3.micro # 또는 t3.medium
```

**인스턴스 타입**:

- 기본: `t3.micro` (1 vCPU, 1 GiB RAM)
- 중간: `t3.medium` (2 vCPU, 4 GiB RAM)
- 선택 기준: 실습 요구사항에 따라 결정

**필수 태그**:

```yaml
Tags:
  - Key: Name
    Value: !Sub '${EnvironmentName}-Instance'
  - Key: Environment
    Value: !Ref EnvironmentName
  - Key: Lab
    Value: !Sub 'Week${WeekNumber}-${SessionNumber}'
```

### 3.2 RDS 인스턴스

**엔진 버전**:

- MySQL: `8.0.35` (최신 안정 버전)
- PostgreSQL: `15.4` (최신 안정 버전)

**인스턴스 클래스**:

- 기본: `db.t3.micro` (2 vCPU, 1 GiB RAM)

**백업 설정**:

```yaml
DBInstance:
  Type: AWS::RDS::DBInstance
  Properties:
    BackupRetentionPeriod: 7 # 7일 백업 보관
    PreferredBackupWindow: '03:00-04:00' # UTC 기준
    PreferredMaintenanceWindow: 'sun:04:00-sun:05:00'
```

**Multi-AZ 설정**:

```yaml
MultiAZ: true  # Multi-AZ 실습의 경우
MultiAZ: false  # Single-AZ 실습의 경우
```

### 3.3 Lambda 함수

**런타임**:

- Python: `python3.11` (최신 안정 버전)
- Node.js: `nodejs20.x` (필요시)

**메모리 및 타임아웃**:

```yaml
LambdaFunction:
  Type: AWS::Lambda::Function
  Properties:
    Runtime: python3.11
    MemorySize: 128 # 기본값, 필요시 256, 512 등으로 조정
    Timeout: 30 # 기본 30초, API 호출 시 최대 300초
```

### 3.4 EKS 클러스터

**Kubernetes 버전**:

```yaml
EKSCluster:
  Type: AWS::EKS::Cluster
  Properties:
    Version: '1.28' # 최신 안정 버전
```

**노드 그룹 인스턴스 타입**:

```yaml
NodeGroup:
  Type: AWS::EKS::Nodegroup
  Properties:
    InstanceTypes:
      - t3.medium # 기본값
    ScalingConfig:
      MinSize: 2
      MaxSize: 4
      DesiredSize: 2
```

### 3.5 ElastiCache

**엔진 버전**:

- Redis: `7.0` (최신 안정 버전)

**노드 타입**:

```yaml
CacheCluster:
  Type: AWS::ElastiCache::CacheCluster
  Properties:
    CacheNodeType: cache.t3.micro # 기본값
    Engine: redis
    EngineVersion: '7.0'
```

---

## 4. VPC 네트워크 구조 패턴

### 4.1 Simple VPC (NAT Gateway 없음)

**사용 사례**: VPC Endpoint 실습 (Week 3-1)

**구조**:

- VPC: 1개 (10.0.0.0/16)
- 퍼블릭 서브넷: 2개 (10.0.1.0/24, 10.0.2.0/24)
- 프라이빗 서브넷: 2개 (10.0.11.0/24, 10.0.12.0/24)
- 인터넷 게이트웨이: 1개
- NAT 게이트웨이: 없음 (VPC Endpoint 사용)

**특징**:

- 프라이빗 서브넷에서 인터넷 접근 불가
- VPC Endpoint를 통한 AWS 서비스 접근

### 4.2 3-Tier VPC (NAT Gateway 포함)

**사용 사례**: 보안 그룹 실습 (Week 3-2), RDS Multi-AZ (Week 5-1)

**구조**:

- VPC: 1개 (10.0.0.0/16)
- 퍼블릭 서브넷: 2개 (10.0.1.0/24, 10.0.2.0/24)
- 웹 계층 서브넷: 2개 (10.0.11.0/24, 10.0.12.0/24)
- 앱 계층 서브넷: 2개 (10.0.21.0/24, 10.0.22.0/24)
- DB 계층 서브넷: 2개 (10.0.31.0/24, 10.0.32.0/24)
- 인터넷 게이트웨이: 1개
- NAT 게이트웨이: 2개 (각 AZ에 1개)

**특징**:

- 계층별 서브넷 분리
- 프라이빗 서브넷에서 NAT Gateway를 통한 인터넷 접근

### 4.3 EKS VPC

**사용 사례**: EKS 클러스터 실습 (Week 7-3, Week 9-3)

**구조**:

- VPC: 1개 (10.0.0.0/16)
- 퍼블릭 서브넷: 2개 (10.0.1.0/24, 10.0.2.0/24)
- 프라이빗 서브넷: 2개 (10.0.11.0/24, 10.0.12.0/24)
- 인터넷 게이트웨이: 1개
- NAT 게이트웨이: 2개

**특징**:

- EKS 클러스터용 서브넷 태그 필수
- 퍼블릭 서브넷: `kubernetes.io/role/elb: 1`
- 프라이빗 서브넷: `kubernetes.io/role/internal-elb: 1`

```yaml
PublicSubnet1:
  Type: AWS::EC2::Subnet
  Properties:
    Tags:
      - Key: Name
        Value: !Sub '${EnvironmentName}-Public-Subnet-A'
      - Key: kubernetes.io/role/elb
        Value: 1
      - Key: !Sub 'kubernetes.io/cluster/${EnvironmentName}-cluster'
        Value: shared

PrivateSubnet1:
  Type: AWS::EC2::Subnet
  Properties:
    Tags:
      - Key: Name
        Value: !Sub '${EnvironmentName}-Private-Subnet-A'
      - Key: kubernetes.io/role/internal-elb
        Value: 1
      - Key: !Sub 'kubernetes.io/cluster/${EnvironmentName}-cluster'
        Value: shared
```

---

## 5. Parameters 표준

### 5.1 필수 Parameters

**EnvironmentName**: 모든 템플릿에 포함

```yaml
Parameters:
  EnvironmentName:
    Type: String
    Default: week{X}-{Y}-{purpose}
    Description: 환경 이름 (리소스 명명에 사용)
    AllowedPattern: ^[a-z0-9-]+$
    ConstraintDescription: 소문자, 숫자, 하이픈만 사용 가능
```

**StudentId**: 학생별 리소스 구분 (선택적)

```yaml
Parameters:
  StudentId:
    Type: String
    Description: 학생 ID (리소스 고유성 보장)
    AllowedPattern: ^[a-z0-9-]+$
    ConstraintDescription: 소문자, 숫자, 하이픈만 사용 가능
```

### 5.2 Parameters 제약사항

**중요**: Parameters의 `Default` 값에는 CloudFormation 내장 함수(`!Sub`, `!Ref`, `!GetAtt` 등)를 사용할 수 없습니다. 문자열 리터럴만 허용됩니다.

**❌ 잘못된 예시**:

```yaml
Parameters:
  BucketName:
    Type: String
    Default: !Sub 'my-bucket-${AWS::AccountId}' # 오류 발생!
```

**✅ 올바른 예시**:

```yaml
Parameters:
  BucketPrefix:
    Type: String
    Default: 'my-bucket'
    Description: S3 버킷 이름 접두사

Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '${BucketPrefix}-${AWS::AccountId}' # Resources에서 사용
```

### 5.3 일반적인 Parameters

**VPC CIDR**:

```yaml
VPCCIDR:
  Type: String
  Default: 10.0.0.0/16
  Description: VPC CIDR 블록
  AllowedPattern: ^(\d{1,3}\.){3}\d{1,3}/\d{1,2}$
```

**서브넷 CIDR**:

```yaml
PublicSubnet1CIDR:
  Type: String
  Default: 10.0.1.0/24
  Description: 퍼블릭 서브넷 1 CIDR 블록
```

**인스턴스 타입**:

```yaml
InstanceType:
  Type: String
  Default: t3.micro
  AllowedValues:
    - t3.micro
    - t3.small
    - t3.medium
  Description: EC2 인스턴스 타입
```

**데이터베이스 자격증명** (Secrets Manager 사용 권장):

```yaml
DBUsername:
  Type: String
  Default: admin
  Description: 데이터베이스 마스터 사용자 이름
  NoEcho: true

DBPassword:
  Type: String
  NoEcho: true
  Description: 데이터베이스 마스터 비밀번호
  MinLength: 8
  MaxLength: 41
  AllowedPattern: ^[a-zA-Z0-9]*$
```

---

## 6. Outputs 표준

### 6.1 Export 명명 규칙

**형식**: `{EnvironmentName}-{ResourceType}`

```yaml
Outputs:
  VPCId:
    Description: VPC ID
    Value: !Ref VPC
    Export:
      Name: !Sub '${EnvironmentName}-VPC'

  PublicSubnet1Id:
    Description: 퍼블릭 서브넷 1 ID
    Value: !Ref PublicSubnet1
    Export:
      Name: !Sub '${EnvironmentName}-PublicSubnet1'
```

### 6.2 일반적인 Outputs

**VPC 관련**:

```yaml
Outputs:
  VPCId:
    Description: VPC ID
    Value: !Ref VPC
    Export:
      Name: !Sub '${EnvironmentName}-VPC'

  VPCCIDR:
    Description: VPC CIDR 블록
    Value: !GetAtt VPC.CidrBlock
```

**서브넷 관련**:

```yaml
PublicSubnet1Id:
  Description: 퍼블릭 서브넷 1 ID (ap-northeast-2a)
  Value: !Ref PublicSubnet1
  Export:
    Name: !Sub '${EnvironmentName}-PublicSubnet1'
```

**보안 그룹 관련**:

```yaml
ALBSecurityGroupId:
  Description: ALB 보안 그룹 ID
  Value: !Ref ALBSecurityGroup
  Export:
    Name: !Sub '${EnvironmentName}-ALB-SG'
```

**IAM 역할 관련**:

```yaml
LambdaExecutionRoleArn:
  Description: Lambda 실행 역할 ARN
  Value: !GetAtt LambdaExecutionRole.Arn
  Export:
    Name: !Sub '${EnvironmentName}-LambdaExecutionRole-Arn'
```

**엔드포인트 관련**:

```yaml
APIEndpoint:
  Description: API Gateway 엔드포인트 URL
  Value: !Sub 'https://${ApiGateway}.execute-api.${AWS::Region}.amazonaws.com/prod'
```

---

## 7. Tags 표준

### 7.1 필수 태그

모든 리소스에 다음 태그를 포함해야 합니다:

```yaml
Tags:
  - Key: Name
    Value: !Sub '${EnvironmentName}-{ResourceName}'
  - Key: Environment
    Value: !Ref EnvironmentName
  - Key: Lab
    Value: !Sub 'Week${WeekNumber}-${SessionNumber}'
  - Key: Purpose
    Value: { 실습 목적 }
```

### 7.2 선택적 태그

```yaml
Tags:
  - Key: StudentId
    Value: !Ref StudentId # 학생별 리소스 구분
  - Key: ManagedBy
    Value: CloudFormation
  - Key: CostCenter
    Value: Education
```

### 7.3 태그 예시

```yaml
EC2Instance:
  Type: AWS::EC2::Instance
  Properties:
    Tags:
      - Key: Name
        Value: !Sub '${EnvironmentName}-WebServer'
      - Key: Environment
        Value: !Ref EnvironmentName
      - Key: Lab
        Value: 'Week3-2'
      - Key: Purpose
        Value: 'Security Group Lab'
      - Key: Tier
        Value: 'Web'
```

### 7.4 태그 파라미터화 패턴

반복되는 태그 값을 Parameters로 정의하여 일관성을 유지하고 유지보수를 용이하게 할 수 있습니다.

**패턴**:

```yaml
Parameters:
  ProjectTag:
    Type: String
    Default: 'AWS-Lab'
    Description: Project tag value for all resources

  WeekTag:
    Type: String
    Default: '3-2'
    Description: Week tag value for all resources

  CreatedByTag:
    Type: String
    Default: 'CloudFormation'
    Description: CreatedBy tag value for all resources

Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      Tags:
        - Key: Project
          Value: !Ref ProjectTag
        - Key: Week
          Value: !Ref WeekTag
        - Key: CreatedBy
          Value: !Ref CreatedByTag
        - Key: Component
          Value: Storage # 리소스별 고유 태그

  MyTable:
    Type: AWS::DynamoDB::Table
    Properties:
      Tags:
        - Key: Project
          Value: !Ref ProjectTag
        - Key: Week
          Value: !Ref WeekTag
        - Key: CreatedBy
          Value: !Ref CreatedByTag
        - Key: Component
          Value: Database # 리소스별 고유 태그
```

**장점**:

- 모든 리소스에 일관된 태그 적용
- 태그 값 변경 시 Parameters만 수정
- 스택 생성 시 태그 값 커스터마이징 가능

**주의사항**:

- 리소스별 고유 태그(예: Component)는 하드코딩 유지
- Parameters Default 값에는 내장 함수 사용 불가

---

## 8. 리소스 삭제 표준

### 8.1 CloudFormation 스택 삭제 절차

**기본 원칙**: CloudFormation 스택을 삭제하면 스택이 생성한 모든 리소스가 자동으로 삭제됩니다.

**삭제 순서**:

1. 종속 스택 먼저 삭제 (예: 애플리케이션 스택)
2. 기반 인프라 스택 나중에 삭제 (예: VPC 스택)

**AWS CLI 명령어**:

```bash
# 스택 삭제
aws cloudformation delete-stack --stack-name week3-1-vpc-stack

# 삭제 상태 확인
aws cloudformation describe-stacks --stack-name week3-1-vpc-stack

# 삭제 완료 대기
aws cloudformation wait stack-delete-complete --stack-name week3-1-vpc-stack
```

**AWS Console**:

1. CloudFormation 콘솔 접속
2. 삭제할 스택 선택
3. "삭제" 버튼 클릭
4. 확인 후 삭제 진행

### 8.2 삭제 보호 설정

**중요 리소스 보호**:

```yaml
DBInstance:
  Type: AWS::RDS::DBInstance
  DeletionPolicy: Snapshot # 삭제 시 스냅샷 생성
  Properties:
    DeletionProtection: true # 삭제 보호 활성화
```

**DeletionPolicy 옵션**:

- `Delete`: 스택 삭제 시 리소스도 삭제 (기본값)
- `Retain`: 스택 삭제 시 리소스 유지
- `Snapshot`: 삭제 전 스냅샷 생성 (RDS, EBS 등)

### 8.3 삭제 시 주의사항

**수동 생성 리소스**:

- CloudFormation이 생성하지 않은 리소스는 자동 삭제되지 않음
- 예: 수동으로 생성한 EC2 인스턴스, S3 객체 등

**S3 버킷**:

- 버킷에 객체가 있으면 삭제 실패
- 삭제 전 버킷 비우기 필요

```yaml
S3Bucket:
  Type: AWS::S3::Bucket
  DeletionPolicy: Delete
  Properties:
    BucketName: !Sub '${EnvironmentName}-bucket'
```

**ENI (Elastic Network Interface)**:

- Lambda, RDS 등이 생성한 ENI는 자동 삭제
- 수동 생성 ENI는 별도 삭제 필요

---

## 9. 검증 및 테스트

### 9.1 템플릿 검증

**AWS CLI 검증**:

```bash
aws cloudformation validate-template \
  --template-body file://week3-1-vpc-lab.yaml
```

**cfn-lint 사용** (권장):

```bash
# 설치
pip install cfn-lint

# 검증
cfn-lint week3-1-vpc-lab.yaml
```

### 9.2 스택 생성 테스트

**테스트 스택 생성**:

```bash
aws cloudformation create-stack \
  --stack-name test-week3-1-vpc-stack \
  --template-body file://week3-1-vpc-lab.yaml \
  --parameters ParameterKey=EnvironmentName,ParameterValue=test-week3-1-vpc \
  --capabilities CAPABILITY_NAMED_IAM
```

**스택 생성 상태 확인**:

```bash
aws cloudformation describe-stacks \
  --stack-name test-week3-1-vpc-stack \
  --query 'Stacks[0].StackStatus'
```

### 9.3 리소스 동작 확인

**생성된 리소스 확인**:

```bash
# VPC 확인
aws ec2 describe-vpcs --filters "Name=tag:Name,Values=test-week3-1-vpc-VPC"

# 서브넷 확인
aws ec2 describe-subnets --filters "Name=tag:Environment,Values=test-week3-1-vpc"

# 보안 그룹 확인
aws ec2 describe-security-groups --filters "Name=tag:Environment,Values=test-week3-1-vpc"
```

---

## 10. 템플릿 작성 체크리스트

### 10.1 필수 항목

- [ ] 파일명이 `week{X}-{Y}-{purpose}-lab.yaml` 형식을 따르는가?
- [ ] `EnvironmentName` Parameter가 정의되어 있는가?
- [ ] 모든 리소스에 `Name` 태그가 있는가?
- [ ] 모든 리소스에 `Environment`, `Lab`, `Purpose` 태그가 있는가?
- [ ] IAM 역할 이름이 표준 형식을 따르는가?
- [ ] 보안 그룹 이름이 표준 형식을 따르는가?
- [ ] 서브넷 이름이 표준 형식을 따르는가?
- [ ] Outputs에 주요 리소스 ID/ARN이 포함되어 있는가?
- [ ] Export 이름이 표준 형식을 따르는가?

### 10.2 권장 항목

- [ ] EC2 AMI가 SSM Parameter를 사용하는가?
- [ ] EC2 인스턴스 타입이 `t3.micro` 또는 `t3.medium`인가?
- [ ] RDS 인스턴스 클래스가 `db.t3.micro`인가?
- [ ] Lambda 런타임이 `python3.11` 또는 `nodejs20.x`인가?
- [ ] EKS 버전이 `1.28`인가?
- [ ] ElastiCache 엔진 버전이 `7.0`인가?
- [ ] 백업 설정이 포함되어 있는가? (RDS)
- [ ] Multi-AZ 설정이 명시되어 있는가? (RDS)
- [ ] DeletionPolicy가 적절히 설정되어 있는가?

### 10.3 보안 항목

- [ ] 보안 그룹 규칙이 최소 권한 원칙을 따르는가?
- [ ] 데이터베이스 비밀번호가 NoEcho로 설정되어 있는가?
- [ ] IAM 역할이 최소 권한 정책을 사용하는가?
- [ ] 퍼블릭 서브넷과 프라이빗 서브넷이 명확히 구분되어 있는가?

---

## 11. 마크다운 가이드 작성 규칙

### 11.1 CloudFormation 템플릿 참조

**중요**: 마크다운 가이드는 CloudFormation 템플릿을 문서화하는 것입니다. 템플릿이 진실의 원천이므로, 가이드가 템플릿에 맞춰져야 합니다.

**검증 순서**:

1. CloudFormation 템플릿 작성 및 테스트
2. 템플릿이 정상 동작하는지 확인
3. 템플릿 기반으로 마크다운 가이드 작성
4. 가이드의 모든 값이 템플릿과 일치하는지 검증

### 11.2 태스크 0: 실습 환경 구축

**표준 구조**:

```markdown
## 태스크 0: 실습 환경 구축

이 태스크에서는 CloudFormation을 사용하여 실습에 필요한 기본 인프라를 자동으로 생성합니다.

### 환경 구성 요소

CloudFormation 스택은 다음 리소스를 생성합니다:

- **VPC 및 네트워크**: VPC, 퍼블릭/프라이빗 서브넷, 인터넷 게이트웨이, NAT Gateway
- **보안 그룹**: 실습에 필요한 보안 그룹 및 인바운드 규칙
- **IAM 역할**: EC2, Lambda 등에서 사용할 IAM 역할 및 정책
- **기타 리소스**: [실습별로 추가 리소스 명시]

### 상세 단계

1. 다운로드한 `week{X}-{Y}-lab.zip` 파일의 압축을 해제합니다.
2. `week{X}-{Y}-{purpose}-lab.yaml` 파일을 확인합니다.
3. AWS Management Console에 로그인한 후 상단 검색창에서 `CloudFormation`을 검색하고 선택합니다.
4. [[Create stack]] 버튼을 클릭합니다.
5. **Prerequisite - Prepare template**에서 `Template is ready`를 선택합니다.
6. **Specify template**에서 `Upload a template file`을 선택합니다.
7. [[Choose file]] 버튼을 클릭한 후 `week{X}-{Y}-{purpose}-lab.yaml` 파일을 선택합니다.
8. [[Next]] 버튼을 클릭합니다.
9. **Stack name**에 `week{X}-{Y}-{purpose}-stack`을 입력합니다.
10. **Parameters** 섹션에서 필요한 파라미터를 확인합니다 (대부분 기본값 사용).
11. [[Next]] 버튼을 클릭합니다.
12. **Configure stack options** 페이지에서 기본값을 유지하고 [[Next]] 버튼을 클릭합니다.
13. **Review** 페이지에서 설정을 확인합니다.
14. **Capabilities** 섹션에서 `I acknowledge that AWS CloudFormation might create IAM resources`를 체크합니다.
15. [[Submit]] 버튼을 클릭합니다.
16. 스택 생성이 시작됩니다. 상태가 "CREATE_IN_PROGRESS"로 표시됩니다.

> [!NOTE]
> 스택 생성에 5-7분이 소요됩니다. **Events** 탭에서 생성 과정을 확인할 수 있습니다.
> 대기하는 동안 이전 차시 내용을 복습하거나 다음 태스크를 미리 읽어보세요.

17. 상태가 "CREATE_COMPLETE"로 변경될 때까지 기다립니다.
18. **Outputs** 탭을 선택합니다.
19. 출력값들을 확인하고 메모장에 복사합니다:
    - `VpcId`: VPC ID (예: vpc-0123456789abcdef0)
    - `PublicSubnetId`: 퍼블릭 서브넷 ID (예: subnet-0a1b2c3d4e5f6g7h8)
    - `PrivateSubnetId`: 프라이빗 서브넷 ID (예: subnet-9i8h7g6f5e4d3c2b1)
    - [실습별 추가 출력값]

> [!IMPORTANT]
> 이 출력값들은 다음 태스크에서 사용됩니다. 반드시 메모장에 저장하세요.

✅ **태스크 완료**: 실습 환경이 준비되었습니다.
```

### 11.3 리소스 정리 섹션

**표준 구조**:

```markdown
## 리소스 정리

> [!WARNING]
> 다음 단계를 **반드시 수행**하여 불필요한 비용을 방지하세요.

### CloudFormation 스택 삭제

1. CloudFormation 콘솔로 이동합니다.
2. `week{X}-{Y}-{purpose}-stack` 스택을 선택합니다.
3. [[Delete]] 버튼을 클릭합니다.
4. 확인 창에서 [[Delete]] 버튼을 클릭합니다.
5. 스택 삭제가 완료될 때까지 기다립니다 (2-3분 소요).

> [!NOTE]
> CloudFormation 스택을 삭제하면 태스크 0에서 생성한 모든 리소스(VPC, 서브넷, 보안 그룹 등)가 자동으로 삭제됩니다.

### 추가 리소스 정리 (필요시)

태스크 1-N에서 수동으로 생성한 리소스가 있다면 다음 순서로 삭제합니다:

1. [리소스 1] 삭제
2. [리소스 2] 삭제
3. ...

✅ **실습 종료**: 모든 리소스가 정리되었습니다.
```

### 11.4 기술적 세부사항 검증

**필수 검증 항목**:

- [ ] CIDR 블록이 템플릿과 일치하는가?
- [ ] 포트 번호가 템플릿과 일치하는가?
- [ ] 리소스 이름이 템플릿과 일치하는가?
- [ ] 인스턴스 타입이 템플릿과 일치하는가?
- [ ] 엔진 버전이 템플릿과 일치하는가?
- [ ] 환경 변수가 템플릿과 일치하는가?
- [ ] Outputs 값이 템플릿과 일치하는가?

**검증 방법**:

1. 템플릿에서 모든 기술적 값 추출
2. 가이드에서 동일한 항목 찾기
3. 값이 정확히 일치하는지 확인
4. 불일치 발견 시 가이드를 템플릿에 맞춰 수정

---

## 12. 주요 템플릿 분석 결과

### 12.1 Week 3-1: VPC Endpoint Lab

**파일**: `week3-1-vpc-lab.yaml`
**스택명**: `week3-1-vpc-stack`

**주요 리소스**:

- VPC: 10.0.0.0/16
- 퍼블릭 서브넷: 10.0.1.0/24, 10.0.2.0/24
- 프라이빗 서브넷: 10.0.11.0/24, 10.0.12.0/24
- NAT Gateway: 없음 (VPC Endpoint 사용)
- EC2 인스턴스: t3.micro, Amazon Linux 2023

**특징**:

- VPC Endpoint를 통한 S3 접근 실습
- NAT Gateway 없이 프라이빗 서브넷 구성

### 12.2 Week 3-2: Security Group Lab

**파일**: `week3-2-security-group-lab.yaml`
**스택명**: `week3-2-security-group-stack`

**주요 리소스**:

- VPC: 10.0.0.0/16
- 3-Tier 서브넷 구조 (퍼블릭, 웹, 앱, DB)
- NAT Gateway: 2개 (각 AZ)
- 보안 그룹: ALB-SG, Web-SG, App-SG, DB-SG

**특징**:

- 계층별 보안 그룹 분리
- 보안 그룹 간 참조를 통한 트래픽 제어

### 12.3 Week 5-1: RDS Multi-AZ Lab

**파일**: `week5-1-rds-lab.yaml`
**스택명**: `week5-1-rds-stack`

**주요 리소스**:

- VPC: 10.0.0.0/16
- DB 서브넷 그룹: 2개 AZ
- RDS MySQL: db.t3.micro, Multi-AZ 활성화
- 보안 그룹: DB-SG (포트 3306)

**특징**:

- Multi-AZ 고가용성 구성
- 자동 백업 및 유지보수 윈도우 설정

### 12.4 Week 7-3: EKS Cluster Lab

**파일**: `week7-3-eks-lab.yaml`
**스택명**: `week7-3-eks-stack`

**주요 리소스**:

- VPC: 10.0.0.0/16
- EKS 클러스터: Kubernetes 1.28
- 노드 그룹: t3.medium, 2-4개 노드
- IAM 역할: EKS-ClusterRole, EKS-NodeRole

**특징**:

- EKS 전용 서브넷 태그 설정
- 클러스터 및 노드 그룹 IAM 역할 분리

### 12.5 Week 10-2: ElastiCache Lab

**파일**: `week10-2-elasticache-lab.yaml`
**스택명**: `week10-2-elasticache-stack`

**주요 리소스**:

- VPC: 10.0.0.0/16
- ElastiCache Redis: cache.t3.micro, 엔진 7.0
- 서브넷 그룹: 2개 AZ
- 보안 그룹: Cache-SG (포트 6379)

**특징**:

- Redis 클러스터 구성
- 프라이빗 서브넷에 배치

### 12.6 Week 11-2: Data Lake Lab

**파일**: `week11-2-datalake-lab.yaml`
**스택명**: `week11-2-datalake-stack`

**주요 리소스**:

- S3 버킷: 데이터 레이크 스토리지
- Glue 데이터베이스 및 크롤러
- IAM 역할: Glue-ServiceRole
- Athena 워크그룹

**특징**:

- 서버리스 데이터 분석 인프라
- Glue 크롤러를 통한 자동 스키마 검색

### 12.7 Week 11-3: Data Pipeline Lab

**파일**: `week11-3-data-pipeline-lab.yaml`
**스택명**: `week11-3-data-pipeline-stack`

**주요 리소스**:

- S3 버킷: 원본 및 처리된 데이터
- Lambda 함수: 데이터 처리 (Python 3.11)
- Glue 크롤러 및 데이터베이스
- EventBridge 규칙: S3 이벤트 트리거

**특징**:

- 이벤트 기반 데이터 파이프라인
- Lambda를 통한 자동 데이터 처리

---

## 13. 일반적인 문제 및 해결 방법

### 13.1 스택 생성 실패

**문제**: IAM 권한 부족

```
User is not authorized to perform: iam:CreateRole
```

**해결**:

- `--capabilities CAPABILITY_NAMED_IAM` 플래그 추가
- IAM 역할 생성 권한 확인

**문제**: 리소스 이름 중복

```
Resource with name already exists
```

**해결**:

- `EnvironmentName` Parameter에 고유한 값 사용
- 기존 리소스 삭제 또는 이름 변경

### 13.2 스택 삭제 실패

**문제**: S3 버킷이 비어있지 않음

```
The bucket you tried to delete is not empty
```

**해결**:

```bash
# 버킷 비우기
aws s3 rm s3://bucket-name --recursive

# 스택 재삭제
aws cloudformation delete-stack --stack-name stack-name
```

**문제**: ENI가 사용 중

```
Network interface is currently in use
```

**해결**:

- Lambda, RDS 등의 리소스가 완전히 삭제될 때까지 대기
- 수동으로 ENI 삭제 (필요시)

### 13.3 리소스 접근 불가

**문제**: 보안 그룹 규칙 오류

```
Connection timed out
```

**해결**:

- 보안 그룹 인바운드 규칙 확인
- 소스 IP 또는 보안 그룹 ID 확인
- 포트 번호 확인

**문제**: VPC Endpoint 연결 실패

```
Could not connect to the endpoint URL
```

**해결**:

- 라우팅 테이블에 VPC Endpoint 경로 확인
- 서브넷과 라우팅 테이블 연결 확인
- VPC Endpoint 정책 확인

---

## 14. 베스트 프랙티스

### 14.1 보안

- ✅ 최소 권한 원칙 적용 (IAM 정책)
- ✅ 보안 그룹 규칙 최소화
- ✅ 데이터베이스 비밀번호 NoEcho 설정
- ✅ 프라이빗 서브넷에 민감한 리소스 배치
- ✅ VPC Endpoint 사용 (인터넷 노출 최소화)
- ❌ 0.0.0.0/0 소스 허용 (필요한 경우만)
- ❌ 하드코딩된 비밀번호 사용

### 14.2 비용 최적화

- ✅ t3.micro 인스턴스 사용 (실습용)
- ✅ NAT Gateway 최소화 (비용 절감)
- ✅ RDS 백업 보관 기간 최소화 (7일)
- ✅ 실습 종료 후 즉시 리소스 삭제
- ❌ 프로덕션 인스턴스 타입 사용
- ❌ 불필요한 Multi-AZ 구성

### 14.3 가용성

- ✅ Multi-AZ 구성 (중요 리소스)
- ✅ 2개 이상의 가용 영역 사용
- ✅ 자동 백업 활성화 (RDS)
- ✅ DeletionPolicy 설정 (중요 데이터)
- ❌ Single-AZ 구성 (프로덕션)
- ❌ 백업 없이 운영

### 14.4 유지보수

- ✅ 명확한 리소스 명명 규칙
- ✅ 모든 리소스에 태그 추가
- ✅ Parameters를 통한 유연성 확보
- ✅ Outputs를 통한 정보 공유
- ✅ 주석을 통한 템플릿 문서화
- ❌ 하드코딩된 값 사용
- ❌ 태그 누락

---

## 15. 참고 자료

### 15.1 AWS 공식 문서

- [CloudFormation 사용자 가이드](https://docs.aws.amazon.com/cloudformation/)
- [CloudFormation 템플릿 참조](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-reference.html)
- [CloudFormation 베스트 프랙티스](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/best-practices.html)
- [IAM 정책 참조](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html)
- [VPC 사용자 가이드](https://docs.aws.amazon.com/vpc/latest/userguide/)

### 15.2 도구

- [cfn-lint](https://github.com/aws-cloudformation/cfn-lint) - CloudFormation 템플릿 검증 도구
- [AWS CLI](https://aws.amazon.com/cli/) - AWS 명령줄 인터페이스
- [CloudFormation Designer](https://console.aws.amazon.com/cloudformation/designer) - 시각적 템플릿 편집기

### 15.3 내부 문서

- [실습 가이드 마크다운 작성 가이드](markdown-guide/README.md)
- [Lab Content Verification Methodology](LAB_CONTENT_VERIFICATION_METHODOLOGY.md)
- [종합 검토 시스템](code-review-system.md)

---

**작성일**: 2025-02-14  
**버전**: 1.0.0  
**마지막 업데이트**: 2025-02-14
