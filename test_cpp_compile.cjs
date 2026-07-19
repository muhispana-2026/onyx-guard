const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /void ShowSplashScreen\(\) \{[\s\S]*?UnregisterClassA\("OnyxSplashClass", wc\.hInstance\);\n    \}\n\}/;

let match = code.match(regex);
if (match) {
    let replaced = match[0].replace('void ShowSplashScreen() {', 'DWORD WINAPI SplashThread(LPVOID lpParam) {');
    replaced += '\nvoid ShowSplashScreen() {\n    CreateThread(NULL, 0, SplashThread, NULL, 0, NULL);\n}';
    code = code.replace(match[0], replaced);
    fs.writeFileSync('src/App.tsx', code);
    console.log('Fixed splash screen!');
} else {
    console.log('Not found');
}
