import os
import re
import glob

# Find all markdown files with COST alerts
files = []
for pattern in ['public/content/week*/*.md']:
    files.extend(glob.glob(pattern))

# Filter files that contain [!COST]
cost_files = []
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        if '[!COST]' in f.read():
            cost_files.append(file)

print(f"Found {len(cost_files)} files with COST alerts")

for filepath in cost_files:
    print(f"Processing: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Restore emoji format for links
    content = re.sub(r'\*\*참고\*\*: \[', '📘 [', content)
    content = re.sub(r'\*\*요금 계산기\*\*: \[AWS 요금 계산기\]', '🧮 [AWS 요금 계산기]', content)
    
    # Also handle cases without bold
    content = re.sub(r'참고: \[', '📘 [', content)
    content = re.sub(r'요금 계산기: \[AWS 요금 계산기\]', '🧮 [AWS 요금 계산기]', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✓ Restored: {filepath}")

print("Restoration completed!")
