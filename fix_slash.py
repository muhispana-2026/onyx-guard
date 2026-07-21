with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

for i in range(len(lines)):
    if "bool isAllowed = SendValidationHandshake" in lines[i]:
        if "enableSplashScreen" in lines[i]:
            lines[i] = "${enableSplashScreen ? `        ShowSplashScreen();\\n` : ''}        bool isAllowed = SendValidationHandshake(username, hwid, invalidFile);\n"

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
