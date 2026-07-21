const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<button \s*type="button"\s*onClick=\{handleRegister\}[\s\S]*?<\/button>/, '');
code = code.replace(/const handleRegister = async \(\) => \{[\s\S]*?console\.error\("Registration failed:", error\);\n\s*\}\n\s*\};/, '');

fs.writeFileSync('src/App.tsx', code);
