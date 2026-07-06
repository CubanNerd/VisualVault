with open("docs/DEVELOPER_GUIDE.md", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "- **[Detailed Developer Architecture Guide](./docs/DEVELOPER_GUIDE.md)**" in line:
        continue
    new_lines.append(line)

with open("docs/DEVELOPER_GUIDE.md", "w", encoding="utf-8") as f:
    f.writelines(new_lines)
