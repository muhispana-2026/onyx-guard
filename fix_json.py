import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Make all have comma
content = content.replace('JsonEscape(SECRET_TOKEN) << "\\""', 'JsonEscape(SECRET_TOKEN) << "\\\","')
# But wait, it's `<< "\\\""` in the JS string literal.
# So `<< "\\\""` which is `<< "\\\""` in Python!
content = content.replace('JsonEscape(SECRET_TOKEN) << "\\\\\\""', 'JsonEscape(SECRET_TOKEN) << "\\\\\\","')

with open('src/App.tsx', 'w') as f:
    f.write(content)
