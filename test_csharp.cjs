const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');
const lines = code.split('\n');
console.log("Raw line: ", lines[1812]);
const line = lines[1812];
// Let's execute this string
const result = eval('`' + line.trim() + '`');
console.log("Evaluated: ", result);
