const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add global variable
code = code.replace(
  /std::string g_startupMessage = "";/,
  'std::string g_startupMessage = "";\ndouble g_speedhackSensitivity = 1.80;'
);

// 2. Parse speedhackSensitivity from API response
const parseBlock = `
                    if (msgEnd != std::string::npos) {
                        g_startupMessage = responseString.substr(msgStart, msgEnd - msgStart);
                    }
                }
                size_t sensStart = responseString.find("\\"speedhackSensitivity\\":\\"");
                if (sensStart != std::string::npos) {
                    sensStart += 24; // length of "speedhackSensitivity":"
                    size_t sensEnd = responseString.find("\\"", sensStart);
                    if (sensEnd != std::string::npos) {
                        try {
                            g_speedhackSensitivity = std::stod(responseString.substr(sensStart, sensEnd - sensStart));
                        } catch (...) {}
                    }
                }`;

code = code.replace(
  /                    if \(msgEnd != std::string::npos\) \{\s*g_startupMessage = responseString\.substr\(msgStart, msgEnd - msgStart\);\s*\}\s*\}/g,
  parseBlock
);

// 3. Update DetectSpeedHack
code = code.replace(
  /if \(qpcDuration > 0 && \(tickDuration \/ qpcDuration\) > 1\.80\) \{/g,
  `if (qpcDuration > 0 && (tickDuration / qpcDuration) > g_speedhackSensitivity) {`
);

fs.writeFileSync('src/App.tsx', code);
