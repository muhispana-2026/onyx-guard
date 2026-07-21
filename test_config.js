fetch('http://127.0.0.1:3000/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-project-id': 'proj_1784597324104' },
    body: JSON.stringify({
        "serverUrl":"https://onyx-guard.onrender.com/api/auth",
        "securityToken":"MU_SECURE_TOKEN_2026_X",
        "clientVersion":"1.00.00"
    })
}).then(r => r.json()).then(console.log).catch(console.error);
