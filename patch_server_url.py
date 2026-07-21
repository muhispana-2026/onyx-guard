with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace('"https://onyx-guard.onrender.com/api/auth"', '`${req.protocol}://${req.get("host")}/api/auth`')

with open('server.ts', 'w') as f:
    f.write(content)
