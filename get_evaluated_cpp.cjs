const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const m = code.match(/const cppCode = useMemo\(\(\) => \{\n    return `([\s\S]*?)`;\n  \}, \[/);

if (!m) {
    console.log("Not found with exactly this pattern. Let's try more flexible.");
    const m2 = code.match(/const cppCode = useMemo\(\(\) => \{[\s\S]*?return `([\s\S]*?)`;\n  \}, \[/);
    if (!m2) throw new Error("Could not find cppCode");
    code = m2[1];
} else {
    code = m[1];
}

// Now let's simulate evaluation
code = code.replace(/\$\{([^\}]+)\}/g, (match, p1) => {
    if (p1.includes("enablePayloadEncryption")) return `    // Encrypting Payload before sending
    payload = EncryptPayload(payload);
    // Add custom header to indicate encrypted payload
    headers += "X-Payload-Encrypted: true\\\\r\\\\n";
`;
    if (p1.includes("enableTestModeBlock")) {
        if (p1.includes("IsTestModeEnabled")) return `// Test Mode Check
    if (IsTestModeEnabled()) {
        HandleFailure("SECURITY BREACH: Windows is running in Test Mode (Testsigning). Please disable it to play.");
        return 1;
    }`;
        return `// Windows Test Mode Detection
bool IsTestModeEnabled() {
    HKEY hKey;
    if (RegOpenKeyExA(HKEY_LOCAL_MACHINE, "SYSTEM\\\\CurrentControlSet\\\\Control", 0, KEY_READ, &hKey) == ERROR_SUCCESS) {
        char value[256];
        DWORD size = sizeof(value);
        if (RegQueryValueExA(hKey, "SystemStartOptions", NULL, NULL, (LPBYTE)value, &size) == ERROR_SUCCESS) {
            std::string startOptions(value);
            for(size_t i=0; i<startOptions.length(); ++i) startOptions[i] = toupper(startOptions[i]);
            if (startOptions.find("TESTSIGNING") != std::string::npos) {
                RegCloseKey(hKey);
                return true;
            }
        }
        RegCloseKey(hKey);
    }
    return false;
}`;
    }
    if (p1.includes("filesArrayContent")) return '{ "main.exe", "dummy" }';
    if (p1.includes("blacklistedArrayContent")) return '"Cheat Engine"';
    if (p1.includes("memorySignaturesContent")) return '{0, 0, {0}, 0, "Dummy"}';
    if (p1.includes("actionOnFailure")) return 'Process.GetCurrentProcess().Kill();';
    if (p1.includes("multiClientLimit")) return 'CreateSemaphoreA(NULL, 3, 3, "Global\\\\MuOnlineSecureSemaphore");';
    if (p1.includes("username")) return '"User"';
    if (p1.includes("hwid")) return '"HWID"';
    return '';
});

fs.writeFileSync('evaluated_cpp.cpp', code);
console.log("Done");
