# 📊 콘텐츠 작성 현황 명세 (Content Completion Status)

**문서 타입**: Specification  
**작성일**: 2026-02-07  
**최종 업데이트**: curriculum.ts 파일과 동기화 완료  
**목적**: 실습/데모 가이드 작성 현황 추적 및 작업 우선순위 정의

## 📊 전체 현황

- **총 커리큘럼**: 42개 차시 (1-1 ~ 14-3, 중간/기말고사 제외)
- **작성 완료**: 24개 파일
- **미작성**: 18개 차시

## ✅ 작성 완료 (24개)

### 1주차: 클라우드 서비스 디자인 개요
- ❌ 1-1: 없음 (이론만 - AWS 클라우드 아키텍처 개요)
- ✅ 1-2: `1-1-well-architected-tool-demo.md` (데모 - Well-Architected Tool)
- ✅ 1-3: `1-3-drawio-architecture.md` (실습 - Draw.io 아키텍처 다이어그램)

### 2주차: AWS IAM 및 조직 관리 고급 전략
- ✅ 2-1: `2-1-iam-role-assumerole.md` (실습 - IAM 역할 전환)
- ✅ 2-2: `2-2-iam-policy-condition.md` (실습 - IAM Policy Condition)
- ❌ 2-3: 없음 (이론만 - AWS Organizations)

### 3주차: Amazon VPC 고급 네트워킹
- ✅ 3-1: `3-1-vpc-design-strategy.md` (실습 - VPC 설계)
- ✅ 3-2: `3-2-security-group-nacl.md` (실습 - 보안 그룹과 NACL)
- ❌ 3-3: 없음 (이론만 - VPC Peering, Endpoints)

### 4주차: 서버리스 및 이벤트 기반 아키텍처
- ❌ 4-1: 없음 (이론만 - 서버리스 아키텍처 설계)
- ✅ 4-2: `4-1-lambda-api-gateway-demo.md` (데모 - Lambda와 API Gateway)
- ✅ 4-3: `4-3-serverless-api.md` (실습 - 서버리스 API 구축)

### 5주차: 고성능 데이터베이스 설계
- ✅ 5-1: `5-1-rds-multi-az.md` (데모 - RDS Multi-AZ)
- ❌ 5-2: 없음 (이론만 - Amazon Aurora)
- ✅ 5-3: `5-3-dynamodb-design.md` (실습 - DynamoDB 설계)

### 6주차: IaC 기반 인프라 자동화
- ✅ 6-1: `6-1-cloudformation-structure-demo.md` (데모 - CloudFormation 구조)
- ✅ 6-2: `6-2-cloudformation-template.md` (실습 - CloudFormation 템플릿)
- ❌ 6-3: 없음 (이론만 - 스택 배포 및 관리)

### 7주차: 컨테이너 기반 서비스 디자인
- ❌ 7-1: 없음 (이론만 - 컨테이너 오케스트레이션 기초)
- ❌ 7-2: 없음 (이론만 - Amazon EKS 아키텍처)
- ✅ 7-3: `7-1-docker-container.md` + `7-2-ecs-fargate-demo.md` (실습 - Docker와 ECS Fargate)

### 9주차: CI/CD 파이프라인 구축
- ❌ 9-1: 없음 (이론만 - CI/CD 개념)
- ❌ 9-2: 없음 (실습 - CodeBuild 컨테이너 이미지 빌드)
- ✅ 9-3: `9-2-container-cicd.md` (실습 - CodePipeline EKS 배포)

### 10주차: 캐싱 및 성능 최적화
- ❌ 10-1: 없음 (이론만 - 캐싱 전략)
- ✅ 10-2: `10-1-elasticache-caching.md` (실습 - ElastiCache API 캐싱)
- ✅ 10-3: `10-3-cloudfront-demo.md` (데모 - CloudFront CDN)

### 11주차: 데이터 레이크 아키텍처
- ❌ 11-1: 없음 (이론만 - 데이터 레이크 개요)
- ✅ 11-2: `11-2-s3-glue-athena-demo.md` (데모 - Glue Crawler + Athena)
- ✅ 11-3: `11-3-data-pipeline.md` (실습 - Glue 데이터 파이프라인)

### 12주차: 보안 아키텍처 설계
- ✅ 12-1: `12-1-credentials-management.md` (실습 - Secrets Manager)
- ✅ 12-2: `12-2-aws-config-demo.md` (데모 - AWS Config)
- ❌ 12-3: 없음 (데모 - GuardDuty 자동 대응)

### 13주차: 비용 최적화 및 관측성
- ✅ 13-1: `13-1-cost-optimization.md` (실습 - Cost Explorer)
- ✅ 13-2: `13-2-cloudwatch-monitoring.md` (데모 - X-Ray Lambda 성능 분석)
- ❌ 13-3: 없음 (실습 - Container Insights EKS 모니터링)

### 14주차: 지능형 클라우드 서비스 설계
- ❌ 14-1: 없음 (실습 - Rekognition 멀티미디어 분석)
- ✅ 14-2: `14-2-route53-cloudfront.md` (데모 - Bedrock Knowledge Bases RAG)
- ❌ 14-3: 없음 (실습 - Bedrock Agent 챗봇)

## ❌ 미작성 (18개)

### 이론만 (실습/데모 없음) - 11개
- 1-1: AWS 클라우드 아키텍처 개요
- 2-3: AWS Organizations OU 구조와 SCP
- 3-3: Amazon VPC Peering, Endpoints, NAT Gateway
- 4-1: 서버리스 아키텍처 설계
- 5-2: Amazon Aurora 및 RDS 고급 기능
- 6-3: CloudFormation 스택 배포 및 관리
- 7-1: 컨테이너 오케스트레이션 기초
- 7-2: Amazon EKS 아키텍처
- 9-1: CI/CD 개념과 AWS Developer Tools
- 10-1: 캐싱 전략
- 11-1: 데이터 레이크 아키텍처 개요

### 실습/데모 필요 (미작성) - 5개
- **9-2**: CodeBuild로 컨테이너 이미지 빌드 (실습)
- **12-3**: GuardDuty와 Lambda 자동 대응 (데모)
- **13-3**: Container Insights로 EKS 모니터링 (실습)
- **14-1**: Rekognition 멀티미디어 분석 (실습)
- **14-3**: Bedrock Agent 챗봇 구축 (실습)

### 파일명/내용 확인 필요 - 2개
- **13-2**: `13-2-cloudwatch-monitoring.md` → X-Ray Lambda 성능 분석 내용 확인 필요
- **14-2**: `14-2-route53-cloudfront.md` → Bedrock Knowledge Bases RAG 내용 확인 필요

## 📝 작업 우선순위

### 1순위: 실습/데모 가이드 작성 (5개)
1. **9-2**: CodeBuild로 컨테이너 이미지 빌드 (실습)
   - buildspec.yml 작성
   - Docker 이미지 빌드
   - Amazon ECR 자동 푸시
   
2. **12-3**: GuardDuty와 Lambda 자동 대응 (데모)
   - GuardDuty 위협 탐지
   - EventBridge 연동
   - Lambda 자동 대응 구현
   
3. **13-3**: Container Insights로 EKS 모니터링 (실습)
   - Container Insights 활성화
   - EKS 클러스터 모니터링
   - 로그 분석 및 대시보드
   
4. **14-1**: Rekognition 멀티미디어 분석 (실습)
   - Rekognition 이미지 분석
   - 얼굴 인식 및 텍스트 추출
   - S3 + Lambda 통합
   
5. **14-3**: Bedrock Agent 챗봇 구축 (실습)
   - Bedrock Agent 생성
   - Lambda 함수 연동
   - 대화형 챗봇 구현

### 2순위: 파일명/내용 확인 및 수정 (2개)
1. **13-2**: `13-2-cloudwatch-monitoring.md`
   - 현재 내용 확인
   - X-Ray Lambda 성능 분석 내용으로 업데이트 필요 시 수정
   
2. **14-2**: `14-2-route53-cloudfront.md`
   - 현재 내용 확인
   - Bedrock Knowledge Bases RAG 내용으로 업데이트 필요 시 수정

### 3순위: 기존 가이드 검토 (24개)
- 마크다운 작성 가이드 준수 여부 확인
- Front Matter 정확성 확인
- Alert 사용 적절성 확인
- 표준 문구 준수 확인
- 한국어 UI 텍스트 규칙 준수 확인

## 📂 파일 구조

```
public/content/
├── week1/  (2개 - 데모 1, 실습 1)
├── week2/  (2개 - 실습 2)
├── week3/  (2개 - 실습 2)
├── week4/  (2개 - 데모 1, 실습 1)
├── week5/  (2개 - 데모 1, 실습 1)
├── week6/  (2개 - 데모 1, 실습 1)
├── week7/  (2개 - 실습 2)
├── week9/  (1개 - 실습 1)
├── week10/ (2개 - 실습 1, 데모 1)
├── week11/ (2개 - 데모 1, 실습 1)
├── week12/ (2개 - 실습 1, 데모 1)
├── week13/ (2개 - 실습 1, 데모 1)
└── week14/ (1개 - 데모 1)
```

## 🎯 다음 단계

1. **미작성 실습/데모 가이드 5개 작성** (우선순위 1)
2. **파일명/내용 불일치 2개 확인 및 수정** (우선순위 2)
3. **기존 가이드 24개 검토 및 표준화** (우선순위 3)
4. **실습 파일(ZIP) 준비 여부 확인**
5. **이미지 파일 준비 여부 확인**

## 📋 curriculum.ts 동기화 완료

- ✅ Week 1: 세션 순서 및 제목 업데이트
- ✅ Week 4: 세션 타입 및 제목 업데이트
- ✅ Week 5: 세션 1 타입 변경 (lab → demo)
- ✅ Week 7: 세션 순서 및 타입 재구성
- ✅ Week 9: 세션 2, 3 제목 및 설명 업데이트
- ✅ Week 10: 세션 1, 2 타입 및 제목 업데이트
- ✅ Week 12: 세션 3 타입 변경 (theory → demo)
- ✅ Week 13: 세션 제목 및 설명 업데이트
- ✅ Week 14: 전체 주차 주제 변경 (글로벌 배포 → 지능형 클라우드)
