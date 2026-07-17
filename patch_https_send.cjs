const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const idx = code.indexOf('// Simple JSON response check (Looking for "success":true)');
console.log(code.substring(idx, idx + 300));
