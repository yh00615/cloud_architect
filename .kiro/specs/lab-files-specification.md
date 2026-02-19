# 📋 실습 파일 명세 (Lab Files Specification)

**문서 타입**: Specification  
**작성일**: 2025-02-07  
**기준**: `src/data/curriculum.ts` 최종 확정 목록  
**목적**: 실습/데모 가이드에 필요한 파일 목록 및 구조 정의

---

## 📊 전체 현황

**총 실습/데모**: 24개 (curriculum.ts 기준)  
**파일 필요**: 13개  
- CloudFormation 템플릿: 13개
- Lambda 함수 코드: 5개
- CI/CD 설정 파일: 2개
- 샘플 데이터: 2개
- 웹 콘텐츠: 1개

**파일 불필요**: 11개 (콘솔 기반 실습/데모)

---

## 📁 파일 유형별 분류

### 1. CloudFormation 템플릿 (13개)
환경 구축 자동화를 위한 IaC 템플릿

### 2. Lambda 함수 코드 (5개)
실습 가이드 내 CodeView로 포함 + 선택적 다운로드 제공

### 3. CI/CD 설정 파일 (2개)
buildspec.yml, Dockerfile, Kubernetes YAML 등

### 4. 샘플 데이터 (2개)
데이터 레이크 및 분석 실습용

### 5. 웹 콘텐츠 (1개)
CloudFront 데모용 정적 웹사이트

---

## 🔴 우선순위 1: 필수 (즉시 작성) - 6개

### 1. Week 3-1: Amazon VPC 생성 및 엔드포인트 연결 (실습)
**파일명**: `week3-1-vpc-endpoint-lab.zip`  
**템플릿명**: `week3-1-vpc-endpoint-lab.yaml`

**현재 문제**:
- 10개 태스크 (VPC 생성부터 검증까지)
- 환경 구축에 6개 태스크 소비

**생성 리소스**:
- VPC (10.0.0.0/16)
- Public Subnet A/C (ap-northeast-2a/c)
- Private Subnet A/C (ap-northeast-2a/c)
- Internet Gateway
- NAT Gateway + Elastic IP
- Route Tables (Public, Private)
- EC2 Instance (테스트용, Private Subnet)
- IAM Role (EC2 Instance Profile)

**Outputs**:
```yaml
Outputs:
  VpcId:
    Description: VPC ID
    Value: !Ref VPC
  PublicSubnetAId:
    Description: Public Subnet A ID
    Value: !Ref PublicSubnetA
  PublicSubnetCId:
    Description: Public Subnet C ID
    Value: !Ref PublicSubnetC
  PrivateSubnetAId:
    Description: Private Subnet A ID
    Value: !Ref PrivateSubnetA
  PrivateSubnetCId:
    Description: Private Subnet C ID
    Value: !Ref PrivateSubnetC
  EC2InstanceId:
    Description: Test EC2 Instance ID
    Value: !Ref TestEC2Instance
  EC2PrivateIP:
    Description: EC2 Private IP Address
    Value: !GetAtt TestEC2Instance.PrivateIp
```

**개선 효과**: 10개 태스크 → 3-4개 태스크

---

### 2. Week 3-2: 3-tier 아키텍처 보안 그룹 구성 (실습)
**파일명**: `week3-2-security-group-lab.zip`  
**템플릿명**: `week3-2-security-group-lab.yaml`

**생성 리소스**:
- VPC (10.0.0.0/16)
- Public Subnets (2개)
- Private Subnets (4개 - App, DB 각 2개)
- Internet Gateway + NAT Gateway
- Route Tables
- Bastion Host Security Group (기본 규칙)
- Web Tier Security Group (기본 규칙)
- App Tier Security Group (기본 규칙)
- DB Tier Security Group (기본 규칙)

**Outputs**:
```yaml
Outputs:
  VpcId:
    Value: !Ref VPC
  BastionSGId:
    Value: !Ref BastionSecurityGroup
  WebSGId:
    Value: !Ref WebSecurityGroup
  AppSGId:
    Value: !Ref AppSecurityGroup
  DBSGId:
    Value: !Ref DBSecurityGroup
```

**개선 효과**: 보안 그룹 규칙 설정에 집중 가능

---

### 3. Week 4-3: Amazon EventBridge 기반 주문 처리 시스템 (실습)
**파일명**: `week4-3-serverless-api-lab.zip`  
**템플릿명**: `week4-3-serverless-api-lab.yaml`

**생성 리소스**:
- DynamoDB Table (Orders)
- DynamoDB Table (Inventory)
- Lambda Execution Role (DynamoDB + EventBridge 권한)
- EventBridge Event Bus
- CloudWatch Logs Groups

**Outputs**:
```yaml
Outputs:
  OrdersTableName:
    Value: !Ref OrdersTable
  InventoryTableName:
    Value: !Ref InventoryTable
  LambdaExecutionRoleArn:
    Value: !GetAtt LambdaExecutionRole.Arn
  EventBusName:
    Value: !Ref OrderEventBus
```

**개선 효과**: DynamoDB 테이블 자동 생성, Lambda 역할 준비

---

### 4. Week 5-3: Amazon DynamoDB 테이블 설계 및 GSI 생성 (실습)
**파일명**: `week5-3-dynamodb-lab.zip`  
**템플릿명**: `week5-3-dynamodb-lab.yaml`

**생성 리소스**:
- VPC (10.0.0.0/16)
- Private Subnet A/C
- VPC Endpoint (DynamoDB Gateway)
- EC2 Instance (Python boto3 설치)
- IAM Role (DynamoDB 접근 권한)
- Security Group

**Outputs**:
```yaml
Outputs:
  VpcId:
    Value: !Ref VPC
  EC2InstanceId:
    Value: !Ref TestEC2Instance
  IAMRoleArn:
    Value: !GetAtt DynamoDBAccessRole.Arn
  VPCEndpointId:
    Value: !Ref DynamoDBVPCEndpoint
```

**개선 효과**: VPC Endpoint 및 EC2 환경 자동 구축

---

### 5. Week 7-3: Amazon EKS 클러스터 생성과 kubectl 기본 명령 (실습)
**파일명**: `week7-3-eks-cluster-lab.zip`  
**템플릿명**: `week7-3-eks-cluster-lab.yaml`

**생성 리소스**:
- VPC (10.0.0.0/16)
- Public/Private Subnets (4개)
- Internet Gateway + NAT Gateway
- EKS Cluster
- EKS Node Group (t3.medium, 2-3 nodes)
- IAM Roles (Cluster, NodeGroup)
- Security Groups

**Outputs**:
```yaml
Outputs:
  VpcId:
    Value: !Ref VPC
  EKSClusterName:
    Value: !Ref EKSCluster
  EKSClusterEndpoint:
    Value: !GetAtt EKSCluster.Endpoint
  NodeGroupName:
    Value: !Ref EKSNodeGroup
  KubeconfigCommand:
    Description: Command to update kubeconfig
    Value: !Sub 'aws eks update-kubeconfig --name ${EKSCluster} --region ${AWS::Region}'
```

**개선 효과**: EKS 클러스터 생성 자동화 (15-20분 소요 단축)

---

### 6. Week 9-3: AWS CodePipeline으로 Amazon EKS 배포 자동화 (실습)
**파일명**: `week9-3-eks-cicd-lab.zip`  
**템플릿명**: `week9-3-eks-cicd-lab.yaml`

**생성 리소스**:
- VPC 환경 (Week 7과 동일)
- EKS Cluster
- ECR Repository
- CodeCommit Repository
- CodeBuild Project (기본 설정)
- CodePipeline (기본 설정)
- IAM Roles (CodeBuild, CodePipeline, EKS)
- S3 Bucket (Artifact Store)

**Outputs**:
```yaml
Outputs:
  CodeCommitRepositoryUrl:
    Value: !GetAtt CodeCommitRepo.CloneUrlHttp
  ECRRepositoryUri:
    Value: !GetAtt ECRRepository.RepositoryUri
  CodeBuildProjectName:
    Value: !Ref CodeBuildProject
  CodePipelineName:
    Value: !Ref CodePipeline
  EKSClusterName:
    Value: !Ref EKSCluster
```

**개선 효과**: CI/CD 파이프라인 기본 구조 자동 생성

---

## 🟠 우선순위 2: 중요 (다음 단계) - 4개

### 7. Week 5-1: Amazon RDS Multi-AZ 장애 조치 시뮬레이션 (데모)
**파일명**: `week5-1-rds-multi-az-demo.zip`  
**템플릿명**: `week5-1-rds-multi-az-demo.yaml`

**생성 리소스**:
- VPC (10.0.0.0/16)
- Private Subnet A/C
- DB Subnet Group
- RDS Security Group
- EC2 Instance (MySQL 클라이언트)
- EC2 Security Group
- IAM Role (EC2 Instance Profile)

**Outputs**:
```yaml
Outputs:
  VpcId:
    Value: !Ref VPC
  DBSubnetGroupName:
    Value: !Ref DBSubnetGroup
  RDSSecurityGroupId:
    Value: !Ref RDSSecurityGroup
  EC2InstanceId:
    Value: !Ref TestEC2Instance
  EC2PublicIP:
    Value: !GetAtt TestEC2Instance.PublicIp
```

**개선 효과**: 7개 태스크 → 3-4개 태스크

---

### 8. Week 10-2: Amazon ElastiCache로 API 응답 캐싱 구현 (실습)
**파일명**: `week10-2-elasticache-lab.zip`  
**템플릿명**: `week10-2-elasticache-lab.yaml`

**생성 리소스**:
- VPC (10.0.0.0/16)
- Private Subnets (2개)
- ElastiCache Subnet Group
- ElastiCache Security Group
- EC2 Instance (Redis CLI 설치)
- Lambda Function (API 예시)
- API Gateway (기본 설정)
- IAM Roles

**Outputs**:
```yaml
Outputs:
  VpcId:
    Value: !Ref VPC
  ElastiCacheSubnetGroupName:
    Value: !Ref ElastiCacheSubnetGroup
  ElastiCacheSecurityGroupId:
    Value: !Ref ElastiCacheSecurityGroup
  EC2InstanceId:
    Value: !Ref TestEC2Instance
  LambdaFunctionArn:
    Value: !GetAtt APIFunction.Arn
  APIGatewayUrl:
    Value: !Sub 'https://${APIGateway}.execute-api.${AWS::Region}.amazonaws.com/prod'
```

**개선 효과**: 네트워크 환경 및 Lambda 자동 구축

---

### 9. Week 11-2: AWS Glue Crawler 설정 및 Amazon Athena 쿼리 (실습)
**파일명**: `week11-2-datalake-lab.zip`  
**템플릿명**: `week11-2-datalake-lab.yaml`

**생성 리소스**:
- S3 Bucket (Raw Data) - 고유 이름 자동 생성
- S3 Bucket (Processed Data) - 고유 이름 자동 생성
- S3 Bucket (Athena Query Results) - 고유 이름 자동 생성
- Glue Database - 고유 이름 자동 생성
- Glue Crawler (기본 설정)
- IAM Role (Glue Service Role)
- 샘플 데이터 업로드 (Lambda Custom Resource)

**리소스 이름 충돌 방지 전략**:
```yaml
# 방법 1: AWS::AccountId + AWS::StackName 조합 (권장)
RawDataBucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: !Sub 'week11-raw-data-${AWS::AccountId}-${AWS::StackName}'

# 방법 2: 타임스탬프 파라미터 사용
Parameters:
  StudentId:
    Type: String
    Description: 학번 또는 고유 식별자 (예: 20240001)
    AllowedPattern: '^[a-z0-9-]+$'

RawDataBucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: !Sub 'week11-raw-data-${StudentId}-${AWS::Region}'

# 방법 3: 자동 생성 (가장 간단, 권장)
RawDataBucket:
  Type: AWS::S3::Bucket
  # BucketName 생략 시 CloudFormation이 고유 이름 자동 생성
  # 예: week11-2-lab-stack-rawdatabucket-abc123def456
```

**Outputs**:
```yaml
Outputs:
  RawDataBucketName:
    Description: Raw Data S3 Bucket Name
    Value: !Ref RawDataBucket
  ProcessedDataBucketName:
    Description: Processed Data S3 Bucket Name
    Value: !Ref ProcessedDataBucket
  QueryResultsBucketName:
    Description: Athena Query Results S3 Bucket Name
    Value: !Ref QueryResultsBucket
  GlueDatabaseName:
    Description: Glue Database Name
    Value: !Ref GlueDatabase
  GlueCrawlerName:
    Description: Glue Crawler Name
    Value: !Ref GlueCrawler
```

**샘플 데이터 제공 방법**:
```yaml
# Lambda Custom Resource로 샘플 데이터 자동 업로드
SampleDataUploader:
  Type: Custom::S3Uploader
  Properties:
    ServiceToken: !GetAtt UploadFunction.Arn
    SourceBucket: 'aws-tc-largeobjects'  # AWS Training 공개 버킷
    SourceKey: 'sample-data/customer-churn.csv'
    DestinationBucket: !Ref RawDataBucket
    DestinationKey: 'raw/customer-churn.csv'
```

**개선 효과**: 데이터 레이크 환경 자동 구축, 이름 충돌 방지

---

### 10. Week 11-3: AWS Glue를 활용한 데이터 파이프라인 구축 (실습)
**파일명**: `week11-3-data-pipeline-lab.zip`  
**템플릿명**: `week11-3-data-pipeline-lab.yaml`

**생성 리소스**:
- S3 Buckets (Data, Scripts, Temp)
- Glue Database
- Glue Crawler
- Glue Job (기본 설정)
- Lambda Function (트리거)
- IAM Roles
- EventBridge Rule

**Outputs**:
```yaml
Outputs:
  DataBucketName:
    Value: !Ref DataBucket
  ScriptsBucketName:
    Value: !Ref ScriptsBucket
  GlueDatabaseName:
    Value: !Ref GlueDatabase
  GlueJobName:
    Value: !Ref GlueJob
  LambdaFunctionArn:
    Value: !GetAtt TriggerFunction.Arn
```

**개선 효과**: Glue ETL 환경 자동 구축

---

## 🟡 우선순위 3: 선택사항 (필요 시) - 3개

### 11. Week 10-3: Amazon CloudFront Functions로 엣지 로케이션 처리 (데모)
**파일명**: `week10-3-cloudfront-demo.zip` (현재 있음)  
**템플릿명**: `week10-3-cloudfront-demo.yaml` (선택사항)

**생성 리소스**:
- S3 Bucket (비공개)
- S3 Bucket Policy (CloudFront OAC)
- 샘플 HTML 파일 업로드 (Lambda Custom Resource)

**Outputs**:
```yaml
Outputs:
  S3BucketName:
    Value: !Ref OriginBucket
  S3BucketArn:
    Value: !GetAtt OriginBucket.Arn
```

**개선 효과**: 최소한, S3 버킷 생성 자동화

---

### 12. Week 12-1: AWS Systems Manager Parameter Store 활용 (실습)
**파일명**: `week12-1-parameter-store-lab.zip`  
**템플릿명**: `week12-1-parameter-store-lab.yaml` (선택사항)

**생성 리소스**:
- VPC 환경
- RDS Instance (MySQL)
- Parameter Store Parameters (기본값)
- Lambda Function (Parameter 사용 예시)
- IAM Roles

**Outputs**:
```yaml
Outputs:
  ParameterNames:
    Value: !Join [',', [!Ref DBEndpointParameter, !Ref DBPasswordParameter]]
  RDSEndpoint:
    Value: !GetAtt RDSInstance.Endpoint.Address
  LambdaFunctionArn:
    Value: !GetAtt ParameterFunction.Arn
```

**개선 효과**: RDS 및 Parameter 자동 생성

---

### 13. Week 13-2: AWS X-Ray로 AWS Lambda 성능 분석 (데모)
**파일명**: `week13-2-xray-monitoring-demo.zip`  
**템플릿명**: `week13-2-xray-monitoring-demo.yaml` (선택사항)

**생성 리소스**:
- Lambda Functions (X-Ray 활성화)
- API Gateway
- DynamoDB Table
- X-Ray Sampling Rules
- CloudWatch Alarms
- IAM Roles

**Outputs**:
```yaml
Outputs:
  LambdaFunctionArns:
    Value: !Join [',', [!GetAtt Function1.Arn, !GetAtt Function2.Arn]]
  APIGatewayUrl:
    Value: !Sub 'https://${APIGateway}.execute-api.${AWS::Region}.amazonaws.com/prod'
  DynamoDBTableName:
    Value: !Ref DynamoDBTable
```

**개선 효과**: X-Ray 추적 환경 자동 구축

---

## ⚪ 템플릿 불필요 - 11개

### 콘솔 기반 실습/데모 (템플릿 불필요)
1. **Week 1-2**: AWS Well-Architected Tool 워크로드 평가 (데모) - 콘솔 사용
2. **Week 1-3**: draw.io로 HA 아키텍처 다이어그램 작성 (실습) - 로컬 도구
3. **Week 2-1**: MFA 기반 AWS IAM 정책 구성 (실습) - IAM 콘솔
4. **Week 2-2**: AWS IAM 역할 전환 (실습) - IAM 콘솔
5. **Week 4-2**: 서버리스 API 구축 및 인증 구성 (실습) - Lambda + API Gateway 콘솔
6. **Week 6-2**: Amazon VPC CloudFormation 템플릿 작성 (실습) - 학생이 직접 작성
7. **Week 9-2**: AWS CodeBuild로 컨테이너 이미지 빌드 (실습) - 콘솔
8. **Week 12-2**: AWS Config 규칙 생성 및 모니터링 (데모) - 콘솔
9. **Week 12-3**: Amazon GuardDuty와 AWS Lambda 자동 대응 (데모) - 콘솔
10. **Week 13-3**: Container Insights로 Amazon EKS 모니터링 (실습) - 콘솔
11. **Week 14-2**: Amazon Bedrock Knowledge Bases 기반 RAG 구현 (데모) - 콘솔

---

## 📊 템플릿 작성 우선순위 요약

### 🔴 필수 (즉시 작성) - 6개
1. **Week 3-1**: VPC 3-Tier 환경 ⭐ 최우선
2. **Week 3-2**: 보안 그룹 환경
3. **Week 4-3**: EventBridge 주문 시스템 환경
4. **Week 5-3**: DynamoDB VPC 환경
5. **Week 7-3**: EKS 클러스터 환경
6. **Week 9-3**: EKS CI/CD 환경

### 🟠 중요 (다음 단계) - 4개
7. **Week 5-1**: RDS Multi-AZ 환경
8. **Week 10-2**: ElastiCache 환경
9. **Week 11-2**: 데이터 레이크 환경
10. **Week 11-3**: Glue 파이프라인 환경

### 🟡 선택사항 (필요 시) - 3개
11. **Week 10-3**: CloudFront S3 환경
12. **Week 12-1**: Parameter Store 환경
13. **Week 13-2**: X-Ray 모니터링 환경

---

## 🎯 템플릿 작성 순서 제안

### Phase 1: 네트워크 기반 (1주)
1. **Week 3-1**: VPC 3-Tier 환경 (가장 복잡, 최우선)
2. **Week 3-2**: 보안 그룹 환경

### Phase 2: 서버리스 및 데이터베이스 (1주)
3. **Week 4-3**: EventBridge 주문 시스템 환경
4. **Week 5-1**: RDS Multi-AZ 환경
5. **Week 5-3**: DynamoDB VPC 환경

### Phase 3: 컨테이너 (1주)
6. **Week 7-3**: EKS 클러스터 환경
7. **Week 9-3**: EKS CI/CD 환경

### Phase 4: 데이터 파이프라인 (1주)
8. **Week 10-2**: ElastiCache 환경
9. **Week 11-2**: 데이터 레이크 환경
10. **Week 11-3**: Glue 파이프라인 환경

### Phase 5: 기타 (선택사항)
11. Week 10-3: CloudFront S3 환경
12. Week 12-1: Parameter Store 환경
13. Week 13-2: X-Ray 모니터링 환경

---

## 📝 템플릿 작성 표준

### 파일 구조
```
public/files/weekX/
├── weekX-Y-lab-name.zip
│   ├── cloudformation-template.yaml
│   ├── README.md
│   └── [기타 실습 파일들]
```

### CloudFormation 템플릿 표준
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Week X-Y: [실습명] 환경 구축'

Parameters:
  EnvironmentName:
    Type: String
    Default: 'weekX-Y-lab'
    Description: 환경 이름 (리소스 태그에 사용)

Resources:
  # 리소스 정의

Outputs:
  # 출력값 (학생이 복사해야 할 값들)
```

---

## 🔐 리소스 이름 충돌 방지 전략

### 문제 상황
여러 학생이 동시에 같은 AWS 계정에서 실습할 때 리소스 이름이 충돌할 수 있습니다.

**충돌 가능한 리소스**:
- S3 Bucket (전역적으로 고유해야 함)
- Glue Database
- ECR Repository
- CodeCommit Repository
- DynamoDB Table (같은 리전 내)

### 해결 방법

#### 방법 1: 자동 생성 (가장 간단, 권장)
```yaml
# BucketName을 명시하지 않으면 CloudFormation이 고유 이름 자동 생성
RawDataBucket:
  Type: AWS::S3::Bucket
  Properties:
    Tags:
      - Key: Purpose
        Value: Week11-RawData

# 생성 예시: week11-2-lab-stack-rawdatabucket-abc123def456
```

**장점**:
- ✅ 100% 충돌 방지
- ✅ 학생이 신경 쓸 필요 없음
- ✅ 스택 삭제 시 자동 정리

**단점**:
- ❌ 버킷 이름이 예측 불가능
- ❌ 실습 가이드에서 정확한 이름 명시 불가

**해결**: Outputs에서 생성된 이름을 출력하여 학생이 복사하도록 안내

#### 방법 2: AWS::AccountId + AWS::StackName 조합 (권장)
```yaml
RawDataBucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: !Sub 'week11-raw-data-${AWS::AccountId}-${AWS::StackName}'
    # 예: week11-raw-data-123456789012-week11-2-lab-stack

ProcessedDataBucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: !Sub 'week11-processed-data-${AWS::AccountId}-${AWS::StackName}'

QueryResultsBucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: !Sub 'week11-query-results-${AWS::AccountId}-${AWS::StackName}'
```

**장점**:
- ✅ 예측 가능한 이름 패턴
- ✅ 계정 ID로 고유성 보장
- ✅ 스택 이름으로 추가 구분

**단점**:
- ⚠️ 스택 이름이 같으면 충돌 가능 (학생에게 고유한 스택 이름 사용 안내 필요)

#### 방법 3: 학번/학생 ID 파라미터 (교육 환경에 최적)
```yaml
Parameters:
  StudentId:
    Type: String
    Description: 학번 또는 고유 식별자 (예: 20240001, student01)
    AllowedPattern: '^[a-z0-9-]+$'
    MinLength: 5
    MaxLength: 20
    ConstraintDescription: 소문자, 숫자, 하이픈만 사용 가능 (5-20자)

Resources:
  RawDataBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'week11-raw-data-${StudentId}-${AWS::Region}'
      # 예: week11-raw-data-20240001-ap-northeast-2

  GlueDatabase:
    Type: AWS::Glue::Database
    Properties:
      CatalogId: !Ref AWS::AccountId
      DatabaseInput:
        Name: !Sub 'week11_database_${StudentId}'
        # 예: week11_database_20240001
```

**장점**:
- ✅ 학생별로 명확히 구분
- ✅ 예측 가능한 이름
- ✅ 교수가 학생별 리소스 추적 가능

**단점**:
- ⚠️ 학생이 파라미터 입력 필요
- ⚠️ 학번 입력 실수 가능성

**실습 가이드 작성 예시**:
```markdown
## 태스크 0: 실습 환경 구축

1. CloudFormation 콘솔로 이동합니다.
2. [[Create stack]] 버튼을 클릭합니다.
3. **Template is ready**를 선택합니다.
4. **Upload a template file**을 선택하고 `week11-2-datalake-lab.yaml` 파일을 업로드합니다.
5. [[Next]] 버튼을 클릭합니다.
6. **Stack name**에 `week11-2-lab-학번`을 입력합니다 (예: `week11-2-lab-20240001`).
7. **StudentId**에 본인의 학번을 입력합니다 (예: `20240001`).

> [!IMPORTANT]
> StudentId는 소문자, 숫자, 하이픈(-)만 사용 가능하며, 5-20자여야 합니다.
> 학번이 대문자를 포함하면 소문자로 변환하여 입력하세요.
```

#### 방법 4: 타임스탬프 조합 (간단하지만 덜 권장)
```yaml
Parameters:
  Timestamp:
    Type: String
    Default: '20250207-143000'
    Description: 타임스탬프 (YYYYMMDD-HHMMSS)

Resources:
  RawDataBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'week11-raw-data-${Timestamp}'
```

**단점**:
- ❌ 학생이 매번 타임스탬프 입력 필요
- ❌ 실수 가능성 높음

### 권장 전략 (실습별)

#### 단일 계정, 여러 학생 (일반적인 대학 환경)
**권장**: 방법 3 (학번 파라미터) 또는 방법 2 (AccountId + StackName)

```yaml
Parameters:
  StudentId:
    Type: String
    Description: 학번 (예: 20240001)
    AllowedPattern: '^[a-z0-9-]+$'

Resources:
  RawDataBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'week11-raw-${StudentId}-${AWS::Region}'
```

#### 학생별 개별 계정 (AWS Academy 환경)
**권장**: 방법 1 (자동 생성) 또는 방법 2 (AccountId + StackName)

```yaml
# 자동 생성 (가장 간단)
RawDataBucket:
  Type: AWS::S3::Bucket

# 또는 AccountId 사용
RawDataBucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: !Sub 'week11-raw-data-${AWS::AccountId}'
```

#### 데모 환경 (교수 시연용)
**권장**: 고정된 이름 사용 가능

```yaml
RawDataBucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: 'week11-demo-raw-data-professor'
```

### 샘플 데이터 제공 방법

#### 방법 1: Lambda Custom Resource로 자동 업로드 (권장)
```yaml
# Lambda 함수로 공개 S3에서 샘플 데이터 복사
SampleDataUploader:
  Type: AWS::Lambda::Function
  Properties:
    Runtime: python3.11
    Handler: index.handler
    Code:
      ZipFile: |
        import boto3
        import cfnresponse
        
        def handler(event, context):
            s3 = boto3.client('s3')
            try:
                if event['RequestType'] == 'Create':
                    # 공개 버킷에서 샘플 데이터 복사
                    s3.copy_object(
                        CopySource={'Bucket': 'aws-tc-largeobjects', 'Key': 'sample-data.csv'},
                        Bucket=event['ResourceProperties']['DestBucket'],
                        Key='raw/sample-data.csv'
                    )
                cfnresponse.send(event, context, cfnresponse.SUCCESS, {})
            except Exception as e:
                cfnresponse.send(event, context, cfnresponse.FAILED, {'Error': str(e)})

UploadSampleData:
  Type: Custom::S3Upload
  Properties:
    ServiceToken: !GetAtt SampleDataUploader.Arn
    DestBucket: !Ref RawDataBucket
```

#### 방법 2: 실습 ZIP 파일에 포함
```
week11-2-datalake-lab.zip
├── cloudformation-template.yaml
├── sample-data/
│   ├── customer-churn.csv
│   ├── sales-data.json
│   └── README.md
└── README.md
```

**실습 가이드**:
```markdown
## 태스크 1: 샘플 데이터 업로드

1. 다운로드한 ZIP 파일의 압축을 해제합니다.
2. `sample-data` 폴더를 확인합니다.
3. S3 콘솔에서 Raw Data 버킷을 선택합니다.
4. [[Upload]] 버튼을 클릭합니다.
5. `customer-churn.csv` 파일을 드래그하여 업로드합니다.
```

#### 방법 3: 공개 S3 버킷 링크 제공
```markdown
## 태스크 1: 샘플 데이터 다운로드

1. 다음 링크에서 샘플 데이터를 다운로드합니다:
   - [customer-churn.csv](https://aws-tc-largeobjects.s3.amazonaws.com/sample-data/customer-churn.csv)
2. S3 콘솔에서 Raw Data 버킷에 업로드합니다.
```

### 최종 권장 조합

**Week 11-2 실습 템플릿**:
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Week 11-2: AWS Glue Crawler 및 Amazon Athena 쿼리 실습 환경'

Parameters:
  StudentId:
    Type: String
    Description: 학번 또는 고유 식별자 (소문자, 숫자, 하이픈만 사용)
    AllowedPattern: '^[a-z0-9-]+$'
    MinLength: 5
    MaxLength: 20
    ConstraintDescription: 소문자, 숫자, 하이픈만 사용 가능 (5-20자)

Resources:
  # S3 버킷 - 학번으로 고유성 보장
  RawDataBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'week11-raw-${StudentId}-${AWS::Region}'
      
  ProcessedDataBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'week11-processed-${StudentId}-${AWS::Region}'
      
  QueryResultsBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'week11-query-${StudentId}-${AWS::Region}'

  # Glue Database - 학번으로 고유성 보장
  GlueDatabase:
    Type: AWS::Glue::Database
    Properties:
      CatalogId: !Ref AWS::AccountId
      DatabaseInput:
        Name: !Sub 'week11_db_${StudentId}'

Outputs:
  RawDataBucketName:
    Description: Raw Data S3 Bucket Name
    Value: !Ref RawDataBucket
  ProcessedDataBucketName:
    Description: Processed Data S3 Bucket Name
    Value: !Ref ProcessedDataBucket
  QueryResultsBucketName:
    Description: Athena Query Results S3 Bucket Name
    Value: !Ref QueryResultsBucket
  GlueDatabaseName:
    Description: Glue Database Name
    Value: !Ref GlueDatabase
```

이 방식으로 여러 학생이 동시에 실습해도 리소스 이름 충돌이 발생하지 않습니다!

---

## � 추가 파일 필요 목록 (YAML 외)

### 데이터 파일이 필요한 실습/데모

#### 1. Week 11-2: AWS Glue Crawler 및 Athena 쿼리 (실습)
**필요 파일**:
- `sample-data/customer-churn.csv` - 고객 이탈 데이터 (1,000-10,000 rows)
- `sample-data/sales-data.json` - 판매 데이터 (JSON Lines 형식)
- `sample-data/README.md` - 데이터 스키마 설명

**데이터 구조 예시**:
```csv
# customer-churn.csv
customer_id,age,gender,tenure,monthly_charges,total_charges,churn
C001,45,Male,24,79.99,1919.76,No
C002,32,Female,12,89.99,1079.88,Yes
```

```json
# sales-data.json (JSON Lines)
{"order_id": "O001", "customer_id": "C001", "product": "Laptop", "amount": 1299.99, "date": "2024-01-15"}
{"order_id": "O002", "customer_id": "C002", "product": "Mouse", "amount": 29.99, "date": "2024-01-16"}
```

---

#### 2. Week 11-3: AWS Glue 데이터 파이프라인 (실습)
**필요 파일**:
- `sample-data/raw-transactions.csv` - 원본 거래 데이터
- `scripts/glue-etl-script.py` - Glue ETL 스크립트 (학생이 수정)
- `scripts/README.md` - 스크립트 사용 안내

**데이터 구조 예시**:
```csv
# raw-transactions.csv
transaction_id,timestamp,customer_id,product_id,quantity,price,status
T001,2024-01-15 10:30:00,C001,P100,2,49.99,completed
T002,2024-01-15 11:45:00,C002,P101,1,99.99,pending
```

**Glue ETL 스크립트 예시**:
```python
# glue-etl-script.py
import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

args = getResolvedOptions(sys.argv, ['JOB_NAME'])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

# 데이터 읽기
datasource0 = glueContext.create_dynamic_frame.from_catalog(
    database = "week11_db",
    table_name = "raw_transactions"
)

# 데이터 변환 (학생이 수정할 부분)
# TODO: 날짜 파싱, 필터링, 집계 등

# 데이터 쓰기
glueContext.write_dynamic_frame.from_options(
    frame = datasource0,
    connection_type = "s3",
    connection_options = {"path": "s3://bucket/processed/"},
    format = "parquet"
)

job.commit()
```

---

### Lambda 함수 코드가 필요한 실습/데모

#### 3. Week 4-2: 서버리스 API 구축 (실습)
**필요 파일**:
- `lambda/todo-api.py` - Lambda 함수 코드
- `lambda/requirements.txt` - Python 패키지 의존성
- `lambda/README.md` - 함수 설명

**실제 파일명**: `week4-2-serverless-api-lab.zip` (curriculum.ts 기준)

**Lambda 함수 예시**:
```python
# lambda/todo-api.py
import json
import boto3
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('TodoTable')

def lambda_handler(event, context):
    http_method = event['httpMethod']
    
    if http_method == 'GET':
        response = table.scan()
        return {
            'statusCode': 200,
            'body': json.dumps(response['Items'])
        }
    
    elif http_method == 'POST':
        body = json.loads(event['body'])
        item = {
            'id': str(datetime.now().timestamp()),
            'title': body['title'],
            'completed': False
        }
        table.put_item(Item=item)
        return {
            'statusCode': 201,
            'body': json.dumps(item)
        }
```

---

#### 4. Week 4-3: EventBridge 주문 처리 시스템 (실습)
**필요 파일**:
- `lambda/order-processor.py` - 주문 처리 Lambda
- `lambda/inventory-checker.py` - 재고 확인 Lambda
- `lambda/notification-sender.py` - 알림 발송 Lambda
- `test-events/order-event.json` - 테스트 이벤트

**테스트 이벤트 예시**:
```json
# test-events/order-event.json
{
  "detail-type": "Order Placed",
  "source": "order.service",
  "detail": {
    "orderId": "ORD-001",
    "customerId": "C001",
    "items": [
      {"productId": "P100", "quantity": 2}
    ],
    "totalAmount": 99.98
  }
}
```

---

#### 5. Week 10-2: ElastiCache API 캐싱 (실습)
**필요 파일**:
- `lambda/api-with-cache.py` - 캐싱 로직 포함 Lambda
- `lambda/cache-warmer.py` - 캐시 워밍 Lambda
- `lambda/requirements.txt` - redis 패키지 포함

**Lambda 함수 예시**:
```python
# lambda/api-with-cache.py
import json
import redis
import boto3

# ElastiCache 연결
redis_client = redis.Redis(
    host='your-elasticache-endpoint',
    port=6379,
    decode_responses=True
)

def lambda_handler(event, context):
    cache_key = f"user:{event['pathParameters']['userId']}"
    
    # 캐시 확인
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return {
            'statusCode': 200,
            'body': cached_data,
            'headers': {'X-Cache': 'HIT'}
        }
    
    # 캐시 미스 - DB 조회
    # ... DB 조회 로직
    
    # 캐시 저장 (TTL 300초)
    redis_client.setex(cache_key, 300, json.dumps(data))
    
    return {
        'statusCode': 200,
        'body': json.dumps(data),
        'headers': {'X-Cache': 'MISS'}
    }
```

---

### 설정 파일이 필요한 실습/데모

#### 6. Week 9-2: CodeBuild 컨테이너 빌드 (실습)
**필요 파일**:
- `buildspec.yml` - CodeBuild 빌드 스펙
- `Dockerfile` - 컨테이너 이미지 정의
- `app/app.py` - 샘플 애플리케이션
- `app/requirements.txt` - Python 의존성

**실제 파일명**: `week9-2-codebuild-lab.zip` (curriculum.ts 기준)

**buildspec.yml 예시**:
```yaml
# buildspec.yml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
  build:
    commands:
      - echo Build started on `date`
      - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG
  post_build:
    commands:
      - echo Build completed on `date`
      - docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG
```

**Dockerfile 예시**:
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 8080

CMD ["python", "app.py"]
```

---

#### 7. Week 9-3: CodePipeline EKS 배포 (실습)
**필요 파일**:
- `buildspec.yml` - CodeBuild 빌드 스펙
- `kubernetes/deployment.yaml` - Kubernetes Deployment
- `kubernetes/service.yaml` - Kubernetes Service
- `Dockerfile` - 컨테이너 이미지
- `app/app.py` - 샘플 애플리케이션

**실제 파일명**: `week9-3-eks-cicd-lab.zip` (curriculum.ts 기준)

**Kubernetes Deployment 예시**:
```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sample-app
  template:
    metadata:
      labels:
        app: sample-app
    spec:
      containers:
      - name: sample-app
        image: ${ECR_REPOSITORY_URI}:${IMAGE_TAG}
        ports:
        - containerPort: 8080
```

---

#### 8. Week 12-1: Parameter Store 활용 (실습)
**필요 파일**:
- `lambda/parameter-reader.py` - Parameter Store 읽기 Lambda
- `config/parameters.json` - 파라미터 정의 (참고용)

**파라미터 정의 예시**:
```json
# config/parameters.json (참고용)
{
  "parameters": [
    {
      "name": "/week12/db/endpoint",
      "value": "database.example.com",
      "type": "String"
    },
    {
      "name": "/week12/db/password",
      "value": "SecurePassword123!",
      "type": "SecureString"
    }
  ]
}
```

---

### 웹 콘텐츠가 필요한 데모

#### 9. Week 10-3: CloudFront Functions (데모)
**필요 파일** (현재 있음):
- `index.html` - 메인 페이지
- `about.html` - 소개 페이지
- `style.css` - 스타일시트
- `script.js` - JavaScript
- `images/logo.png` - 로고 이미지

---

#### 10. Week 14-2: Bedrock Knowledge Bases RAG (데모)
**필요 파일**:
- `documents/aws-faq.txt` - AWS FAQ 문서
- `documents/product-manual.pdf` - 제품 매뉴얼
- `documents/README.md` - 문서 설명

---

## 📋 파일 준비 우선순위

### 🔴 필수 (즉시 작성) - 6개

1. **Week 11-2**: 샘플 데이터 (CSV, JSON) - `week11-2-datalake-lab.zip`
2. **Week 11-3**: 샘플 데이터 + Glue ETL 스크립트 - `week11-3-data-pipeline-lab.zip`
3. **Week 4-3**: Lambda 함수 코드 (3개) + 테스트 이벤트 - `week4-3-serverless-api-lab.zip`
4. **Week 9-3**: buildspec.yml + Kubernetes YAML + Dockerfile - `week9-3-eks-cicd-lab.zip`
5. **Week 10-2**: Lambda 함수 코드 (캐싱 로직) - `week10-2-elasticache-lab.zip`
6. **Week 4-2**: Lambda 함수 코드 (TODO API) - `week4-2-serverless-api-lab.zip`

### 🟠 중요 (다음 단계) - 3개

7. **Week 9-2**: buildspec.yml + Dockerfile + 샘플 앱 - `week9-2-codebuild-lab.zip`
8. **Week 12-1**: Lambda 함수 코드 + 파라미터 정의 - `week12-1-parameter-store-lab.zip`
9. **Week 14-2**: 문서 파일 (RAG용) - `week14-2-bedrock-rag-demo.zip`

### 🟡 선택사항 - 1개

10. **Week 10-3**: 웹 콘텐츠 (현재 있음) - `week10-3-cloudfront-demo.zip`

---

## 📦 ZIP 파일 구조 표준

### 데이터 중심 실습 (Week 11-2, 11-3)
```
week11-2-datalake-lab.zip
├── cloudformation-template.yaml
├── sample-data/
│   ├── customer-churn.csv
│   ├── sales-data.json
│   └── README.md
└── README.md
```

### Lambda 중심 실습 (Week 4-2, 4-3, 10-2)
```
week4-2-serverless-api-lab.zip
├── cloudformation-template.yaml
├── lambda/
│   ├── todo-api.py
│   ├── requirements.txt
│   └── README.md
└── README.md

week4-3-serverless-api-lab.zip
├── cloudformation-template.yaml
├── lambda/
│   ├── order-processor.py
│   ├── inventory-checker.py
│   ├── notification-sender.py
│   ├── requirements.txt
│   └── README.md
├── test-events/
│   ├── order-event.json
│   └── inventory-event.json
└── README.md

week10-2-elasticache-lab.zip
├── cloudformation-template.yaml
├── lambda/
│   ├── api-with-cache.py
│   ├── cache-warmer.py
│   ├── requirements.txt
│   └── README.md
└── README.md
```

### CI/CD 중심 실습 (Week 9-2, 9-3)
```
week9-2-codebuild-lab.zip
├── cloudformation-template.yaml (선택사항)
├── buildspec.yml
├── Dockerfile
├── app/
│   ├── app.py
│   ├── requirements.txt
│   └── README.md
└── README.md

week9-3-eks-cicd-lab.zip
├── cloudformation-template.yaml
├── buildspec.yml
├── Dockerfile
├── kubernetes/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── README.md
├── app/
│   ├── app.py
│   ├── requirements.txt
│   └── README.md
└── README.md
```

### 웹 콘텐츠 중심 데모 (Week 10-3)
```
week10-3-cloudfront-demo.zip
├── cloudformation-template.yaml (선택사항)
├── index.html
├── about.html
├── style.css
├── script.js
├── images/
│   └── logo.png
└── README.md
```

---

## 💡 핵심 포인트

1. **Week 3-1이 최우선** - 10개 태스크를 3-4개로 축소 가능
2. **네트워크 환경이 기반** - VPC, 서브넷, 보안 그룹은 대부분의 실습에 필요
3. **EKS 환경 자동화 필수** - 클러스터 생성에 15-20분 소요
4. **비용 최소화** - 프리 티어 리소스 사용, t2.micro/t3.micro
5. **삭제 용이성** - 스택 삭제 시 모든 리소스 자동 삭제
6. **데이터 파일 준비** - 실습용 샘플 데이터는 현실적이고 교육적이어야 함
7. **Lambda 코드 제공** - 학생이 수정/확장할 수 있는 기본 템플릿 제공
8. **README 필수** - 각 파일의 용도와 사용 방법 명시

---

## 🚀 다음 단계

1. **Week 3-1 템플릿 작성** (가장 복잡, 우선순위 1)
2. **Week 3-2 템플릿 작성** (보안 그룹 환경)
3. **Week 7-3 템플릿 작성** (EKS 클러스터)
4. **나머지 템플릿 순차 작성**

각 템플릿 작성 후 해당 가이드를 재작성하여 태스크 0을 추가하고 태스크 수를 축소합니다.
