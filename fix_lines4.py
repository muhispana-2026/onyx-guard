with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

for i in range(1239, 1260):
    if "msgStart += 11;" in lines[i]:
        lines[i] = lines[i].replace("11", "13")

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
