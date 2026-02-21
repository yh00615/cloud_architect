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

fixed_count = 0
for filepath in cost_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix pattern: **무료 플랜** followed by newline and bullet outside blockquote
    # Pattern 1: > **무료 플랜**\n>\n- 이 실습 비용은
    content = re.sub(
        r'> \*\*무료 플랜\*\*\n>\n- 이 실습 비용은',
        r'> **무료 플랜**\n>\n> - 이 실습 비용은',
        content
    )
    
    # Pattern 2: **무료 플랜**\n\n- 이 실습 비용은 (completely outside)
    content = re.sub(
        r'\*\*무료 플랜\*\*\n\n- 이 실습 비용은',
        r'> **무료 플랜**\n>\n> - 이 실습 비용은',
        content
    )
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Fixed: {filepath}")
        fixed_count += 1
    else:
        print(f"  - OK: {filepath}")

print(f"\nFixed {fixed_count} files")
