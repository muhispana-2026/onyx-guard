const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state variable
if (!code.includes('const [enableRealtimeMonitor')) {
  code = code.replace(
    /const \[enableFileCheck, setEnableFileCheck\] = useState\(true\);/,
    `const [enableFileCheck, setEnableFileCheck] = useState(true);\n  const [enableRealtimeMonitor, setEnableRealtimeMonitor] = useState(false);`
  );
}

// 2. Add to API config fetch
if (!code.includes('enableRealtimeMonitor,')) {
  code = code.replace(/enableFileCheck, enableMultiClientBlock/g, 'enableFileCheck, enableRealtimeMonitor, enableMultiClientBlock');
}
if (!code.includes('setEnableRealtimeMonitor(data.enableRealtimeMonitor)')) {
  code = code.replace(
    /if \(data\.enableFileCheck !== undefined\) setEnableFileCheck\(data\.enableFileCheck\);/,
    `if (data.enableFileCheck !== undefined) setEnableFileCheck(data.enableFileCheck);\n        if (data.enableRealtimeMonitor !== undefined) setEnableRealtimeMonitor(data.enableRealtimeMonitor);`
  );
}

// 3. Add to useMemo dependencies
code = code.replace(
    /enableFileCheck, enableMultiClientBlock/g,
    'enableFileCheck, enableRealtimeMonitor, enableMultiClientBlock'
);

// 4. Add the Splash screen C++ code (wait I already did that, need to add Realtime Monitor C++ code)
const cppRealtimeCode = `\${enableRealtimeMonitor ? \`// Real-time File System Watcher Thread
DWORD WINAPI DirectoryMonitorThread(LPVOID lpParam) {
    HANDLE hDir = CreateFileA(
        ".", // Current directory (game folder)
        FILE_LIST_DIRECTORY,
        FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE,
        NULL,
        OPEN_EXISTING,
        FILE_FLAG_BACKUP_SEMANTICS,
        NULL
    );

    if (hDir == INVALID_HANDLE_VALUE) return 1;

    char buffer[1024];
    DWORD bytesReturned;
    while (true) {
        if (ReadDirectoryChangesW(
            hDir,
            &buffer,
            sizeof(buffer),
            TRUE, // Watch subtree
            FILE_NOTIFY_CHANGE_FILE_NAME | FILE_NOTIFY_CHANGE_SIZE | FILE_NOTIFY_CHANGE_LAST_WRITE,
            &bytesReturned,
            NULL,
            NULL
        )) {
            // If any critical file was modified while the game is running, terminate it.
            // For simplicity, we trigger on any modification in this example.
            HandleFailure("REAL-TIME INTEGRITY VIOLATION:\\nGame files were modified while running.");
        }
    }
    CloseHandle(hDir);
    return 0;
}
\` : ''}`;

if (!code.includes('DirectoryMonitorThread')) {
  code = code.replace(
    /DWORD WINAPI IntegrityCheckThread\(LPVOID lpParam\) \{/,
    `${cppRealtimeCode}\n\nDWORD WINAPI IntegrityCheckThread(LPVOID lpParam) {`
  );
}

// Call DirectoryMonitorThread inside IntegrityCheckThread
if (!code.includes('CreateThread(NULL, 0, DirectoryMonitorThread')) {
  code = code.replace(
    /DWORD WINAPI IntegrityCheckThread\(LPVOID lpParam\) \{\n    \$\{enableSplashScreen \? 'ShowSplashScreen\(\);' : ''\}\n    Sleep\(500\); \/\/ Wait for host window to complete loading/,
    `DWORD WINAPI IntegrityCheckThread(LPVOID lpParam) {\n    \${enableSplashScreen ? 'ShowSplashScreen();' : ''}\n    \${enableRealtimeMonitor ? 'CreateThread(NULL, 0, DirectoryMonitorThread, NULL, 0, NULL);' : ''}\n    Sleep(500); // Wait for host window to complete loading`
  );
}

// 5. Add checkbox to UI
const uiCheckbox = `
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                    <input 
                      type="checkbox" 
                      checked={enableRealtimeMonitor}
                      onChange={(e) => setEnableRealtimeMonitor(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span>{language === 'es' ? 'Monitoreo de Archivos en Tiempo Real (OS Watcher)' : 'Real-time File Monitor (OS Watcher)'}</span>
                  </label>
`;

if (!code.includes('Monitoreo de Archivos en Tiempo Real')) {
  code = code.replace(
    /<input \n                      type="checkbox" \n                      checked=\{enableFileCheck\}\n                      onChange=\{\(e\) => setEnableFileCheck\(e\.target\.checked\)\}\n                      className="accent-amber-500"\n                    \/>\n                    <span>\{language === 'es' \? 'Verificar Integridad de Archivos' : 'Verify File Integrity'\}<\/span>\n                  <\/label>/,
    `<input \n                      type="checkbox" \n                      checked={enableFileCheck}\n                      onChange={(e) => setEnableFileCheck(e.target.checked)}\n                      className="accent-amber-500"\n                    />\n                    <span>{language === 'es' ? 'Verificar Integridad de Archivos (Checksum)' : 'Verify File Integrity (Checksum)'}</span>\n                  </label>${uiCheckbox}`
  );
}

fs.writeFileSync('src/App.tsx', code);
