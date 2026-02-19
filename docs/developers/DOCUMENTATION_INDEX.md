# 📚 문서 인덱스

> University Lab Guide System 전체 문서 가이드

## 🎯 역할별 문서 가이드

### 👨‍💻 개발자 (Kiro 사용)

#### 🆕 처음 프로젝트를 인수받는 2차 개발자

**읽는 순서**:
1. **[HANDOVER_GUIDE.md](HANDOVER_GUIDE.md)** ⭐ 필수
   - 프로젝트 인수인계 완벽 가이드
   - Kiro 환경 설정
   - 표준 준수 검토
   - 추가 개발 방법
   - 가이드 콘텐츠 수정
   - 교수 인계 준비

2. **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** 참고
   - 시스템 전체 이해
   - 마크다운 렌더링 파이프라인
   - 검증 시스템 상세
   - 커스텀 문법 추가
   - 문제 해결

3. **[TECHNICAL_DETAILS.md](TECHNICAL_DETAILS.md)** 참고
   - 프로젝트 설정 파일 상세
   - CloudScape 통합 상세
   - 스타일링 규칙
   - 성능 최적화
   - 알려진 이슈 및 해결

4. **[VALIDATION_GUIDE.md](docs/VALIDATION_GUIDE.md)** 참고
   - 검증 명령어 사용법
   - 오류 수정 방법
   - 자동화 설정

**작업 흐름**:
```
1. HANDOVER_GUIDE 읽기 (1-2시간)
   ↓
2. Kiro 환경 설정 (30분)
   ↓
3. 표준 준수 검토 (1-2시간)
   ↓
4. 추가 개발 시작
```

---

#### 🔧 기존 개발자 (기능 추가/수정)

**읽는 순서**:
1. **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** ⭐ 필수
   - 프로젝트 구조
   - 개발 워크플로우
   - 컴포넌트 개발
   - 마크다운 문법 확장

2. **[TECHNICAL_DETAILS.md](TECHNICAL_DETAILS.md)** 참고
   - 프로젝트 설정 파일
   - CloudScape 통합
   - 스타일링 규칙
   - 성능 최적화
   - 디버깅 팁

3. **[README.md](README.md)** 참고
   - 빠른 참조
   - npm 스크립트
   - 아키텍처 개요

4. **[VALIDATION_GUIDE.md](docs/VALIDATION_GUIDE.md)** 참고
   - 표준 검증 방법

**작업 흐름**:
```
1. 요구사항 파악
   ↓
2. DEVELOPER_GUIDE에서 관련 섹션 찾기
   ↓
3. 개발 및 테스트
   ↓
4. 검증 실행
```

---

### 👨‍🏫 교수 (마크다운 수정)

#### 🆕 마크다운 처음 사용하는 교수

**읽는 순서**:
1. **[QUICK_START_FOR_PROFESSORS.md](docs/QUICK_START_FOR_PROFESSORS.md)** ⭐ 필수
   - 5분 빠른 시작
   - Kiro 열기
   - 가이드 수정하기
   - 저장 및 미리보기

2. **[PROFESSOR_GUIDE.md](docs/PROFESSOR_GUIDE.md)** 참고
   - 마크다운 문법 상세
   - 실습 파일 추가
   - FAQ

**작업 흐름**:
```
1. QUICK_START 읽기 (5분)
   ↓
2. 첫 수정 완료 (5분)
   ↓
3. 필요시 PROFESSOR_GUIDE 참고
```

---

#### 📝 마크다운 익숙한 교수

**읽는 순서**:
1. **[PROFESSOR_GUIDE.md](docs/PROFESSOR_GUIDE.md)** ⭐ 필수
   - 전체 마크다운 문법
   - Alert 타입
   - 실습 파일 추가
   - Git 사용법

2. **[VALIDATION_GUIDE.md](docs/VALIDATION_GUIDE.md)** 참고
   - 표준 준수 확인
   - 오류 수정 방법

**작업 흐름**:
```
1. 가이드 수정
   ↓
2. 검증 실행 (선택)
   ↓
3. Git Commit & Push
```

---

## 📖 문서 목록 및 설명

### 핵심 문서

| 문서 | 대상 | 목적 | 중요도 |
|------|------|------|--------|
| [HANDOVER_GUIDE.md](HANDOVER_GUIDE.md) | 2차 개발자 | 인수인계 완벽 가이드 | ⭐⭐⭐ |
| [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | 모든 개발자 | 시스템 전체 이해 | ⭐⭐⭐ |
| [TECHNICAL_DETAILS.md](TECHNICAL_DETAILS.md) | 개발자 | 기술 세부사항 및 설정 | ⭐⭐⭐ |
| [PROFESSOR_GUIDE.md](docs/PROFESSOR_GUIDE.md) | 모든 교수 | 마크다운 작성 방법 | ⭐⭐⭐ |
| [QUICK_START_FOR_PROFESSORS.md](docs/QUICK_START_FOR_PROFESSORS.md) | 초보 교수 | 5분 빠른 시작 | ⭐⭐⭐ |
| [VALIDATION_GUIDE.md](docs/VALIDATION_GUIDE.md) | 개발자/교수 | 표준 검증 방법 | ⭐⭐ |
| [README.md](README.md) | 모두 | 프로젝트 개요 | ⭐⭐ |

### 참고 문서

| 문서 | 대상 | 목적 |
|------|------|------|
| [markdown-guide.md](.kiro/steering/markdown-guide.md) | AI/개발자 | 마크다운 작성 표준 (AI 컨텍스트) |
| [cloudscape-integration.md](.kiro/steering/cloudscape-integration.md) | 개발자 | CloudScape 통합 가이드 |
| [university-lab-guide-development.md](.kiro/steering/university-lab-guide-development.md) | 개발자 | 개발 철학 및 원칙 |
| [scripts/README.md](scripts/README.md) | 개발자 | 검증 스크립트 사용법 |
| [VALIDATION_REPORT.md](VALIDATION_REPORT.md) | 관리자 | 검증 현황 보고서 (자동 생성) |

---

## 🔍 상황별 문서 찾기

### "Kiro에서 프로젝트를 처음 열었어요"
→ [HANDOVER_GUIDE.md](HANDOVER_GUIDE.md) 섹션 1-3

### "마크다운 가이드를 수정하고 싶어요"
→ [PROFESSOR_GUIDE.md](docs/PROFESSOR_GUIDE.md) 또는 [QUICK_START_FOR_PROFESSORS.md](docs/QUICK_START_FOR_PROFESSORS.md)

### "실습 파일을 추가하고 싶어요"
→ [PROFESSOR_GUIDE.md](docs/PROFESSOR_GUIDE.md) 섹션 "실습 파일 위치"
→ [QUICK_START_FOR_PROFESSORS.md](docs/QUICK_START_FOR_PROFESSORS.md) "작업 3: 실습 파일 추가"

### "표준을 준수하는지 확인하고 싶어요"
→ [VALIDATION_GUIDE.md](docs/VALIDATION_GUIDE.md)

### "새로운 컴포넌트를 만들고 싶어요"
→ [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) 섹션 7 "커스텀 문법 추가하기"
→ [HANDOVER_GUIDE.md](HANDOVER_GUIDE.md) 섹션 5 "추가 개발 가이드"

### "새로운 Alert 타입을 추가하고 싶어요"
→ [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) 섹션 7-2 "새로운 Alert 타입 추가"
→ [README.md](README.md) "새로운 Alert 타입 추가하기"

### "검증 규칙을 추가하고 싶어요"
→ [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) 섹션 6 "새로운 표준 규칙 추가하기"
→ [README.md](README.md) "실습 가이드 표준 관리 워크플로우"

### "오류를 자동으로 수정하고 싶어요"
→ [VALIDATION_GUIDE.md](docs/VALIDATION_GUIDE.md) 섹션 4 "일반적인 오류 수정 방법"

### "교수에게 인계하고 싶어요"
→ [HANDOVER_GUIDE.md](HANDOVER_GUIDE.md) 섹션 7 "교수 인계 준비"

### "프로젝트 구조를 이해하고 싶어요"
→ [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) 섹션 3 "프로젝트 구조 이해하기"
→ [README.md](README.md) "프로젝트 구조"

### "프로젝트 설정 파일을 이해하고 싶어요"
→ [TECHNICAL_DETAILS.md](TECHNICAL_DETAILS.md) 섹션 1 "프로젝트 설정 파일"

### "CloudScape 통합 방법을 알고 싶어요"
→ [TECHNICAL_DETAILS.md](TECHNICAL_DETAILS.md) 섹션 2 "CloudScape 통합 상세"

### "스타일링 규칙을 확인하고 싶어요"
→ [TECHNICAL_DETAILS.md](TECHNICAL_DETAILS.md) 섹션 3 "스타일링 규칙"

### "성능 최적화 방법을 알고 싶어요"
→ [TECHNICAL_DETAILS.md](TECHNICAL_DETAILS.md) 섹션 4 "성능 최적화"

### "알려진 이슈를 확인하고 싶어요"
→ [TECHNICAL_DETAILS.md](TECHNICAL_DETAILS.md) 섹션 6 "알려진 이슈"

### "배포 전 체크리스트를 보고 싶어요"
→ [TECHNICAL_DETAILS.md](TECHNICAL_DETAILS.md) 섹션 7 "배포 전 체크리스트"

### "마크다운 렌더링 원리를 알고 싶어요"
→ [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) 섹션 4 "마크다운 렌더링 파이프라인"
→ [README.md](README.md) "마크다운 렌더링 파이프라인"

---

## 📊 문서 관계도

```
DOCUMENTATION_INDEX.md (이 파일)
    │
    ├─── 개발자용 ───┐
    │                │
    │                ├─ HANDOVER_GUIDE.md (인수인계)
    │                │   └─ 참조: DEVELOPER_GUIDE.md
    │                │   └─ 참조: VALIDATION_GUIDE.md
    │                │   └─ 참조: TECHNICAL_DETAILS.md
    │                │
    │                ├─ DEVELOPER_GUIDE.md (완벽 가이드)
    │                │   └─ 참조: README.md
    │                │   └─ 참조: markdown-guide.md
    │                │   └─ 참조: TECHNICAL_DETAILS.md
    │                │
    │                ├─ TECHNICAL_DETAILS.md (기술 세부사항)
    │                │   └─ 참조: vite.config.ts
    │                │   └─ 참조: tsconfig.json
    │                │   └─ 참조: package.json
    │                │
    │                └─ VALIDATION_GUIDE.md (검증)
    │                    └─ 참조: markdown-guide.md
    │
    ├─── 교수용 ───┐
    │              │
    │              ├─ QUICK_START_FOR_PROFESSORS.md (5분 시작)
    │              │   └─ 참조: PROFESSOR_GUIDE.md
    │              │
    │              └─ PROFESSOR_GUIDE.md (완벽 가이드)
    │                  └─ 참조: VALIDATION_GUIDE.md
    │
    └─── 공통 ───┐
                 │
                 ├─ README.md (프로젝트 개요)
                 │
                 ├─ markdown-guide.md (표준 정의)
                 │
                 └─ VALIDATION_REPORT.md (자동 생성)
```

---

## 🎓 학습 경로

### 2차 개발자 학습 경로 (3-5일)

**Day 1: 프로젝트 이해**
- [ ] HANDOVER_GUIDE.md 읽기 (2시간)
- [ ] Kiro 환경 설정 (1시간)
- [ ] 프로젝트 실행 및 탐색 (2시간)
- [ ] README.md 빠른 참조 확인 (30분)

**Day 2: 표준 준수 검토**
- [ ] 전체 검증 실행 (30분)
- [ ] VALIDATION_GUIDE.md 읽기 (1시간)
- [ ] 주차별 검증 및 분석 (3시간)
- [ ] 우선순위 수정 계획 수립 (1시간)

**Day 3: 시스템 깊이 이해**
- [ ] DEVELOPER_GUIDE.md 읽기 (3시간)
- [ ] TECHNICAL_DETAILS.md 읽기 (2시간)
- [ ] 마크다운 렌더링 파이프라인 분석 (2시간)
- [ ] 주요 컴포넌트 코드 리뷰 (2시간)

**Day 4: 실습 및 개발**
- [ ] 간단한 컴포넌트 수정 (2시간)
- [ ] 새로운 Alert 타입 추가 연습 (2시간)
- [ ] 검증 규칙 추가 연습 (2시간)

**Day 5: 교수 인계 준비**
- [ ] PROFESSOR_GUIDE.md 검토 (1시간)
- [ ] QUICK_START_FOR_PROFESSORS.md 검토 (30분)
- [ ] 교수용 교육 자료 준비 (2시간)
- [ ] 인수인계 미팅 준비 (1시간)

---

### 교수 학습 경로 (1-2시간)

**초보 교수 (마크다운 처음)**
- [ ] QUICK_START_FOR_PROFESSORS.md 읽기 (10분)
- [ ] 첫 수정 실습 (10분)
- [ ] PROFESSOR_GUIDE.md 필요한 부분만 참고 (30분)
- [ ] 실습 파일 추가 연습 (20분)

**경험 있는 교수**
- [ ] PROFESSOR_GUIDE.md 읽기 (30분)
- [ ] 마크다운 문법 복습 (20분)
- [ ] 실습 파일 추가 방법 확인 (10분)
- [ ] Git 사용법 확인 (10분)

---

## 🔄 문서 업데이트 규칙

### 언제 문서를 업데이트해야 하나요?

**필수 업데이트 상황**:
1. ✅ 새로운 표준 규칙 추가 시
   - `markdown-guide.md` 업데이트
   - `VALIDATION_GUIDE.md`에 수정 방법 추가

2. ✅ 새로운 검증 규칙 추가 시
   - `DEVELOPER_GUIDE.md` 섹션 6 업데이트
   - `README.md` 워크플로우 업데이트

3. ✅ 새로운 컴포넌트 추가 시
   - `DEVELOPER_GUIDE.md` 섹션 7 업데이트
   - 필요시 `PROFESSOR_GUIDE.md` 업데이트

4. ✅ 프로젝트 구조 변경 시
   - 모든 문서의 "프로젝트 구조" 섹션 업데이트

### 문서 업데이트 체크리스트

- [ ] 변경 사항이 여러 문서에 영향을 주는지 확인
- [ ] 관련된 모든 문서 업데이트
- [ ] 예시 코드 및 명령어 테스트
- [ ] 스크린샷 업데이트 (필요시)
- [ ] 버전 번호 및 날짜 업데이트

---

## 📞 도움말

### 문서 관련 질문

**"어떤 문서를 읽어야 할지 모르겠어요"**
→ 이 문서(DOCUMENTATION_INDEX.md)의 "역할별 문서 가이드" 참고

**"문서가 너무 길어요"**
→ 각 문서의 목차를 활용하여 필요한 섹션만 읽기

**"예시가 더 필요해요"**
→ `public/content/week1/` 폴더의 실제 파일 참고

**"문서에 오류가 있어요"**
→ GitHub Issues에 보고 또는 개발팀에 연락

---

## 🎯 빠른 링크

### 자주 사용하는 명령어
```bash
# 개발 서버
npm run dev

# 전체 검증
npm run validate:advanced

# 특정 파일 검증
npm run validate:file public/content/week2/2-1-iam-role.md

# 진행률 확인
./scripts/check-progress.sh
```

### 자주 찾는 파일
- 표준 정의: `.kiro/steering/markdown-guide.md`
- 검증 스크립트: `scripts/validate-advanced.js`
- 마크다운 렌더러: `src/components/markdown/MarkdownRenderer.tsx`
- Alert 스타일: `src/styles/info-boxes.css`

---

**마지막 업데이트**: 2026-01-28  
**버전**: 1.0.0  
**관리자**: 개발팀
