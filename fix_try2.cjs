const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace('    try {\n${enableSplashScreen ? `        ShowSplashScreen();\\n` : ``}', '    try {');

fs.writeFileSync('src/App.tsx', code);
