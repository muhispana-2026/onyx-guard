const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = 'size_t msgEnd = responseString.find("\\\\\\"", msgStart);';
const newStr = 'size_t msgEnd = msgStart; while ((msgEnd = responseString.find("\\\\\\"", msgEnd)) != std::string::npos) { if (msgEnd > 0 && responseString[msgEnd - 1] != \'\\\\\\\\\') break; msgEnd++; }';

let lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(targetStr)) {
        lines[i] = lines[i].replace(targetStr, newStr);
    }
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
