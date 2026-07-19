const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `void ShowSplashScreen() {`;
const target2 = `        // Start safety background thread`;

// We need to see where IntegrityCheckThread is launched and how it relates to ShowSplashScreen.

