const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetCheck = `        // Simple JSON response check (Looking for "success":true)
        if (responseString.find("\\"success\\":true") != std::string::npos) {
            isAuthorized = true;
        }`;

const replacementCheck = `        // Simple JSON response check
        if (responseString.find("\\"success\\":true") != std::string::npos || 
            responseString.find("\\"success\\": true") != std::string::npos) {
            isAuthorized = true;
        }`;

code = code.replace(targetCheck, replacementCheck);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched C++ JSON check!");
