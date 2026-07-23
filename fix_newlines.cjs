const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/\\n                  \{\/\* Advanced Security \*\/\}/g, '\n                  {/* Advanced Security */}');
fs.writeFileSync('src/App.tsx', code);
