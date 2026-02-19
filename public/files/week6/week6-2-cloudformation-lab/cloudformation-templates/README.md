# CloudFormation 템플릿 실습 파일

이 패키지는 AWS CloudFormation을 사용하여 인프라를 코드로 정의하고 배포하는 실습을 위한 템플릿 파일들입니다.

## 📦 포함된 파일

- `simple-s3-template.yaml` - 간단한 S3 버킷 템플릿 (입문용)
- `vpc-ec2-template.yaml` - 완전한 VPC + EC2 인프라 템플릿
- `README.md` - 이 파일

## 🚀 사용 방법

### 1. Simple S3 Template (입문)

가장 간단한 템플릿으로 CloudFormation 기본 개념을 학습합니다.

**AWS Console에서 스택 생성**:
1. CloudFormation 콘솔 접속
2. "Create stack" > "With new resources" 선택
3. "Upload a template file" 선택
4. `simple-s3-template.yaml` 업로드
5. 스택 이름 입력 (예: `my-first-stack`)
6. 파라미터 확인 (기본값 사용 가능)
7. "Create stack" 클릭

**생성되는 리소스**:
- S3 버킷 (버전 관리 활성화)

**예상 소요 시간**: 1-2분

### 2. VPC + EC2 Template (실전)

완전한 네트워크 인프라와 웹 서버를 배포합니다.

**사전 준비**:
- EC2 Key Pair 생성 필요 (EC2 콘솔 > Key Pairs)

**AWS Console에서 스택 생성**:
1. CloudFormation 콘솔 접속
2. "Create stack" > "With new resources" 선택
3. "Upload a template file" 선택
4. `vpc-ec2-template.yaml` 업로드
5. 스택 이름 입력 (예: `vpc-lab-stack`)
6. 파라미터 설정:
   - **EnvironmentName**: `Lab` (기본값)
   - **VpcCIDR**: `10.0.0.0/16` (기본값)
   - **PublicSubnetCIDR**: `10.0.1.0/24` (기본값)
   - **InstanceType**: `t2.micro` (기본값)
   - **KeyName**: 생성한 Key Pair 선택 (필수)
7. "Next" 클릭
8. 옵션 페이지에서 "Next" 클릭
9. 검토 페이지에서 "Create stack" 클릭

**생성되는 리소스**:
- VPC (10.0.0.0/16)
- Internet Gateway
- Public Subnet (10.0.1.0/24)
- Route Table
- Security Group (HTTP, SSH 허용)
- EC2 Instance (Apache 웹 서버 자동 설치)

**예상 소요 시간**: 3-5분

**접속 확인**:
1. CloudFormation 콘솔에서 스택 선택
2. "Outputs" 탭 선택
3. `WebServerURL` 값 복사
4. 브라우저에서 접속

## 📋 템플릿 구조 설명

### Parameters (파라미터)
사용자가 스택 생성 시 입력할 수 있는 값들입니다.

```yaml
Parameters:
  EnvironmentName:
    Type: String
    Default: Lab
```

### Resources (리소스)
생성할 AWS 리소스를 정의합니다. (필수 섹션)

```yaml
Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: !Ref VpcCIDR
```

### Outputs (출력)
스택 생성 후 출력할 값들입니다.

```yaml
Outputs:
  VPCId:
    Value: !Ref VPC
```

## 🔧 내장 함수

### !Ref
다른 리소스나 파라미터를 참조합니다.

```yaml
VpcId: !Ref VPC
```

### !GetAtt
리소스의 속성값을 가져옵니다.

```yaml
Value: !GetAtt WebServer.PublicIp
```

### !Sub
문자열 치환을 수행합니다.

```yaml
Value: !Sub '${EnvironmentName}-VPC'
```

### !Select, !GetAZs
가용 영역을 선택합니다.

```yaml
AvailabilityZone: !Select [0, !GetAZs '']
```

## 🔍 스택 업데이트

템플릿을 수정한 후 스택을 업데이트할 수 있습니다.

1. CloudFormation 콘솔에서 스택 선택
2. "Update" 버튼 클릭
3. "Replace current template" 선택
4. 수정된 템플릿 업로드
5. 파라미터 확인
6. "Update stack" 클릭

**Change Set 사용 (권장)**:
- "Update" > "Create change set" 선택
- 변경 사항 미리 검토
- 승인 후 실행

## 🗑️ 스택 삭제

모든 리소스를 자동으로 삭제합니다.

1. CloudFormation 콘솔에서 스택 선택
2. "Delete" 버튼 클릭
3. 확인

**주의**: 스택 삭제 시 생성된 모든 리소스가 삭제됩니다.

## 🔍 트러블슈팅

### 스택 생성 실패

**오류**: `The following resource(s) failed to create: [WebServer]`
- **원인**: Key Pair를 선택하지 않음
- **해결**: 스택 삭제 후 Key Pair 선택하여 재생성

**오류**: `CREATE_FAILED` - Security Group
- **원인**: VPC 생성 실패
- **해결**: CIDR 블록 중복 확인, 스택 삭제 후 재시도

### 스택 삭제 실패

**오류**: `DELETE_FAILED` - VPC
- **원인**: 수동으로 생성한 리소스가 VPC에 연결됨
- **해결**: 수동 생성 리소스 먼저 삭제

### EC2 접속 불가

**문제**: 웹 서버 URL 접속 안 됨
- **확인 1**: EC2 인스턴스 상태 확인 (Running)
- **확인 2**: Security Group에서 HTTP(80) 포트 허용 확인
- **확인 3**: UserData 스크립트 실행 완료 대기 (2-3분)

## 📚 학습 포인트

1. **Infrastructure as Code**: 인프라를 코드로 관리
2. **버전 관리**: Git으로 템플릿 버전 관리 가능
3. **재현 가능성**: 동일한 인프라를 여러 환경에 배포
4. **자동화**: 수동 작업 없이 전체 인프라 생성
5. **의존성 관리**: CloudFormation이 자동으로 리소스 생성 순서 결정
6. **롤백**: 실패 시 자동으로 이전 상태로 복구

## 🔗 추가 리소스

- [CloudFormation 사용 설명서](https://docs.aws.amazon.com/cloudformation/)
- [CloudFormation 템플릿 레퍼런스](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-reference.html)
- [CloudFormation 모범 사례](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/best-practices.html)
- [AWS 샘플 템플릿](https://github.com/awslabs/aws-cloudformation-templates)

## 💡 실습 팁

1. **작은 것부터 시작**: simple-s3-template부터 시작하여 개념 이해
2. **Change Set 활용**: 업데이트 전 변경 사항 미리 확인
3. **태그 활용**: 리소스에 태그를 추가하여 관리 용이
4. **파라미터 활용**: 재사용 가능한 템플릿 작성
5. **Outputs 활용**: 다른 스택에서 참조 가능한 값 출력
