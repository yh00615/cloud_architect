# 리소스 관리 표준 (Resource Management Standards)

## 🏷️ 리소스 태그 표준

### 필수 태그 (3개)

| Tag Key | Tag Value | 예시 |
|---------|-----------|------|
| `Project` | `AWS-Lab` | `AWS-Lab` |
| `Week` | `{주차}-{세션}` | `5-3`, `10-1` |
| `CreatedBy` | `Student` | `Student` |

### 마크다운 작성

```markdown
X. **Tags - optional** 섹션에서 [[Add new tag]] 버튼을 클릭한 후 다음 태그를 추가합니다:

| Key | Value |
|-----|-------|
| `Project` | `AWS-Lab` |
| `Week` | `5-3` |
| `CreatedBy` | `Student` |
```

---

## 📛 QuickTable 명명 규칙

### 주요 리소스

| 리소스 | 패턴 | 예시 |
|--------|------|------|
| **DynamoDB** | `QuickTable{엔티티명}` | `QuickTableReservations` |
| **Lambda** | `QuickTable{동작}{엔티티}` | `QuickTableCreateReservation` |
| **API Gateway** | `QuickTableAPI` | `QuickTableAPI` |
| **S3** | `quicktable-{용도}-{계정ID}` | `quicktable-website-123456789012` |
| **ElastiCache** | `quicktable-{용도}-cache` | `quicktable-api-cache` |
| **IAM Role** | `QuickTable{서비스}{용도}Role` | `QuickTableLambdaExecutionRole` |
| **CloudFormation** | `week{주차}-{세션}-quicktable-stack` | `week4-2-quicktable-stack` |

### 케이스 규칙

- PascalCase: DynamoDB, Lambda, API Gateway, IAM Role
- 소문자 + 하이픈: S3, ElastiCache, CloudFormation

---

**마지막 업데이트**: 2025-02-19  
**버전**: 2.0.0 (축소판)
