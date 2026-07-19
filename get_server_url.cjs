const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const m = code.match(/const serverUrl = ([^;]+);/);
console.log(m ? m[1] : "Not found");
