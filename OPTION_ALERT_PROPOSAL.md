# 커스텀 OPTION Alert 제안

## 사용 예시

```markdown
### 2. 리소스 삭제

다음 두 가지 방법 중 하나를 선택하여 리소스를 삭제할 수 있습니다.

> [!OPTION]
> **🖱️ 옵션 1: AWS 콘솔에서 수동 삭제 (권장)**
>
> AWS 콘솔에 익숙하지 않은 경우 이 방법을 권장합니다. 각 단계를 확인하면서 삭제할 수 있습니다.

**Amazon VPC Endpoint 삭제**

1. Amazon VPC 콘솔로 이동합니다.
2. 왼쪽 메뉴에서 **Endpoints**를 선택합니다.
   ...

> [!OPTION]
> **💻 옵션 2: AWS CloudShell 스크립트로 일괄 삭제**
>
> CLI 명령어에 익숙하거나 빠른 삭제를 원하는 경우 이 방법을 사용하세요.

AWS CloudShell을 사용하여 태그 기반으로 리소스를 자동 삭제할 수 있습니다.

1. AWS Management Console 상단의 CloudShell 아이콘을 클릭합니다.
   ...
```

## 구현 방법

### 1. MarkdownRenderer.tsx 수정

`[!OPTION]` 감지 및 렌더링 로직 추가:

```typescript
// [!OPTION] 감지
if (content.includes('[!OPTION]')) {
  boxType = 'option';
  iconName = 'status-info'; // 또는 'settings' 아이콘
  label = '선택 방법';
}
```

### 2. info-boxes.css 스타일 추가

```css
/* OPTION Alert 스타일 */
.info-box--option {
  background-color: rgba(59, 130, 246, 0.05); /* 연한 파란색 */
  border-color: rgba(59, 130, 246, 0.3);
}

.info-box--option .info-box-icon {
  color: #3b82f6;
}

.info-box--option .info-box-icon svg {
  fill: #3b82f6;
}

/* 다크모드 */
[data-awsui-theme='dark'] .info-box--option {
  background-color: rgba(96, 165, 250, 0.08);
  border-color: rgba(96, 165, 250, 0.4);
}

[data-awsui-theme='dark'] .info-box--option .info-box-icon {
  color: #60a5fa;
}

[data-awsui-theme='dark'] .info-box--option .info-box-icon svg {
  fill: #60a5fa;
}
```

## 색상 옵션

### 옵션 A: 파란색 (정보 느낌) - 추천

- 라이트: `rgba(59, 130, 246, 0.05)` 배경, `rgba(59, 130, 246, 0.3)` 테두리
- 다크: `rgba(96, 165, 250, 0.08)` 배경, `rgba(96, 165, 250, 0.4)` 테두리
- 아이콘: `#3b82f6` (라이트), `#60a5fa` (다크)

### 옵션 B: 청록색 (선택 느낌)

- 라이트: `rgba(20, 184, 166, 0.05)` 배경, `rgba(20, 184, 166, 0.3)` 테두리
- 다크: `rgba(45, 212, 191, 0.08)` 배경, `rgba(45, 212, 191, 0.4)` 테두리
- 아이콘: `#14b8a6` (라이트), `#2dd4bf` (다크)

### 옵션 C: 회색 (중립적)

- 라이트: `rgba(100, 116, 139, 0.05)` 배경, `rgba(100, 116, 139, 0.25)` 테두리
- 다크: `rgba(148, 163, 184, 0.08)` 배경, `rgba(148, 163, 184, 0.3)` 테두리
- 아이콘: `#64748b` (라이트), `#94a3b8` (다크)

## 아이콘 옵션

- `status-info`: 정보 아이콘 (i)
- `settings`: 설정 아이콘 (톱니바퀴)
- `view-full`: 확장 아이콘
- `menu`: 메뉴 아이콘 (3줄)

## 장점

1. **시각적으로 매우 명확**: 박스로 옵션이 완전히 구분됨
2. **일관성**: 다른 Alert들과 동일한 스타일
3. **확장성**: 다른 실습에서도 재사용 가능
4. **헤더 활용**: 옵션 제목이 Alert 헤더에 표시되어 눈에 잘 띔

## 추천

- **색상**: 옵션 A (파란색) - 정보 제공 느낌
- **아이콘**: `status-info` - 정보/선택 느낌
- **레이블**: "선택 방법" 또는 "옵션"

이렇게 하면 COST Alert처럼 깔끔하고 명확하게 옵션을 구분할 수 있습니다!
