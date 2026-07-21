with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'res.status(500).json({ error: e.message });',
    'res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });'
)

with open('server.ts', 'w') as f:
    f.write(content)
