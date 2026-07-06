import os
import re

import emoji

def strip_emojis(text):
    return emoji.replace_emoji(text, replace="")

files_to_process = [
    "README.md",
    "docs/USER_GUIDE.md",
    "docs/DEVELOPER_GUIDE.md",
    "docs/DESKTOP_GUIDE.md"
]

# Patterns for "llm chat" or similar references
llm_patterns = [
    r'(?i)\bllms?\b',
    r'(?i)\bchat(gpt)?\b',
    r'(?i)\bprompt(ing)?\b',
    r'(?i)\blarge language model(s)?\b',
    r'(?i)\bai chat(s)?\b'
]

for file_path in files_to_process:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # We might just print the matched lines for manual review first to be safe
    lines = content.split('\n')
    print(f"--- {file_path} ---")
    for i, line in enumerate(lines):
        for p in llm_patterns:
            if re.search(p, line):
                print(f"{i}: {line}")
                break

    # Strip emojis
    content_no_emojis = strip_emojis(content)
    # We can also do the same replacement if needed, but let's see matches first.
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content_no_emojis)

