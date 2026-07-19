const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const target = `            if (!status)
            {
                string err = string.IsNullOrEmpty(g_startupMessage) ? "CRITICAL SECURITY ERROR: Your client files or Hardware ID are unauthorized." : g_startupMessage;
                HandleFailure(err);
                return;
            }`;
const repl = `            if (!status)
            {
                Thread.Sleep(4500); // Allow splash screen to reach 100%
                string err = string.IsNullOrEmpty(g_startupMessage) ? "CRITICAL SECURITY ERROR: Your client files or Hardware ID are unauthorized." : g_startupMessage;
                HandleFailure(err);
                return;
            }`;
code = code.replace(target, repl);
fs.writeFileSync('src/App.tsx', code);
console.log("Fixed C#!");
