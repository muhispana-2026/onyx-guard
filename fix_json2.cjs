const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<< "\\\"username\\\": \\\"" << JsonEscape\(username\) << "\\\",\\\""/g, '<< "\\\"username\\\": \\\"" << JsonEscape(username) << "\\\","');
code = code.replace(/<< "\\\"hwid\\\": \\\"" << JsonEscape\(hwid\) << "\\\",\\\""/g, '<< "\\\"hwid\\\": \\\"" << JsonEscape(hwid) << "\\\","');
code = code.replace(/<< "\\\"clientVersion\\\": \\\"" << JsonEscape\(CLIENT_VERSION\) << "\\\",\\\""/g, '<< "\\\"clientVersion\\\": \\\"" << JsonEscape(CLIENT_VERSION) << "\\\","');

code = code.replace(/<< "\\\"username\\\": \\\"" << JsonEscape\(user\) << "\\\",\\\""/g, '<< "\\\"username\\\": \\\"" << JsonEscape(user) << "\\\","');

code = code.replace(/<< "\\\"secretToken\\\": \\\"" << JsonEscape\(SECRET_TOKEN\) << "\\\""\\n(\s*)<< "\\\"fileModified\\\":/g, '<< "\\\"secretToken\\\": \\\"" << JsonEscape(SECRET_TOKEN) << "\\\",\\n$1<< \\\"fileModified\\\":');

fs.writeFileSync('src/App.tsx', code);
