const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

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

// extract the cppCode function body
const cppStart = code.indexOf('const cppCode = useMemo(() => {\\n    return \`');
const cppEnd = code.indexOf('\`;\\n  }, [serverUrl');
const cppBody = code.substring(cppStart + 43, cppEnd);
const evalStr = '\`' + cppBody + '\`';

const generatedCpp = eval(evalStr);
fs.writeFileSync('test2.cpp', generatedCpp);
