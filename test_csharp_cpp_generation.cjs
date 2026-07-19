const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const m = code.match(/const cppCode = useMemo\(\(\) => \{[\s\S]*?return `([\s\S]*?)`;\n  \}, \[/);
if (!m) throw new Error("Could not find cppCode");
code = m[1];
fs.writeFileSync('generated_cpp_template.txt', code);
console.log("Wrote C++ template");
