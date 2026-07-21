with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace('serverUrl: "",', 'serverUrl: "", // left empty so frontend uses default')

with open('server.ts', 'w') as f:
    f.write(content)
