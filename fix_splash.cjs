const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const splashFunc = "${enableSplashScreen ? `void ShowSplashScreen() {\\n    MessageBoxA(NULL, \"Onyx Guard Anti-Hack Loaded successfully. Checking client integrity...\", \"Onyx Guard - Startup\", MB_OK | MB_ICONINFORMATION);\\n}\\n` : ''}";

code = code.replace(/bool ValidateClientState\(const std::string& username\) \{/, splashFunc + '\nbool ValidateClientState(const std::string& username) {\n');

code = code.replace(/    try \{/, '    try {\n${enableSplashScreen ? `        ShowSplashScreen();\\n` : ``}');

fs.writeFileSync('src/App.tsx', code);
