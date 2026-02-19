---
inclusion: auto
description: 실습 가이드 내용 검증 방법론 - 기술적 세부사항 정확성 검증 가이드
keywords: ['검증', '확인', '체크리스트', '일치', '비교', 'verification', 'validate', '실습', '가이드', 'README', '기술', '세부사항', 'CIDR', '포트', 'URL']
---

# 실습 가이드 내용 검증 방법론 (Lab Content Verification Methodology)

**목적**: 실습 가이드의 기술적 세부사항이 참조 문서(README.md 등)와 정확히 일치하는지 검증  
**적용 대상**: Week 1-15의 모든 실습 가이드  
**검증 기준**: Week 1-3 검증 완료 (100% 일치)

---

## 🔍 검증 절차

### 검증 시작 전 필수 정보 확인

검증을 시작하기 전에 다음 정보를 먼저 확인하고 설명합니다:

1. **주차 및 차시 정보**
   - 주차: Week X
   - 차시: Session Y
   - 유형: 실습(lab) / 데모(demo) / 이론(theory)
   - curriculum.ts의 sessionType 확인

2. **실습/데모 제목**
   - curriculum.ts의 title 확인
   - 마크다운 가이드의 Front Matter title 확인
   - 두 제목이 정확히 일치하는지 확인 (curriculum.ts가 기준)

3. **사전 환경 요구사항**
   - labEnvironments.ts의 hasPrerequisites 확인
   - ZIP 파일명 및 포함 파일 목록
   - CloudFormation 리소스 목록
   - 추가 노트 사항
   - 사전 파일이 실제로 존재하는지 확인

4. **태스크 구성**
   - 마크다운 가이드의 모든 태스크 제목 나열
   - 각 태스크의 주요 목적 요약
   - 태스크 0 (사전 환경 구축) 존재 여부 확인
   - 태스크 번호가 연속적인지 확인 (0, 1, 2, 3... 또는 1, 2, 3...)

5. **학습 목표**
   - curriculum.ts의 learningObjectives
   - 마크다운 Front Matter의 learningObjectives
   - 두 목표가 의미상 일치하는지 확인

6. **AWS 서비스**
   - curriculum.ts의 awsServices
   - 마크다운 Front Matter의 awsServices
   - 실제 태스크에서 사용하는 AWS 서비스와 일치하는지 확인

7. **사전 요구사항 (Prerequisites)**
   - curriculum.ts의 prerequisites
   - 마크다운 Front Matter의 prerequisites
   - 이전 주차/차시 내용과의 연관성 확인

8. **참조 문서 위치**
   - README.md 또는 참조 문서 경로 확인
   - 참조 문서가 실제로 존재하는지 확인
   - 참조 문서의 구조 파악 (목차, 섹션 등)

**예시 출력 형식**:
```
📋 검증 대상 정보

**주차/차시**: Week 2, Session 1
**유형**: 실습 (lab)
**제목**: AWS IAM 정책 Condition 요소 활용
  - curriculum.ts: "AWS IAM 정책 Condition 요소 활용"
  - 마크다운: "AWS IAM 정책 Condition 요소 활용"
  - ✅ 일치

**사전 환경**:
- hasPrerequisites: true
- ZIP 파일: week2-1-iam-policy-lab.zip
- 파일 존재: ✅ public/files/week2/week2-1-iam-policy-lab/
- 포함 파일:
  1. mfa-policy.json - MFA 강제 정책
  2. ip-restriction-policy.json - IP 제한 정책
  3. time-based-policy.json - 시간 기반 정책
  4. README.md - 정책 사용 방법 및 Condition 키 레퍼런스

**태스크 구성**:
- 태스크 0: ❌ 없음 (사전 환경 구축 불필요)
- 태스크 1: S3 버킷 생성 및 테스트 객체 업로드
- 태스크 2: MFA 강제 정책 생성 및 테스트
- 태스크 3: IP 주소 제한 정책 생성 및 테스트
- 태스크 4: 시간 기반 접근 제어 정책 생성 및 테스트
- 태스크 번호: ✅ 연속적 (1, 2, 3, 4)

**학습 목표**:
- curriculum.ts (4개):
  1. IAM 정책의 Condition 요소를 사용하여 세밀한 권한 제어를 구현할 수 있습니다
  2. MFA를 요구하는 정책을 작성하여 보안을 강화할 수 있습니다
  3. IP 주소 기반 접근 제어를 구현할 수 있습니다
  4. 시간 기반 접근 제어를 구현할 수 있습니다
- 마크다운 Front Matter (4개):
  1. IAM 정책의 Condition 요소를 사용하여 세밀한 권한 제어를 구현할 수 있습니다
  2. MFA를 요구하는 정책을 작성하여 보안을 강화할 수 있습니다
  3. IP 주소 기반 접근 제어를 구현할 수 있습니다
  4. 시간 기반 접근 제어를 구현할 수 있습니다
- ✅ 일치 (4/4)

**AWS 서비스**:
- curriculum.ts: AWS IAM, Amazon S3
- 마크다운: AWS IAM, Amazon S3
- ✅ 일치

**규칙 49 적용 확인**:
- AWS IAM: ✅ 핵심 서비스 (학습 목표: IAM 정책 Condition)
- Amazon S3: ⚠️ 보조 서비스 (테스트용)
- 판단: Week 2-1은 IAM 정책이 핵심이지만, S3는 정책 테스트를 위해 필수적으로 사용되므로 표시 유지
- 참고: 규칙 49는 "학습 목표의 핵심 서비스"를 기준으로 하며, 실습에서 필수적으로 사용되는 서비스는 포함 가능

**사전 요구사항**:
- curriculum.ts: Week 1-2 Well-Architected Framework 이해
- 마크다운: Week 1-2 Well-Architected Framework 이해
- ✅ 일치

**참조 문서**:
- 위치: public/files/week2/week2-1-iam-policy-lab/README.md
- 존재: ✅
- 구조: 정책 사용 방법, Condition 키 레퍼런스, 예시 코드
```

---

## 📋 검증 체크리스트 (15단계)

**⭐⭐⭐ 최우선**: 0단계 (curriculum.ts 기준 검증) - 모든 검증의 기준점
**⭐⭐⭐ 가장 중요**: 5단계 (기술적 세부사항), 8단계 (파일 실제 동작 가능성), 10단계 (CloudFormation 템플릿 기준)

**검증 순서**: 0단계부터 14단계까지 순차적으로 진행하며, 각 단계마다 결과를 명확히 기록합니다.

---

### 0단계: curriculum.ts 기준 검증 ⭐⭐⭐ (최우선)

**검증 항목**:
- [ ] **제목 일치**: 마크다운 Front Matter title이 curriculum.ts title과 정확히 일치
- [ ] **학습 목표 일치**: learningObjectives 개수와 내용이 curriculum.ts와 일치
- [ ] **AWS 서비스 일치**: awsServices 목록이 curriculum.ts와 일치 (핵심 서비스만 표시, 보조 서비스 제외)
- [ ] **사전 요구사항 일치**: prerequisites가 curriculum.ts와 일치
- [ ] **세션 타입 일치**: sessionType(lab/demo/theory)이 curriculum.ts와 일치

**검증 방법**:
1. curriculum.ts에서 해당 주차/세션 데이터 추출
2. 마크다운 Front Matter와 1:1 비교
3. **AWS 서비스 검증 시 규칙 49 적용**:
   - 핵심 서비스만 표시 (학습 목표에 명시된 서비스)
   - 보조 서비스 제외 (VPC, EC2, IAM 등 환경 구축용)
   - 모든 세션 타입(lab/demo/theory)에 동일하게 적용
4. 불일치 발견 시 **curriculum.ts를 기준으로 마크다운 수정**

**우선순위**: ⭐⭐⭐ (가장 높음 - 모든 검증의 기준점)

**예시 (Week 14-2)**:
- curriculum.ts: learningObjectives 2개
- 마크다운: learningObjectives 4개
- 결과: ❌ 불일치 → 마크다운을 2개로 축소

**예시 (Week 5-1 - AWS 서비스 검증)**:
- curriculum.ts: Amazon RDS (핵심 서비스만)
- 마크다운: Amazon RDS, Amazon VPC, Amazon EC2
- 결과: ❌ 불일치 → Amazon VPC, Amazon EC2 제거 (보조 서비스)
- 이유: 학습 목표는 RDS Multi-AZ이므로 RDS만 표시

**예시 (Week 4-3 - AWS 서비스 검증)**:
- curriculum.ts: AWS Lambda, Amazon API Gateway, Amazon DynamoDB (핵심 서비스)
- 마크다운: AWS Lambda, Amazon API Gateway, Amazon DynamoDB, Amazon Cognito
- 결과: ❌ 불일치 → Amazon Cognito 제거 (인증만 담당하는 보조 서비스)
- 이유: 학습 목표는 서버리스 API 구축이므로 Lambda, API Gateway, DynamoDB만 표시

---

### 1단계: 파일 구조 확인 ✅

**검증 항목**:
- [ ] labEnvironments.ts에 해당 주차/세션 데이터 존재
- [ ] ZIP 파일 또는 폴더 존재 (`public/files/week{X}/`)
- [ ] 마크다운 가이드 존재 (`public/content/week{X}/{X}-{Y}-*.md`)
- [ ] README.md 또는 참조 문서 존재
- [ ] 모든 사전 파일이 실제로 존재하는지 확인

**검증 방법**:
```bash
# FILE_STRUCTURE_REPORT.md 확인
cat FILE_STRUCTURE_REPORT.md | grep "week{X}"

# labEnvironments.ts 확인
grep "week: {X}" src/data/labEnvironments.ts
```

**예시 (Week 1-3)**:
- ✅ labEnvironments.ts: Week 1-3 데이터 존재
- ✅ 폴더: `public/files/week1/week1-3-architecture-lab/`
- ✅ 가이드: `public/content/week1/1-3-drawio-architecture.md`
- ✅ 참조: `README.md`, `template-info.md`

---

### 2단계: DOWNLOAD Alert 검증 ✅

**검증 항목**:
- [ ] DOWNLOAD Alert의 파일 목록이 실제 파일과 일치
- [ ] 파일 설명이 간단명료 (5-50자)
- [ ] "**관련 태스크:**" 섹션에 자세한 사용 방법 (30자 이상)
- [ ] 파일명이 백틱으로 감싸져 있음
- [ ] **팝오버 표시 내용**: 파일 설명이 labEnvironments.ts의 description과 일치하는지 확인

**검증 방법**:
1. 가이드의 DOWNLOAD Alert 읽기
2. 실제 폴더의 파일 목록과 비교
3. FILE_STRUCTURE_REPORT.md와 교차 확인
4. **labEnvironments.ts의 files 배열에서 각 파일의 description 확인**
5. **마크다운 DOWNLOAD Alert의 파일 설명과 labEnvironments.ts description 비교**

**예시 (Week 1-3)**:
```markdown
> [!DOWNLOAD]
> [week1-3-architecture-lab.zip](/files/week1/week1-3-architecture-lab.zip)
> - `README.md` - 아키텍처 설계 가이드 및 Multi-AZ 고가용성 원칙 설명
> - `template-info.md` - Draw.io 템플릿 사용 안내 및 AWS 아이콘 라이브러리 로드 방법
```

**실제 파일**:
- ✅ `README.md` 존재
- ✅ `template-info.md` 존재

---

### 3단계: 학습 목표 일치 확인 ✅

**검증 항목**:
- [ ] 가이드 Front Matter의 `learningObjectives`
- [ ] README.md의 "실습 목표" 또는 "학습 목표" 섹션
- [ ] 의미가 동일한지 확인 (표현은 다를 수 있음)

**검증 방법**:
1. 가이드 Front Matter 읽기
2. README.md의 학습 목표 섹션 읽기
3. 항목별로 의미 비교

**예시 (Week 1-3)**:

| 가이드 Front Matter | README.md | 일치 |
|---------------------|-----------|------|
| Draw.io를 사용하여 AWS 아키텍처 다이어그램을 작성할 수 있습니다 | Draw.io를 사용하여 AWS 아키텍처 다이어그램 작성 | ✅ |
| Multi-AZ 고가용성 설계 원칙을 적용할 수 있습니다 | Multi-AZ 고가용성 설계 원칙 적용 | ✅ |
| 3-Tier 아키텍처의 구성 요소를 이해할 수 있습니다 | 3-Tier 아키텍처 구성 요소 이해 | ✅ |

---

### 4단계: 태스크 내용 검증 ✅

**검증 항목**:
- [ ] 가이드의 각 태스크가 README.md를 올바르게 참조
- [ ] 태스크 설명이 README.md의 내용과 일치
- [ ] 태스크 순서가 논리적이고 README.md와 일관성 있음

**검증 방법**:
1. 가이드의 태스크 1부터 순서대로 읽기
2. 각 태스크가 참조하는 README.md 섹션 확인
3. 내용이 일치하는지 비교

**예시 (Week 1-3)**:

| 태스크 | 가이드 내용 | README.md 참조 | 일치 |
|--------|------------|---------------|------|
| 태스크 1 | Draw.io 환경 설정 | template-info.md 참조 | ✅ |
| 태스크 2 | VPC 및 가용 영역 구성 | README.md VPC 섹션 | ✅ |
| 태스크 3 | 서브넷 구성 | README.md 서브넷 테이블 | ✅ |
| 태스크 8 | 보안 그룹 표시 | README.md 보안 그룹 규칙 | ✅ |

---

### 5단계: 기술적 세부사항 검증 ⭐ 핵심

**검증 항목**:
- [ ] **IP 주소 및 CIDR 블록**: VPC, 서브넷, 보안 그룹 규칙
- [ ] **포트 번호**: 보안 그룹, 방화벽 규칙
- [ ] **URL 및 엔드포인트**: API, 웹사이트, 서비스 URL
- [ ] **환경 변수**: 이름, 값, 설명
- [ ] **리소스 이름**: 버킷명, 함수명, 역할명
- [ ] **설정값**: 타임아웃, 메모리, 용량
- [ ] **명령어 파라미터**: CLI 명령어, 스크립트 옵션

**검증 방법**:
1. 가이드에서 모든 기술적 수치/값 추출
2. README.md에서 동일한 항목 찾기
3. 값이 정확히 일치하는지 확인

**예시 (Week 1-3)**:

#### 5-1. CIDR 블록 검증

| 항목 | 가이드 | README.md | 일치 |
|------|--------|-----------|------|
| VPC | 10.0.0.0/16 | 10.0.0.0/16 | ✅ |
| Public Subnet A | 10.0.1.0/24 | 10.0.1.0/24 | ✅ |
| Public Subnet C | 10.0.2.0/24 | 10.0.2.0/24 | ✅ |
| Private App Subnet A | 10.0.11.0/24 | 10.0.11.0/24 | ✅ |
| Private App Subnet C | 10.0.12.0/24 | 10.0.12.0/24 | ✅ |
| Private DB Subnet A | 10.0.21.0/24 | 10.0.21.0/24 | ✅ |
| Private DB Subnet C | 10.0.22.0/24 | 10.0.22.0/24 | ✅ |

#### 5-2. 보안 그룹 규칙 검증

| 보안 그룹 | 가이드 | README.md | 일치 |
|----------|--------|-----------|------|
| ALB SG | 80, 443 from 0.0.0.0/0 | Port 80, 443 from 0.0.0.0/0 | ✅ |
| Web SG | 80, 443 from ALB SG | Port 80, 443 from ALB SG | ✅ |
| App SG | 8080 from Web SG | Port 8080 from Web Tier SG | ✅ |
| DB SG | 3306 from App SG | Port 3306 from App Tier SG | ✅ |

#### 5-3. URL 파라미터 검증

| 항목 | 가이드 | template-info.md | 일치 |
|------|--------|------------------|------|
| URL | `https://app.diagrams.net/?splash=0&libs=aws4` | `splash=0`, `libs=aws4` | ✅ |

---

### 6단계: 아키텍처 구성 요소 검증 ✅

**검증 항목**:
- [ ] 가이드에 언급된 모든 AWS 서비스
- [ ] README.md의 체크리스트 또는 구성 요소 목록
- [ ] 누락된 구성 요소 없음
- [ ] 추가된 구성 요소 없음

**검증 방법**:
1. 가이드의 모든 태스크에서 AWS 서비스 추출
2. README.md의 체크리스트와 비교
3. 1:1 매칭 확인

**예시 (Week 1-3)**:

| 구성 요소 | 가이드 | README.md | 일치 |
|----------|--------|-----------|------|
| VPC | ✅ | ✅ | ✅ |
| Internet Gateway | ✅ | ✅ | ✅ |
| NAT Gateway x2 | ✅ | ✅ | ✅ |
| Application Load Balancer | ✅ | ✅ | ✅ |
| EC2 Web Tier x2 | ✅ | ✅ | ✅ |
| EC2 App Tier x2 | ✅ | ✅ | ✅ |
| Auto Scaling x2 | ✅ | ✅ | ✅ |
| RDS Multi-AZ | ✅ | ✅ | ✅ |
| Security Group x4 | ✅ | ✅ | ✅ |

---

### 7단계: 추가 기술 정보 검증 ✅

**검증 항목**:
- [ ] 복제 방식 (동기식/비동기식)
- [ ] 색상 구분 규칙
- [ ] 파일 형식 및 해상도
- [ ] 명명 규칙
- [ ] 기타 기술적 세부사항

**검증 방법**:
1. 가이드의 NOTE, TIP, 참고 섹션 확인
2. README.md의 해당 섹션과 비교
3. 기술적 정확성 확인

**예시 (Week 1-3)**:

| 항목 | 가이드 | README.md | 일치 |
|------|--------|-----------|------|
| RDS 복제 | Synchronous Replication | Synchronous Replication | ✅ |
| 색상 구분 | 초록/파랑/보라 | 초록/파랑/보라 | ✅ |
| 내보내기 해상도 | 300% | 300% | ✅ |
| 파일명 | aws-ha-architecture.png | aws-ha-architecture.png | ✅ |

---

### 8단계: 파일 실제 동작 가능성 검증 ⭐⭐⭐ (가장 중요)

**검증 항목**:
- [ ] **JSON 파일 문법**: 유효한 JSON 형식인지 확인
- [ ] **YAML 파일 문법**: 유효한 YAML 형식인지 확인
- [ ] **CloudFormation 템플릿**: AWS 리소스 정의가 올바른지 확인
- [ ] **IAM 정책**: 정책 구조 및 Condition 키 유효성 확인
- [ ] **Lambda 함수 코드**: 문법 오류 및 의존성 확인
- [ ] **스크립트 파일**: 실행 가능한 문법인지 확인
- [ ] **플레이스홀더 표준**: 명명 규칙 및 문서화 확인
- [ ] **코드 파일 제공 규칙**: 가이드 표시 + 별도 파일 제공 (규칙 51)

**플레이스홀더 표준 규칙**:
1. **명명 규칙**: `YOUR_{리소스타입}_{속성}` 형식, 대문자 + 언더스코어
2. **일관성**: 동일한 개념은 동일한 플레이스홀더 사용 (프로젝트 전체)
3. **문서화**: README.md에 수정 방법 명시 필수
4. **표준 플레이스홀더 목록** (15개):

| 플레이스홀더 | 설명 | 예시 값 |
|------------|------|---------|
| `YOUR_BUCKET_NAME` | S3 버킷 이름 | `my-lab-bucket-123` |
| `YOUR_IP_ADDRESS` | IP 주소 (CIDR 표기 시 `/32` 포함) | `203.0.113.45` |
| `YOUR_ACCOUNT_ID` | AWS 계정 ID (12자리 숫자) | `123456789012` |
| `YOUR_REGION` | AWS 리전 | `ap-northeast-2` |
| `YOUR_ROLE_NAME` | IAM 역할 이름 | `S3ReadOnlyRole` |
| `YOUR_ROLE_ARN` | IAM 역할 ARN | `arn:aws:iam::123456789012:role/MyRole` |
| `YOUR_USER_NAME` | IAM 사용자 이름 | `lab-user` |
| `YOUR_FUNCTION_NAME` | Lambda 함수 이름 | `MyFunction` |
| `YOUR_TABLE_NAME` | DynamoDB 테이블 이름 | `MyTable` |
| `YOUR_CLUSTER_NAME` | ECS/EKS 클러스터 이름 | `my-cluster` |
| `YOUR_VPC_ID` | VPC ID | `vpc-0123456789abcdef0` |
| `YOUR_SUBNET_ID` | 서브넷 ID | `subnet-0a1b2c3d4e5f6g7h8` |
| `YOUR_SECURITY_GROUP_ID` | 보안 그룹 ID | `sg-0123456789abcdef0` |
| `YOUR_KEY_PAIR_NAME` | EC2 키 페어 이름 | `my-key-pair` |
| `YOUR_INSTANCE_ID` | EC2 인스턴스 ID | `i-0123456789abcdef0` |

**❌ 잘못된 예시**:
- `ACCOUNT_ID` (YOUR_ 접두사 누락)
- `your_bucket_name` (소문자 사용)
- `YOUR-BUCKET-NAME` (하이픈 사용)
- `BUCKET_NAME` (YOUR_ 접두사 누락)

**✅ 올바른 예시**:
- `YOUR_ACCOUNT_ID`
- `YOUR_BUCKET_NAME`
- `YOUR_IP_ADDRESS`

**검증 방법**:

#### JSON 파일 검증
```bash
# JSON 문법 검증
python3 -m json.tool file.json > /dev/null 2>&1 && echo "✅ Valid" || echo "❌ Invalid"

# IAM 정책 구조 검증
- Version: "2012-10-17" 확인
- Statement 배열 존재 확인
- Effect, Action, Resource 필수 요소 확인
- Condition 키가 AWS 공식 문서에 존재하는지 확인
```

#### YAML 파일 검증
```bash
# YAML 문법 검증
python3 -c "import yaml; yaml.safe_load(open('file.yaml'))" && echo "✅ Valid" || echo "❌ Invalid"

# CloudFormation 템플릿 검증
- AWSTemplateFormatVersion 확인
- Resources 섹션 존재 확인
- 리소스 타입이 유효한지 확인 (AWS::EC2::Instance 등)
- 파라미터 참조가 올바른지 확인
```

#### Python/Node.js 코드 검증
```bash
# Python 문법 검증
python3 -m py_compile file.py && echo "✅ Valid" || echo "❌ Invalid"

# Node.js 문법 검증
node --check file.js && echo "✅ Valid" || echo "❌ Invalid"
```

#### Shell 스크립트 검증
```bash
# Bash 문법 검증
bash -n script.sh && echo "✅ Valid" || echo "❌ Invalid"
```

**검증 예시 (Week 2-1)**:

#### mfa-policy.json 검증

**JSON 문법**: ✅ Valid
```bash
python3 -m json.tool mfa-policy.json > /dev/null 2>&1
# Exit code: 0 (성공)
```

**IAM 정책 구조**: ✅ Valid
- Version: "2012-10-17" ✅
- Statement: 배열 형태 ✅
- Sid: 각 Statement에 고유 ID ✅
- Effect: "Allow" / "Deny" ✅
- Action: S3 액션 명시 ✅
- Resource: ARN 형식 ✅

**Condition 키 유효성**: ✅ Valid
- `aws:MultiFactorAuthPresent`: AWS 글로벌 키 (유효)
- `BoolIfExists`: Boolean 연산자 (유효)
- 참조: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html

**플레이스홀더 검증**: ✅ 표준 준수
- 명명 규칙: ✅ 대문자 + 언더스코어 (예: `YOUR_BUCKET_NAME`, `YOUR_IP_ADDRESS`)
- README.md 문서화: ✅ 수정 방법 명시됨
- 일관성: ✅ 모든 파일에서 동일한 플레이스홀더 사용
- 플레이스홀더 목록:
  - `YOUR_BUCKET_NAME` → 실제 버킷 이름으로 교체 필요
  - `YOUR_IP_ADDRESS` → 실제 IP 주소로 교체 필요
- 플레이스홀더 목록:
  - `YOUR_BUCKET_NAME` → 실제 버킷 이름으로 교체 필요
  - `YOUR_IP_ADDRESS` → 실제 IP 주소로 교체 필요
  - `YOUR_ACCOUNT_ID` → 실제 AWS 계정 ID로 교체 필요
  - `YOUR_REGION` → 실제 AWS 리전으로 교체 필요
  - `YOUR_ROLE_ARN` → 실제 IAM 역할 ARN으로 교체 필요

**실제 동작 가능성**:
- 플레이스홀더 수정 전: ⚠️ 학생이 수정해야 함 (의도된 설계)
- 플레이스홀더 수정 후: ✅ 정상 동작 가능

**정책 로직 검증**: ✅ 올바름
- MFA 없이 삭제 시도 → Deny (의도대로 동작)

#### CloudFormation 템플릿 검증 예시

**YAML 문법**: ✅ Valid
```bash
python3 -c "import yaml; yaml.safe_load(open('template.yaml'))"
# 오류 없음
```

**CloudFormation 구조**: ✅ Valid
- AWSTemplateFormatVersion: "2010-09-09" ✅
- Resources: 존재 ✅
- 리소스 타입: AWS::EC2::VPC, AWS::EC2::Subnet 등 (유효) ✅
- 파라미터 참조: !Ref, !GetAtt 올바름 ✅

**리소스 정의**: ✅ Valid
- VPC CIDR: 10.0.0.0/16 (유효한 CIDR) ✅
- 서브넷 CIDR: VPC 범위 내 (올바름) ✅
- 보안 그룹 규칙: 포트 및 프로토콜 유효 ✅

**실제 동작 가능성**: ✅ 정상 동작 가능
- AWS CloudFormation에서 스택 생성 가능
- 모든 리소스가 올바르게 생성됨

---

### 규칙 51: 코드 파일 제공 규칙 ⭐⭐⭐ (신규)

**제목**: 가이드 표시 + 별도 파일 제공 원칙

**규칙**:
- **원칙**: 학생이 이해하고 수정할 수 있는 코드는 가이드에 표시하고 별도 파일로도 제공
- **적용 대상**: Lambda 함수, IAM 정책, SQL 스크립트, 샘플 데이터 등
- **제외 대상**: CloudFormation 템플릿 (인프라 정의, 가이드 표시 불필요)

**예시**:
```markdown
✅ 올바른 예시 (Week 2-1 IAM 정책):
- 가이드: JSON 정책 코드 블록 14개 표시
- 파일: mfa-policy.json, ip-restriction-policy.json, time-based-policy.json 제공

✅ 올바른 예시 (Week 4-3 Lambda):
- 가이드: Python 코드 블록 3개 표시
- 파일: reservation_processor.py, notification_sender.py, table_availability_checker.py 제공

✅ 올바른 예시 (Week 5-3 DynamoDB):
- 가이드: JSON 샘플 데이터 1개 표시
- 파일: sample_reservations.json 제공

❌ 잘못된 예시 (Week 4-2):
- 가이드: Lambda 코드 표시 없음
- 파일: Lambda .py 파일 없음
- 템플릿: Lambda 코드 인라인만 (ZipFile)
```

**이유**:
- 학생이 코드를 읽고 이해할 수 있음
- 필요시 코드 수정 후 재배포 가능
- 가이드에서 코드 설명 시 참조 용이
- 로컬 개발 환경에서 테스트 가능

**적용 범위**:
- Lambda 함수 코드 (Python, Node.js)
- IAM 정책 (JSON)
- SQL 스크립트
- 샘플 데이터 (JSON, CSV)
- 설정 파일 (JSON, YAML)

**제외**:
- CloudFormation 템플릿 (인프라 정의, 별도 표시 불필요)
- README.md (문서, 코드 아님)

**검증 방법**:
1. 가이드에서 코드 블록 개수 확인 (`grep -c '```언어'`)
2. ZIP 파일 내 코드 파일 개수 확인 (`unzip -l | grep '\.확장자'`)
3. 개수 일치 여부 확인
4. 코드 내용 일치 여부 확인

**Week 1-7 검증 결과**:
- ✅ Week 2-1, 2-2: JSON 정책 (가이드 + 파일)
- ✅ Week 4-3: Lambda (가이드 + 파일)
- ✅ Week 5-3: JSON 샘플 (가이드 + 파일)
- ✅ Week 4-2: 데모 가이드 (규칙 51 적용 대상 아님)
- ✅ Week 5-1: SQL (선택적 초기화 스크립트, README 참조)

**제목**: 가이드 표시 + 별도 파일 제공 원칙

**규칙**:
- **원칙**: 학생이 이해하고 수정할 수 있는 코드는 가이드에 표시하고 별도 파일로도 제공
- **적용 대상**: Lambda 함수, IAM 정책, SQL 스크립트, 샘플 데이터 등
- **제외 대상**: CloudFormation 템플릿 (인프라 정의, 가이드 표시 불필요)

**예시**:
```markdown
✅ 올바른 예시 (Week 2-1 IAM 정책):
- 가이드: JSON 정책 코드 블록 14개 표시
- 파일: mfa-policy.json, ip-restriction-policy.json, time-based-policy.json 제공

✅ 올바른 예시 (Week 4-3 Lambda):
- 가이드: Python 코드 블록 3개 표시
- 파일: reservation_processor.py, notification_sender.py, table_availability_checker.py 제공

✅ 올바른 예시 (Week 5-3 DynamoDB):
- 가이드: JSON 샘플 데이터 1개 표시
- 파일: sample_reservations.json 제공

❌ 잘못된 예시 (Week 4-2):
- 가이드: Lambda 코드 표시 없음
- 파일: Lambda .py 파일 없음
- 템플릿: Lambda 코드 인라인만 (ZipFile)
```

**이유**:
- 학생이 코드를 읽고 이해할 수 있음
- 필요시 코드 수정 후 재배포 가능
- 가이드에서 코드 설명 시 참조 용이
- 로컬 개발 환경에서 테스트 가능

**적용 범위**:
- Lambda 함수 코드 (Python, Node.js)
- IAM 정책 (JSON)
- SQL 스크립트
- 샘플 데이터 (JSON, CSV)
- 설정 파일 (JSON, YAML)

**제외**:
- CloudFormation 템플릿 (인프라 정의, 별도 표시 불필요)
- README.md (문서, 코드 아님)

**검증 방법**:
1. 가이드에서 코드 블록 개수 확인 (`grep -c '```언어'`)
2. ZIP 파일 내 코드 파일 개수 확인 (`unzip -l | grep '\.확장자'`)
3. 개수 일치 여부 확인
4. 코드 내용 일치 여부 확인

**Week 1-7 검증 결과**:
- ✅ Week 2-1, 2-2: JSON 정책 (가이드 + 파일)
- ✅ Week 4-3: Lambda (가이드 + 파일)
- ✅ Week 5-3: JSON 샘플 (가이드 + 파일)
- ✅ Week 4-2: 데모 가이드 (규칙 51 적용 대상 아님)
- ✅ Week 5-1: SQL (선택적 초기화 스크립트, README 참조)

---

## 📊 검증 결과 템플릿

**보고서 저장 위치**: `docs/reports/WEEK{X}-{Y}_CONTENT_VERIFICATION.md`

각 주차 검증 후 다음 형식으로 결과를 기록합니다:

```markdown
# Week {X}-{Y} Content Verification Report

**검증 대상**: `public/content/week{X}/{X}-{Y}-*.md`  
**참조 문서**: `public/files/week{X}/*/README.md` 등  
**검증 일시**: YYYY-MM-DD

---

## ✅ 검증 결과 요약

**전체 결과**: ✅/❌ **[일치/불일치] 항목 수**

| 검증 항목 | 결과 | 세부 사항 |
|----------|------|----------|
| 파일 구조 | ✅/❌ | ... |
| DOWNLOAD Alert | ✅/❌ | ... |
| 학습 목표 | ✅/❌ | ... |
| 태스크 내용 | ✅/❌ | ... |
| 기술적 세부사항 | ✅/❌ | ... |
| 아키텍처 구성 요소 | ✅/❌ | ... |
| 추가 기술 정보 | ✅/❌ | ... |

---

## 📋 상세 검증 내역

### 1. 파일 구조 검증
[상세 내용]

### 2. DOWNLOAD Alert 검증
[상세 내용]

### 3. 학습 목표 검증
[상세 내용]

### 4. 태스크 내용 검증
[상세 내용]

### 5. 기술적 세부사항 검증 ⭐
[상세 내용 - 가장 중요]

### 6. 아키텍처 구성 요소 검증
[상세 내용]

### 7. 추가 기술 정보 검증
[상세 내용]

---

## 📊 검증 통계

| 항목 | 검증 수 | 일치 | 불일치 |
|------|---------|------|--------|
| ... | ... | ... | ... |
| **총계** | **X개** | **Y개** | **Z개** |

**정확도**: XX% (Y/X)

---

## ✅/❌ 최종 결론

[검증 결과 요약]

### 검증 완료 항목
[목록]

### 불일치 항목 (있는 경우)
[목록 및 수정 필요 사항]

### 품질 평가
- **정확성**: ⭐⭐⭐⭐⭐ (X/5)
- **일관성**: ⭐⭐⭐⭐⭐ (X/5)
- **완성도**: ⭐⭐⭐⭐⭐ (X/5)
```

---

## 🎯 검증 우선순위

### 필수 검증 (반드시 확인)
1. ⭐⭐⭐ **파일 실제 동작 가능성** (8단계) - 가장 중요
   - JSON/YAML 문법, CloudFormation 템플릿, IAM 정책, Lambda 코드, 스크립트 실행 가능성
2. ⭐⭐⭐ **기술적 세부사항** (5단계) - 매우 중요
   - IP/CIDR, 포트, URL, 환경 변수, 명령어 파라미터
3. ⭐⭐ **DOWNLOAD Alert** (2단계)
   - 파일 목록 일치 여부
4. ⭐⭐ **학습 목표** (3단계)
   - Front Matter와 README.md 일치

### 권장 검증 (가능하면 확인)
5. ⭐ **태스크 내용** (4단계)
   - 참조 문서와 일관성
6. ⭐ **아키텍처 구성 요소** (6단계)
   - AWS 서비스 목록 일치
7. ⭐ **추가 기술 정보** (7단계)
   - 복제 방식, 색상 구분 등

---

## 🔧 검증 도구

### 자동 검증 스크립트
```bash
# 전체 검증
npm run validate:lab-env

# 특정 주차
npm run validate:lab-env:week {X}

# 특정 파일
npm run validate:lab-env:file public/content/week{X}/{X}-{Y}-*.md
```

### 수동 검증 (이 문서 사용)
1. 체크리스트 출력
2. 가이드와 README.md 나란히 열기
3. 7단계 순서대로 검증
4. 결과 템플릿에 기록

---

## 📝 검증 예시 (Week 1-3)

**검증 완료**: ✅ 100% 일치 (28개 항목 중 28개)

**상세 리포트**: `WEEK1-3_CONTENT_VERIFICATION.md`

**주요 검증 항목**:
- ✅ URL 파라미터: `splash=0&libs=aws4`
- ✅ VPC CIDR: `10.0.0.0/16`
- ✅ 서브넷 CIDR: 6개 모두 정확
- ✅ 보안 그룹 규칙: 4개 모두 정확
- ✅ 가용 영역: ap-northeast-2a, ap-northeast-2c
- ✅ 아키텍처 구성 요소: 10개 모두 정확
- ✅ 학습 목표: Front Matter와 README.md 일치
- ✅ 기술적 세부사항: RDS 복제, 색상 구분, 내보내기 설정 모두 정확

---

## 🚀 다음 단계

### Week 2-15 검증 계획

1. **Week 2**: IAM 정책 및 역할 (3개 세션)
2. **Week 3**: VPC 및 네트워킹 (3개 세션)
3. **Week 4**: Lambda 및 서버리스 (3개 세션)
4. **Week 5**: RDS 및 DynamoDB (2개 세션)
5. **Week 6**: CloudFormation (4개 세션)
6. **Week 7**: ECS 및 컨테이너 (1개 세션)
7. **Week 9**: CI/CD 파이프라인 (2개 세션)
8. **Week 10**: ElastiCache 및 CloudFront (3개 세션)
9. **Week 11**: 데이터 레이크 및 파이프라인 (3개 세션)
10. **Week 12**: 보안 및 규정 준수 (3개 세션)
11. **Week 13**: 모니터링 및 로깅 (2개 세션)
12. **Week 14**: Bedrock 및 AI (3개 세션)

**총 검증 대상**: 약 32개 세션 (Week 8, 15 제외)

---

## 💡 검증 팁

### 효율적인 검증 방법

1. **파일 비교 도구 사용**
   - VS Code의 "Compare Selected" 기능
   - 가이드와 README.md를 나란히 열기

2. **검색 기능 활용**
   - CIDR 블록: `10.0.` 검색
   - 포트 번호: `Port`, `Inbound` 검색
   - URL: `https://` 검색

3. **체크리스트 인쇄**
   - 이 문서를 출력하여 수동 체크
   - 또는 별도 파일로 복사하여 체크

4. **일괄 검증**
   - 같은 유형의 항목을 한 번에 검증
   - 예: 모든 CIDR 블록을 한 번에 확인

### 주의사항

- ⚠️ **표현 차이 허용**: 의미가 같으면 표현이 달라도 OK
  - 예: "작성할 수 있습니다" vs "작성"
- ⚠️ **단위 확인**: 시간(초/분), 용량(MB/GB), 포트 번호
- ⚠️ **대소문자 구분**: URL, 파일명, 리소스명
- ⚠️ **공백 및 특수문자**: CIDR 블록, IP 주소

---

**작성일**: 2025-02-14  
**버전**: 1.0.0  
**기준 검증**: Week 1-3 (100% 일치)  
**다음 검증**: Week 2-1부터 순차 진행
