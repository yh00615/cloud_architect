# Week 7-3: Amazon EKS 클러스터 생성 실습 파일

## 📦 포함 파일

- `week7-3-eks-cluster-lab.yaml` - EKS 클러스터 환경 CloudFormation 템플릿

## 🎯 템플릿 개요

이 CloudFormation 템플릿은 Amazon EKS 클러스터 실습을 위한 완전한 환경을 자동으로 생성합니다.

### 생성되는 리소스

#### 네트워크 인프라
- **VPC** (10.0.0.0/16)
- **Public Subnets** (2개 - ap-northeast-2a, ap-northeast-2c)
  - 10.0.1.0/24 (Public Subnet A)
  - 10.0.2.0/24 (Public Subnet C)
- **Private Subnets** (2개 - ap-northeast-2a, ap-northeast-2c)
  - 10.0.11.0/24 (Private Subnet A)
  - 10.0.12.0/24 (Private Subnet C)
- **Internet Gateway** - Public 서브넷 인터넷 연결
- **NAT Gateway** - Private 서브넷 아웃바운드 연결
- **Route Tables** - Public 및 Private 라우팅 테이블

#### EKS 클러스터
- **EKS Cluster** (Kubernetes 1.28)
  - Control Plane (관리형)
  - Public + Private API Endpoint
- **EKS Node Group**
  - 인스턴스 타입: t3.medium (기본값)
  - 노드 수: 2개 (기본값, 1-3개 Auto Scaling)
  - AMI: Amazon Linux 2
  - 위치: Private Subnets

#### IAM 역할
- **EKS Cluster Role** - EKS 클러스터 관리 권한
- **EKS Node Role** - Worker Node 실행 권한
  - AmazonEKSWorkerNodePolicy
  - AmazonEKS_CNI_Policy
  - AmazonEC2ContainerRegistryReadOnly

#### 보안 그룹
- **EKS Cluster Security Group** - Control Plane 보안
- **EKS Node Security Group** - Worker Node 보안
  - Node 간 통신 허용
  - Control Plane과 Node 간 통신 허용

## 🚀 배포 방법

### 1. CloudFormation 스택 생성

1. AWS Management Console에 로그인한 후 상단 검색창에서 `CloudFormation`을 검색하고 선택합니다.
2. [[Create stack]] 버튼을 클릭합니다.
3. **Prerequisite - Prepare template**에서 `Template is ready`를 선택합니다.
4. **Specify template**에서 `Upload a template file`을 선택합니다.
5. [[Choose file]] 버튼을 클릭한 후 `week7-3-eks-cluster-lab.yaml` 파일을 선택합니다.
6. [[Next]] 버튼을 클릭합니다.

### 2. 스택 세부 정보 구성

1. **Stack name**에 `week7-3-eks-lab-stack`을 입력합니다.
2. **Parameters** 섹션에서 다음을 확인합니다:
   - **EnvironmentName**: `week7-3-eks-lab` (기본값)
   - **EKSClusterName**: `eks-lab-cluster` (기본값)
   - **NodeGroupName**: `eks-lab-nodegroup` (기본값)
   - **NodeInstanceType**: `t3.medium` (기본값)
   - **NodeGroupDesiredSize**: `2` (기본값)
   - **NodeGroupMinSize**: `1` (기본값)
   - **NodeGroupMaxSize**: `3` (기본값)
3. [[Next]] 버튼을 클릭합니다.

### 3. 스택 옵션 구성

1. **Configure stack options** 페이지에서 기본값을 유지합니다.
2. [[Next]] 버튼을 클릭합니다.

### 4. 검토 및 생성

1. **Review** 페이지에서 모든 설정을 확인합니다.
2. **Capabilities** 섹션에서 다음을 체크합니다:
   - ☑ `I acknowledge that AWS CloudFormation might create IAM resources with custom names`
3. [[Submit]] 버튼을 클릭합니다.

### 5. 스택 생성 대기

> [!NOTE]
> EKS 클러스터 생성에는 **15-20분**이 소요됩니다.
> **Events** 탭에서 생성 과정을 확인할 수 있습니다.

1. 스택 상태가 "CREATE_IN_PROGRESS"로 표시됩니다.
2. 상태가 "CREATE_COMPLETE"로 변경될 때까지 기다립니다.

## 📋 출력값 확인

스택 생성이 완료되면 **Outputs** 탭에서 다음 정보를 확인할 수 있습니다:

| 출력 키 | 설명 | 사용 용도 |
|---------|------|-----------|
| **VpcId** | VPC ID | 네트워크 리소스 참조 |
| **PublicSubnetAId** | Public Subnet A ID | 로드 밸런서 배포 |
| **PublicSubnetCId** | Public Subnet C ID | 로드 밸런서 배포 |
| **PrivateSubnetAId** | Private Subnet A ID | Worker Node 위치 |
| **PrivateSubnetCId** | Private Subnet C ID | Worker Node 위치 |
| **EKSClusterName** | EKS 클러스터 이름 | kubectl 설정 |
| **EKSClusterEndpoint** | EKS API 엔드포인트 | 클러스터 접근 |
| **EKSClusterArn** | EKS 클러스터 ARN | IAM 정책 참조 |
| **NodeGroupName** | Node Group 이름 | 노드 관리 |
| **EKSClusterSecurityGroupId** | Cluster SG ID | 보안 설정 |
| **EKSNodeSecurityGroupId** | Node SG ID | 보안 설정 |
| **KubeconfigCommand** | kubectl 설정 명령어 | 로컬 환경 설정 |
| **ClusterInfo** | 클러스터 종합 정보 | 빠른 참조 |

## 🔧 kubectl 설정

### 1. AWS CLI 설치 확인

```bash
aws --version
```

### 2. kubeconfig 업데이트

**Outputs** 탭의 **KubeconfigCommand** 값을 복사하여 실행합니다:

```bash
aws eks update-kubeconfig --name eks-lab-cluster --region ap-northeast-2
```

> [!OUTPUT]
> ```
> Added new context arn:aws:eks:ap-northeast-2:123456789012:cluster/eks-lab-cluster to /Users/username/.kube/config
> ```

### 3. 클러스터 연결 확인

```bash
kubectl get nodes
```

> [!OUTPUT]
> ```
> NAME                                               STATUS   ROLES    AGE   VERSION
> ip-10-0-11-123.ap-northeast-2.compute.internal    Ready    <none>   5m    v1.28.x
> ip-10-0-12-456.ap-northeast-2.compute.internal    Ready    <none>   5m    v1.28.x
> ```

```bash
kubectl get pods --all-namespaces
```

> [!OUTPUT]
> ```
> NAMESPACE     NAME                       READY   STATUS    RESTARTS   AGE
> kube-system   aws-node-xxxxx             1/1     Running   0          5m
> kube-system   coredns-xxxxx              1/1     Running   0          10m
> kube-system   coredns-xxxxx              1/1     Running   0          10m
> kube-system   kube-proxy-xxxxx           1/1     Running   0          5m
> kube-system   kube-proxy-xxxxx           1/1     Running   0          5m
> ```

## 💰 비용 정보

### 예상 비용 (ap-northeast-2 리전 기준)

| 리소스 | 사양 | 시간당 비용 | 일일 비용 (24시간) |
|--------|------|-------------|-------------------|
| **EKS Cluster** | Control Plane | $0.10 | $2.40 |
| **EC2 Instances** | t3.medium × 2 | $0.0416 × 2 | $1.99 |
| **NAT Gateway** | 1개 | $0.059 | $1.42 |
| **Elastic IP** | 1개 (NAT용) | $0.005 | $0.12 |
| **데이터 전송** | 변동 | 변동 | 변동 |
| **총 예상 비용** | - | **$0.31/시간** | **$7.44/일** |

> [!WARNING]
> - EKS 클러스터는 시간당 $0.10이 부과됩니다 (Control Plane)
> - Worker Node는 EC2 인스턴스 요금이 부과됩니다
> - NAT Gateway는 시간당 요금 + 데이터 처리 요금이 부과됩니다
> - **실습 종료 후 반드시 스택을 삭제하여 비용을 절감하세요**

### 프리 티어

- EKS 클러스터는 프리 티어가 없습니다
- EC2 t3.medium은 프리 티어 대상이 아닙니다
- NAT Gateway는 프리 티어가 없습니다

## 🧹 리소스 정리

### CloudFormation 스택 삭제

> [!IMPORTANT]
> 스택 삭제 전에 다음을 확인하세요:
> - EKS 클러스터에 배포한 모든 Kubernetes 리소스 삭제
> - LoadBalancer 타입 Service 삭제 (ELB 자동 생성 방지)
> - PersistentVolumeClaim 삭제 (EBS 볼륨 자동 생성 방지)

#### 1. Kubernetes 리소스 정리

```bash
# 모든 네임스페이스의 리소스 확인
kubectl get all --all-namespaces

# 배포한 애플리케이션 삭제
kubectl delete deployment --all
kubectl delete service --all
kubectl delete ingress --all
kubectl delete pvc --all
```

#### 2. CloudFormation 스택 삭제

1. CloudFormation 콘솔로 이동합니다.
2. `week7-3-eks-lab-stack` 스택을 선택합니다.
3. [[Delete]] 버튼을 클릭합니다.
4. 확인 창에서 [[Delete]] 버튼을 클릭합니다.
5. 스택 삭제가 완료될 때까지 기다립니다 (10-15분 소요).

> [!NOTE]
> CloudFormation 스택을 삭제하면 다음 리소스가 자동으로 삭제됩니다:
> - EKS Cluster
> - EKS Node Group
> - EC2 Instances (Worker Nodes)
> - VPC 및 모든 네트워크 리소스
> - IAM Roles
> - Security Groups

### 삭제 실패 시 문제 해결

#### 문제 1: VPC 삭제 실패
**원인**: VPC에 연결된 리소스가 남아있음 (ENI, ELB 등)

**해결**:
1. EC2 콘솔 → **Network Interfaces**에서 VPC의 ENI 확인
2. 사용 중이지 않은 ENI 삭제
3. EC2 콘솔 → **Load Balancers**에서 VPC의 ELB 확인 및 삭제
4. CloudFormation 스택 재삭제

#### 문제 2: Security Group 삭제 실패
**원인**: 다른 리소스가 Security Group 참조 중

**해결**:
1. EC2 콘솔 → **Security Groups**에서 해당 SG 확인
2. **Inbound rules** 및 **Outbound rules**에서 참조하는 리소스 확인
3. 참조하는 리소스 삭제 후 재시도

#### 문제 3: IAM Role 삭제 실패
**원인**: IAM Role이 다른 리소스에서 사용 중

**해결**:
1. IAM 콘솔 → **Roles**에서 해당 Role 확인
2. **Trust relationships** 및 **Permissions** 확인
3. 사용 중인 리소스 삭제 후 재시도

## 📚 추가 리소스

- [Amazon EKS 사용 설명서](https://docs.aws.amazon.com/eks/latest/userguide/)
- [EKS 모범 사례 가이드](https://aws.github.io/aws-eks-best-practices/)
- [kubectl 치트 시트](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [EKS 워크샵](https://www.eksworkshop.com/)

## 🔍 문제 해결

### kubectl 명령어 실패

**문제**: `error: You must be logged in to the server (Unauthorized)`

**해결**:
```bash
# AWS CLI 자격 증명 확인
aws sts get-caller-identity

# kubeconfig 재설정
aws eks update-kubeconfig --name eks-lab-cluster --region ap-northeast-2
```

### Node가 Ready 상태가 되지 않음

**문제**: `kubectl get nodes`에서 Node가 NotReady 상태

**해결**:
1. Node 상태 확인:
```bash
kubectl describe node <node-name>
```

2. Node 로그 확인:
```bash
kubectl logs -n kube-system <aws-node-pod-name>
```

3. Security Group 규칙 확인 (CloudFormation Outputs 참조)

### Pod가 Pending 상태

**문제**: Pod가 계속 Pending 상태로 남아있음

**해결**:
1. Pod 이벤트 확인:
```bash
kubectl describe pod <pod-name>
```

2. Node 리소스 확인:
```bash
kubectl top nodes
```

3. Node 수 확인 및 필요시 증가:
```bash
# CloudFormation 스택 업데이트로 NodeGroupDesiredSize 증가
```

## ⚙️ 파라미터 커스터마이징

### Node 수 조정

더 많은 워크로드를 실행하려면 Node 수를 증가시킬 수 있습니다:

```yaml
NodeGroupDesiredSize: 3  # 2 → 3으로 변경
NodeGroupMaxSize: 5      # 3 → 5로 변경
```

### 인스턴스 타입 변경

더 큰 워크로드를 실행하려면 인스턴스 타입을 변경할 수 있습니다:

```yaml
NodeInstanceType: t3.large  # t3.medium → t3.large로 변경
```

> [!WARNING]
> 인스턴스 타입을 변경하면 비용이 증가합니다.
> t3.large는 t3.medium의 약 2배 비용입니다.

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. CloudFormation **Events** 탭에서 오류 메시지 확인
2. EKS 콘솔에서 클러스터 상태 확인
3. CloudWatch Logs에서 상세 로그 확인
4. AWS Support 또는 교수님께 문의
