const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/Content-Type: application\/json\\\\\\\\r\\\\\\\\n/g, 'Content-Type: application/json\\\\r\\\\n');
code = code.replace(/X-Payload-Encrypted: true\\\\\\\\r\\\\\\\\n/g, 'X-Payload-Encrypted: true\\\\r\\\\n');

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed C++ headers!");
