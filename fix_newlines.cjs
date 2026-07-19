const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    'std::string headers = "Content-Type: application/json\\r\\n";',
    'std::string headers = "Content-Type: application/json\\\\r\\\\n";'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed headers newline!");
