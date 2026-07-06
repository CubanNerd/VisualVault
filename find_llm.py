import os
import re

files_to_process = [
    "README.md",
    "docs/USER_GUIDE.md",
    "docs/DEVELOPER_GUIDE.md",
    "docs/DESKTOP_GUIDE.md"
]

llm_patterns = [
    r'(?i)\bllm\b',
    r'(?i)\bllms\b',
    r'(?i)\bchatgpt\b',
    r'(?i)\bprompt\b',
    r'(?i)\bprompting\b',
    r'(?i)\blarge language model\b',
    r'(?i)\bai chat\b',
    r'(?i)\bchat\b'
]

for file_path in files_to_process:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    lines = content.split('\n')
    print(f"--- {file_path} ---")
    for i, line in enumerate(lines):
        for p in llm_patterns:
            if re.search(p, line):
                print(f"{i}: {line}")
                break
