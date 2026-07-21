fetch('http://127.0.0.1:3000/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-project-id': 'proj_1784597324104' },
    body: JSON.stringify({
        "serverUrl":"https://onyx-guard.onrender.com/api/auth",
        "securityToken":"TOKEN_PROJ_1784597324104",
        "clientVersion":"1.00.00"
    })
}).then(r => r.json()).then(console.log).catch(console.error);
