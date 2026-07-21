import re
with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "JsonEscape(SECRET_TOKEN)" in line and "}" in lines[i+1]:
        lines[i] = line.replace('JsonEscape(SECRET_TOKEN) << "\\\\\\","', 'JsonEscape(SECRET_TOKEN) << "\\\\\\""')

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
