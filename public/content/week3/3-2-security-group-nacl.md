---
title: '3-tier 아키텍처 보안 그룹 및 NACL 구성'
week: 3
session: 2
awsServices:
  - Amazon VPC
learningObjectives:
  - Amazon VPC 핵심 구성 요소와 역할을 설명할 수 있습니다
  - CIDR 블록 설계 원칙을 이해하고 서브넷 구성에 적용할 수 있습니다
  - Amazon VPC Endpoints의 유형을 이해하고 적절한 프라이빗 연결을 선택할 수 있습니다
  - 다층 방어 전략의 개념과 네트워크 보안 계층 구성을 이해할 수 있습니다
  - 보안 그룹과 NACL의 차이를 이해하고 활용할 수 있습니다
  - 멀티 VPC 설계 시나리오를 비교하고 VPC Peering으로 연결할 수 있습니다
  - AWS Transit Gateway로 허브-스포크 네트워크를 설계할 수 있습니다
prerequisites:
  - Week 3-1 완료.
  - Amazon VPC 및 서브넷 개념 이해.
---

이 실습에서는 3-Tier 아키텍처에 맞는 보안 그룹과 NACL을 구성하여 다층 보안을 구현합니다. 보안 그룹 체인을 설계하여 ALB, Web Server, App Server, Database 간의 트래픽을 제어하고, NACL을 사용하여 서브넷 레벨의 방화벽을 구성합니다. 이를 통해 다층 방어 네트워크 보안 전략, 보안 그룹과 NACL 비교 및 활용 방법을 학습합니다.

> [!NOTE]
> 이 실습에서는 보안 그룹 규칙의 설계와 구성 방법을 학습합니다. 실제 트래픽 테스트를 위해서는 각 계층에 Amazon EC2 인스턴스, ALB, RDS를 배포하고 보안 그룹을 연결해야 합니다. 이는 후속 실습에서 다룹니다.

> [!DOWNLOAD]
> [week3-2-security-group-lab.zip](/files/week3/week3-2-security-group-lab.zip)
>
> - `week3-2-security-group-lab.yaml` - 3-Tier Amazon VPC 및 빈 보안 그룹 AWS CloudFormation 템플릿
> - `README.md` - 아키텍처 설명 및 보안 그룹 규칙 레퍼런스
>
> **관련 태스크:**
>
> - 태스크 0: Amazon VPC 환경 구축 (AWS CloudFormation 템플릿 배포하여 Amazon VPC, 서브넷, 빈 보안 그룹 자동 생성)
> - 태스크 1-5: 각 계층별 보안 그룹 규칙 추가 (README.md 참조)

> [!WARNING]
> 이 실습에서 생성하는 리소스는 실습 종료 후 반드시 삭제해야 합니다.
>
> **예상 비용** (ap-northeast-2 리전 기준):
>
> | 리소스      | 타입 | 시간당 비용   |
> | ----------- | ---- | ------------- |
> | NAT Gateway | -    | 약 $0.045     |
> | **총 예상** | -    | **약 $0.045** |

## 태스크 0: Amazon VPC 환경 구축

이 태스크에서는 CloudFormation을 사용하여 3-Tier 아키텍처를 위한 Amazon VPC 환경을 구축합니다.

### 아키텍처 개요

이 실습에서 구축할 3-Tier 보안 그룹 아키텍처는 다음과 같습니다:

![3-Tier 보안 그룹 아키텍처 - ALB, Web Tier, App Tier, DB Tier로 구성된 계층별 보안 그룹 체인 구조](/images/week3/3-2-architecture-diagram.png)

**아키텍처 구성**:

- **ALB-SG (Application Load Balancer)**: 인터넷(0.0.0.0/0)에서 HTTP/HTTPS 트래픽 허용
- **Web-Tier-SG (웹 서버 계층)**: ALB-SG로부터만 HTTP/HTTPS 트래픽 허용
- **App-Tier-SG (애플리케이션 계층)**: Web-Tier-SG로부터만 Port 8080 트래픽 허용
- **DB-Tier-SG (데이터베이스 계층)**: App-Tier-SG로부터만 MySQL 3306 트래픽 허용
- **Public NACL**: 퍼블릭 서브넷에 HTTP/HTTPS/SSH 및 임시 포트 허용
- **Private NACL**: 프라이빗 서브넷에 Amazon VPC 내부 트래픽 및 임시 포트 허용

> [!NOTE]
> 보안 그룹 체인(Security Group Chain)을 사용하면 각 계층이 이전 계층으로부터만 트래픽을 받도록 제어할 수 있습니다. 이는 최소 권한 원칙(Least Privilege)과 심층 방어(Defense in Depth) 전략을 구현하는 핵심 방법입니다.

### 환경 구성 요소

AWS CloudFormation 스택은 다음 리소스를 생성합니다:

- **Amazon VPC 및 네트워크**: Amazon VPC, 퍼블릭/프라이빗 서브넷, 인터넷 게이트웨이, NAT Gateway
- **라우팅 테이블**: 퍼블릭 및 프라이빗 서브넷용 라우팅 테이블
- **인바운드 규칙이 비어있는 보안 그룹 4개**: ALB-SG, Web-Tier-SG, App-Tier-SG, DB-Tier-SG (규칙 없이 생성되며, 태스크 1-4에서 학생이 직접 인바운드 규칙 추가)

### 상세 단계

1. 다운로드한 `week3-2-security-group-lab.zip` 파일의 압축을 해제합니다.
2. `week3-2-security-group-lab.yaml` 파일을 확인합니다.
3. AWS Management Console에 로그인한 후 상단 검색창에서 `AWS CloudFormation`을 검색하고 선택합니다.
4. [[Create stack]] 버튼을 클릭합니다.
5. **Prerequisite - Prepare template**에서 `Template is ready`를 선택합니다.
6. **Specify template**에서 `Upload a template file`을 선택합니다.
7. [[Choose file]] 버튼을 클릭한 후 `week3-2-security-group-lab.yaml` 파일을 선택합니다.
8. [[Next]] 버튼을 클릭합니다.
9. **Stack name**에 `week3-2-security-group-stack`을 입력합니다.
10. **Parameters** 섹션에서 필요한 파라미터를 확인합니다 (대부분 기본값 사용).
11. [[Next]] 버튼을 클릭합니다.
12. **Configure stack options** 페이지에서 아래로 스크롤하여 **Tags** 섹션을 찾습니다.
13. [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key         | Value     |
| ----------- | --------- |
| `Project`   | `AWS-Lab` |
| `Week`      | `3-2`     |
| `CreatedBy` | `Student` |

14. [[Next]] 버튼을 클릭합니다.

> [!NOTE]
> **Review and create** 페이지가 열립니다.

15. [[Submit]] 버튼을 클릭합니다.

> [!NOTE]
> AWS CloudFormation 스택 목록 페이지로 자동 이동합니다.

16. 테이블에서 `week3-2-security-group-stack` 스택을 찾습니다.
17. 스택을 클릭하여 상세 페이지로 이동합니다.
18. **Events** 탭을 선택합니다.

> [!NOTE]
> 스택 생성에 5-7분이 소요됩니다. **Events** 탭에서 리소스 생성 과정을 실시간으로 확인할 수 있습니다. 대기하는 동안 이전 차시 내용을 복습하거나 다음 태스크를 미리 읽어보세요.

19. 페이지를 새로고침하여 최신 상태를 확인합니다.
20. 페이지 상단의 **Status** 필드를 확인합니다.
21. **Status**가 "CREATE_COMPLETE"로 변경될 때까지 19-20단계를 반복합니다.
22. **Outputs** 탭을 선택합니다.
23. 각 출력값 오른쪽의 복사 아이콘을 클릭하여 메모장에 복사합니다:
    - `VpcId`: Amazon VPC ID
    - `PublicSubnetAId`: 퍼블릭 서브넷 A ID
    - `PublicSubnetCId`: 퍼블릭 서브넷 C ID
    - `PrivateSubnetAId`: 프라이빗 서브넷 A ID
    - `PrivateSubnetCId`: 프라이빗 서브넷 C ID

> [!IMPORTANT]
> 이 출력값들은 다음 태스크에서 사용됩니다. 반드시 메모장에 저장합니다.

✅ **태스크 완료**: 3-Tier Amazon VPC 환경이 구축되었습니다.

### CloudFormation이 생성한 빈 보안 그룹 확인

다음 태스크를 시작하기 전에 CloudFormation이 생성한 4개의 빈 보안 그룹을 확인합니다.

24. AWS Management Console에 로그인한 후 상단 검색창에서 `Amazon VPC`를 검색하고 선택합니다.
25. 왼쪽 메뉴에서 **Security groups**를 선택합니다.
26. 검색창에 `week3-2-security-group`을 입력하여 필터링합니다.
27. 다음 4개의 보안 그룹이 표시되는지 확인합니다:
    - `week3-2-security-group-ALB-SG`
    - `week3-2-security-group-Web-SG`
    - `week3-2-security-group-App-SG`
    - `week3-2-security-group-DB-SG`
28. 각 보안 그룹을 선택하고 하단의 **Inbound rules** 탭을 확인합니다.

> [!NOTE]
> 모든 보안 그룹의 인바운드 규칙이 비어 있습니다. CloudFormation이 빈 보안 그룹만 생성했으며, 다음 태스크에서 학생이 직접 인바운드 규칙을 추가합니다.
>
> **학습 목적**: CloudFormation이 빈 보안 그룹만 생성한 이유는 학생들이 직접 인바운드 규칙을 추가하면서 보안 그룹 체인의 구성 방법을 체험하기 위함입니다. 실무에서는 AWS CloudFormation 템플릿에 모든 규칙을 포함하여 자동화합니다.

✅ **확인 완료**: 빈 보안 그룹 4개가 준비되었습니다.

## 태스크 1: ALB 보안 그룹 인바운드 규칙 구성

이 태스크에서는 Application Load Balancer용 보안 그룹에 인바운드 규칙을 추가합니다.

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Amazon VPC`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Security groups**를 선택합니다.
3. `week3-2-security-group-ALB-SG` 보안 그룹을 선택합니다.
4. 하단의 **Inbound rules** 탭을 선택합니다.
5. [[Edit inbound rules]] 버튼을 클릭합니다.
6. [[Add rule]] 버튼을 클릭합니다.
7. 첫 번째 규칙을 설정합니다:
   - **Type**에서 `HTTP`를 선택합니다.
   - **Source**에서 `0.0.0.0/0`을 입력합니다.
   - **Description**에 `Allow HTTP from internet`를 입력합니다.
8. [[Add rule]] 버튼을 다시 클릭합니다.
9. 두 번째 규칙을 설정합니다:
   - **Type**에서 `HTTPS`를 선택합니다.
   - **Source**에서 `0.0.0.0/0`을 입력합니다.
   - **Description**에 `Allow HTTPS from internet`를 입력합니다.
10. [[Save rules]] 버튼을 클릭합니다.

✅ **태스크 완료**: ALB 보안 그룹 인바운드 규칙이 구성되었습니다.

## 태스크 2: Web Tier 보안 그룹 인바운드 규칙 구성

이 태스크에서는 웹 서버 계층 보안 그룹에 인바운드 규칙을 추가합니다. ALB로부터의 HTTP 트래픽만 허용하도록 설정합니다.

1. `week3-2-security-group-Web-SG` 보안 그룹을 선택합니다.
2. 하단의 **Inbound rules** 탭을 선택합니다.
3. [[Edit inbound rules]] 버튼을 클릭합니다.
4. [[Add rule]] 버튼을 클릭합니다.
5. 첫 번째 규칙을 설정합니다:
   - **Type**에서 `HTTP`를 선택합니다.
   - **Source**에서 `Custom`을 선택한 후, 검색 필드에 `ALB-SG`를 입력하여 `week3-2-security-group-ALB-SG`를 찾아 선택합니다.
   - **Description**에 `Allow HTTP from ALB`를 입력합니다.
6. [[Add rule]] 버튼을 다시 클릭합니다.
7. 두 번째 규칙을 설정합니다:
   - **Type**에서 `HTTPS`를 선택합니다.
   - **Source**에서 `Custom`을 선택한 후, 검색 필드에 `ALB-SG`를 입력하여 `week3-2-security-group-ALB-SG`를 찾아 선택합니다.
   - **Description**에 `Allow HTTPS from ALB`를 입력합니다.
8. [[Add rule]] 버튼을 다시 클릭합니다.
9. 세 번째 규칙을 설정합니다:
   - **Type**에서 `SSH`를 선택합니다.
   - **Source**에서 `My IP`를 선택합니다.
   - **Description**에 `Allow SSH from my IP`를 입력합니다.

> [!NOTE]
> **"My IP" 동작 방식**: "My IP"는 현재 콘솔에 접속한 IP 주소를 자동으로 감지합니다. 카페, 학교 등 네트워크 환경이 변경되면 IP가 달라지므로 SSH 접근이 차단될 수 있습니다. 이 경우 보안 그룹 규칙을 업데이트해야 합니다.

> [!WARNING]
> **학교/회사 네트워크에서 "My IP" 사용 시 주의사항**: 학교나 회사 네트워크에서 "My IP"를 선택하면 해당 네트워크의 공인 IP가 자동으로 입력됩니다. 이 경우 다음 사항에 유의해야 합니다:
>
> **공유 IP 문제**: NAT를 사용하는 환경에서는 여러 사용자가 동일한 공인 IP를 공유합니다. 따라서 본인만 접근하려고 해도 같은 네트워크의 다른 사용자도 SSH 접근이 가능합니다.
>
> **IP 변경 문제**: 학교/회사 네트워크의 공인 IP는 관리자가 변경할 수 있으며, DHCP로 동적 할당되는 경우 주기적으로 변경될 수 있습니다. IP가 변경되면 SSH 접근이 차단됩니다.
>
> **방화벽 제한**: 학교/회사 방화벽이 특정 포트(SSH 22번 등)를 차단하는 경우 보안 그룹 규칙과 무관하게 접근이 불가능합니다.
>
> **권장 사항**: 개인 네트워크(집, 카페 등)에서 실습하거나, Session Manager를 사용하여 SSH 없이 EC2에 접속하는 것을 권장합니다.

> [!IMPORTANT]
> **프라이빗 서브넷 SSH 접근 제한**: 이 실습에서 Web-SG에 "My IP"로 SSH 규칙을 추가하지만, 프라이빗 서브넷에 있는 Web Server는 퍼블릭 IP가 없어 인터넷에서 직접 SSH 접속이 불가능합니다. 실제로 프라이빗 서브넷의 EC2에 SSH로 접속하려면 다음 방법 중 하나를 사용해야 합니다:
>
> **접근 방법**:
>
> - **Bastion Host**: 퍼블릭 서브넷에 Bastion Host를 배치하고, Bastion을 통해 프라이빗 서브넷의 EC2에 접속
> - **VPN 연결**: AWS VPN 또는 Direct Connect를 통해 VPC 내부 네트워크에 접속
> - **Session Manager**: AWS Systems Manager Session Manager를 사용하여 SSH 없이 브라우저에서 접속 (권장)
>
> **이 실습의 목적**: 이 SSH 규칙은 보안 그룹 설정 방법을 학습하기 위한 것입니다. 실제 프로덕션 환경에서는 프라이빗 서브넷의 EC2에 직접 SSH 규칙을 추가하지 않고, Bastion Host나 Session Manager를 통해 접근합니다.

10. [[Save rules]] 버튼을 클릭합니다.

✅ **태스크 완료**: Web Tier 보안 그룹 인바운드 규칙이 구성되었습니다.

## 태스크 3: App Tier 보안 그룹 인바운드 규칙 구성

이 태스크에서는 애플리케이션 서버 계층 보안 그룹에 인바운드 규칙을 추가합니다. Web Tier로부터의 트래픽만 허용하도록 설정합니다.

1. `week3-2-security-group-App-SG` 보안 그룹을 선택합니다.
2. 하단의 **Inbound rules** 탭을 선택합니다.
3. [[Edit inbound rules]] 버튼을 클릭합니다.
4. [[Add rule]] 버튼을 클릭합니다.
5. 첫 번째 규칙을 설정합니다:
   - **Type**에서 `Custom TCP`를 선택합니다.
   - **Port range**에 `8080`을 입력합니다.
   - **Source**에서 `Custom`을 선택한 후, 검색 필드에 `Web-SG`를 입력하여 `week3-2-security-group-Web-SG`를 찾아 선택합니다.
   - **Description**에 `Allow 8080 from Web tier`를 입력합니다.
6. [[Add rule]] 버튼을 다시 클릭합니다.
7. 두 번째 규칙을 설정합니다:
   - **Type**에서 `SSH`를 선택합니다.
   - **Source**에서 `Custom`을 선택한 후, 검색 필드에 `Web-SG`를 입력하여 `week3-2-security-group-Web-SG`를 찾아 선택합니다.
   - **Description**에 `Allow SSH from Web tier`를 입력합니다.
8. [[Save rules]] 버튼을 클릭합니다.

✅ **태스크 완료**: App Tier 보안 그룹 인바운드 규칙이 구성되었습니다.

## 태스크 4: DB Tier 보안 그룹 인바운드 규칙 구성

이 태스크에서는 데이터베이스 계층 보안 그룹에 인바운드 규칙을 추가합니다. App Tier로부터의 데이터베이스 트래픽만 허용하도록 설정합니다.

1. `week3-2-security-group-DB-SG` 보안 그룹을 선택합니다.
2. 하단의 **Inbound rules** 탭을 선택합니다.
3. [[Edit inbound rules]] 버튼을 클릭합니다.
4. [[Add rule]] 버튼을 클릭합니다.
5. 첫 번째 규칙을 설정합니다:
   - **Type**에서 `MySQL/Aurora`를 선택합니다.
   - **Source**에서 `Custom`을 선택한 후, 검색 필드에 `App-SG`를 입력하여 `week3-2-security-group-App-SG`를 찾아 선택합니다.
   - **Description**에 `Allow MySQL from App tier`를 입력합니다.
6. [[Save rules]] 버튼을 클릭합니다.

> [!NOTE]
> DB 계층은 App 계층에서만 접근 가능하도록 구성하여 보안을 강화합니다.

✅ **태스크 완료**: DB Tier 보안 그룹 인바운드 규칙이 구성되었습니다.

## 태스크 5: 보안 그룹 체인 이해도 확인

이 태스크에서는 보안 그룹 체인의 동작 원리를 이해하고 있는지 확인합니다. 다음 시나리오를 분석하여 트래픽이 허용되는지 차단되는지 판단합니다.

> [!NOTE]
> **이 태스크의 목적**: 태스크 1-4에서 구성한 보안 그룹 체인이 실제로 어떻게 동작하는지 이해하는 것입니다. 각 시나리오를 분석하면서 보안 그룹 체인의 원리를 체험합니다.

### 시나리오 분석

다음 각 시나리오에서 트래픽이 허용되는지 차단되는지 판단하고, 그 이유를 생각해봅니다.

**시나리오 1: 인터넷 → ALB (HTTP)**

- 출발지: 인터넷 (0.0.0.0/0)
- 목적지: ALB (ALB-SG)
- 프로토콜: HTTP (80)
- 결과: ?

**시나리오 2: ALB → Web Server (HTTP)**

- 출발지: ALB (ALB-SG)
- 목적지: Web Server (Web-Tier-SG)
- 프로토콜: HTTP (80)
- 결과: ?

**시나리오 3: 인터넷 → Web Server (HTTP)**

- 출발지: 인터넷 (0.0.0.0/0)
- 목적지: Web Server (Web-Tier-SG)
- 프로토콜: HTTP (80)
- 결과: ?

**시나리오 4: Web Server → App Server (8080)**

- 출발지: Web Server (Web-Tier-SG)
- 목적지: App Server (App-Tier-SG)
- 프로토콜: Custom TCP (8080)
- 결과: ?

**시나리오 5: Web Server → Database (3306)**

- 출발지: Web Server (Web-Tier-SG)
- 목적지: Database (DB-Tier-SG)
- 프로토콜: MySQL (3306)
- 결과: ?

**시나리오 6: App Server → Database (3306)**

- 출발지: App Server (App-Tier-SG)
- 목적지: Database (DB-Tier-SG)
- 프로토콜: MySQL (3306)
- 결과: ?

### 정답 확인

1. Amazon VPC 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **Security groups**를 선택합니다.
3. 각 보안 그룹의 인바운드 규칙을 확인하여 위 시나리오의 정답을 확인합니다.

> [!NOTE]
> **정답 및 해설**:
>
> **시나리오 1: ✅ 허용**
>
> - ALB-SG 인바운드 규칙에 "HTTP (80) from 0.0.0.0/0"이 있으므로 허용됩니다.
>
> **시나리오 2: ✅ 허용**
>
> - Web-Tier-SG 인바운드 규칙에 "HTTP (80) from ALB-SG"가 있으므로 허용됩니다.
>
> **시나리오 3: ❌ 차단**
>
> - Web-Tier-SG 인바운드 규칙에 "HTTP (80) from ALB-SG"만 있고, 인터넷(0.0.0.0/0)에서의 직접 접근은 허용하지 않으므로 차단됩니다.
> - 이것이 보안 그룹 체인의 핵심입니다. Web Server는 ALB를 통해서만 접근 가능합니다.
>
> **시나리오 4: ✅ 허용**
>
> - App-Tier-SG 인바운드 규칙에 "Custom TCP (8080) from Web-Tier-SG"가 있으므로 허용됩니다.
>
> **시나리오 5: ❌ 차단**
>
> - DB-Tier-SG 인바운드 규칙에 "MySQL (3306) from App-Tier-SG"만 있고, Web-Tier-SG에서의 직접 접근은 허용하지 않으므로 차단됩니다.
> - 데이터베이스는 App Server를 통해서만 접근 가능합니다.
>
> **시나리오 6: ✅ 허용**
>
> - DB-Tier-SG 인바운드 규칙에 "MySQL (3306) from App-Tier-SG"가 있으므로 허용됩니다.

> [!IMPORTANT]
> **보안 그룹 체인의 핵심 원리**: 각 계층은 이전 계층으로부터만 트래픽을 받도록 제한됩니다. 이를 통해 최소 권한 원칙(Least Privilege)과 심층 방어(Defense in Depth)를 구현합니다.
>
> **실무 적용**: 프로덕션 환경에서는 이러한 보안 그룹 체인을 사용하여 각 계층을 격리하고, 공격자가 한 계층을 침투하더라도 다른 계층으로 확산되는 것을 방지합니다.

> [!NOTE]
> **아웃바운드 규칙과 Stateful 특성**: 보안 그룹은 Stateful이므로 인바운드로 허용된 트래픽의 응답은 자동으로 허용됩니다. 따라서 대부분의 경우 아웃바운드 규칙을 수정할 필요가 없습니다. 하지만 보안을 더욱 강화하려면 DB 계층의 아웃바운드를 App 계층으로만 제한할 수 있습니다.

✅ **태스크 완료**: 보안 그룹 체인의 동작 원리를 이해했습니다.

## 태스크 6: Public 서브넷용 NACL 생성

이 태스크에서는 Public 서브넷을 위한 Network ACL을 생성합니다. NACL은 서브넷 레벨에서 인바운드 및 아웃바운드 트래픽을 제어하는 상태 비저장 방화벽입니다.

1. 왼쪽 메뉴에서 **Network ACLs**를 선택합니다.
2. [[Create network ACL]] 버튼을 클릭합니다.
3. **Name**에 `Public-NACL`을 입력합니다.
4. **Amazon VPC**에서 CloudFormation이 생성한 VPC를 선택합니다.

> [!TIP]
> Amazon VPC ID는 메모장에 저장한 VpcId와 일치해야 합니다. Amazon VPC 이름에 "week3-2-security-group"이 포함되어 있는지 확인합니다.

5. **Tags - optional** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key         | Value     |
| ----------- | --------- |
| `Project`   | `AWS-Lab` |
| `Week`      | `3-2`     |
| `CreatedBy` | `Student` |

6. [[Create network ACL]] 버튼을 클릭합니다.

### 인바운드 규칙 설정

7. 생성된 `Public-NACL`을 선택합니다.
8. 하단의 **Inbound rules** 탭을 선택합니다.
9. [[Edit inbound rules]] 버튼을 클릭합니다.
10. 다음 4개의 인바운드 규칙을 [[Add new rule]] 버튼을 클릭하여 순서대로 추가합니다:

    **규칙 1 - HTTP 트래픽 허용**

- Rule number: `100`
- Type: `HTTP (80)`
- Source: `0.0.0.0/0`
- Allow/Deny: `Allow`

**규칙 2 - HTTPS 트래픽 허용**

- Rule number: `110`
- Type: `HTTPS (443)`
- Source: `0.0.0.0/0`
- Allow/Deny: `Allow`

**규칙 3 - SSH 트래픽 허용**

- Rule number: `120`
- Type: `SSH (22)`
- Source: `0.0.0.0/0`
- Allow/Deny: `Allow`

> [!WARNING]
> 이 실습에서는 편의를 위해 SSH를 전체 인터넷(0.0.0.0/0)에서 허용하지만, 프로덕션 환경에서는 반드시 특정 IP 주소 또는 IP 범위로 제한해야 합니다. 보안 그룹에서 "My IP"로 제한했더라도 NACL에서 전체 허용하면 보안이 약화됩니다.

**규칙 4 - 임시 포트 허용 (응답 트래픽용)**

- Rule number: `130`
- Type: `Custom TCP`
- Port range: `1024-65535`
- Source: `0.0.0.0/0`
- Allow/Deny: `Allow`

11. [[Save changes]] 버튼을 클릭합니다.

> [!NOTE]
> **임시 포트 (Ephemeral Ports)**: 클라이언트가 서버에 요청을 보낼 때, 서버의 응답을 받기 위해 클라이언트 측에서 임시로 열리는 포트입니다 (1024-65535 범위). 예를 들어, 브라우저가 웹 서버(포트 80)에 접속할 때 브라우저는 자신의 임시 포트(예: 50234)를 열어서 응답을 받습니다. NACL은 Stateless이므로 응답 트래픽을 위해 이 포트 범위를 명시적으로 허용해야 합니다.
>
> **NACL 규칙 번호 평가 순서**: NACL 규칙은 번호가 작은 것부터 순서대로 평가됩니다. 첫 번째로 매칭되는 규칙이 적용되고 나머지는 무시됩니다. 10 간격(100, 110, 120...)으로 설정하면 나중에 중간에 규칙을 추가할 수 있어 유연합니다. 예를 들어, 105번에 특정 IP 차단 규칙을 추가하면 100번(HTTP 허용)과 110번(HTTPS 허용) 사이에 삽입됩니다. 마지막에 암묵적 Deny(\*) 규칙이 있어 명시적으로 허용하지 않은 모든 트래픽은 차단됩니다.

### 아웃바운드 규칙 설정

12. 하단의 **Outbound rules** 탭을 선택합니다.
13. [[Edit outbound rules]] 버튼을 클릭합니다.
14. 다음 3개의 아웃바운드 규칙을 [[Add new rule]] 버튼을 클릭하여 순서대로 추가합니다:

    **규칙 1 - HTTP 트래픽 허용**
    - Rule number: `100`
    - Type: `HTTP (80)`
    - Destination: `0.0.0.0/0`
    - Allow/Deny: `Allow`

    **규칙 2 - HTTPS 트래픽 허용**
    - Rule number: `110`
    - Type: `HTTPS (443)`
    - Destination: `0.0.0.0/0`
    - Allow/Deny: `Allow`

    **규칙 3 - 임시 포트 허용 (응답 트래픽용)**
    - Rule number: `120`
    - Type: `Custom TCP`
    - Port range: `1024-65535`
    - Destination: `0.0.0.0/0`
    - Allow/Deny: `Allow`

15. [[Save changes]] 버튼을 클릭합니다.

✅ **태스크 완료**: Public NACL이 생성되었습니다.

## 태스크 7: Private 서브넷용 NACL 생성

이 태스크에서는 Private 서브넷을 위한 Network ACL을 생성합니다. Private 서브넷은 내부 트래픽만 허용하도록 설정합니다.

1. [[Create network ACL]] 버튼을 다시 클릭합니다.
2. **Name**에 `Private-NACL`을 입력합니다.
3. **Amazon VPC**에서 CloudFormation이 생성한 VPC를 선택합니다.

> [!TIP]
> Amazon VPC ID는 메모장에 저장한 VpcId와 일치해야 합니다.

4. **Tags - optional** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key         | Value     |
| ----------- | --------- |
| `Project`   | `AWS-Lab` |
| `Week`      | `3-2`     |
| `CreatedBy` | `Student` |

5. [[Create network ACL]] 버튼을 클릭합니다.
6. 생성된 `Private-NACL`을 선택합니다.
7. 하단의 **Inbound rules** 탭을 선택합니다.
8. [[Edit inbound rules]] 버튼을 클릭합니다.
9. [[Add new rule]] 버튼을 클릭합니다.
10. 첫 번째 규칙을 설정합니다 (Amazon VPC 내부 트래픽):
    - **Rule number**에 `100`을 입력합니다.
    - **Type**에서 `All traffic`을 선택합니다.
    - **Source**에 `10.0.0.0/16`을 입력합니다.
    - **Allow/Deny**에서 `Allow`를 선택합니다.
11. [[Add new rule]] 버튼을 다시 클릭합니다.
12. 두 번째 규칙을 설정합니다 (임시 포트):
    - **Rule number**에 `110`을 입력합니다.
    - **Type**에서 `Custom TCP`를 선택합니다.
    - **Port range**에 `1024-65535`를 입력합니다.
    - **Source**에 `0.0.0.0/0`을 입력합니다.
    - **Allow/Deny**에서 `Allow`를 선택합니다.

> [!NOTE]
> **Private NACL 인바운드 규칙 110의 용도**: 이 규칙은 NAT Gateway를 통해 인터넷으로 나간 트래픽의 응답을 받기 위한 것입니다. Private 서브넷의 인스턴스가 NAT Gateway를 통해 외부 API나 패키지 저장소에 접근할 때, 응답 트래픽은 임시 포트(1024-65535)로 돌아옵니다. 규칙 100에서 Amazon VPC 내부 트래픽(10.0.0.0/16)을 허용하지만, NAT Gateway를 거친 인터넷 응답은 0.0.0.0/0에서 오므로 별도 규칙이 필요합니다.

13. [[Save changes]] 버튼을 클릭합니다.
14. 하단의 **Outbound rules** 탭을 선택합니다.
15. [[Edit outbound rules]] 버튼을 클릭합니다.
16. [[Add new rule]] 버튼을 클릭합니다.
17. 첫 번째 규칙을 설정합니다:
    - **Rule number**에 `100`을 입력합니다.
    - **Type**에서 `All traffic`을 선택합니다.
    - **Destination**에 `0.0.0.0/0`을 입력합니다.
    - **Allow/Deny**에서 `Allow`를 선택합니다.
18. [[Save changes]] 버튼을 클릭합니다.

> [!NOTE]
> 이 실습에서는 편의를 위해 Private 서브넷의 아웃바운드를 전체 허용했습니다. 프로덕션 환경에서는 필요한 포트와 대상만 허용하는 것이 보안 모범 사례입니다. 예를 들어, HTTP/HTTPS(80, 443)와 데이터베이스 포트(3306, 5432)만 허용하도록 제한할 수 있습니다.

✅ **태스크 완료**: Private NACL이 생성되었습니다.

## 태스크 8: NACL을 서브넷에 연결

이 태스크에서는 생성한 NACL을 해당 서브넷에 연결합니다. Public NACL은 Public 서브넷에, Private NACL은 Private 서브넷에 연결합니다.

1. `Public-NACL`을 선택합니다.
2. 하단의 **Subnet associations** 탭을 선택합니다.
3. [[Edit subnet associations]] 버튼을 클릭합니다.
4. `week3-2-security-group-Public-Subnet-A`와 `week3-2-security-group-Public-Subnet-C`를 체크합니다.
5. [[Save changes]] 버튼을 클릭합니다.
6. `Private-NACL`을 선택합니다.
7. 하단의 **Subnet associations** 탭을 선택합니다.
8. [[Edit subnet associations]] 버튼을 클릭합니다.
9. 프라이빗 서브넷들을 체크합니다.

> [!TIP]
> **서브넷 식별 방법**: 서브넷 이름에 "Private"가 포함된 서브넷들을 선택합니다. 메모장에 저장한 PrivateSubnetAId와 PrivateSubnetCId를 참고하여 올바른 서브넷을 선택합니다.
>
> **서브넷 구분 팁**:
>
> - **이름으로 구분**: CloudFormation이 생성한 서브넷은 이름에 "Public" 또는 "Private"가 포함되어 있습니다
> - **서브넷 ID로 구분**: 메모장에 저장한 출력값과 일치하는 서브넷 ID를 찾습니다
> - **CIDR 블록으로 구분**: 프라이빗 서브넷은 10.0.11.0/24, 10.0.12.0/24 범위를 사용합니다
> - **라우팅 테이블로 구분**: 프라이빗 서브넷은 NAT Gateway로 향하는 라우팅 테이블과 연결되어 있습니다

10. [[Save changes]] 버튼을 클릭합니다.

✅ **태스크 완료**: NACL이 서브넷에 연결되었습니다.

## 마무리

다음을 성공적으로 수행했습니다:

- 3-tier 아키텍처를 위한 보안 그룹을 생성했습니다
- 보안 그룹 체인을 구성하여 계층 간 통신을 제어했습니다
- NACL을 생성하고 서브넷에 연결했습니다
- 보안 그룹과 NACL의 차이점을 이해했습니다
- 최소 권한 원칙을 적용한 보안 정책을 구현했습니다

## 리소스 정리

> [!WARNING]
> 다음 단계를 **반드시 수행**하여 불필요한 비용을 방지하세요.

---

## 1단계: Tag Editor로 생성된 리소스 확인

실습에서 생성한 모든 리소스를 Tag Editor로 확인합니다.

#### CloudFormation으로 생성한 리소스 확인

1. AWS Management Console에 로그인한 후 상단 검색창에서 `Resource Groups & Tag Editor`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `ap-northeast-2`를 선택합니다.
4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Name`
   - **Optional tag value**에 `week3-2`를 입력합니다.
6. [[Search resources]] 버튼을 클릭합니다.

> [!NOTE]
> CloudFormation 스택으로 생성된 Amazon VPC, 서브넷, 보안 그룹 등 모든 리소스가 표시됩니다. 수동으로 생성한 NACL은 태그가 없어 표시되지 않지만, 다음 단계에서 삭제합니다.

> [!TIP]
> Tag Editor는 리소스 확인 용도로만 사용하며, 실제 삭제는 다음 단계에서 수행합니다.

---

## 2단계: 리소스 삭제

수동으로 생성한 NACL을 먼저 삭제한 후 CloudFormation 스택을 삭제합니다.

### 옵션 1: AWS 콘솔에서 수동 삭제 (권장)

> [!TIP]
> AWS 관리 콘솔 방식을 선호하거나 각 단계를 확인하면서 삭제하고 싶은 경우 이 방법을 권장합니다.
>
> AWS CLI 명령어에 익숙한 경우 아래 [옵션 2](#option-2)를 사용하면 더 빠르게 삭제할 수 있습니다.

**NACL 삭제**

1. Amazon VPC 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **Network ACLs**를 선택합니다.
3. `Public-NACL`을 선택합니다.
4. 하단의 **Subnet associations** 탭을 선택합니다.
5. [[Edit subnet associations]] 버튼을 클릭합니다.
6. 모든 서브넷의 체크를 해제합니다.
7. [[Save changes]] 버튼을 클릭합니다.

> [!NOTE]
> 서브넷 연결을 해제하면 해당 서브넷은 기본 NACL로 자동 전환됩니다.

8. `Private-NACL`을 선택합니다.
9. 하단의 **Subnet associations** 탭을 선택합니다.
10. [[Edit subnet associations]] 버튼을 클릭합니다.
11. 모든 서브넷의 체크를 해제합니다.
12. [[Save changes]] 버튼을 클릭합니다.
13. `Public-NACL`을 선택합니다.
14. **Actions** > `Delete network ACL`을 선택합니다.
15. 확인 창에서 `delete`를 입력하고 [[Delete]] 버튼을 클릭합니다.
16. `Private-NACL`을 선택합니다.
17. **Actions** > `Delete network ACL`을 선택합니다.
18. 확인 창에서 `delete`를 입력하고 [[Delete]] 버튼을 클릭합니다.

> [!NOTE]
> NACL 삭제는 즉시 완료됩니다.

### 옵션 2: AWS CloudShell 스크립트로 일괄 삭제

> [!TIP]
> AWS CLI 명령어에 익숙하거나 빠른 삭제를 원하는 경우 이 방법을 사용하세요.
>
> 콘솔 방식이 더 편하다면 위 [옵션 1](#option-1)을 참고하세요.

1. AWS Management Console 상단의 CloudShell 아이콘을 클릭합니다.
2. CloudShell이 열리면 다음 명령어를 실행합니다:

```bash
# VPC ID 찾기
VPC_ID=$(aws ec2 describe-vpcs \
  --region ap-northeast-2 \
  --filters "Name=tag:Name,Values=week3-2-security-group-VPC" \
  --query 'Vpcs[0].VpcId' \
  --output text)

# NACL 찾기 및 삭제
NACL_IDS=$(aws ec2 describe-network-acls \
  --region ap-northeast-2 \
  --filters "Name=vpc-id,Values=$VPC_ID" "Name=default,Values=false" \
  --query 'NetworkAcls[*].NetworkAclId' \
  --output text)

for NACL_ID in $NACL_IDS; do
  echo "NACL 삭제 중: $NACL_ID"

  # 서브넷 연결 해제
  ASSOCIATIONS=$(aws ec2 describe-network-acls \
    --region ap-northeast-2 \
    --network-acl-ids $NACL_ID \
    --query 'NetworkAcls[0].Associations[?!IsDefault].NetworkAclAssociationId' \
    --output text)

  for ASSOC_ID in $ASSOCIATIONS; do
    # 기본 NACL로 재연결
    DEFAULT_NACL=$(aws ec2 describe-network-acls \
      --region ap-northeast-2 \
      --filters "Name=vpc-id,Values=$VPC_ID" "Name=default,Values=true" \
      --query 'NetworkAcls[0].NetworkAclId' \
      --output text)

    aws ec2 replace-network-acl-association \
      --region ap-northeast-2 \
      --association-id $ASSOC_ID \
      --network-acl-id $DEFAULT_NACL
  done

  # NACL 삭제
  aws ec2 delete-network-acl \
    --region ap-northeast-2 \
    --network-acl-id $NACL_ID

  echo "NACL 삭제 완료: $NACL_ID"
done
```

> [!NOTE]
> 스크립트는 week3-2 VPC의 모든 사용자 정의 NACL을 자동으로 찾아 삭제합니다.

---

## 3단계: CloudFormation 스택 삭제

마지막으로 CloudFormation 스택을 삭제하여 나머지 모든 리소스를 정리합니다.

1. AWS Management Console에 로그인한 후 상단 검색창에서 `CloudFormation`을 검색하고 선택합니다.
2. 스택 목록에서 `week3-2-security-group-stack` 스택을 검색합니다.
3. `week3-2-security-group-stack` 스택의 체크박스를 선택합니다.

> [!NOTE]
> 스택이 선택되면 체크박스에 체크 표시가 나타나고, 상단의 [[Delete]] 버튼이 활성화됩니다.

4. [[Delete]] 버튼을 클릭합니다.
5. 확인 창에서 [[Delete]] 버튼을 다시 클릭하여 삭제를 확인합니다.

> [!NOTE]
> 확인 후 스택 목록 페이지로 돌아갑니다.

6. `week3-2-security-group-stack` 스택의 **Status** 열을 확인합니다.

> [!NOTE]
> 스택 삭제가 시작되면 **Status**가 "DELETE_IN_PROGRESS"로 표시됩니다. CloudFormation이 생성한 모든 리소스를 역순으로 삭제합니다.

7. 스택을 클릭하여 상세 페이지로 이동합니다.
8. **Events** 탭을 선택합니다.

> [!NOTE]
> **Events** 탭에는 리소스 삭제 과정이 실시간으로 표시됩니다. 보안 그룹, 서브넷, Amazon VPC 등이 순차적으로 삭제됩니다. 삭제에 3-5분이 소요됩니다.

9. 스택 삭제가 완료될 때까지 기다립니다.

> [!NOTE]
> 스택이 완전히 삭제되면 스택 목록에서 사라집니다. 만약 "DELETE_FAILED"가 표시되면 **Events** 탭에서 오류 원인을 확인하고, 보안 그룹 간 참조 관계를 수동으로 제거한 후 스택 삭제를 다시 시도합니다.

10. 스택 목록 페이지로 돌아가서 `week3-2-security-group-stack` 스택이 목록에서 사라졌는지 확인합니다.

> [!NOTE]
> 스택이 목록에 표시되지 않으면 성공적으로 삭제된 것입니다.

---

## 4단계: 최종 삭제 확인 (Tag Editor 활용)

모든 리소스가 정상적으로 삭제되었는지 Tag Editor로 최종 확인합니다.

1. AWS Management Console에서 `Resource Groups & Tag Editor`로 이동합니다.
2. 왼쪽 메뉴에서 **Tag Editor**를 선택합니다.
3. **Regions**에서 `ap-northeast-2`를 선택합니다.
4. **Resource types**에서 `All supported resource types`를 선택합니다.
5. **Tags** 섹션에서 다음을 입력합니다:
   - **Tag key**: `Name`
   - **Optional tag value**에 `week3-2`를 입력합니다.
6. [[Search resources]] 버튼을 클릭합니다.

> [!NOTE]
> 검색 결과에 리소스가 표시되지 않으면 모든 리소스가 성공적으로 삭제된 것입니다.

✅ **실습 종료**: 모든 리소스가 정리되었습니다.

## 추가 학습 리소스

- [보안 그룹](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)
- [네트워크 ACL](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html)
- [보안 그룹과 네트워크 ACL 비교](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html)

## 📚 참고: 보안 그룹 및 NACL 핵심 개념

### 보안 그룹 vs NACL

| 항목            | 보안 그룹 (Stateful) | NACL (Stateless)   |
| :-------------- | :------------------- | :----------------- |
| 연결 추적       | 추적함               | 추적 안 함         |
| 응답 트래픽     | 자동 허용            | 명시적 허용 필요   |
| 규칙 평가       | 모든 규칙 평가       | 번호 순서대로 평가 |
| 적용 레벨       | 인스턴스             | 서브넷             |
| 규칙 타입       | Allow만              | Allow + Deny       |
| 아웃바운드 규칙 | 기본 전체 허용       | 명시적 설정 필요   |

💡 **핵심**: 보안 그룹은 인바운드만 설정하면 되지만, NACL은 인바운드와 아웃바운드(임시 포트 포함)를 모두 설정해야 합니다.

> [!NOTE]
> 보안 그룹의 기본 아웃바운드 규칙은 "All traffic to 0.0.0.0/0 Allow"입니다. 프로덕션 환경에서는 최소 권한 원칙을 적용하여 필요한 포트와 대상만 허용하도록 아웃바운드 규칙을 제한하는 것을 고려해야 합니다.

### 최소 권한 원칙

| 구분           | 설정                                                | 설명                                               |
| :------------- | :-------------------------------------------------- | :------------------------------------------------- |
| ❌ 잘못된 예시 | `DB-Tier-SG Inbound: MySQL (3306) from 0.0.0.0/0`   | 인터넷 전체에서 데이터베이스 접근 허용 (보안 위험) |
| ✅ 올바른 예시 | `DB-Tier-SG Inbound: MySQL (3306) from App-Tier-SG` | App 계층에서만 데이터베이스 접근 허용 (최소 권한)  |

💡 **심층 방어 (Defense in Depth)**: NACL (서브넷 레벨) → 보안 그룹 (인스턴스 레벨) → OS 방화벽 순으로 다층 보안을 구성합니다.
