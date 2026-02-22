# Week 2-2 데모 스크립트: AWS STS AssumeRole을 활용한 역할 전환

**소요 시간**: 10분  
**대상**: 교수 (PPT 촬영본 시연용)

---

## 1. 도입 (1분)

### 화면 공유

- 실습 가이드 웹페이지 (Week 2-2) 화면 공유

### 멘트

"안녕하세요. 이번 실습은 'AWS STS AssumeRole을 활용한 역할 전환'입니다."

"이번 실습의 목표는 AssumeRole로 역할을 전환하고, 임시 자격증명으로 S3에 접근하는 방법을 배우는 것입니다."

"오늘 실습의 핵심만 간단히 살펴볼 예정입니다. 사용자 권한 확인, AssumeRole 실행, 그리고 S3 접근 테스트 순서로 진행합니다."

---

## 2. 현재 사용자 권한 확인 (2분)

### 화면 전환

- AWS IAM 콘솔로 이동

### 멘트

"먼저 현재 사용자가 어떤 권한을 가지고 있는지 확인해보겠습니다."

**[클릭: Users]**

"사용자 목록에서 현재 사용 중인 사용자를 선택합니다."

**[클릭: 사용자 이름]**

"Permissions 탭을 보시면 이 사용자에게 연결된 정책들을 확인할 수 있습니다."

**[클릭: Permissions 탭]**

"여기 보시면 `AssumeS3ReadOnlyRolePolicy`라는 인라인 정책이 있습니다."

**[화면: Permissions policies 섹션을 가리키며]**

"이 정책을 클릭해서 내용을 확인해보겠습니다."

**[클릭: AssumeS3ReadOnlyRolePolicy]**

**[화면: JSON 정책 내용]**

"이 정책은 `sts:AssumeRole` 권한만 부여하고 있습니다. Resource에는 S3ReadOnlyRole이 지정되어 있네요."

"즉, 이 사용자는 S3ReadOnlyRole 역할을 맡을 수 있는 권한만 있고, S3에 직접 접근할 수 있는 권한은 없습니다."

"이제 CloudShell에서 실제로 확인해보겠습니다."

---

## 3. CloudShell에서 AssumeRole 실행 및 S3 접근 테스트 (4분)

### 화면 전환

- AWS CloudShell 실행

### 멘트

"CloudShell을 실행합니다."

**[클릭: CloudShell 아이콘]**

**[대기: CloudShell 로딩]**

"먼저 현재 자격증명을 확인해보겠습니다."

**[입력 및 실행]**

```bash
aws sts get-caller-identity
```

**[화면: 출력 결과]**

"Arn을 보시면 `arn:aws:iam::계정ID:user/사용자이름`으로 표시됩니다. 현재 IAM 사용자로 인증되어 있습니다."

"이제 S3 버킷 목록을 조회해보겠습니다."

**[입력 및 실행]**

```bash
aws s3 ls
```

**[화면: AccessDenied 오류]**

"예상대로 AccessDenied 오류가 발생합니다. 현재 사용자는 S3 접근 권한이 없기 때문입니다."

"이제 AssumeRole을 사용해서 S3ReadOnlyRole 역할을 맡아보겠습니다."

**[입력 및 실행]**

```bash
aws sts assume-role \
  --role-arn arn:aws:iam::123456789012:role/S3ReadOnlyRole \
  --role-session-name s3-readonly-session
```

**[화면: 출력 결과 - Credentials 섹션]**

"AssumeRole이 성공하면 이렇게 임시 자격증명을 받습니다."

"Credentials 섹션을 보시면 AccessKeyId, SecretAccessKey, SessionToken 세 가지 값이 있습니다."

"이 값들을 환경 변수로 설정하면 AWS CLI가 이 임시 자격증명을 사용하게 됩니다."

**[화면: 메모장에 미리 준비한 export 명령어 3줄]**

"실습에서는 이 세 값을 복사해서 환경 변수로 설정합니다. 저는 미리 준비해둔 명령어를 사용하겠습니다."

**[복사 및 붙여넣기]**

```bash
export AWS_ACCESS_KEY_ID="ASIAZ..."
export AWS_SECRET_ACCESS_KEY="wJalrXUtn..."
export AWS_SESSION_TOKEN="FwoGZXIvYXdz..."
```

**[실행]**

"환경 변수가 설정되었습니다. 이제 다시 자격증명을 확인해보겠습니다."

**[입력 및 실행]**

```bash
aws sts get-caller-identity
```

**[화면: 출력 결과]**

"Arn이 변경되었습니다. `arn:aws:sts::계정ID:assumed-role/S3ReadOnlyRole/s3-readonly-session`으로 표시됩니다."

"assumed-role이라는 단어가 보이시죠? 이제 역할을 사용하고 있다는 의미입니다."

"이제 다시 S3 버킷 목록을 조회해보겠습니다."

**[입력 및 실행]**

```bash
aws s3 ls
```

**[화면: 버킷 목록 출력]**

"이번에는 성공했습니다! 버킷 목록이 조회됩니다."

"역할을 맡으니 S3 읽기 권한을 얻게 된 것입니다."

---

## 4. 역할 전환 전후 비교표 정리 및 마무리 (3분)

### 화면 전환

- 실습 가이드의 비교표 섹션으로 이동

### 멘트

"이제 방금 확인한 내용을 표로 정리해보겠습니다."

**[화면: 비교표]**

"역할 전환 전후를 비교해보면 네 가지 차이점이 있습니다."

**[표의 첫 번째 행을 가리키며]**

"첫째, 자격증명 유형입니다. 처음에는 IAM 사용자 자격증명을 사용했지만, AssumeRole 후에는 임시 역할 자격증명을 사용합니다."

**[표의 두 번째 행을 가리키며]**

"둘째, ARN이 변경됩니다. user에서 assumed-role로 바뀌었죠."

**[표의 세 번째 행을 가리키며]**

"셋째, S3 접근 권한입니다. 처음에는 권한이 없어서 AccessDenied가 발생했지만, 역할을 맡은 후에는 읽기 전용 권한을 얻었습니다."

**[표의 네 번째 행을 가리키며]**

"넷째, 유효 기간입니다. IAM 사용자 자격증명은 영구적이지만, 임시 자격증명은 기본 1시간 동안만 유효합니다."

"이렇게 AssumeRole을 사용하면 필요한 시점에만 권한을 얻을 수 있어서 보안이 강화됩니다."

### 실무 활용 사례

"실무에서는 이런 방식을 어디에 사용할까요?"

"첫째, Lambda 함수가 실행될 때 자동으로 역할을 맡아서 필요한 권한을 얻습니다."

"둘째, 다른 AWS 계정의 리소스에 접근할 때 Cross-Account Access로 사용합니다."

"셋째, 일반 사용자가 특정 작업을 위해 임시로 높은 권한을 얻을 때 사용합니다."

### 마무리

"이번 실습에서는 IAM 역할을 생성하고, AssumeRole로 역할을 전환하며, 임시 자격증명으로 리소스에 접근하는 방법을 배웠습니다."

"실습 가이드에는 더 자세한 단계와 설명이 있으니 직접 따라해보시기 바랍니다."

"질문 있으신가요?"

**[종료]**

---

## 📝 준비 사항

### 사전 준비

1. AWS 계정에 Week 2-2 실습 환경 구축 (CloudFormation 스택 배포)
2. IAM 사용자에 `AssumeS3ReadOnlyRolePolicy` 인라인 정책 추가
3. S3ReadOnlyRole 역할 생성 및 ARN 복사
4. 메모장에 export 명령어 3줄 미리 작성 (실제 자격증명 값 포함)

### 화면 전환 순서

1. 실습 가이드 웹페이지
2. IAM 콘솔 (Users → Permissions)
3. CloudShell
4. 실습 가이드 웹페이지 (비교표)

### 주의 사항

- CloudShell 로딩 시간 고려 (미리 열어두기)
- AssumeRole 명령어의 역할 ARN은 실제 계정 ID로 교체
- 임시 자격증명 값은 보안상 촬영 후 즉시 만료시키기
- 시연 후 리소스 정리 (CloudFormation 스택 삭제)

---

**마지막 업데이트**: 2025-02-23  
**버전**: 1.0.0
