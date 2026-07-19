const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const advancedFeatures = `
\${enableApiHookDetection ? \`// Advanced API Hooking Detection
bool CheckApiHook(LPCSTR moduleName, LPCSTR procName) {
    HMODULE hMod = GetModuleHandleA(moduleName);
    if (!hMod) return false;
    FARPROC procAddr = GetProcAddress(hMod, procName);
    if (!procAddr) return false;
    
    BYTE* pBytes = (BYTE*)procAddr;
    // Check for common hooking instructions: JMP (0xE9), Short JMP (0xEB), CALL (0xE8)
    if (pBytes[0] == 0xE9 || pBytes[0] == 0xEB || pBytes[0] == 0xE8) {
        return true; 
    }
    return false;
}

bool ScanForApiHooks() {
    if (CheckApiHook("ws2_32.dll", "send") || 
        CheckApiHook("ws2_32.dll", "recv") ||
        CheckApiHook("kernel32.dll", "WriteProcessMemory") || 
        CheckApiHook("kernel32.dll", "ReadProcessMemory")) {
        return true;
    }
    return false;
}\` : ''}

\${enableHeuristics ? \`// Heuristic Window Scanning
bool ScanHeuristicWindows() {
    bool found = false;
    EnumWindows([](HWND hwnd, LPARAM lParam) -> BOOL {
        if (IsWindowVisible(hwnd)) {
            char title[256];
            GetWindowTextA(hwnd, title, sizeof(title));
            std::string sTitle(title);
            for(size_t i = 0; i < sTitle.length(); ++i) sTitle[i] = tolower(sTitle[i]);
            
            // Check for common suspicious keywords
            if (sTitle.length() > 0 && (
                sTitle.find("hack") != std::string::npos ||
                sTitle.find("cheat") != std::string::npos ||
                sTitle.find("inject") != std::string::npos ||
                sTitle.find("speedhack") != std::string::npos ||
                sTitle.find("bypass") != std::string::npos
                )) {
                
                // Exclude some common false positives like web browsers searching for these terms
                if (sTitle.find("google") == std::string::npos && 
                    sTitle.find("chrome") == std::string::npos && 
                    sTitle.find("firefox") == std::string::npos &&
                    sTitle.find("edge") == std::string::npos) {
                    
                    *((bool*)lParam) = true;
                    return FALSE; // Stop enumerating
                }
            }
        }
        return TRUE;
    }, (LPARAM)&found);
    return found;
}\` : ''}
`;

code = code.replace(
  /\` : ''}\n\/\/ Simple MD5 file hashing/,
  `\` : ''}\n${advancedFeatures}\n// Simple MD5 file hashing`
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated with C++ logic.');
