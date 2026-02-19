#!/usr/bin/env python3
"""
Alert 사용 현황 분석 스크립트

모든 마크다운 파일의 Alert 사용 현황을 분석하고 남발 여부를 확인합니다.
"""

import os
import re
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple

# Alert 타입 정의
ALERT_TYPES = [
    'NOTE',
    'WARNING',
    'TIP',
    'SUCCESS',
    'ERROR',
    'OUTPUT',
    'IMPORTANT',
    'TROUBLESHOOTING',
    'CONCEPT',
    'DOWNLOAD'
]

# Alert 사용 권장 기준
ALERT_LIMITS = {
    'total': {'max': 18, 'recommended': 15},
    'NOTE': {'max': 10, 'recommended': 8},
    'per_task': {'max': 4, 'recommended': 3}
}

class AlertAnalyzer:
    def __init__(self, content_dir: str = 'public/content'):
        self.content_dir = Path(content_dir)
        self.results = []
        
    def analyze_file(self, file_path: Path) -> Dict:
        """단일 파일의 Alert 사용 현황 분석"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Alert 타입별 개수 카운트
        alert_counts = {}
        for alert_type in ALERT_TYPES:
            pattern = rf'> \[!{alert_type}\]'
            matches = re.findall(pattern, content)
            alert_counts[alert_type] = len(matches)
        
        # 태스크 개수 카운트
        task_pattern = r'^## 태스크 \d+:'
        tasks = re.findall(task_pattern, content, re.MULTILINE)
        task_count = len(tasks)
        
        # 태스크별 Alert 분포 분석
        task_sections = re.split(r'^## 태스크 \d+:', content, flags=re.MULTILINE)
        task_alert_counts = []
        
        for section in task_sections[1:]:  # 첫 번째는 헤더 부분이므로 제외
            section_alerts = 0
            for alert_type in ALERT_TYPES:
                pattern = rf'> \[!{alert_type}\]'
                section_alerts += len(re.findall(pattern, section))
            task_alert_counts.append(section_alerts)
        
        # 총 Alert 수
        total_alerts = sum(alert_counts.values())
        
        # 위반 사항 체크
        violations = []
        
        # 1. 총 Alert 수 초과
        if total_alerts > ALERT_LIMITS['total']['max']:
            violations.append(f"총 Alert 수 초과: {total_alerts}개 (최대 {ALERT_LIMITS['total']['max']}개)")
        elif total_alerts > ALERT_LIMITS['total']['recommended']:
            violations.append(f"총 Alert 수 권장 초과: {total_alerts}개 (권장 {ALERT_LIMITS['total']['recommended']}개)")
        
        # 2. NOTE Alert 과다 사용
        if alert_counts['NOTE'] > ALERT_LIMITS['NOTE']['max']:
            violations.append(f"NOTE Alert 과다: {alert_counts['NOTE']}개 (최대 {ALERT_LIMITS['NOTE']['max']}개)")
        elif alert_counts['NOTE'] > ALERT_LIMITS['NOTE']['recommended']:
            violations.append(f"NOTE Alert 권장 초과: {alert_counts['NOTE']}개 (권장 {ALERT_LIMITS['NOTE']['recommended']}개)")
        
        # 3. 태스크당 Alert 과다
        max_task_alerts = max(task_alert_counts) if task_alert_counts else 0
        if max_task_alerts > ALERT_LIMITS['per_task']['max']:
            violations.append(f"태스크당 Alert 과다: 최대 {max_task_alerts}개 (최대 {ALERT_LIMITS['per_task']['max']}개)")
        elif max_task_alerts > ALERT_LIMITS['per_task']['recommended']:
            violations.append(f"태스크당 Alert 권장 초과: 최대 {max_task_alerts}개 (권장 {ALERT_LIMITS['per_task']['recommended']}개)")
        
        return {
            'file': str(file_path.relative_to(self.content_dir.parent)),
            'total_alerts': total_alerts,
            'alert_counts': alert_counts,
            'task_count': task_count,
            'task_alert_counts': task_alert_counts,
            'max_task_alerts': max_task_alerts,
            'violations': violations,
            'status': '❌ 문제' if violations else '✅ 정상'
        }
    
    def analyze_all(self) -> List[Dict]:
        """모든 마크다운 파일 분석"""
        md_files = list(self.content_dir.rglob('*.md'))
        
        for md_file in sorted(md_files):
            result = self.analyze_file(md_file)
            self.results.append(result)
        
        return self.results
    
    def print_summary(self):
        """분석 결과 요약 출력"""
        print("\n" + "="*80)
        print("Alert 사용 현황 분석 결과")
        print("="*80 + "\n")
        
        # 전체 통계
        total_files = len(self.results)
        problem_files = sum(1 for r in self.results if r['violations'])
        
        print(f"📊 전체 통계:")
        print(f"  - 분석 파일 수: {total_files}개")
        print(f"  - 문제 파일 수: {problem_files}개")
        print(f"  - 정상 파일 수: {total_files - problem_files}개")
        print()
        
        # 문제 파일 상세
        if problem_files > 0:
            print("🚨 문제 파일 목록:\n")
            
            for result in self.results:
                if result['violations']:
                    print(f"{result['status']} {result['file']}")
                    print(f"  총 Alert: {result['total_alerts']}개")
                    print(f"  태스크 수: {result['task_count']}개")
                    print(f"  태스크당 최대 Alert: {result['max_task_alerts']}개")
                    print()
                    
                    # Alert 타입별 개수
                    print("  Alert 타입별:")
                    for alert_type, count in result['alert_counts'].items():
                        if count > 0:
                            print(f"    - {alert_type}: {count}개")
                    print()
                    
                    # 위반 사항
                    print("  위반 사항:")
                    for violation in result['violations']:
                        print(f"    ⚠️  {violation}")
                    print()
                    print("-" * 80)
                    print()
        
        # 정상 파일 목록
        normal_files = [r for r in self.results if not r['violations']]
        if normal_files:
            print("✅ 정상 파일 목록:\n")
            for result in normal_files:
                print(f"  {result['file']} (총 {result['total_alerts']}개)")
            print()
        
        # Alert 타입별 전체 통계
        print("📈 Alert 타입별 전체 통계:\n")
        total_by_type = defaultdict(int)
        for result in self.results:
            for alert_type, count in result['alert_counts'].items():
                total_by_type[alert_type] += count
        
        for alert_type in ALERT_TYPES:
            count = total_by_type[alert_type]
            if count > 0:
                avg = count / total_files
                print(f"  {alert_type}: {count}개 (평균 {avg:.1f}개/파일)")
        print()
        
        # 권장사항
        if problem_files > 0:
            print("💡 권장사항:\n")
            print("  1. NOTE Alert 과다 사용 파일: 일반 텍스트로 전환")
            print("  2. 태스크당 Alert 과다: 중요도 낮은 Alert 제거")
            print("  3. 총 Alert 수 초과: 불필요한 Alert 통합 또는 제거")
            print()
    
    def export_csv(self, output_file: str = 'alert-usage-report.csv'):
        """CSV 파일로 결과 내보내기"""
        import csv
        
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            
            # 헤더
            header = ['파일', '상태', '총 Alert', '태스크 수', '태스크당 최대 Alert']
            header.extend(ALERT_TYPES)
            header.append('위반 사항')
            writer.writerow(header)
            
            # 데이터
            for result in self.results:
                row = [
                    result['file'],
                    result['status'],
                    result['total_alerts'],
                    result['task_count'],
                    result['max_task_alerts']
                ]
                
                for alert_type in ALERT_TYPES:
                    row.append(result['alert_counts'][alert_type])
                
                row.append(' | '.join(result['violations']) if result['violations'] else '')
                
                writer.writerow(row)
        
        print(f"📄 CSV 파일 생성: {output_file}")

def main():
    analyzer = AlertAnalyzer()
    analyzer.analyze_all()
    analyzer.print_summary()
    analyzer.export_csv()

if __name__ == '__main__':
    main()
