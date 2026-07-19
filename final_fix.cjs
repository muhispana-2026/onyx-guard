const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// I need to replace single backslash r with double backslash r.
// The file currently has: std::string headers = "Content-Type: application/json\r\n";
// (where \r and \n are literal slash-r and slash-n).

code = code.replace(/Content-Type: application\/json\\r\\n/g, 'Content-Type: application/json\\\\\\\\r\\\\\\\\n');
code = code.replace(/X-Payload-Encrypted: true\\r\\n/g, 'X-Payload-Encrypted: true\\\\\\\\r\\\\\\\\n');

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed!");
