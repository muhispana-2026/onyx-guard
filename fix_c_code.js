const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/DWORD err = GetLastError\(\);\s*std::stringstream ss;\s*ss << "HttpOpenRequest Error: " << err;\s*g_startupMessage = ss\.str\(\);/, 'DWORD err = GetLastError();\n            std::stringstream ss;\n            ss << "HttpOpenRequest Error: " << err;\n            g_startupMessage = ss.str();');
console.log(code.includes('HttpOpenRequest Error:'));
