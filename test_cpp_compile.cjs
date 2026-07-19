const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const m = code.match(/const cppCode = useMemo\(\(\) => \{[\s\S]*?return `([\s\S]*?)`;\n  \}, \[/);
const template = m[1];
const rendered = eval('`' + template + '`');
fs.writeFileSync('test_cpp_compile.cpp', rendered);
console.log("Rendered!");
