const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "buffer[bytesRead] = '\\0';",
  "buffer[bytesRead] = '\\\\0';"
);

fs.writeFileSync('src/App.tsx', code);
