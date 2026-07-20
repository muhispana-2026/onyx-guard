const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix Report Handshake
code = code.replace(/<< "\\\"username\\\": \\\"" << JsonEscape\(username\) << "\\\",\\\""\\n\s*<< "\\\"hwid\\\": \\\"" << JsonEscape\(hwid\) << "\\\",\\\""\\n\s*<< "\\\"clientVersion\\\": \\\"" << JsonEscape\(CLIENT_VERSION\) << "\\\",\\\""\\n\s*<< "\\\"secretToken\\\": \\\"" << JsonEscape\(SECRET_TOKEN\) << "\\\""\\n\s*<< "\\\"fileModified\\\": \\\"" << \(modifiedFile\.empty\(\) \? "none" : JsonEscape\(modifiedFile\)\) << "\\\""/g, 
`<< "\\\"username\\\": \\\"" << JsonEscape(username) << "\\\","
         << "\\\"hwid\\\": \\\"" << JsonEscape(hwid) << "\\\","
         << "\\\"clientVersion\\\": \\\"" << JsonEscape(CLIENT_VERSION) << "\\\","
         << "\\\"secretToken\\\": \\\"" << JsonEscape(SECRET_TOKEN) << "\\\","
         << "\\\"fileModified\\\": \\\"" << (modifiedFile.empty() ? "none" : JsonEscape(modifiedFile)) << "\\\""`);

// Fix Heartbeat
code = code.replace(/<< "\\\"username\\\": \\\"" << JsonEscape\(username\) << "\\\",\\\""\\n\s*<< "\\\"hwid\\\": \\\"" << JsonEscape\(hwid\) << "\\\",\\\""\\n\s*<< "\\\"secretToken\\\": \\\"" << JsonEscape\(SECRET_TOKEN\) << "\\\""/g, 
`<< "\\\"username\\\": \\\"" << JsonEscape(username) << "\\\","
             << "\\\"hwid\\\": \\\"" << JsonEscape(hwid) << "\\\","
             << "\\\"secretToken\\\": \\\"" << JsonEscape(SECRET_TOKEN) << "\\\""`);

// Fix Validation Handshake
code = code.replace(/<< "\\\"username\\\": \\\"" << JsonEscape\(user\) << "\\\",\\\""\\n\s*<< "\\\"hwid\\\": \\\"" << JsonEscape\(hwid\) << "\\\",\\\""\\n\s*<< "\\\"clientVersion\\\": \\\"" << JsonEscape\(CLIENT_VERSION\) << "\\\",\\\""\\n\s*<< "\\\"secretToken\\\": \\\"" << JsonEscape\(SECRET_TOKEN\) << "\\\""\\n\s*<< "\\\"fileModified\\\": \\\"" << \(modFile\.empty\(\) \? "none" : JsonEscape\(modFile\)\) << "\\\""/g, 
`<< "\\\"username\\\": \\\"" << JsonEscape(user) << "\\\","
         << "\\\"hwid\\\": \\\"" << JsonEscape(hwid) << "\\\","
         << "\\\"clientVersion\\\": \\\"" << JsonEscape(CLIENT_VERSION) << "\\\","
         << "\\\"secretToken\\\": \\\"" << JsonEscape(SECRET_TOKEN) << "\\\","
         << "\\\"fileModified\\\": \\\"" << (modFile.empty() ? "none" : JsonEscape(modFile)) << "\\\""`);

fs.writeFileSync('src/App.tsx', code);
