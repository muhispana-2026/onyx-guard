const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'UUID uuid;',
  'GUID uuid;'
);

code = code.replace(
  '#pragma comment(lib, "user32.lib")',
  '#pragma comment(lib, "user32.lib")\n#pragma comment(lib, "ole32.lib")'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched UUID to GUID!");
