const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const globalNidCode = `
// Global tray icon data so we can update it from other threads
NOTIFYICONDATAA g_nid = { 0 };
bool g_trayIconAdded = false;

// Action taken if security check fails`;

code = code.replace("// Action taken if security check fails", globalNidCode);

// Modify TrayIconThread
code = code.replace(
    'NOTIFYICONDATAA nid = { 0 };\n    nid.cbSize = sizeof(NOTIFYICONDATAA);\n    nid.hWnd = hwnd;\n    nid.uID = 1001;\n    nid.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;\n    nid.uCallbackMessage = WM_USER + 1;\n    nid.hIcon = CreateOnyxLogoIcon();\n    strcpy_s(nid.szTip, "Onyx Guard Anti-Hack (Active)");\n\n    Shell_NotifyIconA(NIM_ADD, &nid);',
    `g_nid.cbSize = sizeof(NOTIFYICONDATAA);
    g_nid.hWnd = hwnd;
    g_nid.uID = 1001;
    g_nid.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;
    g_nid.uCallbackMessage = WM_USER + 1;
    g_nid.hIcon = CreateOnyxLogoIcon();
    strcpy_s(g_nid.szTip, "Onyx Guard Anti-Hack (Active)");

    Shell_NotifyIconA(NIM_ADD, &g_nid);
    g_trayIconAdded = true;`
);

code = code.replace(
    'Shell_NotifyIconA(NIM_DELETE, &nid);\n    DestroyIcon(nid.hIcon);',
    'Shell_NotifyIconA(NIM_DELETE, &g_nid);\n    DestroyIcon(g_nid.hIcon);\n    g_trayIconAdded = false;'
);

// Now, update PerformHandshake
const oldMessageBox = `                    std::string msg = responseString.substr(msgStart, msgEnd - msgStart);
                    MessageBoxA(NULL, msg.c_str(), "Onyx Guard - Status", MB_OK | MB_ICONINFORMATION);`;

const newBalloon = `                    std::string msg = responseString.substr(msgStart, msgEnd - msgStart);
                    if (g_trayIconAdded) {
                        g_nid.uFlags = NIF_INFO;
                        strcpy_s(g_nid.szInfo, msg.c_str());
                        strcpy_s(g_nid.szInfoTitle, "Onyx Guard");
                        g_nid.dwInfoFlags = NIIF_INFO;
                        Shell_NotifyIconA(NIM_MODIFY, &g_nid);
                    }`;

code = code.replace(oldMessageBox, newBalloon);

fs.writeFileSync('src/App.tsx', code);
