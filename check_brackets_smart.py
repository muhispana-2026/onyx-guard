import sys

with open('test_compile.cpp', 'r') as f:
    code = f.read()

in_string = False
in_char = False
in_line_comment = False
in_block_comment = False
escape = False

stack = []

for i, c in enumerate(code):
    if in_line_comment:
        if c == '\n':
            in_line_comment = False
        continue
    if in_block_comment:
        if c == '*' and i+1 < len(code) and code[i+1] == '/':
            in_block_comment = False
        continue
    if in_string:
        if escape:
            escape = False
        elif c == '\\':
            escape = True
        elif c == '"':
            in_string = False
        continue
    if in_char:
        if escape:
            escape = False
        elif c == '\\':
            escape = True
        elif c == "'":
            in_char = False
        continue
    
    if c == '"':
        in_string = True
    elif c == "'":
        in_char = True
    elif c == '/' and i+1 < len(code) and code[i+1] == '/':
        in_line_comment = True
    elif c == '/' and i+1 < len(code) and code[i+1] == '*':
        in_block_comment = True
    elif c == '{':
        stack.append(i)
    elif c == '}':
        if not stack:
            print(f"Extra }} at index {i}")
            print(code[max(0, i-50):i+50])
            sys.exit(0)
        else:
            stack.pop()

if stack:
    print(f"Unmatched {{ at index {stack[-1]}")
    idx = stack[-1]
    print(code[max(0, idx-100):idx+100])
else:
    print("Brackets are balanced.")

