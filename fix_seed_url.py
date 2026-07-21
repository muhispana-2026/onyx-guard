with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'serverUrl: `${req.protocol}://${req.get("host")}/api/auth`,',
    'serverUrl: "https://ais-pre-h2vywcvn6xvdzf4t2sbkzu-258992696762.us-east5.run.app/api/auth",',
    1 # Only replace the first occurrence (which is in seedData)
)

with open('server.ts', 'w') as f:
    f.write(content)
