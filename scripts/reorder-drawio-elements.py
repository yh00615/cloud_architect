#!/usr/bin/env python3
"""
draw.io 파일에서 EC2/RDS 인스턴스를 맨 앞으로 배치하는 스크립트
"""

import xml.etree.ElementTree as ET
import sys

def reorder_elements(input_file, output_file):
    # XML 파싱
    tree = ET.parse(input_file)
    root = tree.getroot()
    
    # mxGraphModel > root 찾기
    diagram = root.find('.//diagram')
    model = diagram.find('.//mxGraphModel')
    graph_root = model.find('.//root')
    
    # 인스턴스 ID 목록
    instance_ids = ['ec2-a1', 'ec2-a2', 'ec2-c1', 'ec2-c2', 'rds-primary', 'rds-standby']
    
    # 모든 요소를 리스트로 변환
    all_elements = list(graph_root)
    
    # 인스턴스 요소와 나머지 요소 분리
    instances = []
    other_elements = []
    
    for elem in all_elements:
        elem_id = elem.get('id', '')
        if elem_id in instance_ids:
            instances.append(elem)
        else:
            other_elements.append(elem)
    
    # root 비우기
    for elem in all_elements:
        graph_root.remove(elem)
    
    # 순서대로 다시 추가: 나머지 요소 먼저, 인스턴스 나중에 (나중에 추가된 것이 앞에 표시됨)
    for elem in other_elements:
        graph_root.append(elem)
    
    for elem in instances:
        graph_root.append(elem)
    
    # 파일 저장
    tree.write(output_file, encoding='utf-8', xml_declaration=True)
    print(f"✅ 인스턴스 {len(instances)}개를 맨 앞으로 배치했습니다.")
    print(f"   배치된 인스턴스: {', '.join(instance_ids)}")

if __name__ == '__main__':
    input_file = 'public/files/week1/1-3-quicktable-3tier-architecture-with-arrows.drawio'
    output_file = input_file
    
    reorder_elements(input_file, output_file)
