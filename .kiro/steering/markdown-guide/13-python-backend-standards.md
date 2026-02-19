# Python 백엔드 표준 (FastAPI/Flask)

Python 백엔드 코드 작성 시 핵심 명명 규칙입니다.

---

## 핵심 원칙: 명명 규칙 일관성

프론트엔드(TypeScript)와 백엔드(Python) 간 데이터 교환 시 일관된 명명 규칙 사용

| 영역 | 규칙 | 예시 |
|------|------|------|
| **API 응답 (JSON)** | camelCase | `userId`, `createdAt` |
| **Python 변수** | snake_case | `user_id`, `created_at` |
| **Python 함수** | snake_case | `get_user()`, `create_order()` |
| **Python 클래스** | PascalCase | `UserService`, `OrderModel` |
| **환경 변수** | UPPER_SNAKE_CASE | `REDIS_HOST`, `DB_NAME` |

---

## 데이터 변환 규칙

### Python → JSON (API 응답)

```python
# ✅ 올바른 예시: snake_case → camelCase 변환
def get_user(user_id: int):
    user_data = {
        'user_id': 123,
        'user_name': 'John',
        'created_at': '2024-02-15T10:30:00'
    }
    
    # camelCase로 변환하여 반환
    return jsonify({
        'userId': user_data['user_id'],
        'userName': user_data['user_name'],
        'createdAt': user_data['created_at']
    })
```

### JSON (API 요청) → Python

```python
# ✅ 올바른 예시: camelCase → snake_case 변환
@app.route('/user', methods=['POST'])
def create_user():
    data = request.json
    
    # camelCase를 snake_case로 변환
    user_id = data.get('userId')
    user_name = data.get('userName')
    
    # Python 코드에서는 snake_case 사용
    save_user(user_id, user_name)
    
    return jsonify({'userId': user_id})
```

---

## 주석 및 DocString

### 모듈 레벨 DocString (필수)

```python
"""
AWS Lambda 함수: ElastiCache 캐싱 데모

주요 기능:
    1. 사용자 정보 조회 (캐시 우선)
    2. 상품 목록 조회 (캐시 적용)

환경 변수:
    REDIS_HOST (str): ElastiCache Redis 엔드포인트
    DB_HOST (str): RDS MySQL 엔드포인트
"""
```

### 함수 레벨 DocString (필수)

```python
def get_user(user_id: int):
    """
    Cache-Aside 패턴으로 사용자 정보를 조회합니다
    
    Args:
        user_id (int): 사용자 고유 ID
    
    Returns:
        dict: HTTP 응답 형식
    """
```

### 인라인 주석 (권장)

```python
# 1. Redis 캐시에서 조회 시도
cached_data = redis_client.get(cache_key)

# 2. 캐시 미스: RDS MySQL에서 조회
if not cached_data:
    user_data = fetch_from_db(user_id)
```

---

## 환경 변수 관리

### .env.example (필수)

```bash
# Redis 설정
REDIS_HOST=your-elasticache-endpoint.cache.amazonaws.com
REDIS_PORT=6379

# RDS MySQL 설정
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=your-password
DB_NAME=labdb
```

### app.py에서 사용

```python
import os
from dotenv import load_dotenv

load_dotenv()

redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST', 'localhost'),
    port=int(os.getenv('REDIS_PORT', 6379))
)
```

---

## Flask vs FastAPI 선택

### Flask
- 간단한 REST API
- 빠른 프로토타입
- 학습 목적

### FastAPI
- 타입 안전성 필요
- 자동 API 문서 생성
- 비동기 처리 필요

---

## 체크리스트

### 코드 작성
- [ ] 모듈/함수 DocString 작성
- [ ] 인라인 주석 (한국어)
- [ ] 환경 변수로 설정 관리
- [ ] .env.example 제공

### API 응답
- [ ] JSON 키는 camelCase
- [ ] Python 변수는 snake_case
- [ ] 오류 응답 형식 일관성

### 금지 사항
- [ ] API 응답에 snake_case 사용 금지
- [ ] Python 코드에 camelCase 사용 금지
- [ ] 하드코딩된 설정 금지

---

**마지막 업데이트**: 2025-02-19  
**버전**: 2.0.0 (축소판)