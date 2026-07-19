const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const m = code.match(/const cppCode = useMemo\(\(\) => \{[\s\S]*?return `([\s\S]*?)`;\n  \}, \[/);
if (!m) throw new Error("Could not find cppCode");
const template = m[1];
fs.writeFileSync('debug_handshake.txt', template);
console.log("Wrote debug_handshake.txt");
