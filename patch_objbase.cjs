const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '#include <windows.h>',
  '#include <windows.h>\\n#include <objbase.h>'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched objbase!");
