const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /std::string headers = "Content-Type: application\/json\\\\r\\\\n";/;
code = code.replace(regex, 'std::string headers = "Content-Type: application/json\\r\\n";');

const regex2 = /headers \+= "X-Payload-Encrypted: true\\\\r\\\\n";/;
code = code.replace(regex2, 'headers += "X-Payload-Encrypted: true\\r\\n";');

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed headers newline!");
