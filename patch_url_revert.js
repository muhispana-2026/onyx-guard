const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetUrl = /const \[serverUrl, setServerUrl\] = useState\(typeof window !== 'undefined' \? window\.location\.origin\.replace\('ais-dev', 'ais-pre'\) \+ '\/api\/auth' : 'http:\/\/127\.0\.0\.1:3000\/api\/auth'\);/g;
const replacementUrl = "const [serverUrl, setServerUrl] = useState('https://onyx-guard.onrender.com/api/auth');";

code = code.replace(targetUrl, replacementUrl);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched serverUrl back!");
