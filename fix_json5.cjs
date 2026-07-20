const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<< "\\\\\\\"secretToken\\\\\\\": \\\\\\\"" << JsonEscape\(SECRET_TOKEN\) << "\\\\\\\",\\n(\s*)<< "\\\\\\\"\\}/g, 
  '<< "\\\\\\\"secretToken\\\\\\\": \\\\\\\"" << JsonEscape(SECRET_TOKEN) << "\\\\\\\"\\n$1<< \\"}\\";');

// Simpler way:
code = code.replace(/<< "\\\\\\\"secretToken\\\\\\\": \\\\\\\"" << JsonEscape\(SECRET_TOKEN\) << "\\\\\\\",\\n             << "\\}/g, 
  '<< "\\\\\\\"secretToken\\\\\\\": \\\\\\\"" << JsonEscape(SECRET_TOKEN) << "\\\\\\\"\\n             << \\"}\\";');

fs.writeFileSync('src/App.tsx', code);
