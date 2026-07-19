const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetRegex = /std::stringstream json;\s*json << "\{"\s*<< [^;]+;/;
const newCode = `std::stringstream json;
    json << "{"
         << "\\\"username\\\": \\\"" << JsonEscape(username) << "\\\","
         << "\\\"hwid\\\": \\\"" << JsonEscape(hwid) << "\\\","
         << "\\\"clientVersion\\\": \\\"" << JsonEscape(CLIENT_VERSION) << "\\\","
         << "\\\"secretToken\\\": \\\"" << JsonEscape(SECRET_TOKEN) << "\\\","
         << "\\\"fileModified\\\": \\\"" << (modifiedFile.empty() ? "none" : JsonEscape(modifiedFile)) << "\\\""
         << "}";`;

code = code.replace(targetRegex, newCode);
fs.writeFileSync('src/App.tsx', code);
console.log("Done");
