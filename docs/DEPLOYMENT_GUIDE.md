# GitHub Pages 배포 가이드

## 📋 사전 준비

### 1. GitHub 리포지토리 설정

1. GitHub 리포지토리로 이동합니다
2. **Settings** > **Pages** 메뉴를 선택합니다
3. **Source**를 **GitHub Actions**로 변경합니다

![GitHub Pages Settings](https://docs.github.com/assets/cb-47267/mw-1440/images/help/pages/publishing-source-drop-down.webp)

---

## 🚀 배포 방법

### 방법 1: 자동 배포 (권장)

`main` 브랜치에 푸시하면 자동으로 배포됩니다.

```bash
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin main
```

**배포 확인:**

1. GitHub 리포지토리 > **Actions** 탭 이동
2. 워크플로우 실행 상태 확인
3. 완료 후 `https://username.github.io/university-lab-guide/` 접속

---

### 방법 2: 수동 배포

GitHub Actions에서 수동으로 실행할 수 있습니다.

1. GitHub 리포지토리 > **Actions** 탭 이동
2. **Deploy to GitHub Pages** 워크플로우 선택
3. **Run workflow** 버튼 클릭
4. **Run workflow** 확인

---

## 🔧 로컬 테스트

배포 전에 로컬에서 프로덕션 빌드를 테스트하세요.

```bash
# 프로덕션 빌드
npm run build:gh-pages

# 빌드 결과 미리보기 (base 경로 포함)
npm run preview:gh-pages
```

브라우저에서 `http://localhost:4173/university-lab-guide/` 접속하여 확인합니다.

---

## 📝 리포지토리 이름 변경 시

리포지토리 이름이 `university-lab-guide`가 아니라면 다음 파일을 수정하세요.

### 1. `vite.config.ts`

```typescript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

### 2. `src/App.tsx`

```typescript
const basename =
  import.meta.env.MODE === 'production' ? '/your-repo-name' : '/';
```

> [!NOTE]
> `package.json`의 `preview:gh-pages` 스크립트는 자동으로 `vite.config.ts`의 base 설정을 따라가므로 별도 수정이 필요 없습니다.

---

## 🐛 문제 해결

### 404 오류 발생

**증상:** 페이지 접속 시 404 오류

**원인:** base 경로가 리포지토리 이름과 일치하지 않음

**해결:**

1. `vite.config.ts`의 base 경로 확인
2. GitHub 리포지토리 이름과 일치하는지 확인
3. 수정 후 다시 배포

---

### CSS/JS 파일 로드 실패

**증상:** 페이지는 열리지만 스타일이 깨짐

**원인:** 절대 경로로 리소스를 참조하고 있음

**해결:**

1. 모든 리소스 경로가 상대 경로인지 확인
2. `public/` 폴더의 파일은 자동으로 base 경로 적용됨
3. 코드에서 직접 경로를 작성할 때는 `import.meta.env.BASE_URL` 사용

```typescript
// ❌ 잘못된 예
const imagePath = '/images/logo.png';

// ✅ 올바른 예
const imagePath = `${import.meta.env.BASE_URL}images/logo.png`;
```

---

### 라우팅 404 오류

**증상:** 새로고침 시 404 오류

**원인:** GitHub Pages는 SPA 라우팅을 지원하지 않음

**해결:** 404.html 리다이렉트 추가 (선택사항)

`public/404.html` 생성:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirecting...</title>
    <script>
      // GitHub Pages SPA 리다이렉트
      const path = window.location.pathname.replace(
        '/university-lab-guide',
        '',
      );
      window.location.replace('/university-lab-guide/#' + path);
    </script>
  </head>
  <body>
    Redirecting...
  </body>
</html>
```

---

## 📊 배포 상태 확인

### GitHub Actions 로그 확인

1. GitHub 리포지토리 > **Actions** 탭
2. 최근 워크플로우 실행 클릭
3. 각 단계별 로그 확인

### 배포 URL

- **프로덕션:** `https://username.github.io/university-lab-guide/`
- **로컬 미리보기:** `http://localhost:4173/university-lab-guide/`

---

## ✅ 배포 체크리스트

배포 전에 다음 항목을 확인하세요:

- [ ] `vite.config.ts`의 base 경로가 리포지토리 이름과 일치
- [ ] GitHub Settings > Pages에서 Source를 GitHub Actions로 설정
- [ ] 로컬에서 `npm run build:gh-pages` 성공
- [ ] 로컬에서 `npm run preview:gh-pages` 테스트 완료
- [ ] 모든 변경사항 커밋 및 푸시
- [ ] GitHub Actions 워크플로우 실행 성공
- [ ] 배포 URL 접속 확인

---

## 🔄 배포 롤백

문제가 발생하면 이전 버전으로 롤백할 수 있습니다.

```bash
# 이전 커밋으로 되돌리기
git revert HEAD
git push origin main

# 또는 특정 커밋으로 되돌리기
git reset --hard <commit-hash>
git push origin main --force
```

---

## 📚 추가 리소스

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [GitHub Actions 문서](https://docs.github.com/en/actions)

---

**마지막 업데이트:** 2026-02-20  
**작성자:** 개발팀
