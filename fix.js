const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<< "\\\"username\\\": \\\""/g,
  '<< "\\\\\\\"username\\\\\\\": \\\\\\\""'
);
code = code.replace(
  /<< "\\\"hwid\\\": \\\""/g,
  '<< "\\\\\\\"hwid\\\\\\\": \\\\\\\""'
);
code = code.replace(
  /<< "\\\"clientVersion\\\": \\\""/g,
  '<< "\\\\\\\"clientVersion\\\\\\\": \\\\\\\""'
);
code = code.replace(
  /<< "\\\"secretToken\\\": \\\""/g,
  '<< "\\\\\\\"secretToken\\\\\\\": \\\\\\\""'
);
code = code.replace(
  /<< "\\\"fileModified\\\": \\\""/g,
  '<< "\\\\\\\"fileModified\\\\\\\": \\\\\\\""'
);
code = code.replace(
  /<< "\\\""/g,
  '<< "\\\\\\\""'
);

fs.writeFileSync('src/App.tsx', code);
