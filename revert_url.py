with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'serverUrl: `${req.protocol}://${req.headers["x-forwarded-host"] || req.get("host")}/api/auth`,',
    'serverUrl: "https://onyx-guard.onrender.com/api/auth",'
)
content = content.replace(
    'serverUrl: "https://ais-pre-h2vywcvn6xvdzf4t2sbkzu-258992696762.us-east5.run.app/api/auth",',
    'serverUrl: "https://onyx-guard.onrender.com/api/auth",'
)
with open('server.ts', 'w') as f:
    f.write(content)
