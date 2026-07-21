with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'serverUrl: `${req.protocol}://${req.get("host")}/api/auth`,',
    'serverUrl: `${req.protocol}://${req.headers["x-forwarded-host"] || req.get("host")}/api/auth`,'
)

with open('server.ts', 'w') as f:
    f.write(content)
