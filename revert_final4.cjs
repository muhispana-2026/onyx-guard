const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

let lines = code.split('\n');
lines[1262] = '                    size_t msgEnd = responseString.find("\\\\\\"", msgStart);';
lines[1286] = '                    size_t msgEnd = responseString.find("\\\\\\"", msgStart);';

fs.writeFileSync('src/App.tsx', lines.join('\n'));
