const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const globalNidCodeOld = `// Global tray icon data so we can update it from other threads
NOTIFYICONDATAA g_nid = { 0 };
bool g_trayIconAdded = false;`;

const globalNidCodeNew = `// Global tray icon data so we can update it from other threads
NOTIFYICONDATAA g_nid = { 0 };
bool g_trayIconAdded = false;
std::string g_startupMessage = "";`;

code = code.replace(globalNidCodeOld, globalNidCodeNew);

const oldHandshakeBalloon = `                    if (g_trayIconAdded) {
                        g_nid.uFlags = NIF_INFO;
                        strcpy_s(g_nid.szInfo, msg.c_str());
                        strcpy_s(g_nid.szInfoTitle, "Onyx Guard");
                        g_nid.dwInfoFlags = NIIF_INFO;
                        Shell_NotifyIconA(NIM_MODIFY, &g_nid);
                    }`;

const newHandshakeBalloon = `                    g_startupMessage = msg;`;

code = code.replace(oldHandshakeBalloon, newHandshakeBalloon);

const oldTrayIconAdd = `    Shell_NotifyIconA(NIM_ADD, &g_nid);
    g_trayIconAdded = true;`;

const newTrayIconAdd = `    Shell_NotifyIconA(NIM_ADD, &g_nid);
    g_trayIconAdded = true;

    if (!g_startupMessage.empty()) {
        g_nid.uFlags = NIF_INFO;
        strcpy_s(g_nid.szInfo, g_startupMessage.c_str());
        strcpy_s(g_nid.szInfoTitle, "Onyx Guard");
        g_nid.dwInfoFlags = NIIF_INFO;
        Shell_NotifyIconA(NIM_MODIFY, &g_nid);
    }`;

code = code.replace(oldTrayIconAdd, newTrayIconAdd);

fs.writeFileSync('src/App.tsx', code);
