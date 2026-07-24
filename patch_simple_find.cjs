const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /size_t msgEnd = msgStart; while \(\(msgEnd = responseString\.find\("\\\\\\"", msgEnd\)\) != std::string::npos\) \{ if \(msgEnd > 0 && responseString\[msgEnd - 1\] != '\\\\\\\\'\) break; msgEnd\+\+; \}/g;
code = code.replace(regex, 'size_t msgEnd = responseString.find("\\\\\"", msgStart);');

fs.writeFileSync('src/App.tsx', code);
