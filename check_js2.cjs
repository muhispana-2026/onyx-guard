const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const match = code.match(/std::string headers = "Content-Type: application\/json\\\\\\\\r\\\\\\\\n";/);
if(match) {
    console.log("It has 4 backslashes");
} else {
    console.log("It does NOT have 4 backslashes");
    const match2 = code.match(/std::string headers = "Content-Type: application\/json\\\\r\\\\n";/);
    if(match2) console.log("It has 2 backslashes");
}
