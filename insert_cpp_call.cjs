const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const calls = `\${enableApiHookDetection ? \`        if(ScanForApiHooks()) {
            HandleFailure("API HOOK DETECTED:\\nCritical system functions have been modified.");
        }\` : ''}
\${enableHeuristics ? \`        if(ScanHeuristicWindows()) {
            HandleFailure("SUSPICIOUS WINDOW DETECTED:\\nHeuristic scan detected a hack-like window running.");
        }\` : ''}`;

code = code.replace(
  /\${enableMemoryScanner \? \`        if\(ScanMemorySignatures\(\)\) \{\n            HandleFailure\("MEMORY TAMPERING DETECTED:\\\\nKnown cheat signatures found in memory\."\);\n        \}\` : ''}/,
  `\${enableMemoryScanner ? \`        if(ScanMemorySignatures()) {
            HandleFailure("MEMORY TAMPERING DETECTED:\\\\nKnown cheat signatures found in memory.");
        }\` : ''}
${calls}`
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated with calls.');
