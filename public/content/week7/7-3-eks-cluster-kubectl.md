---
title: 'kubectl을 활용한 Amazon EKS 클러스터 운영'
week: 7
session: 3
awsServices:
  - Amazon EKS
  - Kubernetes
learningObjectives:
  - 컨테이너와 가상 머신의 차이를 이해할 수 있습니다
  - Docker의 기본 개념과 컨테이너 이미지 빌드 방법을 설명할 수 있습니다
  - 컨테이너 오케스트레이션의 필요성을 이해할 수 있습니다
  - Kubernetes의 기본 개념과 주요 구성 요소를 설명할 수 있습니다
  - Amazon EKS 아키텍처와 컨트롤 플레인/데이터 플레인을 이해할 수 있습니다
  - Amazon EKS 클러스터를 생성하고 kubectl로 관리할 수 있습니다
  - Pod, Deployment, Service 등 Kubernetes 리소스를 생성할 수 있습니다
prerequisites:
  - Week 3-1 Amazon VPC 기본 개념 이해
  - 컨테이너 기본 개념 이해
---

이 실습에서는 Amazon EKS(Elastic Kubernetes Service)를 사용하여 관리형 Kubernetes 클러스터를 생성하고, kubectl 명령어를 사용하여 기본적인 Kubernetes 리소스를 관리하는 방법을 학습합니다.

> [!NOTE]
> **QuickTable 프로젝트 연계**: 이 실습에서 학습하는 EKS와 Kubernetes 개념은 Week 9-2에서 QuickTable 컨테이너 이미지를 빌드하고 Amazon ECR에 푸시하는 데 활용됩니다.
>
> **학습 흐름**:
>
> - Week 7-3: EKS 클러스터 생성 및 kubectl 기본 (현재)
> - Week 9-2: AWS CodeBuild로 QuickTable 컨테이너 이미지 빌드 및 ECR 푸시
> - Week 9-3: AWS CodePipeline으로 QuickTable 웹사이트 S3 자동 배포

> [!DOWNLOAD]
> [week7-3-eks-lab.zip](/files/week7/week7-3-eks-lab.zip)
>
> - `week7-3-eks-lab.yaml` - Amazon EKS 클러스터 및 노드 그룹 AWS CloudFormation 템플릿
> - `nginx-deployment.yaml` - Nginx Deployment 매니페스트 (태스크 3에서 사용)
> - `nginx-service.yaml` - Nginx Service 매니페스트 (태스크 6에서 사용)
> - `nginx-ingress-alb.yaml` - ALB Ingress 매니페스트 (참고용)
> - `README.md` - 템플릿 파라미터 설명 및 배포 가이드
>
> **관련 태스크:**
>
> - 태스크 0: 실습 환경 구축 (week7-3-eks-lab.yaml을 사용하여 Amazon EKS 클러스터, 워커 노드, AWS IAM 역할 자동 생성)
> - 태스크 3: Deployment 생성 (nginx-deployment.yaml을 사용하여 Nginx 애플리케이션 배포)
> - 태스크 6: Service 생성 (nginx-service.yaml을 사용하여 LoadBalancer 타입 Service 생성)

> [!COST]
> **리소스 운영 비용 가이드 (ap-northeast-2 기준, 온디맨드 요금 기준)**
>
> | 리소스명              | 타입/사양     | IaC |         비용 |
> | --------------------- | ------------- | :-: | -----------: |
> | Amazon VPC            | N/A           | ✅  |         무료 |
> | 서브넷                | N/A           | ✅  |         무료 |
> | Amazon EKS            | 클러스터      | ✅  |   $0.10/시간 |
> | Amazon EC2            | t3.medium x 2 | ✅  | $0.0832/시간 |
> | Classic Load Balancer | Service 타입  | ❌  | $0.0270/시간 |
>
> - **예상 실습 시간**: 2시간
> - **예상 총 비용**: 약 $0.36-0.42 (실무 환경 온디맨드 기준)
>
> **무료 플랜**
>
> - 이 실습 비용은 AWS 가입 후 6개월 내 제공되는 크레딧에서 차감될 수 있습니다.
>
> **실무 팁**
>
> 💡 Amazon EKS는 시간당 비용이 높은 서비스입니다 (클러스터 $0.10/시간 + 워커 노드). 개발 환경에서는 사용하지 않을 때 클러스터를 삭제하여 비용을 절감하세요. 실습 후 반드시 리소스를 삭제하세요.
>
> **참고**
>
> ℹ️ 이 실습에서는 t3.medium 인스턴스를 사용합니다. 인스턴스 타입을 변경하면 비용이 크게 증가할 수 있습니다.
>
> **리전별로 요금이 다를 수 있습니다. 최신 요금은 아래 링크에서 확인하세요.**
>
> 📘 [Amazon EKS 요금](https://aws.amazon.com/eks/pricing/) | 📘 [Amazon EC2 요금](https://aws.amazon.com/ec2/pricing/) | 📘 [Elastic Load Balancing 요금](https://aws.amazon.com/elasticloadbalancing/pricing/) | 🧮 [AWS 요금 계산기](https://calculator.aws/)

> [!WARNING]
> 이 실습에서 생성하는 리소스는 실습 종료 후 **즉시 삭제**해야 합니다.
>
> **삭제를 잊으면**: 1일 약 $4.32, 1주일 약 $30.24의 비용이 발생합니다.
>
> 다른 실습 대비 비용이 높으므로 실습 완료 후 즉시 리소스를 삭제합니다.

> [!TIP]
> **실습 시간 최적화**: 태스크 0의 AWS CloudFormation 스택 생성에 20-30분이 소요됩니다.
> 수업 시작 전 사전 과제로 태스크 0을 미리 수행하면 실습 시간을 효율적으로 활용할 수 있습니다.

## 태스크 0: 실습 환경 구축

이 태스크에서는 CloudFormation을 사용하여 실습에 필요한 Amazon EKS 클러스터와 워커 노드를 자동으로 생성합니다.

### 환경 구성 요소

AWS CloudFormation 스택은 다음 리소스를 생성합니다:

- **Amazon VPC 및 네트워크**: Amazon VPC, 퍼블릭 서브넷 2개, 인터넷 게이트웨이, 라우팅 테이블
- **AWS IAM 역할**: Amazon EKS 클러스터 역할 (AmazonEKSClusterPolicy), 워커 노드 역할 (AmazonEKSWorkerNodePolicy, AmazonEC2ContainerRegistryReadOnly, AmazonEKS_CNI_Policy)
- **Amazon EKS 클러스터**: Kubernetes 버전 1.32, Public 엔드포인트
- **노드 그룹**: t3.medium 인스턴스 2개, Amazon Linux 2 AMI

> [!WARNING]
> **보안 주의**: 이 실습에서는 간소화를 위해 퍼블릭 서브넷만 사용합니다.
>
> **프로덕션 환경 필수 사항:**
>
> - 워커 노드는 반드시 프라이빗 서브넷에 배치합니다
> - 퍼블릭 서브넷의 워커 노드는 퍼블릭 IP가 할당되어 인터넷에서 직접 접근 가능합니다
> - NAT Gateway를 통해 아웃바운드 트래픽만 허용하고 인바운드는 차단해야 합니다
> - Week 3-2에서 학습한 최소 권한 원칙을 적용합니다

Kubernetes 버전 호환성을 확인하는 것도 중요합니다.

> [!WARNING]
> **Kubernetes 버전 확인 필수**: AWS CloudFormation 템플릿은 Kubernetes 버전 1.32를 사용합니다.
>
> 1.32가 지원되지 않으면 `week7-3-eks-lab.yaml` 파일을 텍스트 에디터로 열고,
> `KubernetesVersion: '1.32'` 줄을 지원되는 최신 버전으로 변경합니다 (예: `'1.33'` 또는 `'1.34'`).
>
> 지원 버전 확인 및 상세 정보는 📚 참고 섹션의 "Kubernetes 버전 지원 정책"을 참조합니다.

### 상세 단계

1. 다운로드한 `week7-3-eks-lab.zip` 파일의 압축을 해제합니다.
2. `week7-3-eks-lab.yaml` 파일을 확인합니다.
3. AWS Management Console에 로그인한 후 상단 검색창에서 `AWS CloudFormation`을 검색하고 선택합니다.
4. [[Create stack]] 버튼을 클릭한 후 **With new resources (standard)**를 선택합니다.
5. **Prerequisite - Prepare template**에서 `Template is ready`를 선택합니다.
6. **Specify template**에서 `Upload a template file`을 선택합니다.
7. [[Choose file]] 버튼을 클릭한 후 `week7-3-eks-lab.yaml` 파일을 선택합니다.
8. [[Next]] 버튼을 클릭합니다.
9. **Stack name**에 `week7-3-eks-lab-stack`을 입력합니다.
10. **Parameters** 섹션에서 기본값을 확인합니다:
    - **ClusterName**: `my-eks-cluster`
    - **NodeGroupName**: `my-node-group`
    - **NodeInstanceType**: `t3.medium`
    - **DesiredCapacity**: `2`
    - **MinSize**: `1`
    - **MaxSize**: `3`

> [!IMPORTANT]
> 모든 파라미터는 기본값을 그대로 사용합니다.
> 값을 변경하면 이후 태스크의 명령어와 일치하지 않을 수 있습니다.

11. [[Next]] 버튼을 클릭합니다.
12. **Configure stack options** 페이지에서 아래로 스크롤하여 **Tags** 섹션을 확인합니다.
13. [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key         | Value     |
| ----------- | --------- |
| `Project`   | `AWS-Lab` |
| `Week`      | `7-3`     |
| `CreatedBy` | `Student` |

14. [[Next]] 버튼을 클릭합니다.
15. **Review** 페이지에서 설정을 확인합니다.
16. **Capabilities** 섹션에서 `I acknowledge that AWS CloudFormation might create AWS IAM resources with custom names`를 체크합니다.
17. [[Submit]] 버튼을 클릭합니다.
18. 스택 생성이 시작됩니다. 상태가 "CREATE_IN_PROGRESS"로 표시됩니다.

> [!NOTE]
> **Events** 탭에는 리소스 생성 과정이 실시간으로 표시됩니다.
> Amazon VPC, 서브넷, AWS IAM 역할, Amazon EKS 클러스터, 노드 그룹이 순차적으로 생성됩니다.
> 스택 생성에 20-30분이 소요됩니다. Amazon EKS 클러스터 생성에 10-15분, 노드 그룹 생성에 추가 5-10분이 필요합니다.
> 대기하는 동안 이전 차시 내용을 복습하거나 다음 태스크를 미리 읽어보세요.
> 페이지를 새로고침하여 최신 상태를 확인할 수 있습니다.

> [!WARNING]
> **AWS CloudShell 세션 타임아웃 주의**: CloudShell은 약 20분 비활성 시 세션이 자동 종료됩니다.
> 스택 생성 중 AWS CloudShell 세션이 끊어지면 다음 태스크에서 다시 CloudShell을 열고 `aws eks update-kubeconfig` 명령을 재실행합니다.
>
> **kubeconfig 영속성**: kubeconfig 파일은 AWS CloudShell 홈 디렉토리(`~/.kube/config`)에 저장되므로, 세션이 재시작되어도 파일은 유지됩니다.
> 세션 재시작 후 `kubectl get nodes` 명령을 바로 실행할 수 있습니다.

스택 생성 상태를 확인하는 방법도 알아두세요.

> [!NOTE]
> **Status** 열은 스택의 현재 상태를 보여줍니다:
>
> - **CREATE_IN_PROGRESS** (주황색): 리소스 생성 중
> - **CREATE_COMPLETE** (초록색): 생성 완료
> - **CREATE_FAILED** (빨간색): 오류 발생 (Events 탭에서 원인 확인)

19. 상태가 "CREATE_COMPLETE"로 변경될 때까지 기다립니다.
20. **Outputs** 탭을 선택합니다.
21. 출력값들을 확인하고 메모장에 복사합니다:
    - `ClusterName`: Amazon EKS 클러스터 이름 (예: my-eks-cluster)
    - `ClusterEndpoint`: Amazon EKS 클러스터 엔드포인트 URL
    - `NodeGroupName`: 노드 그룹 이름 (예: my-node-group)
    - `VpcId`: Amazon VPC ID (예: vpc-0123456789abcdef0)

> [!IMPORTANT]
> 이 출력값들은 다음 태스크에서 사용됩니다. 반드시 메모장에 저장합니다.

✅ **태스크 완료**: 실습 환경이 준비되었습니다.

## 태스크 1: kubectl 구성 및 클러스터 연결

이 태스크에서는 CloudShell에서 kubectl을 사용하여 Amazon EKS 클러스터에 연결합니다.

> [!NOTE]
> AWS CloudShell에는 kubectl이 사전 설치되어 있습니다.
> 별도 설치 없이 바로 사용할 수 있습니다.
>
> **kubectl 버전 호환성**: 버전이 호환 범위를 벗어나면 📚 참고 섹션의 "kubectl 수동 설치 방법"을 참조합니다.

1. AWS Management Console 상단의 AWS CloudShell 아이콘을 클릭합니다.
2. CloudShell이 시작될 때까지 기다립니다.
3. kubectl 버전을 확인합니다:

```bash
kubectl version --client
```

> [!OUTPUT]
>
> ```
> Client Version: v1.32.x 이상
> Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3
> ```

> [!NOTE]
> AWS CloudShell의 kubectl 버전은 정기적으로 업데이트됩니다.
> 2026년 2월 기준으로 v1.32 이상의 버전이 설치되어 있을 수 있습니다.

4. AWS CLI를 사용하여 kubeconfig를 업데이트합니다:

```bash
aws eks update-kubeconfig --name my-eks-cluster --region ap-northeast-2
```

> [!NOTE]
> 태스크 0에서 ClusterName 파라미터를 변경했다면, `my-eks-cluster` 대신 변경한 이름을 사용합니다.

> [!OUTPUT]
>
> ```
> Added new context arn:aws:eks:ap-northeast-2:xxxx:cluster/my-eks-cluster to /home/cloudshell-user/.kube/config
> ```

5. 클러스터 연결을 확인합니다:

```bash
kubectl get nodes
```

> [!OUTPUT]
>
> ```
> NAME                                            STATUS   ROLES    AGE   VERSION
> ip-xxx-xxx-xxx-xxx.ap-northeast-2.compute.internal   Ready    <none>   5m    v1.32.x
> ip-xxx-xxx-xxx-xxx.ap-northeast-2.compute.internal   Ready    <none>   5m    v1.32.x
> ```

> [!TROUBLESHOOTING]
> **문제**: `kubectl get nodes` 실행 시 연결 오류가 발생합니다.
>
> **증상 1**: `error: You must be logged in to the server (Unauthorized)`
> **원인**: AWS CloudShell의 IAM 사용자/역할이 클러스터 생성자와 다릅니다.
> **해결**: Amazon EKS 클러스터는 생성자에게만 기본 접근 권한을 부여합니다. 동일한 IAM 사용자/역할로 CloudShell을 사용하는지 확인합니다.
>
> **증상 2**: `Unable to connect to the server`
> **원인**: 클러스터가 아직 생성 중이거나 엔드포인트 접근 문제입니다.
> **해결**: 클러스터 상태가 ACTIVE인지 확인합니다:
>
> ```bash
> aws eks describe-cluster --name my-eks-cluster --query 'cluster.status' --output text
> ```
>
> 출력이 `ACTIVE`가 아니면 클러스터 생성이 완료될 때까지 기다립니다.

✅ **태스크 완료**: kubectl이 Amazon EKS 클러스터에 연결되었습니다.

## 태스크 2: Kubernetes Pod 생성 및 관리

이 태스크에서는 kubectl을 사용하여 Pod를 생성하고 관리하는 방법을 학습합니다.

> [!NOTE]
> Pod를 직접 생성하는 방식은 학습 및 디버깅 목적으로만 사용합니다.
> 프로덕션 환경에서는 Pod가 삭제되면 자동으로 재생성되지 않으므로, 항상 Deployment를 사용해야 합니다.

이제 nginx Pod를 생성해봅시다.

1. 다음 명령어를 실행하여 nginx Pod를 생성합니다:

```bash
kubectl run nginx-pod --image=nginx:1.25
```

> [!OUTPUT]
>
> ```
> pod/nginx-pod created
> ```

2. Pod 목록을 확인합니다:

```bash
kubectl get pods
```

> [!OUTPUT]
>
> ```
> NAME        READY   STATUS    RESTARTS   AGE
> nginx-pod   1/1     Running   0          10s
> ```

3. Pod의 상세 정보를 확인합니다:

```bash
kubectl describe pod nginx-pod
```

> [!NOTE]
> 출력에서 다음 항목을 확인합니다:
>
> - **Status**: Running (Pod가 정상 실행 중)
> - **IP**: Pod에 할당된 Amazon VPC IP 주소
> - **Node**: Pod가 실행 중인 워커 노드
> - **Events**: Pod 생성 과정 (Scheduled → Pulling → Pulled → Created → Started)

4. Pod의 로그를 확인합니다:

```bash
kubectl logs nginx-pod
```

> [!OUTPUT]
>
> ```
> (빈 출력 또는 nginx 기본 로그)
> ```

> [!NOTE]
> nginx Pod에 아직 HTTP 요청이 없으므로 로그가 비어 있거나 기본 시작 로그만 표시될 수 있습니다.
> 웹 브라우저나 curl로 nginx에 접속하면 액세스 로그가 표시됩니다.

5. Pod 내부에 접속합니다:

```bash
kubectl exec -it nginx-pod -- /bin/bash
```

> [!WARNING]
> `kubectl exec`는 디버깅 목적으로만 사용합니다.
> 프로덕션 환경에서는 Pod 내부 접속을 RBAC으로 제한하고, 감사 로그를 활성화해야 합니다.

6. Pod 내부에서 nginx 버전을 확인합니다:

```bash
nginx -v
```

7. `exit` 명령어를 입력하여 Pod에서 나옵니다.

✅ **태스크 완료**: Kubernetes Pod를 생성하고 관리했습니다.

## 태스크 3: Kubernetes Deployment 생성 (명령형)

이 태스크에서는 명령형 방식으로 Deployment를 생성하고 관리하는 방법을 학습합니다.

1. 다음 명령어를 실행하여 nginx Deployment를 생성합니다:

```bash
kubectl create deployment nginx-deployment --image=nginx:1.25 --replicas=2
```

> [!OUTPUT]
>
> ```
> deployment.apps/nginx-deployment created
> ```

> [!NOTE]
> 명령형 방식은 빠르게 리소스를 생성할 수 있지만, 버전 관리와 재현성이 떨어집니다.
> 프로덕션 환경에서는 선언형 방식(YAML 매니페스트)을 권장합니다.
>
> replicas를 2로 설정하여 리소스 사용량을 최소화합니다.
> t3.medium 2대에서 총 4 vCPU, 8GB 메모리를 사용할 수 있습니다.

2. Deployment 목록을 확인합니다:

```bash
kubectl get deployments
```

> [!OUTPUT]
>
> ```
> NAME               READY   UP-TO-DATE   AVAILABLE   AGE
> nginx-deployment   2/2     2            2           20s
> ```

3. Pod 목록을 확인합니다:

```bash
kubectl get pods
```

> [!OUTPUT]
>
> ```
> NAME                                READY   STATUS    RESTARTS   AGE
> nginx-deployment-xxxxxxxxxx-xxxxx   1/1     Running   0          30s
> nginx-deployment-xxxxxxxxxx-xxxxx   1/1     Running   0          30s
> nginx-pod                           1/1     Running   0          5m
> ```

4. Deployment를 스케일링합니다:

```bash
kubectl scale deployment nginx-deployment --replicas=3
```

> [!OUTPUT]
>
> ```
> deployment.apps/nginx-deployment scaled
> ```

5. Pod 개수가 증가했는지 확인합니다:

```bash
kubectl get pods
```

6. Deployment의 상세 정보를 확인합니다:

```bash
kubectl describe deployment nginx-deployment
```

> [!NOTE]
> **다음 태스크 준비**: 태스크 4에서는 선언형 방식으로 새로운 Deployment를 생성합니다.
> 리소스 사용량을 관리하기 위해 태스크 3에서 생성한 리소스를 먼저 정리합니다.

7. 태스크 3에서 생성한 Deployment를 삭제합니다:

```bash
kubectl delete deployment nginx-deployment
```

> [!OUTPUT]
>
> ```
> deployment.apps "nginx-deployment" deleted
> ```

8. 태스크 2에서 생성한 Pod를 삭제합니다:

```bash
kubectl delete pod nginx-pod
```

> [!OUTPUT]
>
> ```
> pod "nginx-pod" deleted
> ```

9. 삭제가 완료되었는지 확인합니다:

```bash
kubectl get pods
```

> [!OUTPUT]
>
> ```
> No resources found in default namespace.
> ```

> [!NOTE]
> 모든 Pod가 삭제되었습니다. 이제 태스크 4를 진행할 준비가 되었습니다.

✅ **태스크 완료**: 명령형 방식으로 Kubernetes Deployment를 생성하고 스케일링했습니다.

## 태스크 4: YAML 매니페스트로 Deployment 생성 (선언형)

이 태스크에서는 선언형 방식으로 YAML 매니페스트 파일을 사용하여 Deployment를 생성하는 방법을 학습합니다.

> [!CONCEPT] 명령형 vs 선언형
> **명령형 (Imperative)**: `kubectl create`, `kubectl scale` 등 명령어로 직접 리소스 생성 및 수정
>
> - 장점: 빠르고 간단함
> - 단점: 버전 관리 어려움, 재현성 낮음, 변경 이력 추적 불가
>
> **선언형 (Declarative)**: YAML 파일로 원하는 상태를 정의하고 `kubectl apply` 실행
>
> - 장점: Git으로 버전 관리, 재현 가능, 변경 이력 추적, 프로덕션 권장
> - 단점: 초기 학습 곡선

1. 다운로드한 실습 파일에서 `nginx-deployment.yaml` 파일을 확인합니다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-app
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.21
          ports:
            - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

2. CloudShell에 파일을 업로드합니다:
   - CloudShell 우측 상단의 **Actions** > **Upload file**을 클릭합니다.
   - `nginx-deployment.yaml` 파일을 선택합니다.

3. 업로드된 파일을 확인합니다:

```bash
cat nginx-deployment.yaml
```

4. YAML 파일을 사용하여 Deployment를 생성합니다:

```bash
kubectl apply -f nginx-deployment.yaml
```

> [!OUTPUT]
>
> ```
> deployment.apps/nginx-app created
> ```

5. Deployment 목록을 확인합니다:

```bash
kubectl get deployments
```

> [!OUTPUT]
>
> ```
> NAME        READY   UP-TO-DATE   AVAILABLE   AGE
> nginx-app   3/3     3            3           10s
> ```

6. Pod 목록을 확인합니다:

```bash
kubectl get pods -l app=nginx
```

> [!OUTPUT]
>
> ```
> NAME                         READY   STATUS    RESTARTS   AGE
> nginx-app-xxxxxxxxxx-xxxxx   1/1     Running   0          20s
> nginx-app-xxxxxxxxxx-xxxxx   1/1     Running   0          20s
> nginx-app-xxxxxxxxxx-xxxxx   1/1     Running   0          20s
> ```

> [!NOTE]
> 태스크 3에서 이전 리소스를 모두 정리했으므로, nginx-app 3개만 실행됩니다.
> 각 Pod는 cpu: 100m request를 사용하므로, 총 300m(0.3 vCPU)가 필요합니다.
> t3.medium 2대는 총 4 vCPU, 8GB 메모리를 제공하므로 충분히 수용 가능합니다.

7. Deployment의 상세 정보를 확인합니다:

```bash
kubectl describe deployment nginx-app
```

8. 롤링 업데이트 전략을 확인합니다:

```bash
kubectl get deployment nginx-app -o yaml | grep -A 3 "strategy:"
```

> [!OUTPUT]
>
> ```
>   strategy:
>     rollingUpdate:
>       maxSurge: 1
>       maxUnavailable: 0
>     type: RollingUpdate
> ```

8. Pod 개수가 증가했는지 확인합니다:

```bash
kubectl get pods -l app=nginx
```

> [!TIP]
> YAML 매니페스트 파일은 Git 저장소에 저장하여 버전 관리하고, CI/CD 파이프라인에서 자동 배포할 수 있습니다.
> 이를 GitOps라고 하며, 프로덕션 환경에서 권장되는 방식입니다.

✅ **태스크 완료**: YAML 매니페스트를 사용하여 선언형 방식으로 Deployment를 생성하고 수정했습니다.

## 태스크 5: 롤링 업데이트 및 롤백

이 태스크에서는 Deployment의 롤링 업데이트와 롤백 기능을 학습합니다.

> [!CONCEPT] 롤링 업데이트 (Rolling Update)
> 롤링 업데이트는 애플리케이션의 다운타임 없이 새 버전으로 점진적으로 업데이트하는 방식입니다.
> Kubernetes는 기본적으로 롤링 업데이트 전략을 사용하며, 다음과 같이 동작합니다:
>
> 1. 새 버전의 Pod를 하나씩 생성합니다
> 2. 새 Pod가 Ready 상태가 되면 기존 Pod를 하나씩 종료합니다
> 3. 모든 Pod가 새 버전으로 교체될 때까지 반복합니다

1. 현재 nginx-app Deployment의 이미지 버전을 확인합니다:

```bash
kubectl describe deployment nginx-app | grep Image
```

> [!OUTPUT]
>
> ```
>     Image:        nginx:1.25
> ```

2. 다음 명령어를 실행하여 이미지를 업데이트합니다:

```bash
kubectl set image deployment/nginx-app nginx=nginx:1.26
```

> [!OUTPUT]
>
> ```
> deployment.apps/nginx-app image updated
> ```

> [!NOTE]
> `kubectl set image`는 실무에서 가장 많이 사용하는 롤링 업데이트 방법입니다.
> 빠르고 간단하지만, 변경 이력이 Git에 남지 않습니다.
>
> **대안 방법 (선언형)**: YAML 파일을 수정하여 업데이트할 수도 있습니다:
>
> ```bash
> sed -i 's/nginx:1.25/nginx:1.26/' nginx-deployment.yaml
> kubectl apply -f nginx-deployment.yaml
> ```
>
> 선언형 방식은 YAML 파일을 Git으로 버전 관리할 수 있어 프로덕션 환경에서 권장됩니다.

3. 롤링 업데이트 진행 상황을 실시간으로 확인합니다:

```bash
kubectl rollout status deployment/nginx-app
```

> [!OUTPUT]
>
> ```
> Waiting for deployment "nginx-app" rollout to finish: 1 out of 3 new replicas have been updated...
> Waiting for deployment "nginx-app" rollout to finish: 2 out of 3 new replicas have been updated...
> Waiting for deployment "nginx-app" rollout to finish: 2 of 3 updated replicas are available...
> deployment "nginx-app" successfully rolled out
> ```

> [!NOTE]
> 현재 nginx-app의 replicas는 3입니다 (태스크 4에서 2→3으로 변경).
> 롤링 업데이트는 3개 Pod를 순차적으로 nginx:1.26으로 교체합니다.

4. 업데이트된 이미지 버전을 확인합니다:

```bash
kubectl describe deployment nginx-app | grep Image
```

> [!OUTPUT]
>
> ```
>     Image:        nginx:1.26
> ```

5. 롤아웃 히스토리를 확인합니다:

```bash
kubectl rollout history deployment/nginx-app
```

> [!OUTPUT]
>
> ```
> deployment.apps/nginx-app
> REVISION  CHANGE-CAUSE
> 1         <none>
> 2         <none>
> ```

> [!NOTE]
> REVISION 1: nginx:1.25 (최초 생성)
> REVISION 2: nginx:1.26 (이미지 업데이트)

7. 특정 리비전의 상세 정보를 확인합니다:

```bash
kubectl rollout history deployment/nginx-app --revision=2
```

8. 이전 버전으로 롤백합니다:

```bash
kubectl rollout undo deployment/nginx-app
```

> [!OUTPUT]
>
> ```
> deployment.apps/nginx-app rolled back
> ```

> [!NOTE]
> 롤백을 실행하면 이전 버전(nginx:1.25)으로 되돌아갑니다.
>
> **REVISION 번호 변화:**
>
> - 최초: REVISION 1 (nginx:1.25)
> - 업데이트: REVISION 2 (nginx:1.26)
> - 롤백: REVISION 3 (nginx:1.25) ← 새로운 리비전 생성
>
> 롤백 자체도 하나의 배포로 기록되므로 REVISION 1은 사라지고 REVISION 2, 3이 남습니다.

9. 롤백 진행 상황을 확인합니다:

```bash
kubectl rollout status deployment/nginx-app
```

10. 이미지 버전이 1.25로 롤백되었는지 확인합니다:

```bash
kubectl describe deployment nginx-app | grep Image
```

> [!OUTPUT]
>
> ```
>     Image:        nginx:1.25
> ```

11. 롤아웃 히스토리를 다시 확인합니다:

```bash
kubectl rollout history deployment/nginx-app
```

> [!OUTPUT]
>
> ```
> deployment.apps/nginx-app
> REVISION  CHANGE-CAUSE
> 2         <none>
> 3         <none>
> ```

> [!NOTE]
> **REVISION 번호 변화 확인:**
>
> - REVISION 1은 사라지고, REVISION 2(nginx:1.26)와 REVISION 3(nginx:1.25, 롤백)이 남습니다.
> - 롤백 자체도 하나의 새로운 배포로 기록되므로 REVISION 번호가 증가합니다.
> - 가장 오래된 REVISION(1)은 히스토리에서 제거됩니다.
>
> **특정 리비전으로 롤백:**
> 다시 nginx:1.26으로 돌아가려면 다음 명령어를 실행합니다:
>
> ```bash
> kubectl rollout undo deployment/nginx-app --to-revision=2
> ```
>
> 이 경우 REVISION 4가 생성되며 이미지는 nginx:1.26이 됩니다.
>
> 이 명령어는 선택사항입니다. 실행하지 않아도 다음 태스크에 영향이 없습니다.

> [!TIP]
> 롤링 업데이트 전략을 세밀하게 제어하려면 YAML 파일에 다음 설정을 추가할 수 있습니다:
>
> ```yaml
> spec:
>   strategy:
>     type: RollingUpdate
>     rollingUpdate:
>       maxSurge: 1 # 동시에 생성할 수 있는 추가 Pod 수
>       maxUnavailable: 0 # 동시에 사용 불가능한 Pod 수
> ```

✅ **태스크 완료**: 롤링 업데이트를 수행하고 이전 버전으로 롤백했습니다.

## 태스크 6: Kubernetes Service 생성

이 태스크에서는 Service를 사용하여 Pod에 네트워크 접근을 제공하는 방법을 학습합니다.

### 방법 1: 명령형 방식 (빠른 테스트)

1. 다음 명령어를 실행하여 LoadBalancer 타입의 Service를 생성합니다:

```bash
kubectl expose deployment nginx-app --type=LoadBalancer --port=80
```

> [!OUTPUT]
>
> ```
> service/nginx-app exposed
> ```

### 방법 2: 선언형 방식 (프로덕션 권장)

1. 다운로드한 실습 파일에서 `nginx-service.yaml` 파일을 확인합니다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-app
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
```

2. CloudShell에 파일을 업로드합니다:
   - CloudShell 우측 상단의 **Actions** > **Upload file**을 클릭합니다.
   - `nginx-service.yaml` 파일을 선택합니다.

3. YAML 파일을 사용하여 Service를 생성합니다:

```bash
kubectl apply -f nginx-service.yaml
```

> [!OUTPUT]
>
> ```
> service/nginx-app created
> ```

> [!NOTE]
> 방법 1 또는 방법 2 중 하나만 선택하여 실행합니다. 두 방법 모두 동일한 Service를 생성합니다.

### Service 확인

1. Service 목록을 확인합니다:

```bash
kubectl get services
```

> [!OUTPUT]
>
> ```
> NAME               TYPE           CLUSTER-IP      EXTERNAL-IP                                                                    PORT(S)        AGE
> kubernetes         ClusterIP      10.100.0.1      <none>                                                                         443/TCP        30m
> nginx-app          LoadBalancer   10.100.xxx.xxx  xxxxx-xxxxxxxx.ap-northeast-2.elb.amazonaws.com                                80:xxxxx/TCP   10s
> ```

> [!NOTE]
> EXTERNAL-IP가 생성되는 데 1-2분이 소요될 수 있습니다. `<pending>` 상태에서 실제 주소로 변경될 때까지 기다립니다.

2. EXTERNAL-IP가 할당될 때까지 실시간으로 확인합니다:

```bash
kubectl get service nginx-app -w
```

> [!NOTE]
> `-w` (watch) 옵션을 사용하면 상태 변경을 실시간으로 확인할 수 있습니다.
> EXTERNAL-IP가 `<pending>`에서 실제 주소로 변경되면 Ctrl+C를 눌러 종료합니다.

> [!OUTPUT]
>
> ```
> NAME        TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
> nginx-app   LoadBalancer   10.100.xxx.xxx  <pending>     80:xxxxx/TCP   10s
> nginx-app   LoadBalancer   10.100.xxx.xxx  xxxxx-xxxxxxxx.ap-northeast-2.elb.amazonaws.com   80:xxxxx/TCP   1m
> ```

3. Service의 상세 정보를 확인합니다:

```bash
kubectl describe service nginx-app
```

4. AWS CLI로 Load Balancer DNS 이름을 확인합니다:

```bash
kubectl get service nginx-app -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

> [!OUTPUT]
>
> ```
> xxxxx-xxxxxxxx.ap-northeast-2.elb.amazonaws.com
> ```

> [!TIP]
> AWS CLI를 사용하면 Load Balancer DNS 이름을 정확하게 추출할 수 있습니다.
> 이 명령어는 자동화 스크립트나 CI/CD 파이프라인에서 유용하게 사용됩니다.

5. AWS Management Console에 로그인한 후 상단 검색창에서 `Amazon EC2`를 검색하고 선택합니다.
6. 왼쪽 메뉴에서 **Instances**를 선택합니다.
7. 인스턴스 목록에서 이름에 `my-node-group`이 포함된 워커 노드 인스턴스를 하나 선택합니다.
8. 하단의 **Security** 탭을 선택합니다.
9. **Security groups** 섹션에서 보안 그룹 이름을 확인합니다 (예: `eks-cluster-sg-my-eks-cluster-xxxxx`).

> [!NOTE]
> EKS 워커 노드에 연결된 보안 그룹을 수정해야 LoadBalancer Service가 NodePort를 통해 Pod에 접근할 수 있습니다.
> 워커 노드 인스턴스의 Security 탭에서 확인한 보안 그룹이 수정 대상입니다.

7. 왼쪽 메뉴에서 **Security Groups**를 선택합니다.
8. 검색창에서 방금 확인한 보안 그룹 이름을 입력하여 찾습니다.
9. 해당 보안 그룹을 선택합니다.
10. 하단의 **Inbound rules** 탭을 선택합니다.
11. [[Edit inbound rules]] 버튼을 클릭합니다.
12. [[Add rule]] 버튼을 클릭합니다.
13. **Type**에서 `Custom TCP`를 선택합니다.
14. **Port range**에 `30000-32767`을 입력합니다.
15. **Source**에서 `Anywhere-IPv4` (0.0.0.0/0)를 선택합니다.
16. [[Save rules]] 버튼을 클릭합니다.

> [!NOTE]
> **학습 목적**: 이 단계는 Kubernetes Service와 AWS 보안 그룹의 관계를 이해하기 위한 학습 목적입니다.
>
> LoadBalancer 타입의 Service는 AWS Classic Load Balancer를 생성하고, NodePort 범위(30000-32767)를 통해 워커 노드와 통신합니다.
> 보안 그룹에 이 포트 범위를 허용해야 Load Balancer가 워커 노드의 Pod에 트래픽을 전달할 수 있습니다.
>
> **프로덕션 환경**: AWS CloudFormation 템플릿에서 미리 이 포트 범위를 설정하면 수동 수정이 불필요합니다.
> 실무에서는 인프라 코드(IaC)로 모든 보안 그룹 규칙을 사전 정의하는 것이 권장됩니다.

> [!WARNING]
> **보안 주의**: 0.0.0.0/0으로 포트를 여는 것은 실습 환경에서만 사용합니다.
> 프로덕션 환경에서는 Load Balancer의 보안 그룹만 허용하거나, 특정 IP 범위로 제한해야 합니다.
> Week 3-2에서 학습한 최소 권한 원칙을 적용합니다.

> [!NOTE]
> **Load Balancer 준비 시간**: Classic Load Balancer의 DNS가 전파되고 Health Check가 통과하기까지 3-5분이 소요될 수 있습니다.
> 보안 그룹 수정 직후 바로 접속하면 타임아웃이 발생할 수 있으므로 잠시 기다린 후 접속합니다.
>
> **연결 테스트 명령어**:
>
> ```bash
> curl -v http://$(kubectl get service nginx-app -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
> ```
>
> 이 명령어로 Load Balancer 연결 상태를 확인할 수 있습니다.

17. 웹 브라우저에서 EXTERNAL-IP 주소로 접속하여 nginx 기본 페이지를 확인합니다.

> [!TIP]
> Service도 YAML 매니페스트로 생성할 수 있습니다:
>
> ```yaml
> apiVersion: v1
> kind: Service
> metadata:
>   name: nginx-app
> spec:
>   type: LoadBalancer
>   selector:
>     app: nginx
>   ports:
>     - port: 80
>       targetPort: 80
> ```

✅ **태스크 완료**: Kubernetes Service를 생성하고 외부에서 접근했습니다.

## 마무리

다음을 성공적으로 수행했습니다:

- Amazon EKS 클러스터를 생성하고 워커 노드를 추가했습니다
- kubectl을 구성하고 Amazon EKS 클러스터에 연결했습니다
- 명령형 방식으로 Kubernetes Pod와 Deployment를 생성했습니다
- 선언형 방식으로 YAML 매니페스트를 사용하여 Deployment를 관리했습니다
- 롤링 업데이트를 수행하고 이전 버전으로 롤백했습니다
- LoadBalancer Service를 통해 애플리케이션을 외부에 노출했습니다

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
   - **Tag value**: `7-3`
6. [[Search resources]] 버튼을 클릭합니다.
7. 이 실습에서 생성한 AWS CloudFormation 스택이 표시됩니다.

> [!NOTE]
> Tag Editor는 리소스를 찾는 용도로만 사용됩니다. 실제 삭제는 각 서비스 콘솔에서 수행해야 합니다.

### 방법 2: 수동 삭제

#### Kubernetes 리소스 삭제

1. Service 삭제 전에 Load Balancer 정보를 확인합니다:

```bash
kubectl describe service nginx-app | grep "LoadBalancer Ingress"
```

> [!NOTE]
> 이 명령어로 확인한 Load Balancer 주소를 메모합니다.
> AWS 콘솔에서 해당 Load Balancer를 찾을 때 사용합니다.

2. AWS Management Console에 로그인한 후 상단 검색창에서 `Amazon EC2`를 검색하고 선택합니다.
3. 왼쪽 메뉴에서 **Load Balancers**를 선택합니다.
4. Load Balancer 목록에서 메모한 주소와 일치하는 Load Balancer를 찾습니다.
5. 해당 Load Balancer를 선택하고 **Tags** 탭을 선택합니다.
6. 태그에서 `kubernetes.io/service-name: default/nginx-app`이 있는지 확인합니다.

> [!NOTE]
> EKS가 생성한 Load Balancer는 자동 생성된 이름(예: a1b2c3d4e5f6g7h8i9)을 가지므로,
> 태그를 통해 실습에서 생성한 Load Balancer를 식별할 수 있습니다.

7. Load Balancer 이름을 메모장에 복사합니다.

> [!IMPORTANT]
> 이 Load Balancer 이름은 Service 삭제 후 Load Balancer가 완전히 삭제되었는지 확인할 때 사용합니다.
> 반드시 메모장에 저장합니다.

8. CloudShell로 이동합니다.
9. 다음 명령어를 실행하여 Service를 삭제합니다:

```bash
kubectl delete service nginx-app
```

> [!OUTPUT]
>
> ```
> service "nginx-app" deleted
> ```

> [!IMPORTANT]
> Service 삭제 후 AWS Load Balancer가 완전히 삭제될 때까지 1-2분 대기합니다.
> Load Balancer가 남아있으면 AWS CloudFormation 스택 삭제가 실패하고 Amazon VPC 삭제가 불가능합니다.

10. Amazon EC2 콘솔의 Load Balancer 목록으로 이동합니다.
11. Load Balancer 목록에서 메모한 이름의 Load Balancer가 사라졌는지 확인합니다.

> [!NOTE]
> Load Balancer가 완전히 삭제되면 목록에서 사라집니다. 1-2분 정도 소요될 수 있습니다.

12. CloudShell로 이동합니다.
13. Deployment를 삭제합니다:

```bash
kubectl delete deployment nginx-app
```

> [!NOTE]
> nginx-deployment와 nginx-pod는 태스크 3에서 이미 삭제했습니다.
> 다시 삭제를 시도하면 "not found" 오류가 표시되며, 이는 정상입니다.

> [!NOTE]
> YAML 파일(nginx-deployment.yaml)은 AWS CloudShell 홈 디렉토리에 남아있지만, AWS 리소스 비용과는 무관합니다.
> 필요시 `rm nginx-deployment.yaml` 명령어로 삭제할 수 있습니다.

#### AWS CloudFormation 스택 삭제

1. AWS CloudFormation 콘솔로 이동합니다.
2. `week7-3-eks-lab-stack` 스택을 선택합니다.
3. [[Delete]] 버튼을 클릭합니다.
4. 확인 창에서 [[Delete]] 버튼을 클릭합니다.
5. 스택 삭제가 시작됩니다. 상태가 "DELETE_IN_PROGRESS"로 표시됩니다.

> [!NOTE]
> AWS CloudFormation 스택을 삭제하면 노드 그룹, Amazon EKS 클러스터, AWS IAM 역할, Amazon VPC 등 모든 리소스가 자동으로 삭제됩니다.
> 스택 삭제에 10-15분이 소요됩니다. 페이지를 새로고침하여 최신 상태를 확인할 수 있습니다.

6. 상태가 "DELETE_COMPLETE"로 변경될 때까지 기다립니다.

> [!TROUBLESHOOTING]
> **문제**: AWS CloudFormation 스택 삭제 시 "DELETE_FAILED" 상태가 되고 Amazon VPC 삭제가 실패합니다.
>
> **원인**: Load Balancer가 완전히 삭제되지 않아 VPC에 연결된 네트워크 인터페이스(ENI)가 남아있습니다.
>
> **해결 (대부분 1단계로 해결됩니다)**:
>
> **1단계: Load Balancer 수동 삭제** ← 대부분의 경우 이 단계만으로 해결
>
> 1. Amazon EC2 콘솔로 이동합니다.
> 2. 왼쪽 메뉴에서 **Load Balancers**를 선택합니다.
> 3. `nginx-app`와 관련된 Load Balancer를 찾습니다 (태그에 `kubernetes.io/service-name: default/nginx-app` 포함).
> 4. Load Balancer를 선택하고 **Actions** > `Delete load balancer`를 선택합니다.
> 5. 확인 창에서 `confirm`을 입력하고 [[Delete]] 버튼을 클릭합니다.
> 6. 1-2분 대기한 후 AWS CloudFormation 콘솔로 이동하여 스택을 다시 삭제합니다.
>
> **2단계: 네트워크 인터페이스(ENI) 삭제** (1단계로 해결되지 않는 경우만)
>
> 1. Amazon EC2 콘솔에서 왼쪽 메뉴의 **Network Interfaces**를 선택합니다.
> 2. **Amazon VPC ID** 필터에서 실습에서 생성한 Amazon VPC ID를 입력합니다.
> 3. 상태가 "available"인 네트워크 인터페이스를 모두 선택합니다.
> 4. **Actions** > `Delete network interface`를 선택합니다.
> 5. 확인 창에서 [[Delete]] 버튼을 클릭합니다.
>
> **3단계: 보안 그룹 삭제** (1-2단계로 해결되지 않는 경우만)
>
> 1. Amazon EC2 콘솔에서 왼쪽 메뉴의 **Security Groups**를 선택합니다.
> 2. **Amazon VPC ID** 필터에서 실습에서 생성한 Amazon VPC ID를 입력합니다.
> 3. 기본 보안 그룹(default)을 제외한 모든 보안 그룹을 선택합니다.
> 4. **Actions** > `Delete security groups`를 선택합니다.
> 5. 확인 창에서 [[Delete]] 버튼을 클릭합니다.
>
> [!NOTE]
> 보안 그룹 간 참조가 있으면 삭제가 실패할 수 있습니다.
> 이 경우 각 보안 그룹의 인바운드/아웃바운드 규칙을 먼저 삭제한 후 보안 그룹을 삭제합니다.
>
> **4단계: AWS CloudFormation 스택 재삭제**
>
> 1. AWS CloudFormation 콘솔로 이동합니다.
> 2. `week7-3-eks-lab-stack` 스택을 선택합니다.
> 3. [[Delete]] 버튼을 다시 클릭합니다.
> 4. 상태가 "DELETE_COMPLETE"로 변경될 때까지 기다립니다.

✅ **실습 종료**: 모든 리소스가 정리되었습니다.

## 추가 학습 리소스

- [Amazon EKS 사용 설명서](https://docs.aws.amazon.com/eks/latest/userguide/)
- [Kubernetes 공식 문서](https://kubernetes.io/docs/home/)
- [kubectl 치트 시트](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Amazon EKS 모범 사례 가이드](https://aws.github.io/aws-eks-best-practices/)

## 📚 참고: Amazon EKS 및 Kubernetes 핵심 개념

### Amazon EKS (Elastic Kubernetes Service)

Amazon EKS는 AWS에서 제공하는 관리형 Kubernetes 서비스입니다. Kubernetes 컨트롤 플레인의 설치, 운영, 유지 관리를 자동화하여 사용자는 애플리케이션 배포에만 집중할 수 있습니다.

**주요 특징:**

- 고가용성: 여러 가용 영역에 걸쳐 컨트롤 플레인 자동 배포
- 자동 업그레이드: Kubernetes 버전 업그레이드 자동화
- AWS 통합: IAM, Amazon VPC, ELB 등 AWS 서비스와 네이티브 통합
- 보안: AWS 보안 모범 사례 자동 적용

### Kubernetes 버전 지원 정책

Amazon EKS는 Kubernetes 버전을 Standard Support와 Extended Support로 구분하여 지원합니다.

**지원 버전 확인 방법:**

CloudShell을 열고 다음 명령어를 실행하여 현재 지원되는 Kubernetes 버전을 확인합니다:

```bash
aws eks describe-addon-versions --query 'addons[0].addonVersions[0].compatibilities[*].clusterVersion' --output text | tr '\t' '\n' | sort -V | uniq
```

또는 더 간단하게:

```bash
aws eks describe-cluster-versions --query 'clusterVersions[?status==`STANDARD_SUPPORT`].clusterVersion' --output text
```

**템플릿 수정 방법:**

1. `week7-3-eks-lab.yaml` 파일을 텍스트 에디터로 엽니다.
2. `KubernetesVersion: '1.32'` 줄을 찾습니다.
3. 지원되는 최신 버전으로 변경합니다 (예: `KubernetesVersion: '1.33'` 또는 `'1.34'`).
4. 파일을 저장하고 AWS CloudFormation 스택을 생성합니다.

### kubectl 수동 설치 방법

CloudShell의 kubectl 버전이 클러스터와 호환되지 않으면 다음 명령어로 수동 설치합니다:

```bash
# 클러스터 버전 확인
CLUSTER_VERSION=$(aws eks describe-cluster --name my-eks-cluster --query 'cluster.version' --output text)
echo "클러스터 버전: $CLUSTER_VERSION"

# 해당 버전의 최신 안정 릴리스 다운로드 및 설치
curl -LO "https://dl.k8s.io/release/stable-${CLUSTER_VERSION}/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
kubectl version --client
```

> [!NOTE]
> `stable-${CLUSTER_VERSION}` URL은 해당 마이너 버전의 최신 패치 버전을 자동으로 다운로드합니다.
> 예: 클러스터가 1.32이면 1.32.x의 최신 안정 버전(예: 1.32.3)을 다운로드합니다.
>
> kubectl과 클러스터 간 버전 호환성 규칙은 위의 "Kubernetes 버전 지원 정책" 섹션을 참조합니다.

### Kubernetes 아키텍처

**컨트롤 플레인 (Control Plane):**

- API Server: 모든 요청의 진입점
- etcd: 클러스터 상태 저장소
- Scheduler: Pod를 노드에 할당
- Controller Manager: 클러스터 상태 관리

**워커 노드 (Worker Node):**

- kubelet: 노드에서 Pod 실행 관리
- kube-proxy: 네트워크 규칙 관리
- Container Runtime: 컨테이너 실행 (Docker, containerd 등)

### Kubernetes 리소스

**Pod:**

- Kubernetes의 가장 작은 배포 단위
- 하나 이상의 컨테이너를 포함
- 동일한 네트워크 네임스페이스 공유
- 일시적(ephemeral)이며 재시작 시 IP 변경

**Deployment:**

- Pod의 선언적 업데이트 제공
- 원하는 상태(desired state) 유지
- 롤링 업데이트 및 롤백 지원
- ReplicaSet을 통한 Pod 복제 관리

**Service:**

- Pod에 대한 안정적인 네트워크 엔드포인트 제공
- 로드 밸런싱 기능 내장
- 타입: ClusterIP, NodePort, LoadBalancer, ExternalName

### 명령형 vs 선언형 방식

**명령형 (Imperative):**

- 명령어로 직접 리소스 생성 및 수정
- 예: `kubectl create`, `kubectl scale`, `kubectl expose`
- 장점: 빠르고 간단, 학습 및 테스트에 적합
- 단점: 버전 관리 어려움, 재현성 낮음, 변경 이력 추적 불가

**선언형 (Declarative):**

- YAML 파일로 원하는 상태 정의 후 `kubectl apply` 실행
- 예: `kubectl apply -f deployment.yaml`
- 장점: Git으로 버전 관리, 재현 가능, 변경 이력 추적, 프로덕션 권장
- 단점: 초기 학습 곡선, YAML 문법 이해 필요

**프로덕션 권장사항:**

- 개발/테스트: 명령형 방식으로 빠르게 실험
- 프로덕션: 선언형 방식으로 YAML 파일 관리
- GitOps: Git 저장소에 YAML 파일 저장, CI/CD 파이프라인 자동 배포

### 롤링 업데이트 (Rolling Update)

**개념:**

- 애플리케이션의 다운타임 없이 새 버전으로 점진적 업데이트
- Kubernetes의 기본 배포 전략
- 무중단 배포(Zero-downtime deployment) 구현

**동작 방식:**

1. 새 버전의 Pod를 하나씩 생성합니다.
2. 새 Pod가 Ready 상태가 되면 기존 Pod를 하나씩 종료합니다.
3. 모든 Pod가 새 버전으로 교체될 때까지 반복합니다.

**롤링 업데이트 전략 설정:**

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1 # 동시에 생성할 수 있는 추가 Pod 수
      maxUnavailable: 0 # 동시에 사용 불가능한 Pod 수
```

**maxSurge:**

- 원하는 Pod 수를 초과하여 생성할 수 있는 최대 Pod 수
- 예: replicas=3, maxSurge=1 → 업데이트 중 최대 4개 Pod 실행
- 값: 숫자 또는 백분율 (예: 1, 25%)

**maxUnavailable:**

- 업데이트 중 사용 불가능한 최대 Pod 수
- 예: replicas=3, maxUnavailable=1 → 최소 2개 Pod는 항상 실행
- 값: 숫자 또는 백분율 (예: 1, 25%)

**롤백 (Rollback):**

- 이전 버전으로 빠르게 복구
- 명령어: `kubectl rollout undo deployment/<name>`
- 특정 리비전으로 롤백: `kubectl rollout undo deployment/<name> --to-revision=<n>`
- 롤아웃 히스토리: `kubectl rollout history deployment/<name>`

**모범 사례:**

- 프로덕션에서는 maxUnavailable=0 설정 (무중단 보장)
- Health Check (Readiness Probe) 설정 필수
- 롤아웃 히스토리 보존: `revisionHistoryLimit: 10`
- 점진적 롤아웃: Canary 배포, Blue-Green 배포 고려

### kubectl 주요 명령어

**리소스 조회:**

```bash
kubectl get pods                    # Pod 목록
kubectl get deployments             # Deployment 목록
kubectl get services                # Service 목록
kubectl get nodes                   # 노드 목록
kubectl get all                     # 모든 리소스
```

**리소스 상세 정보:**

```bash
kubectl describe pod <pod-name>     # Pod 상세 정보
kubectl logs <pod-name>             # Pod 로그
kubectl exec -it <pod-name> -- bash # Pod 내부 접속
```

**리소스 생성 및 수정:**

```bash
kubectl create deployment <name> --image=<image>  # Deployment 생성
kubectl scale deployment <name> --replicas=<n>    # 스케일링
kubectl expose deployment <name> --port=<port>    # Service 생성
kubectl delete pod <pod-name>                     # Pod 삭제
```

### Amazon EKS 노드 그룹

**관리형 노드 그룹:**

- AWS가 Amazon EC2 인스턴스 수명 주기 관리
- 자동 업데이트 및 패치 적용
- Auto Scaling 그룹 자동 생성
- 권장 방식

**자체 관리형 노드:**

- 사용자가 직접 Amazon EC2 인스턴스 관리
- 더 많은 제어권 제공
- 특수한 요구사항이 있을 때 사용

### AWS IAM 역할 및 권한

**클러스터 역할 (eks-cluster-role):**

- EKS가 AWS 리소스를 관리하기 위한 권한
- AmazonEKSClusterPolicy 필요
- Amazon VPC, 로드 밸런서, 보안 그룹 관리

**노드 역할 (eks-node-role):**

- 워커 노드가 AWS 리소스에 접근하기 위한 권한
- AmazonEKSWorkerNodePolicy: 노드 기본 권한
- AmazonEC2ContainerRegistryReadOnly: ECR 이미지 pull
- AmazonEKS_CNI_Policy: 네트워크 플러그인 권한

### 네트워킹

**Amazon VPC CNI (Container Network Interface):**

- 각 Pod에 Amazon VPC IP 주소 할당
- AWS 네트워크와 네이티브 통합
- 보안 그룹을 Pod에 직접 적용 가능

**Service 타입별 네트워킹:**

- ClusterIP: 클러스터 내부에서만 접근 가능
- NodePort: 각 노드의 특정 포트로 접근
- LoadBalancer: AWS ELB를 자동 생성하여 외부 노출

### LoadBalancer Service와 AWS Load Balancer

**기본 동작 (Classic Load Balancer):**

- `kubectl expose --type=LoadBalancer` 명령은 기본적으로 Classic Load Balancer를 생성합니다
- NodePort 범위(30000-32767)를 통해 워커 노드와 통신합니다
- 학습 및 테스트 환경에서는 충분히 사용 가능합니다

**프로덕션 환경 권장사항 (ALB/NLB):**

AWS에서는 Classic Load Balancer를 레거시로 분류하고, Application Load Balancer(ALB) 또는 Network Load Balancer(NLB) 사용을 권장합니다.

**AWS Load Balancer Controller 사용:**

1. AWS Load Balancer Controller를 클러스터에 설치합니다.
2. Ingress 리소스(ALB) 또는 Service 어노테이션(NLB)을 사용합니다.

**ALB 사용 예시 (Ingress):**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
spec:
  ingressClassName: alb
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nginx-app
                port:
                  number: 80
```

**NLB 사용 예시 (Service 어노테이션):**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-app
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: 'nlb'
    service.beta.kubernetes.io/aws-load-balancer-scheme: 'internet-facing'
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
    - port: 80
      targetPort: 80
```

**Classic LB vs ALB/NLB 비교:**

| 특징                   | Classic LB       | ALB               | NLB           |
| ---------------------- | ---------------- | ----------------- | ------------- |
| **OSI 계층**           | Layer 4/7        | Layer 7           | Layer 4       |
| **프로토콜**           | HTTP, HTTPS, TCP | HTTP, HTTPS, gRPC | TCP, UDP, TLS |
| **경로 기반 라우팅**   | ❌               | ✅                | ❌            |
| **호스트 기반 라우팅** | ❌               | ✅                | ❌            |
| **WebSocket**          | ✅               | ✅                | ✅            |
| **고정 IP**            | ❌               | ❌                | ✅            |
| **성능**               | 보통             | 높음              | 매우 높음     |
| **비용**               | 낮음             | 중간              | 중간          |
| **AWS 권장**           | ❌ (레거시)      | ✅                | ✅            |

**프로덕션 환경 선택 가이드:**

- **HTTP/HTTPS 애플리케이션**: ALB 사용 (경로 기반 라우팅, SSL 종료, WAF 통합)
- **고성능 TCP/UDP**: NLB 사용 (낮은 지연 시간, 고정 IP, 초당 수백만 요청)
- **레거시 마이그레이션**: Classic LB에서 ALB/NLB로 마이그레이션 계획 수립

**참고 자료:**

- [AWS Load Balancer Controller 설치 가이드](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html)
- [ALB Ingress 어노테이션](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/ingress/annotations/)
- [NLB Service 어노테이션](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)

### 모범 사례

**보안:**

- AWS IAM 역할을 사용한 Pod 권한 관리 (IRSA)
- 네트워크 정책으로 Pod 간 통신 제어
- Secrets를 사용한 민감 정보 관리
- 최소 권한 원칙 적용

**성능:**

- 적절한 리소스 요청(requests) 및 제한(limits) 설정
- Horizontal Pod Autoscaler 활용
- Cluster Autoscaler로 노드 자동 확장
- 여러 가용 영역에 노드 분산

**비용 최적화:**

- Spot 인스턴스 활용
- 적절한 인스턴스 타입 선택
- 사용하지 않는 리소스 정리
- 리소스 요청 최적화

### 문제 해결

**Pod가 Pending 상태:**

- 노드 리소스 부족 확인
- PersistentVolume 바인딩 확인
- 노드 셀렉터 및 어피니티 규칙 확인

**Pod가 CrashLoopBackOff:**

- 로그 확인: `kubectl logs <pod-name>`
- 이벤트 확인: `kubectl describe pod <pod-name>`
- 컨테이너 이미지 및 설정 검증

**Service 접근 불가:**

- Service 엔드포인트 확인: `kubectl get endpoints`
- 보안 그룹 규칙 확인
- 네트워크 정책 확인

### QuickTable 프로젝트 적용 예시

**Week 9-2에서 활용할 컨테이너 빌드 프로세스:**

이 실습에서 학습한 EKS와 kubectl 개념은 Week 9-2에서 다음과 같이 활용됩니다:

**1. Docker 이미지 빌드 (buildspec.yml)**:

```yaml
version: 0.2
phases:
  build:
    commands:
      - docker build -t quicktable-api:latest .
      - docker tag quicktable-api:latest $ECR_REPO:latest
      - docker push $ECR_REPO:latest
```

**2. Amazon ECR에 이미지 푸시**:

- AWS CodeBuild가 자동으로 Docker 이미지 빌드
- Amazon ECR(Elastic Container Registry)에 이미지 저장
- 버전 태그 관리 (latest, v1.0.0 등)

**3. Week 9-3에서 S3 정적 웹사이트 배포**:

- QuickTable 프론트엔드를 S3에 배포
- CodePipeline으로 자동 배포 파이프라인 구성
- CloudFront CDN 연동 (Week 10-3)

**학습 연계**:

- **Week 7-3**: Kubernetes 기본 개념 (Pod, Deployment, Service)
- **Week 9-2**: 컨테이너 이미지 빌드 및 ECR 푸시 (CI/CD)
- **Week 9-3**: S3 정적 웹사이트 자동 배포 (CI/CD)
- **Week 10-3**: CloudFront로 글로벌 배포 (성능 최적화)

**실전 프로젝트 흐름**:

1. EKS 클러스터 이해 (Week 7-3).
2. 컨테이너 이미지 빌드 자동화 (Week 9-2).
3. 웹사이트 배포 자동화 (Week 9-3).
4. CDN으로 성능 최적화 (Week 10-3).
