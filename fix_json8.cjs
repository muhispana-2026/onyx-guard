const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<< "\\\\\\\"secretToken\\\\\\\": \\\\\\\"" << JsonEscape\(SECRET_TOKEN\) << "\\\\\\\",\\n(\s*)<< "\\}";/g, 
  '<< "\\\\\\\"secretToken\\\\\\\": \\\\\\\"" << JsonEscape(SECRET_TOKEN) << "\\\\\\\"\\n$1<< \\"}\\";');

fs.writeFileSync('src/App.tsx', code);
