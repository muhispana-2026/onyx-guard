const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /size_t msgEnd = responseString\.find\("\\\\"", msgStart\);/g;
code = code.replace(regex, 'size_t msgEnd = responseString.find("\\\\\\"", msgStart);');

fs.writeFileSync('src/App.tsx', code);
