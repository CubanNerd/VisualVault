import os

files_to_process = [
    "README.md",
    "docs/USER_GUIDE.md",
    "docs/DEVELOPER_GUIDE.md",
    "docs/DESKTOP_GUIDE.md"
]

chars = set()

for file_path in files_to_process:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    for c in content:
        if ord(c) > 127:
            chars.add(c)

for c in chars:
    print(f"{repr(c)} - {ord(c)}")

