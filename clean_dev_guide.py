with open("docs/DEVELOPER_GUIDE.md", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if line.startswith("# VisualVault — Developer Architecture & Integration Guide"):
        # We already have the title at the top, so we skip this line and the next few if they are redundant intro
        continue
    if line.strip() == "Welcome to the **VisualVault Developer Architecture & Integration Guide**. This document serves as a standard reference manual for core workflows, state lifecycles, storage partitioning patterns, and layout render targets. It is written to aid developers with future maintenance, updates, or native platform ports.":
        continue
    new_lines.append(line)

with open("docs/DEVELOPER_GUIDE.md", "w", encoding="utf-8") as f:
    f.writelines(new_lines)
