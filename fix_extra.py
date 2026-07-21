with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

for i in range(1255, 1270):
    if lines[i].strip() == "}" and lines[i+1].strip() == "}":
        print(f"Found double braces at {i} and {i+1}")
        if "InternetCloseHandle(hRequest)" in lines[i+2]:
            lines.pop(i)
            print("Removed extra brace.")
            break

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
