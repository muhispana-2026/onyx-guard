const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    '    headers += "X-Payload-Encrypted: true\\\\r\\\\n";',
    '    headers += "X-Payload-Encrypted: true\\r\\n";'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed X-Payload-Encrypted newline!");
