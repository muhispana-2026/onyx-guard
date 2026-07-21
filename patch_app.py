with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'if (data.serverUrl) setServerUrl(data.serverUrl);',
    "if (data.serverUrl && !data.serverUrl.includes('onyx-guard')) { setServerUrl(data.serverUrl); } else { setServerUrl(window.location.origin + '/api/auth'); }"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
