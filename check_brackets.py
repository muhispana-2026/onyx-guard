import sys
with open('src/App.tsx', 'r') as f:
    content = f.read()

start_idx = content.find("const cppCode = useMemo(() => {")
if start_idx == -1:
    print("Cannot find cppCode")
    sys.exit(1)

start_quote = content.find("`", start_idx)
end_quote = content.rfind("`;")
if start_quote == -1 or end_quote == -1:
    print("Cannot find backticks")
    sys.exit(1)

cpp = content[start_quote+1:end_quote]

stack = []
for i, c in enumerate(cpp):
    if c == '{':
        stack.append(i)
    elif c == '}':
        if not stack:
            print(f"Extra }} at {i}")
        else:
            stack.pop()

if stack:
    for i in stack:
        print(f"Unmatched {{ at {i}: ", cpp[i:i+50].replace('\n', '\\n'))
else:
    print("Brackets are balanced.")
