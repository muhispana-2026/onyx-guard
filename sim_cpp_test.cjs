const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const m = code.match(/const cppCode = useMemo\(\(\) => \{[\s\S]*?return `([\s\S]*?)`;\n  \}, \[/);
let cppBody = m[1];

// Evaluate template vars
cppBody = cppBody.replace(/\$\{([^\}]+)\}/g, (match, p1) => {
    if (p1.includes("filesArrayContent")) return '{ "main.exe", "dummy" }';
    if (p1.includes("blacklistedArrayContent")) return '"Cheat Engine"';
    if (p1.includes("memorySignaturesContent")) return '{0, 0, {0}, 0, "Dummy"}';
    if (p1.includes("actionOnFailure")) return 'Process.GetCurrentProcess().Kill();';
    if (p1.includes("multiClientLimit")) return 'CreateSemaphoreA(NULL, 3, 3, "Global\\\\MuOnlineSecureSemaphore");';
    return '';
});

fs.writeFileSync('test_handshake.cpp', cppBody);
console.log("Simulated");
