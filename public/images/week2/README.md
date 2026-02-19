# Week 2 이미지 - IAM 역할 및 정책

이 폴더는 Week 2 실습 가이드에 사용되는 스크린샷을 저장합니다.

## 📸 필요한 이미지 목록

### 2-1: AWS IAM 정책 Condition 요소 활용

#### 태스크 1: S3 버킷 생성 및 테스트 객체 업로드
- [ ] `2-1-step1-s3-search.png`
  - **캡처 내용**: AWS Management Console 상단 검색창에 "S3" 입력
  - **강조 표시**: 검색창과 S3 서비스 결과
  - **크기**: 약 800x400px

- [ ] `2-1-step2-create-bucket.png`
  - **캡처 내용**: S3 콘솔의 Create bucket 버튼
  - **강조 표시**: Create bucket 버튼에 빨간 박스
  - **크기**: 약 1200x600px

#### 태스크 2: MFA 강제 정책 생성
- [ ] `2-1-step1-iam-policies.png`
  - **캡처 내용**: IAM 콘솔의 Policies 메뉴
  - **강조 표시**: Policies 메뉴 항목
  - **크기**: 약 1200x600px

- [ ] `2-1-step3-json-editor.png`
  - **캡처 내용**: Create policy 화면의 JSON 에디터
  - **강조 표시**: JSON 탭 선택
  - **크기**: 약 1200x800px

#### 태스크 3: IP 주소 제한 정책 생성
- [ ] `2-1-step2-ip-policy-json.png`
  - **캡처 내용**: IP 제한 정책 JSON 에디터
  - **강조 표시**: IpAddress Condition 부분
  - **크기**: 약 1200x800px

#### 태스크 4: 시간 기반 접근 제어 정책 생성
- [ ] `2-1-step2-time-policy-json.png`
  - **캡처 내용**: 시간 기반 정책 JSON 에디터
  - **강조 표시**: DateGreaterThan/DateLessThan Condition 부분
  - **크기**: 약 1200x800px

### 2-2: AWS STS AssumeRole을 활용한 역할 전환

#### 태스크 1: S3 읽기 전용 역할 생성
- [ ] `2-1-step1-iam-search.png`
  - **캡처 내용**: AWS Management Console 상단 검색창에 "IAM" 입력
  - **강조 표시**: 검색창과 IAM 서비스 결과
  - **크기**: 약 800x400px

- [ ] `2-1-step2-roles-menu.png`
  - **캡처 내용**: IAM 콘솔 왼쪽 메뉴의 "Roles" 항목
  - **강조 표시**: Roles 메뉴 항목에 빨간 박스
  - **크기**: 약 300x600px

- [ ] `2-1-step5-trusted-entity.png`
  - **캡처 내용**: Create role 화면의 Trusted entity type 설정
  - **강조 표시**: "AWS account" 선택 및 "This account" 라디오 버튼
  - **크기**: 약 1200x800px

#### 태스크 2: 권한 정책 연결
- [ ] `2-1-step2-permission-policy.png`
  - **캡처 내용**: Permissions policies 검색창에 "S3" 입력 및 AmazonS3ReadOnlyAccess 정책
  - **강조 표시**: 검색창과 정책 체크박스
  - **크기**: 약 1200x600px

- [ ] `2-1-step5-role-name.png`
  - **캡처 내용**: Role name 및 Description 입력 필드
  - **강조 표시**: 입력 필드에 빨간 박스
  - **크기**: 약 1000x400px

- [ ] `2-1-step7-role-created.png`
  - **캡처 내용**: 역할 생성 완료 후 성공 메시지 또는 역할 목록
  - **강조 표시**: 생성된 S3ReadOnlyRole
  - **크기**: 약 1200x600px

### 2-2: IAM 정책 Condition 키 활용

#### 태스크 1: MFA 강제 정책
- [ ] `2-2-step1-iam-policies.png`
  - **캡처 내용**: IAM 콘솔의 Policies 메뉴
  - **크기**: 약 1200x600px

- [ ] `2-2-step3-json-editor.png`
  - **캡처 내용**: Create policy 화면의 JSON 에디터
  - **강조 표시**: JSON 탭 선택
  - **크기**: 약 1200x800px

## 🎨 캡처 가이드라인

### 공통 요구사항
- **브라우저**: Chrome (일관성 유지)
- **AWS 콘솔 언어**: 영어
- **확대/축소**: 100%
- **테마**: 라이트 모드 (기본)

### 강조 표시 방법
1. **빨간 박스**: 클릭해야 할 버튼이나 입력 필드
2. **화살표**: 순서나 방향 표시
3. **번호**: 여러 단계를 한 이미지에 표시할 때

### 개인정보 제거
- ✅ 계정 ID → `123456789012` 또는 모자이크
- ✅ 이메일 → `user@example.com` 또는 모자이크
- ✅ 사용자 이름 → `lab-user` 또는 모자이크

## 📝 예시 마크다운

```markdown
1. AWS Management Console에 로그인한 후 상단 검색창에서 `IAM`을 검색하고 선택합니다.

![IAM 서비스 검색](/images/week2/2-1-step1-iam-search.png)

2. 왼쪽 메뉴에서 **Roles**를 선택합니다.

![IAM 콘솔 - Roles 메뉴](/images/week2/2-1-step2-roles-menu.png)
```

## 🔧 이미지 최적화

```bash
# 이 폴더의 모든 이미지 최적화
cd public/images/week2
pngquant --quality=65-80 --ext .png --force *.png
```

---

**참고**: 이미지를 추가한 후 반드시 파일 크기를 확인하고 500KB 이하로 최적화하세요.
