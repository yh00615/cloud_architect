# AWS 아키텍처 다이어그램 템플릿

이 파일은 Draw.io에서 바로 열 수 있는 AWS 고가용성 아키텍처 템플릿입니다.

## 사용 방법

1. https://app.diagrams.net/ 접속
2. File > Open from > Device 선택
3. 이 파일 선택
4. 템플릿을 기반으로 수정

## 포함된 구성 요소

- VPC (10.0.0.0/16)
- 2개의 가용 영역 (ap-northeast-2a, ap-northeast-2c)
- 6개의 서브넷 (Public x2, Private App x2, Private DB x2)
- Internet Gateway
- NAT Gateway x2
- Application Load Balancer
- EC2 인스턴스 (Web Tier, App Tier)
- Auto Scaling 그룹
- RDS Multi-AZ
- Security Group 표시

## 커스터마이징

- 서브넷 CIDR 변경
- 인스턴스 수 조정
- 추가 서비스 배치 (ElastiCache, CloudFront 등)
- 색상 및 레이블 수정
