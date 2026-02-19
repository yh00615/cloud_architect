# 📝 가이드 개선 실행 명세 (Guide Improvement Execution Spec)

**문서 타입**: Execution Specification  
**작성일**: 2025-02-12  
**목적**: 옵션 2 (기존 가이드 개선) 실행 계획 및 진행 상황 추적

---

## 📊 현재 상태

### 진행 중인 작업
- **3-1-vpc-design-strategy.md**: 계층 구조 적용 중 (60% 완료)
  - ✅ 태스크 1: 계층 구조 적용 완료 (4개 하위 단계)
  - ✅ 태스크 2: 계층 구조 적용 완료 (3개 하위 단계)
  - ❌ 태스크 3: 특수 문자 문제로 중단 (계층 구조 미적용)

### 문제 상황
- `strReplace` 실패: 파일 내 특수 문자로 인해 태스크 3 부분 수정 불가
- 임시 파일 생성됨: `3-1-vpc-design-strategy-temp.md` (태스크 3 계층 구조 버전)

---

## 🎯 실행 계획

### Phase 1: 3-1 가이드 완료 (최우선)

#### Step 1.1: 태스크 3 계층 구조 적용 완료
**목표**: 특수 문자 문제 해결 및 태스크 3 계층 구조 적용

**방법**:
1. 현재 파일 백업
2. 태스크 3 부분을 임시 파일(`3-1-vpc-design-strategy-temp.md`)의 내용으로 교체
3. 전체 파일 재작성 (특수 문자 회피)

**태스크 3 계층 구조**:
```markdown
## 태스크 3: VPC Endpoint 동작 확인

### 태스크 3.1: EC2 인스턴스 접속

1. AWS Management Console에 로그인한 후 상단 검색창에서 `EC2`를 검색하고 선택합니다.
2. 왼쪽 메뉴에서 **Instances**를 선택합니다.
...
8. [[Connect]] 버튼을 클릭합니다.

### 태스크 3.2: S3 버킷 목록 확인

1. 다음 명령어를 입력합니다:

```bash
aws s3 ls
```

2. Enter 키를 눌러 실행합니다.
3. S3 버킷 목록이 표시되는지 확인합니다.

### 태스크 3.3: VPC Endpoint URL 확인

1. 다음 명령어를 입력합니다:

```bash
aws s3 ls --debug 2>&1 | grep -i endpoint
```

2. Enter 키를 눌러 실행합니다.
3. 출력 결과에서 VPC Endpoint URL을 확인합니다.
```

**검증**:
- [ ] `npm run review:guides` 실행
- [ ] 표준 문구 47개 규칙 준수 확인
- [ ] 계층 구조 3단계 모두 적용 확인

---

#### Step 1.2: 3-1 가이드 최종 검토
**체크리스트**:
- [ ] 태스크 0 존재 (CloudFormation 환경 구축)
- [ ] 태스크 1-3 계층 구조 적용
- [ ] 리소스 정리 간소화 (CloudFormation 스택 삭제)
- [ ] DOWNLOAD Alert 포함
- [ ] WARNING Alert 포함 (비용 정보)
- [ ] 📚 참고 섹션 포함

---

### Phase 2: 5-1 가이드 개선

#### Step 2.1: 현재 상태 분석
**파일**: `public/content/week5/5-1-rds-multi-az.md`

**현재 구조**:
- 태스크 수: 7개
- 태스크 0: 없음
- 계층 구조: 일부만 사용 (태스크 3만)
- 리소스 정리: 복잡 (4단계)

**개선 목표**:
- 태스크 0 추가 (CloudFormation)
- 태스크 수 유지 또는 축소 (3-4개)
- 모든 태스크에 계층 구조 적용
- 리소스 정리 간소화

---

#### Step 2.2: CloudFormation 템플릿 작성
**파일**: `public/files/week5/week5-1-rds-lab.yaml`

**생성할 리소스**:
- VPC (10.0.0.0/16)
- 퍼블릭 서브넷 2개 (Multi-AZ)
- 프라이빗 서브넷 2개 (Multi-AZ)
- 데이터베이스 서브넷 2개 (Multi-AZ)
- 보안 그룹 (RDS 접근용)
- DB 서브넷 그룹

**Outputs**:
- VpcId
- DBSubnetGroupName
- SecurityGroupId

---

#### Step 2.3: 가이드 재작성
**새로운 구조**:

```markdown
## 태스크 0: 실습 환경 구축
- CloudFormation으로 VPC, 서브넷, 보안 그룹 자동 생성

## 태스크 1: RDS MySQL 인스턴스 생성 (Multi-AZ)
### 태스크 1.1: 엔진 및 템플릿 선택
### 태스크 1.2: 기본 설정
### 태스크 1.3: Multi-AZ 및 네트워크 설정

## 태스크 2: Read Replica 생성
### 태스크 2.1: Replica 생성
### 태스크 2.2: 복제 지연 확인

## 태스크 3: 페일오버 테스트
### 태스크 3.1: 수동 페일오버 수행
### 태스크 3.2: 페일오버 시간 측정

## 리소스 정리
- CloudFormation 스택 삭제 (간소화)
```

---

### Phase 3: 4-1 가이드 개선

#### Step 3.1: 현재 상태 분석
**파일**: `public/content/week4/4-1-lambda-api-gateway-demo.md`

**현재 구조**:
- 태스크 수: 5개 (적절)
- CONCEPT Alert: 없음 (데모인데 개념 설명 부족)
- 계층 구조: 일부만 사용 (태스크 3만)

**개선 목표**:
- CONCEPT Alert 추가 (태스크당 1-2개)
- 모든 태스크에 계층 구조 적용

---

#### Step 3.2: CONCEPT Alert 추가
**추가할 개념**:

**태스크 1: Lambda 함수 생성**
```markdown
> [!CONCEPT] Lambda 실행 환경
> Lambda는 함수를 실행하기 위해 격리된 컨테이너 환경을 생성합니다.
> 환경은 런타임, 메모리, 임시 스토리지(/tmp)를 포함합니다.
```

**태스크 2: 콜드/웜 스타트 확인**
```markdown
> [!CONCEPT] 콜드 스타트 vs 웜 스타트
> - 콜드 스타트: 첫 호출 시 실행 환경 초기화 (100-1000ms)
> - 웜 스타트: 기존 환경 재사용 (수 밀리초)
```

**태스크 3: API Gateway 통합**
```markdown
> [!CONCEPT] Lambda 프록시 통합
> 프록시 통합은 HTTP 요청을 그대로 Lambda에 전달하고, Lambda 응답을 HTTP 응답으로 변환합니다.
> 개발자가 요청/응답 매핑을 직접 제어할 수 있습니다.
```

---

### Phase 4: 2-1 가이드 개선

#### Step 4.1: 현재 상태 분석
**파일**: `public/content/week2/2-1-iam-role-assumerole.md`

**현재 구조**:
- 태스크 수: 8개
- 태스크 0: 없음
- 계층 구조: 미사용

**개선 목표**:
- 태스크 0 추가 (선택사항 - IAM 기본 환경)
- 모든 태스크에 계층 구조 적용

---

#### Step 4.2: 계층 구조 적용
**새로운 구조**:

```markdown
## 태스크 0: 실습 환경 구축 (선택사항)
- CloudFormation으로 기본 IAM 사용자 및 정책 생성

## 태스크 1: S3 읽기 전용 역할 생성
### 태스크 1.1: 신뢰 정책 구성
### 태스크 1.2: 권한 정책 연결

## 태스크 2: AssumeRole 권한 부여
### 태스크 2.1: 인라인 정책 생성
### 태스크 2.2: 정책 연결

## 태스크 3: AssumeRole 수행 및 테스트
### 태스크 3.1: 임시 자격증명 획득
### 태스크 3.2: S3 접근 테스트
```

---

### Phase 5: 10-3 가이드 개선

#### Step 5.1: 현재 상태 분석
**파일**: `public/content/week10/10-3-cloudfront-demo.md`

**현재 구조**:
- 태스크 수: 5개 (적절)
- CONCEPT Alert: 적절히 활용 중
- 계층 구조: 미사용

**개선 목표**:
- 모든 태스크에 계층 구조 적용
- 태스크 0 추가 (선택사항 - S3 버킷 자동 생성)

---

#### Step 5.2: 계층 구조 적용
**새로운 구조**:

```markdown
## 태스크 0: 실습 환경 구축 (선택사항)
- CloudFormation으로 S3 버킷 및 콘텐츠 자동 업로드

## 태스크 1: CloudFront 배포 생성
### 태스크 1.1: 오리진 설정
### 태스크 1.2: OAC 구성
### 태스크 1.3: 캐시 정책 설정

## 태스크 2: 캐싱 동작 확인
### 태스크 2.1: 첫 번째 요청 (캐시 미스)
### 태스크 2.2: 두 번째 요청 (캐시 히트)

## 태스크 3: 캐시 무효화
### 태스크 3.1: 무효화 생성
### 태스크 3.2: 무효화 확인
```

---

## 📋 작업 우선순위

### 우선순위 1 (즉시 시작)
1. **3-1 가이드 완료** - 태스크 3 계층 구조 적용
2. **5-1 가이드 개선** - CloudFormation 템플릿 작성 + 가이드 재작성

### 우선순위 2 (1주일 내)
3. **4-1 가이드 개선** - CONCEPT Alert 추가 + 계층 구조 적용
4. **2-1 가이드 개선** - 계층 구조 적용
5. **10-3 가이드 개선** - 계층 구조 적용

---

## 📊 진행 상황 추적

### 3-1-vpc-design-strategy.md
- [x] 태스크 0 존재 확인
- [x] 태스크 1 계층 구조 적용
- [x] 태스크 2 계층 구조 적용
- [ ] 태스크 3 계층 구조 적용 ⬅️ **현재 작업**
- [ ] 리소스 정리 확인
- [ ] 최종 검증

### 5-1-rds-multi-az.md
- [ ] 현재 상태 분석
- [ ] CloudFormation 템플릿 작성
- [ ] 가이드 재작성
- [ ] 검증

### 4-1-lambda-api-gateway-demo.md
- [ ] 현재 상태 분석
- [ ] CONCEPT Alert 추가
- [ ] 계층 구조 적용
- [ ] 검증

### 2-1-iam-role-assumerole.md
- [ ] 현재 상태 분석
- [ ] 계층 구조 적용
- [ ] 검증

### 10-3-cloudfront-demo.md
- [ ] 현재 상태 분석
- [ ] 계층 구조 적용
- [ ] 검증

---

## 🔧 기술적 해결 방법

### 특수 문자 문제 해결
**문제**: `strReplace` 실패로 태스크 3 수정 불가

**해결 방법 1: 전체 파일 재작성**
```typescript
// 현재 파일 읽기
const currentContent = readFile('3-1-vpc-design-strategy.md')

// 태스크 3 부분만 교체
const task3Content = readFile('3-1-vpc-design-strategy-temp.md')
const newContent = replaceTask3(currentContent, task3Content)

// 전체 파일 재작성
fsWrite('3-1-vpc-design-strategy.md', newContent)
```

**해결 방법 2: 수동 병합**
1. 현재 파일의 태스크 0-2 부분 복사
2. 임시 파일의 태스크 3 부분 복사
3. 나머지 부분 (마무리, 리소스 정리, 참고) 복사
4. 전체 파일 재작성

---

## ✅ 검증 기준

### 각 가이드 완료 기준
- [ ] 태스크 0 존재 (CloudFormation 환경 구축)
- [ ] 모든 태스크에 계층 구조 적용 (### 태스크 X.Y)
- [ ] 리소스 정리 간소화 (CloudFormation 스택 삭제)
- [ ] DOWNLOAD Alert 포함 (실습만)
- [ ] WARNING Alert 포함 (비용 정보)
- [ ] CONCEPT Alert 적절 (데모: 태스크당 1-2개, 실습: 전체 1-3개)
- [ ] 📚 참고 섹션 포함
- [ ] `npm run review:guides` 통과

### 전체 완료 기준
- [ ] 5개 가이드 모두 개선 완료
- [ ] 표준 문구 47개 규칙 준수
- [ ] 검증 스크립트 통과 (80점 이상)

---

## 📝 다음 단계

### 즉시 실행
1. **3-1 가이드 태스크 3 완료**
   - 임시 파일 내용으로 태스크 3 교체
   - 전체 파일 재작성
   - 검증 실행

2. **5-1 가이드 개선 시작**
   - CloudFormation 템플릿 작성
   - 가이드 재작성
   - 검증 실행

### 1주일 내
3. **4-1, 2-1, 10-3 가이드 개선**
   - 순차적으로 진행
   - 각 가이드 완료 후 검증

---

## 📚 참조 문서

- **개선 명세**: `.kiro/specs/guide-improvement-specification.md`
- **다음 단계**: `.kiro/specs/next-steps-specification.md`
- **핵심 규칙**: `.kiro/steering/CORE_RULES.md`
- **가이드 작성**: `.kiro/steering/guide-writing-guide.md`
- **계층 구조**: `.kiro/steering/markdown-guide/08-guide-strategy.md`

---

**마지막 업데이트**: 2025-02-12  
**버전**: 1.0.0  
**상태**: 실행 중 (3-1 가이드 60% 완료)
