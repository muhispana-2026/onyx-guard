const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The file contains literal backslash r backslash n.
// So we match /\\\\r\\\\n/g.

code = code.replace(/Content-Type: application\/json\\\\r\\\\n/g, 'Content-Type: application/json\\\\\\\\r\\\\\\\\n');
code = code.replace(/X-Payload-Encrypted: true\\\\r\\\\n/g, 'X-Payload-Encrypted: true\\\\\\\\r\\\\\\\\n');

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed!");
