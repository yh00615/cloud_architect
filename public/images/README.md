# 실습 가이드 이미지 저장소

이 폴더는 실습 가이드에 사용되는 스크린샷 이미지를 저장하는 곳입니다.

## 📁 폴더 구조

```
images/
├── week1/
│   ├── 1-1-step1-well-architected-search.png
│   └── 1-1-step2-create-workload.png
├── week2/
│   ├── 2-1-step1-iam-search.png
│   ├── 2-1-step2-roles-menu.png
│   ├── 2-1-step5-trusted-entity.png
│   ├── 2-1-step2-permission-policy.png
│   ├── 2-1-step5-role-name.png
│   └── 2-1-step7-role-created.png
└── week3/
    └── ...
```

## 📸 파일 명명 규칙

**형식**: `{주차}-{세션}-step{단계}-{설명}.png`

**예시**:
- `2-1-step1-iam-search.png` (2주차 1세션 1단계 - IAM 검색)
- `2-1-step2-roles-menu.png` (2주차 1세션 2단계 - Roles 메뉴)
- `3-2-step5-security-group.png` (3주차 2세션 5단계 - 보안 그룹)

## 🎨 이미지 가이드라인

### 필수 요구사항
- ✅ **형식**: PNG (권장) 또는 JPG
- ✅ **최대 크기**: 1920x1080px
- ✅ **파일 크기**: 500KB 이하
- ✅ **해상도**: 72-96 DPI
- ✅ **브라우저**: Chrome 또는 Firefox (일관성 유지)
- ✅ **확대/축소**: 100% 배율

### 캡처 가이드
1. **필요한 부분만 캡처**: 전체 화면 대신 관련 UI만
2. **중요 부분 강조**: 빨간 박스나 화살표로 표시
3. **개인정보 제거**: 계정 ID, 이메일 등 모자이크 처리
4. **AWS 콘솔 언어**: 영어로 설정
5. **선명한 이미지**: 흐릿하지 않게 캡처

### 캡처 도구
- **macOS**: `Cmd + Shift + 4` (영역 선택)
- **Windows**: `Win + Shift + S` (캡처 도구)
- **추천 도구**: Snagit, Greenshot (무료)

## 🔧 이미지 최적화

### 자동 최적화 (권장)
```bash
# PNG 최적화
npm run optimize:images

# 또는 수동으로
pngquant --quality=65-80 --ext .png --force image.png
```

### 온라인 도구
- [TinyPNG](https://tinypng.com/) - PNG/JPG 압축
- [Squoosh](https://squoosh.app/) - 구글 이미지 압축 도구
- [ImageOptim](https://imageoptim.com/) - macOS 전용

## 📋 주차별 필요 이미지 목록

### Week 2: IAM 역할 및 정책
- [ ] `2-1-step1-iam-search.png` - IAM 서비스 검색
- [ ] `2-1-step2-roles-menu.png` - Roles 메뉴 선택
- [ ] `2-1-step5-trusted-entity.png` - Trusted entity 설정
- [ ] `2-1-step2-permission-policy.png` - 권한 정책 검색
- [ ] `2-1-step5-role-name.png` - 역할 이름 입력
- [ ] `2-1-step7-role-created.png` - 역할 생성 완료

### Week 3: VPC 및 네트워킹
- [ ] `3-1-step1-vpc-search.png` - VPC 서비스 검색
- [ ] `3-2-step1-security-groups.png` - 보안 그룹 메뉴

### Week 4: Lambda 및 API Gateway
- [ ] `4-1-step1-lambda-search.png` - Lambda 서비스 검색
- [ ] `4-3-step1-api-gateway.png` - API Gateway 콘솔

### Week 5: RDS 및 DynamoDB
- [ ] `5-1-step1-rds-search.png` - RDS 서비스 검색
- [ ] `5-3-step1-dynamodb-search.png` - DynamoDB 서비스 검색

## 🚫 피해야 할 실수

❌ **잘못된 예시**:
- 전체 화면 캡처 (불필요한 정보 포함)
- 흐릿한 이미지 (저해상도)
- 개인정보 노출 (계정 ID, 이메일)
- 일관성 없는 브라우저 (Chrome, Firefox 혼용)
- 파일명이 불명확 (`screenshot1.png`)
- 파일 크기가 너무 큼 (1MB 이상)

✅ **올바른 예시**:
- 필요한 UI만 캡처
- 선명한 고해상도 이미지
- 개인정보 모자이크 처리
- 일관된 브라우저 사용
- 명확한 파일명 (`2-1-step1-iam-search.png`)
- 최적화된 파일 크기 (500KB 이하)

## 📝 이미지 추가 워크플로우

1. **AWS 콘솔에서 스크린샷 캡처**
2. **이미지 편집** (강조 표시, 개인정보 제거)
3. **이미지 최적화** (TinyPNG 또는 자동 스크립트)
4. **파일명 규칙에 맞게 저장** (`{주차}-{세션}-step{단계}-{설명}.png`)
5. **해당 주차 폴더에 저장** (`public/images/week{주차}/`)
6. **마크다운 파일에 이미지 추가**:
   ```markdown
   ![이미지 설명](/images/week2/2-1-step1-iam-search.png)
   ```
7. **Git 커밋 및 푸시**

## 🔍 이미지 검증

이미지를 추가한 후 다음을 확인하세요:

- [ ] 파일명이 규칙에 맞는가?
- [ ] 파일 크기가 500KB 이하인가?
- [ ] 이미지가 선명한가?
- [ ] 개인정보가 제거되었는가?
- [ ] 마크다운에서 올바르게 참조되는가?
- [ ] 대체 텍스트(alt)가 명확한가?

## 📚 참고 문서

- [교수 가이드 - 이미지 추가 방법](../../docs/professors/PROFESSOR_GUIDE.md#q15-실습-가이드에-스크린샷을-추가할-수-있나요)
- [개발자 가이드 - 이미지 처리 파이프라인](../../docs/developers/DEVELOPER_GUIDE.md#4-5-이미지-처리-파이프라인)
- [마크다운 가이드 - 이미지 문법](../../.kiro/steering/markdown-guide.md#9-이미지-삽입)

---

**마지막 업데이트**: 2025-01-29  
**버전**: 1.0.0
