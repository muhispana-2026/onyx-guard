with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace('results.push(`Error on ${q}: ${e.message}`);', 'results.push(`Error on ${q}: ${e.message || String(e)} | Full: ${JSON.stringify(e, Object.getOwnPropertyNames(e))}`);')

with open('server.ts', 'w') as f:
    f.write(content)
