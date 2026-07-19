const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

let startIndex = code.indexOf('const cppCode = useMemo(() => {');
let startTemplate = code.indexOf('return `', startIndex);
let endTemplate = code.indexOf('`;\n  }, [', startTemplate);

let template = code.substring(startTemplate + 8, endTemplate);

const serverUrl = 'http://localhost';
const securityToken = 'TOKEN';
const clientVersion = '1.0';
const enableFileCheck = true;
const enableRealtimeMonitor = true;
const enableMultiClientBlock = true;
const multiClientLimit = 3;
const actionOnFailure = 'EXIT';
const enableAntiMacro = true;
const blacklistedPrograms = ['Cheat Engine'];
const clientFiles = [];
const enableDllScanner = true;
const enableMemoryScanner = true;
const enableSplashScreen = true;
const enablePayloadEncryption = true;
const enableAntiDebug = true;
const enableProcessBinding = true;
const usePch = true;
const enableApiHookDetection = true;
const enableHeuristics = true;
const enableWatchdog = true;

const fn = new Function(
  'serverUrl, securityToken, clientVersion, enableFileCheck, enableRealtimeMonitor, enableMultiClientBlock, multiClientLimit, actionOnFailure, enableAntiMacro, blacklistedPrograms, clientFiles, enableDllScanner, enableMemoryScanner, enableSplashScreen, enablePayloadEncryption, enableAntiDebug, enableProcessBinding, usePch, enableApiHookDetection, enableHeuristics, enableWatchdog',
  'return `' + template + '`;'
);

const output = fn(serverUrl, securityToken, clientVersion, enableFileCheck, enableRealtimeMonitor, enableMultiClientBlock, multiClientLimit, actionOnFailure, enableAntiMacro, blacklistedPrograms, clientFiles, enableDllScanner, enableMemoryScanner, enableSplashScreen, enablePayloadEncryption, enableAntiDebug, enableProcessBinding, usePch, enableApiHookDetection, enableHeuristics, enableWatchdog);

fs.writeFileSync('generated.cpp', output);
console.log('generated.cpp written');
