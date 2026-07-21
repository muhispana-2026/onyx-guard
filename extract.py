import sys, re
with open('src/App.tsx', 'r') as f:
    content = f.read()

start_idx = content.find("const cppCode = useMemo(() => {")
start_quote = content.find("return `", start_idx) + 7
end_quote = content.rfind("`;")
cpp = content[start_quote+1:end_quote]

with open('test_compile.cpp', 'w') as f:
    f.write(cpp)
