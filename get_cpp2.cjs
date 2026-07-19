const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const m = code.match(/return `\/\/ ============================================================================\n\/\/  ONYX GUARD ANTI-HACK([\s\S]*?)`;\n  }, \[serverUrl/);
const cppBody = '// ============================================================================\n//  ONYX GUARD ANTI-HACK' + m[1];

const securityToken = "TEST_TOKEN";
const clientVersion = "1.04d";
const filesArrayContent = '    { "main.exe", "abcd" }';
const blacklistedArrayContent = '    "Cheat Engine"';
const memorySignaturesContent = '    { 0, 0x0, {0}, 0, "Dummy" }';
const actionOnFailure = 'MSG_BOX';
const enableRealtimeMonitor = true;
const enableProcessBinding = true;
const enableAntiDebug = true;
const enableFileCheck = true;
const enableAntiMacro = true;
const enableDllScanner = true;
const enableMemoryScanner = true;
const enableApiHookDetection = true;
const enableHeuristics = true;
const enableMultiClientBlock = true;
const enableSplashScreen = true;
const usePch = true;
const multiClientLimit = 3;
const clientFiles = [];
const enablePayloadEncryption = true;
const activeProjectId = '123';
const serverUrl = 'http://localhost';

const evalStr = '\`' + cppBody + '\`';
const generatedCpp = eval(evalStr);
fs.writeFileSync('test3.cpp', generatedCpp);
