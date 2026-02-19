#!/bin/bash

# 검증 진행률 확인 스크립트

echo "📊 마크다운 검증 진행률"
echo "========================"
echo ""

# 전체 파일 수
TOTAL=$(find public/content -name "*.md" 2>/dev/null | wc -l | tr -d ' ')

# 검증 실행 및 결과 파싱
VALIDATION_OUTPUT=$(npm run validate:all 2>&1)

# 통과 파일 수 (각 파일마다 "✅ 모든 검증 통과!" 메시지가 나옴)
PASSED=$(echo "$VALIDATION_OUTPUT" | grep "✅ 모든 검증 통과!" | wc -l | tr -d ' ')

# 총 오류 수
TOTAL_ERRORS=$(echo "$VALIDATION_OUTPUT" | grep "총 오류:" | awk '{print $3}' | tr -d ' ')

# 총 경고 수
TOTAL_WARNINGS=$(echo "$VALIDATION_OUTPUT" | grep "총 경고:" | awk '{print $3}' | tr -d ' ')

# 진행률 계산
if [ "$TOTAL" -gt 0 ]; then
  PROGRESS=$((PASSED * 100 / TOTAL))
else
  PROGRESS=0
fi

# 결과 출력
echo "📁 총 파일: $TOTAL"
echo "✅ 통과 파일: $PASSED"
echo "❌ 오류 파일: $((TOTAL - PASSED))"
echo ""
echo "🐛 총 오류: ${TOTAL_ERRORS:-0}"
echo "⚠️  총 경고: ${TOTAL_WARNINGS:-0}"
echo ""
echo "📈 진행률: $PROGRESS%"
echo ""

# 진행률 바 표시
BAR_LENGTH=50
FILLED=$((PROGRESS * BAR_LENGTH / 100))
EMPTY=$((BAR_LENGTH - FILLED))

printf "["
printf "%${FILLED}s" | tr ' ' '█'
printf "%${EMPTY}s" | tr ' ' '░'
printf "] $PROGRESS%%\n"
echo ""

# 상태 메시지
if [ "$PROGRESS" -eq 100 ]; then
  echo "🎉 축하합니다! 모든 파일이 표준을 준수합니다!"
elif [ "$PROGRESS" -ge 80 ]; then
  echo "👍 거의 다 왔습니다! 조금만 더 수정하면 완료됩니다."
elif [ "$PROGRESS" -ge 50 ]; then
  echo "💪 절반 이상 완료했습니다. 계속 진행하세요!"
else
  echo "🚀 시작이 반입니다. 화이팅!"
fi

echo ""
echo "💡 팁: 'npm run validate:all'로 상세 오류 확인"
echo "💡 팁: 'npm run fix:auto'로 일반 오류 자동 수정"
