const fs = require('fs');

const code = fs.readFileSync('src/App.tsx', 'utf8');

const js = `
const clientVersion = '1.04d';
const usePch = false;
const SECRET_TOKEN = 'secret';
const AUTH_SERVER_URL = 'http://127.0.0.1:3000';
const enablePayloadEncryption = false;
const enableProcessBinding = false;
const enableAntiDebug = true;
const enableFileCheck = true;
const clientFiles = [{path: 'main.exe', expectedHash: 'abcd'}];
const enableAntiMacro = true;
const blacklistedPrograms = ['cheatengine.exe'];
const actionOnFailure = 'MSG_BOX'; // MSG_BOX test
const enableMemoryScanner = true;
const dumps = [{rawRule: 'type 0x0 0x12 hack', type: 'type', addr: '0', bytes: '12', name: 'hack'}];
const enableTestModeBlock = false;
const enableWatchdog = false;
const enableApiHookDetection = false;
const enableHeuristics = false;
const enableMultiClientBlock = false;
const enableDllScanner = false;
const enableHwidCheck = false;
const activeProjectId = 'id';
const serverUrl = 'url';
const securityToken = 'token';
const enableRealtimeMonitor = false;
const enableSplashScreen = true;
const multiClientLimit = 1;

function useMemo(fn) { return fn(); }

` + code.substring(code.indexOf('const cppCode = useMemo(() => {'), code.indexOf('  }, [serverUrl, securityToken, clientVersion, enableFileCheck, actionOnFailure')) + "  });\n" + `

const fs = require('fs');
fs.writeFileSync('output_final.cpp', cppCode);
`;

fs.writeFileSync('runner_final.cjs', js);
