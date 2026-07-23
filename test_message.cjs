const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We need to delay the WM_USER+2 message slightly to ensure the TrayIcon is ready, or use a loop to wait for g_trayHwnd
const update = `    if (g_startupMessage.empty()) {
        g_startupMessage = "Welcome to Onyx Guard!";
    }
    
    for (int i = 0; i < 20; i++) {
        if (g_trayHwnd) break;
        Sleep(100);
    }
    
    if (g_trayHwnd) {
        PostMessageA(g_trayHwnd, WM_USER + 2, 0, 0);
    }`;

code = code.replace(
/    if \(g_startupMessage\.empty\(\)\) \{\s*g_startupMessage = "Welcome to Onyx Guard!";\s*\}\s*if \(g_trayHwnd\) \{\s*PostMessageA\(g_trayHwnd, WM_USER \+ 2, 0, 0\);\s*\}/g,
update);

fs.writeFileSync('src/App.tsx', code);
