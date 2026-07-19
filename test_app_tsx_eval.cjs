const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const m = code.match(/const cppCode = useMemo\(\(\) => \{[\s\S]*?return `([\s\S]*?)`;\n  \}, \[/);
let cppBody = m[1];

// We need to evaluate the string just like React does.
// `cppBody` is the raw string literal source code (without the outer backticks).
// Let's eval it. We just need to define the variables used in it.

const enablePayloadEncryption = true;
const username = "User";
const hwid = "HWID";
const CLIENT_VERSION = "1.0";
const SECRET_TOKEN = "TOKEN";
const modifiedFile = "none";
const enableTestModeBlock = true;
const enableFileCheck = true;
const enableAntiMacro = true;
const enableAntiDebug = true;
const enableDllScanner = true;
const enableMemoryScanner = true;
const enableSplashScreen = true;
const enableProcessBinding = true;
const enableApiHookDetection = true;
const enableHeuristics = true;
const enableWatchdog = true;
const actionOnFailure = "MSG_BOX";
const serverUrl = "http://localhost:3000";
const securityToken = "TOKEN";
const clientVersion = "1.0";
const usePch = true;
const multiClientLimit = 3;
const enableMultiClientBlock = true;
const filesArrayContent = "{}";
const blacklistedArrayContent = "{}";
const memorySignaturesContent = "{}";

const result = eval('`' + cppBody + '`');

const lines = result.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("application/json") || lines[i].includes("X-Payload-Encrypted")) {
        console.log("LINE", i, ":", JSON.stringify(lines[i]));
    }
}
