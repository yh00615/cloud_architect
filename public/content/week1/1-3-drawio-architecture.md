---
title: "draw.io로 HA 아키텍처 다이어그램 작성"
week: 1
session: 3
awsServices: []
learningObjectives:
  - Draw.io를 사용하여 AWS 아키텍처 다이어그램을 작성할 수 있습니다
  - QuickTable 3-Tier 아키텍처 다이어그램을 작성할 수 있습니다
  - Multi-AZ 구성으로 고가용성 설계를 적용할 수 있습니다
  - 아키텍처 다이어그램을 PNG 파일로 내보낼 수 있습니다
prerequisites:
  - AWS 기본 서비스 이해
  - 네트워킹 기본 개념
---

이 실습에서는 **Draw.io**를 사용하여 **QuickTable 레스토랑 예약 시스템**의 전체 아키텍처 다이어그램을 작성하는 방법을 학습합니다.

먼저 **Draw.io**의 **AWS 아이콘 라이브러리**를 활용하여 **3-Tier 아키텍처**의 기본 구조를 그립니다. **프레젠테이션 레이어**(Application Load Balancer, Web Server), **애플리케이션 레이어**(App Server), **데이터 레이어**(Amazon RDS MySQL)를 명확히 구분하고, 각 계층의 역할과 통신 흐름을 시각화합니다.

**Multi-AZ 설계 원칙**을 적용하여 **Amazon EC2 인스턴스**, **Amazon RDS Multi-AZ**, **Amazon EC2 Auto Scaling**의 고가용성 구성을 다이어그램에 표현하고, **보안 그룹** 설정을 통한 계층화된 보안을 구현합니다. 이를 통해 실제 프로덕션 환경에서 사용되는 **AWS Well-Architected Framework**의 **6가지 원칙**을 이해하게 됩니다.

> [!DOWNLOAD]
> [week1-3-architecture-lab.zip](/files/week1/week1-3-architecture-lab.zip)
> - `README.md` - QuickTable 아키텍처 설계 가이드 및 Multi-AZ 고가용성 원칙 설명
> - `template-info.md` - Draw.io 템플릿 사용 안내 및 AWS 아이콘 라이브러리 로드 방법
> 
> **관련 태스크:**
> 
> - 태스크 1: Draw.io 환경 설정 - template-info.md를 참고하여 AWS 아이콘 라이브러리를 자동으로 로드하는 URL 파라미터 사용법을 확인하고 작업 환경을 설정합니다
> - 태스크 2-8: QuickTable 아키텍처 다이어그램 작성 - README.md를 참고하여 Multi-AZ 고가용성 설계 원칙, 3-Tier 아키텍처 구성 요소, 보안 그룹 설계 모범 사례, Amazon EC2 Auto Scaling 전략 등을 학습하고 다이어그램에 적용합니다

> [!NOTE]
> 이 실습은 Draw.io를 사용한 다이어그램 작성 실습으로, AWS 리소스를 생성하지 않습니다.

## 태스크 1: Draw.io 환경 설정

이 태스크에서는 **Draw.io** 작업 환경을 설정하고 **AWS 아이콘 라이브러리**를 로드합니다.

1. 웹 브라우저에서 다음 URL에 접속합니다: `https://app.diagrams.net/?splash=0&libs=aws4`.

> [!NOTE]
> URL 파라미터 `splash=0`은 시작 화면을 건너뛰고, `libs=aws4`는 AWS 아이콘 라이브러리를 자동으로 로드합니다.

2. 상단 메뉴에서 **Extras**를 선택합니다.
3. **Language**를 선택합니다.
4. **English**를 선택합니다.

> [!NOTE]
> 영어 인터페이스를 사용하면 메뉴와 옵션을 더 쉽게 찾을 수 있습니다. 페이지가 새로고침되면서 영어로 변경됩니다.

5. [[Create New Diagram]] 버튼을 클릭합니다.
6. **Blank Diagram**을 선택합니다.
7. [[Create]] 버튼을 클릭합니다.
5. 다이어그램 이름을 `quicktable-architecture`로 입력합니다.
6. 저장 위치를 선택합니다.

> [!NOTE]
> - **Device**를 선택하면 로컬 컴퓨터에 저장됩니다.
> - 클라우드 저장소를 선택하면 어디서나 접근할 수 있습니다.

7. [[Create]] 버튼을 클릭합니다.

✅ **태스크 완료**: Draw.io 작업 환경이 준비되고 AWS 아이콘 라이브러리가 자동으로 로드되었습니다.

## 태스크 2: QuickTable Amazon VPC 및 가용 영역 구성

이 태스크에서는 **QuickTable Amazon VPC**와 **2개의 가용 영역(Availability Zone)**을 다이어그램에 배치합니다. **Multi-AZ** 구조를 통해 **고가용성** 아키텍처의 기반을 마련합니다.

> [!NOTE]
> 왼쪽 패널에 AWS 아이콘 라이브러리가 자동으로 로드되어 있습니다.

1. 왼쪽 패널의 **Networking & Content Delivery** 카테고리를 확장합니다.

> [!TIP]
> **AWS 아이콘 검색 방법**: 왼쪽 패널 상단의 검색창에 서비스명(예: `Amazon VPC`, `Amazon EC2`, `Amazon RDS`)을 입력하면 아이콘을 빠르게 찾을 수 있습니다. 카테고리를 클릭하면 해당 카테고리의 모든 아이콘이 표시됩니다. 이후 태스크에서도 이 방법을 사용하여 필요한 아이콘을 검색하세요.

2. **Amazon VPC** 아이콘을 캔버스로 드래그합니다.
3. Amazon VPC 박스 크기를 조정하여 전체 아키텍처를 포함할 수 있도록 확장합니다.
4. Amazon VPC 박스를 더블클릭하여 레이블을 `QuickTable Amazon VPC (10.0.0.0/16)`로 변경합니다.
5. 왼쪽 패널에서 **Availability Zone** 아이콘을 검색합니다.
6. **Availability Zone** 아이콘을 Amazon VPC 내부에 2개 배치합니다.
7. 첫 번째 AZ 레이블을 `ap-northeast-2a`로 설정합니다.
8. 두 번째 AZ 레이블을 `ap-northeast-2c`로 설정합니다.

> [!NOTE]
> Multi-AZ 구성은 하나의 가용 영역에 장애가 발생해도 다른 가용 영역에서 서비스를 계속 제공할 수 있도록 합니다. QuickTable은 2개의 AZ를 사용하여 고가용성을 보장합니다.

✅ **태스크 완료**: QuickTable Amazon VPC와 2개의 가용 영역이 생성되었습니다.

## 태스크 3: 3-Tier 서브넷 구성

이 태스크에서는 **3-Tier 아키텍처**의 핵심인 **퍼블릭 서브넷**, **프라이빗 애플리케이션 서브넷**, **프라이빗 데이터베이스 서브넷**을 각 가용 영역에 배치합니다.

1. 왼쪽 패널에서 **Subnet** 아이콘을 검색합니다.
2. **ap-northeast-2a** AZ 내부에 3개의 서브넷을 배치합니다.
3. 첫 번째 서브넷 레이블을 `Public Subnet A (10.0.1.0/24)`로 설정합니다.
4. 두 번째 서브넷 레이블을 `Private App Subnet A (10.0.11.0/24)`로 설정합니다.
5. 세 번째 서브넷 레이블을 `Private DB Subnet A (10.0.21.0/24)`로 설정합니다.
6. **ap-northeast-2c** AZ 내부에 3개의 서브넷을 배치합니다.
7. 첫 번째 서브넷 레이블을 `Public Subnet C (10.0.2.0/24)`로 설정합니다.
8. 두 번째 서브넷 레이블을 `Private App Subnet C (10.0.12.0/24)`로 설정합니다.
9. 세 번째 서브넷 레이블을 `Private DB Subnet C (10.0.22.0/24)`로 설정합니다.

> [!NOTE]
> - **퍼블릭 서브넷**: 인터넷 게이트웨이를 통해 외부와 통신하며, Application Load Balancer가 배치됩니다.
> - **프라이빗 애플리케이션 서브넷**: NAT Gateway를 통해 외부로 나가는 트래픽만 허용하며, Amazon EC2 웹 서버와 앱 서버가 배치됩니다.
> - **프라이빗 데이터베이스 서브넷**: 외부 인터넷 접근이 차단되며, Amazon RDS 데이터베이스가 배치됩니다.

✅ **태스크 완료**: 3-Tier 서브넷 구성이 완료되었습니다.

## 태스크 4: 인터넷 게이트웨이 및 NAT Gateway

이 태스크에서는 **인터넷 게이트웨이**와 **NAT Gateway**를 추가하여 네트워크 연결을 구성합니다.

1. 왼쪽 패널에서 **Internet Gateway** 아이콘을 검색합니다.
2. **Internet Gateway** 아이콘을 Amazon VPC 상단 외부에 배치합니다.
3. 레이블을 `QuickTable IGW`로 설정합니다.
4. Internet Gateway에서 Amazon VPC로 화살표를 연결합니다.
5. 왼쪽 패널에서 **NAT Gateway** 아이콘을 검색합니다.
6. **NAT Gateway** 아이콘을 **Public Subnet A** 내부에 배치합니다.
7. 레이블을 `NAT Gateway A`로 설정합니다.
8. **NAT Gateway** 아이콘을 **Public Subnet C** 내부에 추가로 배치합니다.
9. 레이블을 `NAT Gateway C`로 설정합니다.
10. 각 NAT Gateway에서 Internet Gateway로 화살표를 연결합니다.
11. 각 NAT Gateway에서 해당 AZ의 Private App Subnet으로 화살표를 연결합니다.

> [!NOTE]
> - **Internet Gateway**: 퍼블릭 서브넷의 리소스가 인터넷과 양방향 통신을 할 수 있도록 합니다.
> - **NAT Gateway**: 프라이빗 서브넷의 리소스가 인터넷으로 나가는 트래픽을 처리합니다. NAT Gateway는 퍼블릭 서브넷에 배치되며, Internet Gateway를 통해 인터넷에 연결됩니다. 프라이빗 서브넷의 리소스는 NAT Gateway를 통해 인터넷으로 나가는 트래픽만 허용하며, 외부에서 들어오는 트래픽은 차단합니다. Multi-AZ 구성으로 고가용성을 보장합니다.

✅ **태스크 완료**: 인터넷 게이트웨이 및 NAT Gateway가 추가되었습니다.

## 태스크 5: Application Load Balancer 추가

이 태스크에서는 **Application Load Balancer(ALB)**를 퍼블릭 서브넷에 배치하여 외부 트래픽을 수신하고 Amazon EC2 인스턴스로 분산합니다.

1. 왼쪽 패널에서 **Elastic Load Balancing** 아이콘을 검색합니다.
2. **Application Load Balancer** 아이콘을 **Public Subnet A**와 **Public Subnet C** 사이에 배치합니다.
3. 레이블을 `QuickTable ALB`로 설정합니다.
4. Internet Gateway에서 ALB로 화살표를 연결합니다.
5. 화살표 레이블을 `HTTPS (443)`로 설정합니다.

> [!NOTE]
> Application Load Balancer는 Layer 7(애플리케이션 계층)에서 동작하며, HTTP/HTTPS 트래픽을 처리합니다. Multi-AZ 구성으로 2개의 퍼블릭 서브넷에 배포되어 고가용성을 보장합니다.

✅ **태스크 완료**: Application Load Balancer가 추가되었습니다.

## 태스크 6: Amazon EC2 인스턴스 및 Amazon EC2 Auto Scaling 그룹

이 태스크에서는 **Web Tier**와 **App Tier**의 **Amazon EC2 인스턴스**와 **Amazon EC2 Auto Scaling 그룹**을 추가합니다.

1. 왼쪽 패널에서 **Amazon EC2** 아이콘을 검색합니다.
2. **Amazon EC2 Instance** 아이콘을 **Private App Subnet A** 내부에 배치합니다.
3. 레이블을 `Web Server A`로 설정합니다.
4. **Amazon EC2 Instance** 아이콘을 **Private App Subnet C** 내부에 배치합니다.
5. 레이블을 `Web Server C`로 설정합니다.
6. 왼쪽 패널에서 **Amazon EC2 Auto Scaling** 아이콘을 검색합니다.
7. **Amazon EC2 Auto Scaling** 아이콘을 Web Server 영역 주변에 배치합니다.
8. 레이블을 `QuickTable Web ASG`로 설정합니다.
9. ALB에서 각 Web Server로 화살표를 연결합니다.
10. 화살표 레이블을 `HTTP (80)`로 설정합니다.
11. **Amazon EC2 Instance** 아이콘을 **Private App Subnet A** 하단에 추가로 배치합니다.
12. 레이블을 `App Server A`로 설정합니다.
13. **Amazon EC2 Instance** 아이콘을 **Private App Subnet C** 하단에 추가로 배치합니다.
14. 레이블을 `App Server C`로 설정합니다.
15. **Amazon EC2 Auto Scaling** 아이콘을 App Server 영역 주변에 배치합니다.
16. 레이블을 `QuickTable App ASG`로 설정합니다.
17. 각 Web Server에서 해당 AZ의 App Server로 화살표를 연결합니다.

> [!NOTE]
> - **Web Tier**: Nginx 또는 Apache를 실행하며, 정적 콘텐츠를 제공하고 요청을 App Tier로 전달합니다.
> - **App Tier**: Node.js 또는 Python 애플리케이션을 실행하며, 비즈니스 로직을 처리합니다.
> - **Amazon EC2 Auto Scaling**: 트래픽에 따라 Amazon EC2 인스턴스 수를 자동으로 조정하여 비용을 최적화하고 가용성을 보장합니다.

✅ **태스크 완료**: Amazon EC2 인스턴스 및 Amazon EC2 Auto Scaling 그룹이 추가되었습니다.

## 태스크 7: Amazon RDS Multi-AZ 데이터베이스

이 태스크에서는 **Amazon RDS MySQL Multi-AZ** 데이터베이스를 프라이빗 데이터베이스 서브넷에 추가합니다.

1. 왼쪽 패널에서 **Amazon RDS** 아이콘을 검색합니다.
2. **Amazon RDS DB Instance** 아이콘을 **Private DB Subnet A** 내부에 배치합니다.
3. 레이블을 `QuickTable Amazon RDS Primary`로 설정합니다.
4. **Amazon RDS DB Instance** 아이콘을 **Private DB Subnet C** 내부에 배치합니다.
5. 레이블을 `QuickTable Amazon RDS Standby`로 설정합니다.
6. Primary에서 Standby로 양방향 화살표를 연결합니다.
7. 화살표 레이블을 `Synchronous Replication`로 설정합니다.
8. 각 App Server에서 Amazon RDS Primary로 화살표를 연결합니다.
9. 화살표 레이블을 `MySQL (3306)`로 설정합니다.

> [!NOTE]
> - **Amazon RDS Multi-AZ**: Primary DB 인스턴스와 Standby DB 인스턴스가 서로 다른 가용 영역에 배포됩니다.
> - **동기식 복제**: Primary에 쓰기가 발생하면 즉시 Standby로 복제됩니다.
> - **자동 페일오버**: Primary에 장애가 발생하면 1-2분 내에 Standby가 자동으로 Primary로 승격됩니다.
> - **엔드포인트**: 애플리케이션은 단일 엔드포인트를 사용하며, 페일오버 시 DNS가 자동으로 업데이트됩니다.

✅ **태스크 완료**: Amazon RDS Multi-AZ 데이터베이스가 추가되었습니다.

## 태스크 8: 보안 그룹 표시

이 태스크에서는 각 계층의 **보안 그룹**을 다이어그램에 표시하여 계층화된 보안 구조를 시각화합니다.

1. 왼쪽 도구 모음에서 **Rectangle** 도구를 선택합니다.
2. ALB 주변에 점선 사각형을 그립니다.
3. 사각형 색상을 빨간색으로 설정합니다.
4. 레이블을 `QuickTable-ALB-SG`로 설정합니다.
5. 텍스트를 추가하여 `Inbound: 0.0.0.0/0:443`를 입력합니다.
6. Web Server 주변에 점선 사각형을 그립니다.
7. 사각형 색상을 주황색으로 설정합니다.
8. 레이블을 `QuickTable-Web-SG`로 설정합니다.
9. 텍스트를 추가하여 `Inbound: ALB-SG:80`를 입력합니다.
10. App Server 주변에 점선 사각형을 그립니다.
11. 사각형 색상을 노란색으로 설정합니다.
12. 레이블을 `QuickTable-App-SG`로 설정합니다.
13. 텍스트를 추가하여 `Inbound: Web-SG:8080`를 입력합니다.
14. Amazon RDS 주변에 점선 사각형을 그립니다.
15. 사각형 색상을 초록색으로 설정합니다.
16. 레이블을 `QuickTable-DB-SG`로 설정합니다.
17. 텍스트를 추가하여 `Inbound: App-SG:3306`를 입력합니다.

> [!NOTE]
> 보안 그룹은 계층화된 보안을 구현합니다:
> - **ALB-SG**: 인터넷에서 HTTPS(443) 트래픽만 허용
> - **Web-SG**: ALB에서 HTTP(80) 트래픽만 허용
> - **App-SG**: Web Tier에서 8080 포트 트래픽만 허용
> - **DB-SG**: App Tier에서 MySQL(3306) 트래픽만 허용
> 
> 각 계층은 이전 계층의 보안 그룹만 허용하여 최소 권한 원칙을 적용합니다.

✅ **태스크 완료**: 보안 그룹이 표시되었습니다.

## 태스크 9: 다이어그램 정리 및 저장

이 태스크에서는 완성된 **QuickTable 3-Tier 아키텍처 다이어그램**을 정리하고 **고해상도 이미지**로 내보냅니다.

1. 모든 요소가 정렬되어 있는지 확인합니다.
2. 화살표가 명확하게 연결되어 있는지 확인합니다.
3. 레이블이 읽기 쉬운지 확인합니다.
4. 보안 그룹 점선 사각형이 각 계층을 명확히 구분하는지 확인합니다.
5. 상단 메뉴에서 **File** > **Export as** > **PNG**를 선택합니다.
6. **Zoom** 필드를 `300%`로 설정합니다.

> [!NOTE]
> Draw.io에서는 "해상도" 대신 "Zoom" 필드로 이미지 크기를 조정합니다. 300% 이상으로 설정하면 문서나 프레젠테이션에 삽입할 때 선명한 품질을 유지할 수 있습니다.

7. [[Export]] 버튼을 클릭합니다.
8. 파일명을 `quicktable-architecture.png`로 저장합니다.
9. 상단 메뉴에서 **File** > **Save**를 선택합니다.
10. 원본 다이어그램을 저장합니다.

> [!TIP]
> 다이어그램을 팀원과 공유하려면 **File** > **Export as** > **SVG**를 선택하여 벡터 형식으로도 저장하세요. SVG 파일은 확대해도 선명하며, 웹 문서에 삽입하기 적합합니다.

✅ **태스크 완료**: QuickTable 3-Tier 아키텍처 다이어그램이 저장되었습니다.

## 마무리

다음을 성공적으로 수행했습니다:

- Draw.io를 사용하여 QuickTable 3-Tier 아키텍처 다이어그램을 작성했습니다
- Multi-AZ 고가용성 아키텍처를 설계했습니다
- Amazon VPC, 서브넷, 인터넷 게이트웨이, NAT Gateway를 구성했습니다
- Application Load Balancer, Amazon EC2 인스턴스, Amazon EC2 Auto Scaling 그룹을 배치했습니다
- Amazon RDS Multi-AZ 데이터베이스를 추가했습니다
- 계층화된 보안 그룹 구조를 시각화했습니다
- Week 5-1에서 구축할 전체 시스템의 청사진을 완성했습니다

---

# 🗑️ 리소스 정리

> [!NOTE]
> 이 실습은 Draw.io를 사용한 다이어그램 작성 실습으로, AWS 리소스를 생성하지 않았습니다.

---

## 1단계: 작업 내용 확인

실습에서 생성한 파일을 확인합니다.

1. 로컬 컴퓨터의 다운로드 폴더 또는 선택한 저장 위치를 엽니다.
2. 다음 파일이 저장되어 있는지 확인합니다:
   - `quicktable-architecture.drawio` - 원본 다이어그램 파일
   - `quicktable-architecture.png` - 내보낸 이미지 파일

> [!NOTE]
> 이 파일들은 Week 5-1 실습에서 참고 자료로 사용할 수 있습니다.

---

## 2단계: 파일 정리 (선택사항)

필요에 따라 파일을 정리합니다.

1. 다이어그램 파일을 프로젝트 폴더로 이동합니다 (선택사항).
2. 불필요한 임시 파일을 삭제합니다 (선택사항).

> [!TIP]
> 다이어그램 파일은 향후 아키텍처 변경 시 수정할 수 있으므로 보관하는 것을 권장합니다.

---

## 3단계: 완료 확인

실습이 정상적으로 완료되었는지 확인합니다.

1. `quicktable-architecture.png` 파일을 열어 다이어그램이 정상적으로 표시되는지 확인합니다.
2. 다음 구성 요소가 모두 포함되어 있는지 확인합니다:
   - Amazon VPC 및 2개의 가용 영역
   - 3-Tier 서브넷 구성 (퍼블릭, 프라이빗 앱, 프라이빗 DB)
   - 인터넷 게이트웨이 및 NAT Gateway
   - Application Load Balancer
   - Amazon EC2 인스턴스 및 Amazon EC2 Auto Scaling 그룹
   - Amazon RDS Multi-AZ 데이터베이스
   - 보안 그룹 표시

> [!SUCCESS]
> 모든 구성 요소가 포함되어 있으면 다이어그램 작성이 완료되었습니다.

✅ **실습 종료**: QuickTable 3-Tier 아키텍처 다이어그램이 완성되었습니다.

## 추가 학습 리소스

- [AWS 아키텍처 센터](https://aws.amazon.com/architecture/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [3-Tier 아키텍처 모범 사례](https://docs.aws.amazon.com/whitepapers/latest/web-application-hosting-best-practices/an-aws-cloud-architecture-for-web-hosting.html)
- [Amazon RDS Multi-AZ 배포](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html)
- [Amazon EC2 Auto Scaling 모범 사례](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-best-practices.html)

## 📚 참고: QuickTable 3-Tier 아키텍처 설계 원칙

### 3-Tier 아키텍처 개요

**계층 분리의 이점**
- 각 계층은 독립적으로 확장 가능합니다.
- 보안 그룹으로 계층 간 트래픽을 제어합니다.
- 장애 격리가 용이하여 한 계층의 문제가 다른 계층에 영향을 주지 않습니다.
- 유지보수와 업데이트가 쉽습니다.

**QuickTable 3-Tier 구성**
- **프레젠테이션 계층**: Application Load Balancer (퍼블릭 서브넷)
- **애플리케이션 계층**: Amazon EC2 Web Server + App Server (프라이빗 애플리케이션 서브넷)
- **데이터 계층**: Amazon RDS MySQL Multi-AZ (프라이빗 데이터베이스 서브넷)

### Multi-AZ 고가용성 설계

**가용 영역 분산**
- 2개의 가용 영역(ap-northeast-2a, ap-northeast-2c)을 사용합니다.
- 각 AZ에 동일한 구성의 서브넷을 배치합니다.
- 하나의 AZ에 장애가 발생해도 다른 AZ에서 서비스를 계속 제공합니다.

**Application Load Balancer**
- 2개의 퍼블릭 서브넷에 배포되어 고가용성을 보장합니다.
- Health Check를 통해 정상 인스턴스로만 트래픽을 전달합니다.
- Cross-Zone Load Balancing으로 AZ 간 트래픽을 균등하게 분산합니다.

**Amazon RDS Multi-AZ**
- Primary DB 인스턴스와 Standby DB 인스턴스가 서로 다른 AZ에 배포됩니다.
- 동기식 복제로 데이터 일관성을 보장합니다.
- 자동 페일오버로 1-2분 내에 Standby가 Primary로 승격됩니다.

### 네트워크 구성

**Amazon VPC 설계**
- CIDR 블록: 10.0.0.0/16 (65,536개 IP 주소)
- 퍼블릭 서브넷: 10.0.1.0/24, 10.0.2.0/24 (각 256개 IP)
- 프라이빗 애플리케이션 서브넷: 10.0.11.0/24, 10.0.12.0/24
- 프라이빗 데이터베이스 서브넷: 10.0.21.0/24, 10.0.22.0/24

**인터넷 연결**
- 인터넷 게이트웨이: 퍼블릭 서브넷의 리소스가 인터넷과 양방향 통신
- NAT Gateway: 프라이빗 서브넷의 리소스가 인터넷으로 나가는 트래픽만 허용
- Multi-AZ NAT Gateway: 각 AZ에 NAT Gateway를 배치하여 고가용성 보장

### 보안 그룹 설계

**계층화된 보안**
- **QuickTable-ALB-SG**: 인터넷(0.0.0.0/0)에서 HTTPS(443) 트래픽만 허용
- **QuickTable-Web-SG**: ALB 보안 그룹에서 HTTP(80) 트래픽만 허용
- **QuickTable-App-SG**: Web 보안 그룹에서 8080 포트 트래픽만 허용
- **QuickTable-DB-SG**: App 보안 그룹에서 MySQL(3306) 트래픽만 허용

**최소 권한 원칙**
- 각 계층은 이전 계층의 보안 그룹만 허용합니다.
- 불필요한 포트는 모두 차단합니다.
- 데이터베이스는 외부 인터넷 접근이 완전히 차단됩니다.

### Amazon EC2 Auto Scaling 전략

**Web Tier Amazon EC2 Auto Scaling**
- 최소 인스턴스: 2개 (각 AZ에 1개씩)
- 최대 인스턴스: 10개
- 스케일링 정책: CPU 사용률 70% 이상 시 스케일 아웃

**App Tier Amazon EC2 Auto Scaling**
- 최소 인스턴스: 2개 (각 AZ에 1개씩)
- 최대 인스턴스: 20개
- 스케일링 정책: CPU 사용률 60% 이상 시 스케일 아웃

**스케일링 쿨다운**
- 스케일 아웃 후 5분 대기 (인스턴스 초기화 시간 고려)
- 스케일 인 후 10분 대기 (트래픽 변동 고려)

### Amazon RDS 데이터베이스 설계

**Multi-AZ 배포**
- Primary DB: ap-northeast-2a
- Standby DB: ap-northeast-2c
- 동기식 복제로 RPO(Recovery Point Objective) = 0

**자동 백업**
- 백업 보존 기간: 7일
- 백업 시간: 새벽 3-4시 (트래픽이 적은 시간)
- Point-in-Time Recovery 지원

**읽기 성능 최적화**
- Read Replica를 추가하여 읽기 트래픽 분산 가능
- 애플리케이션에서 읽기/쓰기 엔드포인트 분리

### 비용 최적화

**Amazon EC2 인스턴스 타입 선택**
- Web Tier: t3.small (2 vCPU, 2GB RAM) - 가벼운 웹 서버
- App Tier: t3.medium (2 vCPU, 4GB RAM) - 비즈니스 로직 처리
- Reserved Instance 또는 Savings Plans로 비용 절감

**NAT Gateway 비용 절감**
- Amazon VPC Endpoint를 사용하여 Amazon S3, Amazon DynamoDB 접근 시 NAT Gateway 우회
- 트래픽이 적은 환경에서는 NAT Instance 고려

**Amazon RDS 비용 최적화**
- db.t3.micro 또는 db.t3.small로 시작
- 트래픽 증가 시 수직 확장 (인스턴스 타입 변경)
- Reserved Instance로 최대 60% 비용 절감

### 모니터링 및 로깅

**Amazon CloudWatch 메트릭**
- ALB: 요청 수, 응답 시간, 오류율
- Amazon EC2: CPU 사용률, 네트워크 트래픽, 디스크 I/O
- Amazon RDS: CPU 사용률, 연결 수, 읽기/쓰기 IOPS

**Amazon CloudWatch Logs**
- ALB 액세스 로그: Amazon S3에 저장
- Amazon EC2 애플리케이션 로그: Amazon CloudWatch Logs Agent로 수집
- Amazon RDS 슬로우 쿼리 로그: 성능 최적화에 활용

**Amazon CloudWatch Alarms**
- CPU 사용률 80% 이상: Amazon SNS 알림
- Amazon RDS 연결 수 90% 이상: 경고
- ALB 5xx 오류율 5% 이상: 긴급 알림

### 재해 복구 전략

**백업 전략**
- Amazon RDS 자동 백업: 매일 새벽 3시
- Amazon EC2 AMI 스냅샷: 주 1회
- 백업 데이터를 다른 리전에 복제 (선택사항)

**복구 시나리오**
- **AZ 장애**: Multi-AZ 구성으로 자동 페일오버 (1-2분)
- **리전 장애**: 다른 리전에 백업에서 복구 (RTO: 1-2시간)
- **데이터 손상**: Point-in-Time Recovery로 특정 시점 복구

### 확장 가능성

**수평 확장**
- Amazon EC2 Auto Scaling으로 Amazon EC2 인스턴스 수 자동 조정
- Read Replica 추가로 읽기 성능 향상
- ALB가 자동으로 트래픽 분산

**수직 확장**
- Amazon EC2 인스턴스 타입 변경 (t3.small → t3.medium → t3.large)
- Amazon RDS 인스턴스 타입 변경 (db.t3.micro → db.t3.small → db.t3.medium)
- 다운타임 최소화 (Amazon RDS는 Multi-AZ 페일오버 활용)

**서버리스 전환 경로**
- Week 4-3: AWS Lambda + Amazon API Gateway로 애플리케이션 계층 전환
- Week 5-3: Amazon DynamoDB로 데이터 계층 전환
- Week 10-2: Amazon ElastiCache로 캐싱 계층 추가
- Week 14-2: Amazon Bedrock Knowledge Bases 기반 RAG 구현
