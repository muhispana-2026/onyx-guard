const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix Simulation to send secretToken
code = code.replace(
  /body: JSON\.stringify\(\{([\s\n]*)username: simUsername,([\s\n]*)hwid: simHwid,([\s\n]*)ip: simIp,([\s\n]*)clientVersion: simClientVersion,([\s\n]*)fileModified: simModifiedFile,?/g,
  `body: JSON.stringify({\n            username: simUsername,\n            hwid: simHwid,\n            ip: simIp,\n            clientVersion: simClientVersion,\n            fileModified: simModifiedFile,\n            secretToken: securityToken,`
);

// Fix C++ HandleFailure deadlock
code = code.replace(
  /void HandleFailure\(const std::string& message\) \{\s*SuspendAllOtherThreads\(\);/g,
  `void HandleFailure(const std::string& message) {` // removed SuspendAllOtherThreads
);

code = code.replace(
  /ReportViolation\(message\);\s*EnumWindows/g,
  `ReportViolation(message);\n    SuspendAllOtherThreads();\n    EnumWindows`
);

// Wait, if SuspendAllOtherThreads is called before EnumWindows or MessageBox, it will STILL deadlock!
code = code.replace(
  /SuspendAllOtherThreads\(\);\s*EnumWindows/g,
  `EnumWindows` // completely remove SuspendAllOtherThreads to avoid deadlocks.
);

fs.writeFileSync('src/App.tsx', code);
