const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<< "\\\\\\\"secretToken\\\\\\\": \\\\\\\"" << JsonEscape\(SECRET_TOKEN\) << "\\\\\\\"\\n(\s*)<< "\\\\\\\"fileModified\\\\\\\":/g, 
  '<< "\\\\\\\"secretToken\\\\\\\": \\\\\\\"" << JsonEscape(SECRET_TOKEN) << "\\\\\\\",\\n$1<< \\\"\\\\\\\"fileModified\\\\\\\":');

fs.writeFileSync('src/App.tsx', code);
