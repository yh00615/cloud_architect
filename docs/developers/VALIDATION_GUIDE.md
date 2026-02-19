# 실습 가이드 표준 검증 가이드

실습 가이드 마크다운 파일이 표준을 준수하는지 자동으로 검증하고 수정하는 방법을 안내합니다.

## 📋 목차

1. [빠른 시작](#빠른-시작)
2. [검증 명령어](#검증-명령어)
3. [파일 내용 검증](#파일-내용-검증)
4. [검증 결과 해석](#검증-결과-해석)
5. [일반적인 오류 수정 방법](#일반적인-오류-수정-방법)
6. [자동화 설정](#자동화-설정)

## 🚀 빠른 시작

### 1단계: 전체 파일 검증
```bash
npm run validate:all
```

### 2단계: 오류가 있는 파일 확인
출력에서 ❌ 표시가 있는 파일을 확인합니다.

### 3단계: 개별 파일 상세 검증
```bash
npm run validate:file public/content/week2/2-1-iam-role-assumerole.md
```

### 4단계: 오류 수정
아래 [일반적인 오류 수정 방법](#일반적인-오류-수정-방법)을 참고하여 수정합니다.

### 5단계: 재검증
```bash
npm run validate:file public/content/week2/2-1-iam-role-assumerole.md
```

## 🔍 검증 명령어

### 전체 검증
모든 실습 가이드 파일을 한 번에 검증합니다.

```bash
npm run validate:all
```

**출력 예시:**
```
🔍 총 25개 파일 검증 시작
...
📊 전체 검증 요약
총 파일: 25
총 오류: 87
총 경고: 2
```

### 파일 내용 검증
ZIP 파일 내부의 실제 파일 내용을 검증합니다.

```bash
# 전체 검증
npm run validate:file-contents

# 특정 주차 검증
npm run validate:file-contents 3
```

**출력 예시:**
```
🔍 ZIP 파일 내용 검증 시작

📦 Week 4 Session 3: week4-3-serverless-api-lab.zip
✓ CloudFormation: 문제 없음
⚠  Python: 2개 경고
  Week 4 Session 3 - lambda_function.py
  Lambda 함수: 모듈 레벨 DocString 누락 (규칙 40)

📊 파일 내용 검증 결과
오류: 0개
경고: 2개
정보: 1개
```

### 특정 파일 검증
개별 파일을 상세하게 검증합니다.

```bash
npm run validate:file public/content/week2/2-1-iam-role-assumerole.md
```

**출력 예시:**
```
📄 검증 중: public/content/week2/2-1-iam-role-assumerole.md

📊 검증 결과:
   오류: 3
   경고: 2

❌ 오류 (3):
1. 줄 15:
   "AWS Console" → "AWS Management Console"로 수정 필요
   > AWS Console에 로그인한 후 IAM을 검색하고 선택합니다.
```

### 특정 주차 검증
특정 주차의 모든 파일을 검증합니다.

```bash
# Week 1 검증
node scripts/validate-markdown-guide.js public/content/week1

# Week 11 검증
node scripts/validate-markdown-guide.js public/content/week11
```

### 여러 파일 동시 검증
```bash
node scripts/validate-markdown-guide.js \
  public/content/week1/1-1-*.md \
  public/content/week2/2-1-*.md
```

## 📦 파일 내용 검증 상세

### 검증 대상 파일

ZIP 파일 내부의 다음 파일들을 검증합니다:

1. **CloudFormation 템플릿** (`.yaml`, `.yml`)
   - 필수 섹션 확인 (Resources)
   - 권장 섹션 확인 (Description, Parameters, Outputs)
   - 리소스 타입 검증
   - Outputs 섹션 상세 검증
   - 주석 확인

2. **Python 스크립트** (`.py`)
   - Python 문법 검증
   - Lambda 함수 DocString 검증 (규칙 40)
     - 모듈 레벨 DocString
     - 함수 레벨 DocString (Args, Returns)
   - 한국어 주석 확인
   - import 문 확인

3. **SQL 파일** (`.sql`)
   - SQL 키워드 확인
   - 세미콜론 확인
   - 주석 확인

4. **JSON 파일** (`.json`)
   - JSON 파싱 검증
   - 구조 확인

5. **README 파일** (`README.md`, `README.txt`)
   - 내용 길이 확인 (최소 100자)
   - 마크다운 제목 확인

### Lambda 함수 DocString 규칙 (규칙 40)

Lambda 함수는 반드시 다음 DocString을 포함해야 합니다:

**모듈 레벨 DocString:**
```python
"""
AWS Lambda 함수: [함수 목적]

이 Lambda 함수는 [상세 설명]

주요 기능:
    1. [기능 1]
    2. [기능 2]

환경 변수:
    VAR_NAME (str): [설명]

트리거:
    [트리거 설명]
"""
```

**함수 레벨 DocString:**
```python
def lambda_handler(event, context):
    """
    [함수 설명]
    
    Args:
        event (dict): [이벤트 설명]
        context (LambdaContext): Lambda 실행 컨텍스트
    
    Returns:
        dict: HTTP 응답 형식
            - statusCode (int): 200 (성공)
            - body (str): JSON 형식의 처리 결과
    """
```

**한국어 주석:**
```python
# 이벤트 전체 내용을 로그에 출력 (디버깅용)
print(f"Received event: {json.dumps(event)}")
```

### 검증 실행 방법

#### 전체 검증
```bash
npm run validate:file-contents
```

#### 특정 주차 검증
```bash
npm run validate:file-contents 4
```

#### 종합 검토에 포함
```bash
npm run review
```

### 일반적인 문제 및 해결 방법

#### 1. Lambda 함수 DocString 누락

**문제:**
```
⚠  Python: 2개 경고
  Week 4 Session 3 - lambda_function.py
  Lambda 함수: 모듈 레벨 DocString 누락 (규칙 40)
```

**해결:**
```python
# 파일 상단에 모듈 레벨 DocString 추가
"""
AWS Lambda 함수: 서버리스 API

이 Lambda 함수는 DynamoDB와 연동하여 RESTful API를 제공합니다.

주요 기능:
    1. GET /todos - 할 일 목록 조회
    2. POST /todos - 새 할 일 생성
    3. PUT /todos/{id} - 할 일 수정
    4. DELETE /todos/{id} - 할 일 삭제

환경 변수:
    TABLE_NAME (str): DynamoDB 테이블 이름

트리거:
    API Gateway (REST API)
"""

import json
import boto3
```

#### 2. CloudFormation Outputs 섹션 누락

**문제:**
```
⚠  CloudFormation: 1개 경고
  Week 3 Session 2 - vpc-template.yaml
  권장 섹션 누락: Outputs
```

**해결:**
```yaml
Outputs:
  VpcId:
    Description: VPC ID
    Value: !Ref MyVPC
    Export:
      Name: !Sub "${AWS::StackName}-VpcId"
  
  PublicSubnetId:
    Description: Public Subnet ID
    Value: !Ref PublicSubnet
```

#### 3. JSON 파싱 오류

**문제:**
```
❌ JSON: 1개 오류
  Week 11 Session 2 - customers.json
  JSON 파싱 오류: Unexpected token
```

**해결:**
```json
// JSONL 형식 (잘못됨)
{"id": 1, "name": "Alice"}
{"id": 2, "name": "Bob"}

// JSON 배열 형식 (올바름)
[
  {"id": 1, "name": "Alice"},
  {"id": 2, "name": "Bob"}
]
```

#### 4. SQL 세미콜론 누락

**문제:**
```
⚠  SQL: 1개 경고
  Week 5 Session 1 - init_database.sql
  SQL 문이 세미콜론(;)으로 끝나지 않습니다
```

**해결:**
```sql
-- 잘못됨
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100)
)

-- 올바름
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);
```

## 📊 검증 결과 해석

### 심각도 수준

#### ❌ 오류 (Error)
**반드시 수정해야 하는 문제**
- 표준을 명확히 위반한 경우
- 사용자 경험에 직접적인 영향을 주는 경우
- 일관성을 해치는 경우

#### ⚠️ 경고 (Warning)
**수정을 권장하는 문제**
- 표준을 따르면 더 좋지만 필수는 아닌 경우
- 가독성이나 유지보수성을 개선할 수 있는 경우

#### ✅ 통과
문제가 없는 파일입니다.

### 출력 형식

```
📄 검증 중: [파일 경로]

📊 검증 결과:
   오류: [숫자]
   경고: [숫자]

❌ 오류 ([숫자]):

[번호]. 줄 [줄번호]:
   [오류 메시지]
   > [문제가 있는 원본 텍스트]

⚠️  경고 ([숫자]):

[번호]. 줄 [줄번호]:
   [경고 메시지]
   > [문제가 있는 원본 텍스트]
```

## 🔧 일반적인 오류 수정 방법

### 1. AWS Console → AWS Management Console

**오류:**
```markdown
AWS Console에 로그인한 후 IAM을 검색하고 선택합니다.
```

**수정:**
```markdown
AWS Management Console에 로그인한 후 상단 검색창에서 `IAM`을 검색하고 선택합니다.
```

**검색 및 치환:**
- 찾기: `AWS Console에 로그인`
- 바꾸기: `AWS Management Console에 로그인한 후 상단 검색창에서`

### 2. 마침표 누락

**오류:**
```markdown
1. [[Create bucket]] 버튼을 클릭합니다
2. **Bucket name**에 `my-bucket`을 입력합니다
```

**수정:**
```markdown
1. [[Create bucket]] 버튼을 클릭합니다.
2. **Bucket name**에 `my-bucket`을 입력합니다.
```

**팁:** VS Code에서 정규식 검색 사용
- 찾기: `^(\d+\.\s+.+[^.])$`
- 바꾸기: `$1.`

### 3. 청유형 → 명령형

**오류:**
```markdown
[[Create role]] 버튼을 클릭하세요.
결과를 확인하세요.
```

**수정:**
```markdown
[[Create role]] 버튼을 클릭합니다.
결과를 확인합니다.
```

**검색 및 치환:**
- 찾기: `하세요`
- 바꾸기: `합니다`

### 4. 상태값 따옴표

**오류:**
```markdown
상태가 Available로 변경될 때까지 기다립니다.
```

**수정:**
```markdown
상태가 "Available"로 변경될 때까지 기다립니다.
```

**검색 및 치환:**
- 찾기: `상태가 (Available|Enabled|Running|Active|Ready|Complete)`
- 바꾸기: `상태가 "$1"`

### 5. 연속 동작 표현

**오류:**
```markdown
**Source**에서 `Custom`을 선택하고 `ALB-SG`를 선택합니다.
```

**수정:**
```markdown
**Source**에서 `Custom`을 선택한 후 `ALB-SG`를 선택합니다.
```

**검색 및 치환:**
- 찾기: `선택하고`
- 바꾸기: `선택한 후`

### 6. 왼쪽 메뉴 표현

**오류:**
```markdown
왼쪽 메뉴의 **Databases**를 선택합니다.
VPC 콘솔 왼쪽 메뉴에서 **Endpoints**를 선택합니다.
```

**수정:**
```markdown
왼쪽 메뉴에서 **Databases**를 선택합니다.
왼쪽 메뉴에서 **Endpoints**를 선택합니다.
```

**검색 및 치환:**
- 찾기: `왼쪽 메뉴의`
- 바꾸기: `왼쪽 메뉴에서`
- 찾기: `\w+ 콘솔 왼쪽 메뉴에서`
- 바꾸기: `왼쪽 메뉴에서`

### 7. 탭 선택 표현

**오류:**
```markdown
**Code** 탭으로 이동합니다.
**Monitor** 탭으로 돌아갑니다.
```

**수정:**
```markdown
**Code** 탭을 선택합니다.
**Monitor** 탭을 선택합니다.
```

**검색 및 치환:**
- 찾기: `탭으로 (이동|돌아갑니다)`
- 바꾸기: `탭을 선택합니다`

### 8. 괄호 설명 제거

**오류:**
```markdown
CloudShell 아이콘을 클릭합니다 (터미널 아이콘).
왼쪽 메뉴에서 **Roles**를 선택합니다 (역할 메뉴).
```

**수정:**
```markdown
CloudShell 아이콘을 클릭합니다.
왼쪽 메뉴에서 **Roles**를 선택합니다.
```

**검색 및 치환:**
- 찾기: `\s*\([^)]*(?:아이콘|메뉴|버튼|탭)[^)]*\)`
- 바꾸기: (빈 문자열)

### 9. 예상 출력 Alert 사용

**오류:**
```markdown
📋 **예상 출력**:
```
PONG
```
```

**수정:**
```markdown
> [!OUTPUT]
> ```
> PONG
> ```
```

### 10. 필드 입력 값 백틱

**오류:**
```markdown
**Bucket name**에 my-bucket-123을 입력합니다.
```

**수정:**
```markdown
**Bucket name**에 `my-bucket-123`을 입력합니다.
```

## 🤖 자동화 설정

### VS Code에서 빠른 검증

`.vscode/tasks.json` 파일을 생성하거나 수정:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "현재 파일 검증",
      "type": "shell",
      "command": "npm run validate:file ${file}",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "group": {
        "kind": "test",
        "isDefault": true
      }
    },
    {
      "label": "전체 파일 검증",
      "type": "shell",
      "command": "npm run validate:all",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

**사용법:**
1. `Cmd+Shift+P` (Mac) 또는 `Ctrl+Shift+P` (Windows/Linux)
2. "Tasks: Run Task" 선택
3. "현재 파일 검증" 또는 "전체 파일 검증" 선택

### Git Pre-commit Hook

커밋 전 자동으로 검증하도록 설정:

```bash
# .git/hooks/pre-commit 파일 생성
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh

echo "🔍 마크다운 파일 검증 중..."

# 변경된 마크다운 파일만 검증
CHANGED_MD_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.md$')

if [ -n "$CHANGED_MD_FILES" ]; then
  for file in $CHANGED_MD_FILES; do
    if [ -f "$file" ]; then
      node scripts/validate-markdown-guide.js "$file"
      if [ $? -ne 0 ]; then
        echo "❌ 검증 실패: $file"
        echo "수정 후 다시 커밋하세요."
        exit 1
      fi
    fi
  done
fi

echo "✅ 모든 마크다운 파일 검증 통과"
exit 0
EOF

# 실행 권한 부여
chmod +x .git/hooks/pre-commit
```

### GitHub Actions CI/CD

`.github/workflows/validate-markdown.yml` 파일 생성:

```yaml
name: Validate Markdown Guides

on:
  push:
    paths:
      - 'public/content/**/*.md'
  pull_request:
    paths:
      - 'public/content/**/*.md'

jobs:
  validate:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Validate markdown files
        run: npm run validate:all
      
      - name: Comment PR
        if: failure() && github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ 마크다운 검증 실패! 표준을 준수하도록 수정해주세요.'
            })
```

## 📈 검증 통계 및 진행 상황

### 현재 상태 확인
```bash
npm run validate:all | grep "총"
```

**출력 예시:**
```
총 파일: 25
총 오류: 87
총 경고: 2
```

### 주차별 상태 확인
```bash
for week in {1..14}; do
  echo "=== Week $week ==="
  node scripts/validate-markdown-guide.js public/content/week$week 2>&1 | grep "총"
done
```

### 진행률 추적
```bash
# 전체 파일 수
TOTAL=$(find public/content -name "*.md" | wc -l)

# 오류 없는 파일 수
PASSED=$(npm run validate:all 2>&1 | grep "✅" | wc -l)

# 진행률 계산
echo "진행률: $((PASSED * 100 / TOTAL))%"
```

## 🎯 목표 설정

### 단계별 목표

#### Phase 1: 심각한 오류 제거 (우선순위 높음)
- [ ] 청유형 → 명령형 변환
- [ ] AWS Console → AWS Management Console
- [ ] 마침표 누락 수정
- [ ] 상태값 따옴표 추가

**목표:** 오류 0개

#### Phase 2: 일관성 개선 (우선순위 중간)
- [ ] 연속 동작 표현 통일
- [ ] 탭 선택 표현 통일
- [ ] 왼쪽 메뉴 표현 통일

**목표:** 경고 10개 이하

#### Phase 3: 완벽한 표준 준수 (우선순위 낮음)
- [ ] 괄호 설명 제거
- [ ] 버튼 문법 통일
- [ ] 필드 입력 값 백틱 추가

**목표:** 모든 파일 ✅ 통과

## 💡 팁과 트릭

### 1. 일괄 수정 스크립트
여러 파일을 한 번에 수정할 때:

```bash
# 모든 마크다운 파일에서 "하세요" → "합니다" 변경
find public/content -name "*.md" -exec sed -i '' 's/하세요/합니다/g' {} +

# 변경 사항 확인
git diff public/content
```

### 2. VS Code 정규식 검색
`Cmd+Shift+F` (Mac) 또는 `Ctrl+Shift+H` (Windows/Linux)로 전체 검색 및 치환:

- 정규식 모드 활성화 (`.*` 아이콘 클릭)
- 대소문자 구분 (`Aa` 아이콘)
- 파일 필터: `public/content/**/*.md`

### 3. 검증 결과 파일로 저장
```bash
npm run validate:all > validation-report.txt 2>&1
```

### 4. 오류만 필터링
```bash
npm run validate:all 2>&1 | grep -A 5 "❌ 오류"
```

## 🆘 문제 해결

### "파일을 찾을 수 없습니다" 오류
- 파일 경로가 올바른지 확인
- 프로젝트 루트에서 명령어 실행 확인

### 너무 많은 경고 표시
- 우선 오류부터 수정
- 경고는 점진적으로 개선

### 특정 규칙 무시하고 싶을 때
`scripts/validate-markdown-guide.js` 파일에서 해당 규칙 주석 처리

## 📚 관련 문서

- [실습 가이드 마크다운 작성 가이드](../.kiro/steering/markdown-guide.md)
- [검증 스크립트 README](../scripts/README.md)
- [표준 문구 체크리스트](../.kiro/steering/markdown-guide.md#표준-문구-체크리스트)
