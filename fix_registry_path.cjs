const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    /"SYSTEM\\\\CurrentControlSet\\\\Control"/g,
    '"SYSTEM\\\\\\\\CurrentControlSet\\\\\\\\Control"'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed registry path!");
