fetch('http://127.0.0.1:3000/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-project-id': 'proj_1784597324104' },
    body: JSON.stringify({
        "serverUrl":"https://onyx-guard.onrender.com/api/auth",
        "securityToken":"TOKEN_PROJ_1784597324104",
        "clientVersion":"1.00.00",
        "actionOnFailure":"MSG_BOX",
        "enableHwidCheck":true,
        "enableFileCheck":true,
        "enableRealtimeMonitor":false,
        "enableMultiClientBlock":false,
        "multiClientLimit":3,
        "enableAntiMacro":true,
        "enableAntiDebug":true,
        "enableDllScanner":true,
        "enableMemoryScanner":true,
        "enableProcessBinding":true,
        "enablePayloadEncryption":true,
        "enableApiHookDetection":true,
        "enableHeuristics":true,
        "enableTestModeBlock":true,
        "enableWatchdog":true,
        "blacklistedPrograms":[],
        "licenseExpiration":null
    })
}).then(r => r.json()).then(console.log).catch(console.error);
