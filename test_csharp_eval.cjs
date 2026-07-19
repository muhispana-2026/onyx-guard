const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const m = code.match(/const cppCode = useMemo\(\(\) => \{[\s\S]*?return `([\s\S]*?)`;\n  \}, \[/);
let cppBody = m[1];

let enablePayloadEncryption = true;
const val = eval("`" + cppBody + "`");
console.log(val.includes("Content-Type: application/json\r\n"));
