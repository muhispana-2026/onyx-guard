const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /std::string headers = "Content-Type: application\/json\\r\\n";/;
console.log(code.includes('std::string headers = "Content-Type: application/json\\r\\n";'));
console.log(code.includes('std::string headers = "Content-Type: application/json\\\\r\\\\n";'));
