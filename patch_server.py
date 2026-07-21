with open('server.ts', 'r') as f:
    content = f.read()

import re
content = re.sub(r'async function runMigrations\(\) \{.*?\n\}\n\n', '', content, flags=re.DOTALL)
content = content.replace('await runMigrations();\n', '')

with open('server.ts', 'w') as f:
    f.write(content)
