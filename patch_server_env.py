with open('server.ts', 'r') as f:
    content = f.read()
if "import 'dotenv/config'" not in content:
    content = "import 'dotenv/config';\n" + content
with open('server.ts', 'w') as f:
    f.write(content)
