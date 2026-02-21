---
inclusion: manual
---

# Draw.io AWS 아이콘 라이브러리 가이드

이 가이드는 `public/files/drawio-libraries/aws-architecture-icons.xml` 파일을 기반으로 draw.io에서 AWS 아키텍처 다이어그램을 작성하는 방법을 설명합니다.

---

## 라이브러리 파일 구조

### XML 형식

```xml
<mxlibrary>[
  {
    "data": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...",
    "w": 45,
    "h": 45,
    "title": "Res Amazon-ElastiCache ElastiCache-for-Memcached 48",
    "aspect": "fixed"
  },
  ...
]</mxlibrary>
```

### 주요 필드

- `data`: base64로 인코딩된 SVG 이미지
- `w`, `h`: 아이콘 너비와 높이 (픽셀)
- `title`: 아이콘 이름 (검색 가능)
- `aspect`: "fixed" (고정 비율)

---

## 포함된 AWS 서비스 아이콘

### Database (데이터베이스)

- Amazon ElastiCache (Memcached, Redis)
- Amazon Aurora (MySQL, PostgreSQL, Oracle, SQL Server)
  - Instance, Instance-Alternate, PIOPS-Instance
- Amazon RDS (다양한 인스턴스 타입)

### Quantum Technologies (양자 컴퓨팅)

- Amazon Braket
  - Chandelier (양자 컴퓨터 하드웨어)
  - Chip (양자 칩)
  - Embedded-Simulator (내장 시뮬레이터)
  - Managed-Simulator (관리형 시뮬레이터)
  - Noise-Simulator (노이즈 시뮬레이터)
  - QPU (양자 처리 장치)
  - Simulator (시뮬레이터)

### Networking & Content Delivery

- Amazon API Gateway Endpoint

### Analytics

- Amazon Athena Data-Source-Connectors

### General Resources

- Alert (경고 아이콘 - Dark/Light 버전)

---

## Draw.io에서 라이브러리 사용하기

### 1. 라이브러리 불러오기

1. draw.io (https://app.diagrams.net/) 접속
2. **File** > **Open Library from** > **Device** 선택
3. `aws-architecture-icons.xml` 파일 선택
4. 왼쪽 패널에 "aws-architecture-icons" 라이브러리 추가됨

### 2. 아이콘 검색

- 왼쪽 패널 상단 검색창에서 서비스명 입력
- 예: "ElastiCache", "Aurora", "Braket", "API Gateway"

### 3. 아이콘 사용

- 아이콘을 캔버스로 드래그 앤 드롭
- 크기 조정 시 비율 유지 (aspect="fixed")
- 기본 크기: 대부분 45x45 픽셀

---

## 실습 가이드 작성 시 활용

### 아키텍처 다이어그램 작성 단계

1. **태스크 0 또는 태스크 1에서 다이어그램 작성 안내**

   ```markdown
   > [!DOWNLOAD]
   > [aws-architecture-icons.xml](/files/drawio-libraries/aws-architecture-icons.xml)
   >
   > - AWS 아키텍처 다이어그램 작성을 위한 공식 아이콘 라이브러리
   >
   > **관련 태스크:**
   >
   > - 태스크 1: draw.io에서 라이브러리를 불러와 VPC 아키텍처를 설계합니다.
   ```

2. **다이어그램 작성 지침**

   ```markdown
   ## 태스크 1: 아키텍처 다이어그램 작성

   ### 태스크 설명

   draw.io를 사용하여 이번 실습에서 구축할 아키텍처를 시각화합니다.

   ### 상세 단계

   1. draw.io (https://app.diagrams.net/)에 접속합니다.
   2. **File** > **Open Library from** > **Device**를 선택합니다.
   3. 다운로드한 `aws-architecture-icons.xml` 파일을 선택합니다.
   4. 왼쪽 패널에서 필요한 AWS 서비스 아이콘을 검색합니다.
   5. 아이콘을 캔버스로 드래그하여 아키텍처를 구성합니다.
   ```

### 주요 서비스별 아이콘 이름

| 서비스      | 아이콘 이름 (검색어)                                  |
| ----------- | ----------------------------------------------------- |
| ElastiCache | "ElastiCache-for-Memcached", "ElastiCache-for-Redis"  |
| Aurora      | "Aurora-MySQL-Instance", "Aurora-PostgreSQL-Instance" |
| API Gateway | "API-Gateway Endpoint"                                |
| Athena      | "Athena Data-Source-Connectors"                       |
| Braket      | "Braket Simulator", "Braket QPU"                      |

---

## 아이콘 명명 규칙

### 패턴

```
Res_{서비스명}_{리소스타입}_{크기}
```

### 예시

- `Res Amazon-ElastiCache ElastiCache-for-Memcached 48`
- `Res Amazon-Aurora-MySQL-Instance 48`
- `Res Amazon-API-Gateway Endpoint 48`

### 크기

- 대부분 48x48 픽셀 (일부 45x45, 31x45 등)
- 고정 비율 유지 (`aspect: "fixed"`)

---

## 실습 예시: ElastiCache 아키텍처

### 필요한 아이콘

1. Amazon ElastiCache (Redis)
2. Amazon RDS (MySQL)
3. AWS Lambda
4. Amazon API Gateway

### 다이어그램 구성

```
[API Gateway] → [Lambda] → [ElastiCache Redis]
                           ↓
                    [RDS MySQL]
```

---

## 주의사항

### 라이브러리 파일 관리

- 파일 위치: `public/files/drawio-libraries/`
- 파일명: `aws-architecture-icons.xml`
- 크기: 약 2.1MB
- 형식: XML (mxlibrary)

### 실습 가이드 작성 시

- DOWNLOAD Alert로 파일 제공
- draw.io 사용법 간단히 안내
- 아키텍처 다이어그램 예시 이미지 포함 권장

### 아이콘 사용 시

- 고정 비율 유지 (aspect="fixed")
- 기본 크기 사용 권장 (45x45 또는 48x48)
- 명확한 레이블 추가

---

## 추가 리소스

- AWS Architecture Icons: https://aws.amazon.com/architecture/icons/
- draw.io 공식 문서: https://www.drawio.com/doc/
- draw.io 라이브러리 가이드: https://www.drawio.com/blog/custom-libraries

---

**마지막 업데이트**: 2025-02-21  
**버전**: 1.0.0
