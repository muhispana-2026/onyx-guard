const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.split('<< "\\\"username\\\": \\\"" << JsonEscape(username) << "\\\",\\\""').join('<< "\\\"username\\\": \\\"" << JsonEscape(username) << "\\\","');
code = code.split('<< "\\\"hwid\\\": \\\"" << JsonEscape(hwid) << "\\\",\\\""').join('<< "\\\"hwid\\\": \\\"" << JsonEscape(hwid) << "\\\","');
code = code.split('<< "\\\"clientVersion\\\": \\\"" << JsonEscape(CLIENT_VERSION) << "\\\",\\\""').join('<< "\\\"clientVersion\\\": \\\"" << JsonEscape(CLIENT_VERSION) << "\\\","');
code = code.split('<< "\\\"username\\\": \\\"" << JsonEscape(user) << "\\\",\\\""').join('<< "\\\"username\\\": \\\"" << JsonEscape(user) << "\\\","');

code = code.replace(/<< "\\\"secretToken\\\": \\\"" << JsonEscape\(SECRET_TOKEN\) << "\\\""(\r?\n\s*)<< "\\\"fileModified\\\":/g, '<< "\\\"secretToken\\\": \\\"" << JsonEscape(SECRET_TOKEN) << "\\\","$1<< "\\\"fileModified\\\":');

fs.writeFileSync('src/App.tsx', code);
