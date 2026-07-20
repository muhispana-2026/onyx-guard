const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove from the first occurrence (loginWithGoogle)
code = code.replace(/    try \{\n\$\\{enableSplashScreen \? \`        ShowSplashScreen\(\);\\n\` : \`\`\}/, '    try {');

// Now add it properly inside ValidateClientState
const searchStr = `        bool isAllowed = SendValidationHandshake(username, hwid, invalidFile);`;
const replaceStr = `\\$\\{enableSplashScreen ? \\\`        ShowSplashScreen();\\n\\\` : ''}        bool isAllowed = SendValidationHandshake(username, hwid, invalidFile);`;

code = code.replace(searchStr, replaceStr);

fs.writeFileSync('src/App.tsx', code);
