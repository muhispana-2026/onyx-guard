const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace('BYTE signature[32];', 'BYTE signature[128];');
code = code.replace('BYTE buffer[32];', 'BYTE buffer[128];');
// Let's also make sure there are no other [32] arrays that need to be [128]
code = code.replace(/BYTE signature\[32\]/g, 'BYTE signature[128]');
code = code.replace(/BYTE buffer\[32\]/g, 'BYTE buffer[128]');

fs.writeFileSync('src/App.tsx', code);
