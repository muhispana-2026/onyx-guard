const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetDllMain = `BOOL APIENTRY DllMain(HMODULE hModule, DWORD ul_reason_for_call, LPVOID lpReserved) {
    switch (ul_reason_for_call) {
    case DLL_PROCESS_ATTACH:
        DisableThreadLibraryCalls(hModule);
        
        ${enableAntiDebug ? \`// 1. Instantly check for debuggers
        if (IsDebuggerPresent()) {
            ExitProcess(0);
        }\` : '// Anti-Debug checks disabled'}
        
        // 2. Start Security Checks in a new Thread to not block game launch
        CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)SecurityThread, hModule, 0, NULL);
        break;`;

const replacementDllMain = `BOOL APIENTRY DllMain(HMODULE hModule, DWORD ul_reason_for_call, LPVOID lpReserved) {
    switch (ul_reason_for_call) {
    case DLL_PROCESS_ATTACH:
        DisableThreadLibraryCalls(hModule);
        
        ${enableAntiDebug ? \`// 1. Instantly check for debuggers
        if (IsDebuggerPresent()) {
            MessageBoxA(NULL, "Debugger detected! Exiting.", "Onyx Guard", MB_OK);
            ExitProcess(0);
        }\` : '// Anti-Debug checks disabled'}
        
        // 2. Start Security Checks in a new Thread to not block game launch
        CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)SecurityThread, hModule, 0, NULL);
        break;`;

code = code.replace(targetDllMain, replacementDllMain);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched DllMain");
