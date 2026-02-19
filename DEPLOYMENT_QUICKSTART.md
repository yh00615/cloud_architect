# 🚀 GitHub Pages 배포 빠른 시작

## 1단계: GitHub 리포지토리 설정 (1회만)

1. GitHub 리포지토리로 이동
2. **Settings** > **Pages**
3. **Source**를 **GitHub Actions**로 변경

## 2단계: 리포지토리 이름 확인

현재 설정: `/university-lab-guide/`

**리포지토리 이름이 다르다면:**

`vite.config.ts` 파일 수정:

```typescript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

## 3단계: 로컬 테스트

```bash
# 프로덕션 빌드
npm run build:gh-pages

# 미리보기
npm run preview:gh-pages
```

브라우저에서 `http://localhost:4173/university-lab-guide/` 접속

## 4단계: 배포

```bash
git add .
git commit -m "feat: GitHub Pages 배포 설정"
git push origin main
```

## 5단계: 배포 확인

1. GitHub > **Actions** 탭에서 워크플로우 실행 확인
2. 완료 후 `https://username.github.io/university-lab-guide/` 접속

---

## 🐛 문제 발생 시

### 404 오류

→ `vite.config.ts`의 base 경로와 리포지토리 이름 일치 확인

### CSS 깨짐

→ 리소스 경로가 절대 경로(`/`)로 시작하는지 확인

### 상세 가이드

→ `docs/DEPLOYMENT_GUIDE.md` 참조

---

**배포 URL:** `https://username.github.io/university-lab-guide/`
