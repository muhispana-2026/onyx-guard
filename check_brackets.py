import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Extract cppCode string
m = re.search(r'const cppCode = useMemo\(\(\) => \{.*?return `(.*?)`;\n  \}, \[', content, re.DOTALL)
if not m:
    print("Could not find cppCode")
    exit(1)

cpp = m.group(1)
cpp = re.sub(r'\$\{.*?\}', '0', cpp)

stack = []
in_str = False
in_char = False
escape = False
in_line_comment = False
in_block_comment = False

for i, c in enumerate(cpp):
    if in_line_comment:
        if c == '\n': in_line_comment = False
        continue
    if in_block_comment:
        if c == '*' and i+1 < len(cpp) and cpp[i+1] == '/':
            in_block_comment = False
        continue
    if in_str:
        if escape: escape = False
        elif c == '\\': escape = True
        elif c == '"': in_str = False
        continue
    if in_char:
        if escape: escape = False
        elif c == '\\': escape = True
        elif c == "'": in_char = False
        continue

    if c == '"': in_str = True
    elif c == "'": in_char = True
    elif c == '/' and i+1 < len(cpp) and cpp[i+1] == '/': in_line_comment = True
    elif c == '/' and i+1 < len(cpp) and cpp[i+1] == '*': in_block_comment = True
    elif c == '{': stack.append(i)
    elif c == '}':
        if not stack:
            print(f"Extra }} at {i}")
            print(cpp[max(0, i-50):i+50])
            exit(1)
        stack.pop()

if stack:
    print(f"Unmatched {{ at {stack[-1]}")
    exit(1)
print("Brackets are balanced.")
