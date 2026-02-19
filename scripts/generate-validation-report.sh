#!/bin/bash

# 검증 보고서 생성 스크립트
# 사용법: ./scripts/generate-validation-report.sh

REPORT_FILE="VALIDATION_REPORT.md"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

echo "📊 검증 보고서 생성 중..."

# 보고서 헤더
cat > "$REPORT_FILE" << EOF
# 실습 가이드 검증 보고서

**생성 일시**: $TIMESTAMP  
**검증 도구**: validate-advanced.js (30개 규칙)

---

## 📊 전체 요약

EOF

# 전체 통계
echo "전체 파일 검증 중..."
TOTAL_OUTPUT=$(node scripts/validate-advanced.js public/content 2>&1)

# 통계 추출
TOTAL_FILES=$(echo "$TOTAL_OUTPUT" | grep "총 파일:" | awk '{print $3}')
TOTAL_ISSUES=$(echo "$TOTAL_OUTPUT" | grep "발견된 항목:" | awk '{print $3}')
TOTAL_ERRORS=$(echo "$TOTAL_OUTPUT" | grep "오류:" | awk '{print $3}')
TOTAL_WARNINGS=$(echo "$TOTAL_OUTPUT" | grep "경고:" | awk '{print $3}')
TOTAL_INFO=$(echo "$TOTAL_OUTPUT" | grep "정보:" | awk '{print $3}')

cat >> "$REPORT_FILE" << EOF
| 항목 | 개수 |
|------|------|
| 총 파일 수 | $TOTAL_FILES |
| 발견된 항목 | $TOTAL_ISSUES |
| 오류 (Error) | $TOTAL_ERRORS |
| 경고 (Warning) | $TOTAL_WARNINGS |
| 정보 (Info) | $TOTAL_INFO |

EOF

# 통과율 계산
if [ "$TOTAL_FILES" -gt 0 ]; then
    PASSED_FILES=$((TOTAL_FILES - $(echo "$TOTAL_OUTPUT" | grep -c "❌\|⚠️")))
    PASS_RATE=$((PASSED_FILES * 100 / TOTAL_FILES))
    
    cat >> "$REPORT_FILE" << EOF
**통과율**: $PASS_RATE% ($PASSED_FILES/$TOTAL_FILES 파일)

EOF
fi

# 주차별 통계
cat >> "$REPORT_FILE" << EOF
---

## 📁 주차별 검증 결과

| 주차 | 파일 수 | 오류 | 경고 | 정보 | 상태 |
|------|---------|------|------|------|------|
EOF

for week in {1..15}; do
    WEEK_DIR="public/content/week$week"
    
    if [ -d "$WEEK_DIR" ]; then
        echo "Week $week 검증 중..."
        WEEK_OUTPUT=$(node scripts/validate-advanced.js "$WEEK_DIR" 2>&1)
        
        WEEK_FILES=$(echo "$WEEK_OUTPUT" | grep "총 파일:" | awk '{print $3}')
        WEEK_ERRORS=$(echo "$WEEK_OUTPUT" | grep "오류:" | awk '{print $3}')
        WEEK_WARNINGS=$(echo "$WEEK_OUTPUT" | grep "경고:" | awk '{print $3}')
        WEEK_INFO=$(echo "$WEEK_OUTPUT" | grep "정보:" | awk '{print $3}')
        
        # 상태 결정
        if [ "$WEEK_ERRORS" = "0" ] && [ "$WEEK_WARNINGS" = "0" ]; then
            STATUS="✅ 통과"
        elif [ "$WEEK_ERRORS" = "0" ]; then
            STATUS="⚠️ 경고"
        else
            STATUS="❌ 오류"
        fi
        
        echo "| Week $week | $WEEK_FILES | $WEEK_ERRORS | $WEEK_WARNINGS | $WEEK_INFO | $STATUS |" >> "$REPORT_FILE"
    fi
done

# 카테고리별 통계
cat >> "$REPORT_FILE" << EOF

---

## 📋 카테고리별 검증 결과

EOF

echo "카테고리별 통계 집계 중..."

# 각 카테고리별 항목 수 계산
FRONTMATTER_COUNT=$(echo "$TOTAL_OUTPUT" | grep -c "📁 Front Matter")
STRUCTURE_COUNT=$(echo "$TOTAL_OUTPUT" | grep -c "📁 섹션 구조\|📁 완료 메시지")
CONSISTENCY_COUNT=$(echo "$TOTAL_OUTPUT" | grep -c "📁 강조 스타일\|📁 완료 표시")
PAGE_STRUCTURE_COUNT=$(echo "$TOTAL_OUTPUT" | grep -c "📁 페이지 구조\|📁 참고 섹션")
CONTENT_QUALITY_COUNT=$(echo "$TOTAL_OUTPUT" | grep -c "📁 실습 환경\|📁 Prerequisites")

cat >> "$REPORT_FILE" << EOF
| 카테고리 | 발견된 항목 | 설명 |
|---------|------------|------|
| A. 구조 및 완성도 | $STRUCTURE_COUNT | Front Matter, 섹션 구조, 완료 메시지 |
| B. 일관성 검증 | $CONSISTENCY_COUNT | 강조 스타일, 완료 표시, 버튼 문법 |
| C. 페이지 구조 | $PAGE_STRUCTURE_COUNT | 실습 vs 데모, 섹션 순서, 참고 섹션 |
| D. 콘텐츠 품질 | $CONTENT_QUALITY_COUNT | 실습 환경 정보, Prerequisites |

---

## 🔍 상세 검증 결과

EOF

# 주차별 상세 결과
for week in {1..15}; do
    WEEK_DIR="public/content/week$week"
    
    if [ -d "$WEEK_DIR" ]; then
        cat >> "$REPORT_FILE" << EOF

### Week $week

\`\`\`
EOF
        node scripts/validate-advanced.js "$WEEK_DIR" 2>&1 >> "$REPORT_FILE"
        echo "\`\`\`" >> "$REPORT_FILE"
    fi
done

# 권장 사항
cat >> "$REPORT_FILE" << EOF

---

## 💡 권장 사항

### 우선순위 1: 오류 수정 (Error)

오류는 표준을 위반하는 심각한 문제입니다. 즉시 수정이 필요합니다.

**일반적인 오류**:
- Front Matter 필수 필드 누락
- 청유형 사용 ("~하세요" → "~합니다")
- 마침표 누락
- 버튼 문법 미사용

**수정 방법**:
\`\`\`bash
# 자동 수정 스크립트 실행
./scripts/fix-common-errors.sh

# 또는 수동 수정
# 1. 검증 결과에서 오류 확인
# 2. 해당 파일 열기
# 3. 오류 수정
# 4. 재검증
\`\`\`

### 우선순위 2: 경고 수정 (Warning)

경고는 권장 사항을 따르지 않는 경우입니다. 가능한 수정하는 것이 좋습니다.

### 우선순위 3: 정보 확인 (Info)

정보는 개선 가능한 부분을 안내합니다. 선택적으로 수정할 수 있습니다.

---

## 📈 진행률 추적

**목표**: 모든 파일 100% 통과

**현재 진행률**: $PASS_RATE%

**다음 단계**:
1. 오류가 있는 파일 우선 수정
2. 경고가 있는 파일 검토
3. 정보 항목 개선
4. 재검증 및 보고서 재생성

---

**보고서 생성 완료**: $TIMESTAMP
EOF

echo "✅ 검증 보고서 생성 완료: $REPORT_FILE"
echo ""
echo "📊 요약:"
echo "  총 파일: $TOTAL_FILES"
echo "  오류: $TOTAL_ERRORS"
echo "  경고: $TOTAL_WARNINGS"
echo "  정보: $TOTAL_INFO"
echo "  통과율: $PASS_RATE%"
