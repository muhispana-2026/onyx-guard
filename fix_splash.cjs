const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `    if (!status) {
        std::string err = g_startupMessage.empty() ? "CRITICAL SECURITY ERROR: Your client files or Hardware ID are unauthorized." : g_startupMessage;
        HandleFailure(err);
        return 1;
    }`;

const repl1 = `    if (!status) {
        Sleep(2500); // Allow splash screen progress bar to reach 100% visually
        std::string err = g_startupMessage.empty() ? "CRITICAL SECURITY ERROR: Your client files or Hardware ID are unauthorized." : g_startupMessage;
        HandleFailure(err);
        return 1;
    }`;

code = code.replace(target1, repl1);
fs.writeFileSync('src/App.tsx', code);
console.log("Fixed!");
