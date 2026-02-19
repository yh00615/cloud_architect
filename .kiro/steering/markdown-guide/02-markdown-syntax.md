# CloudScape 특수 문법 (Custom Syntax)

CloudScape 컴포넌트로 변환되는 특수 마크다운 문법입니다.

---

## 1. AWS 버튼 (3가지)

- **Primary**: `[[버튼명]]` - 주요 액션 (Create, Save, Next)
- **Normal**: `{{버튼명}}` - 보조 액션 (Upload, Edit, Delete)
- **Link**: `((버튼명))` - 취소/뒤로가기 (Cancel, Back, Close)

---

## 2. 복사 가능한 값

- **문법**: `` `값` ``
- **용도**: 입력값, 명령어, 리소스 ID
- **렌더링**: 빨간색 글씨 + 복사 버튼

---

## 3. Alert 박스 (10가지)

| 타입 | 용도 |
|------|------|
| `[!NOTE]` | 참고 사항, 대기 시간 |
| `[!WARNING]` | 비용 경고, 리소스 삭제 |
| `[!TIP]` | 모범 사례 |
| `[!SUCCESS]` | 태스크 완료 |
| `[!ERROR]` | 오류 메시지 |
| `[!OUTPUT]` | 명령어 실행 결과 (코드 블록 필수) |
| `[!IMPORTANT]` | 필수 확인 사항 |
| `[!TROUBLESHOOTING]` | 문제 해결 |
| `[!CONCEPT]` | 개념 설명 (데모 전용) |
| `[!DOWNLOAD]` | 파일 다운로드 |

---

## 4. 파일 다운로드

```markdown
> [!DOWNLOAD]
> [파일명.zip](/files/week{주차}/파일명.zip)
> - `파일1` - 설명
> - `파일2` - 설명
> 
> **관련 태스크:**
> - 태스크 X: 사용 방법
```

---

## 5. AWS 서비스 배지

Front Matter에서 자동 생성:
```yaml
awsServices:
  - Amazon S3
  - AWS Lambda
```

---

**마지막 업데이트**: 2025-02-19  
**버전**: 2.0.0 (축소판)
