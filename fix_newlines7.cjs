const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We are literally looking for \r\n inside the template string.
// Let's replace any `\r\n` with `\\\\r\\\\n`.
// But wait, the file has a literal backslash followed by 'r', followed by backslash followed by 'n'.
// So:
code = code.replace(/Content-Type: application\/json\\r\\n/g, 'Content-Type: application/json\\\\\\\\r\\\\\\\\n');
code = code.replace(/X-Payload-Encrypted: true\\r\\n/g, 'X-Payload-Encrypted: true\\\\\\\\r\\\\\\\\n');

fs.writeFileSync('src/App.tsx', code);
console.log("Replaced with 4 backslashes!");
