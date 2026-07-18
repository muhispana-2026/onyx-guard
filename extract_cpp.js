const fs = require('fs');

const code = fs.readFileSync('src/App.tsx', 'utf8');

// The C++ template starts at `const cppCode = `...`;`
const match = code.match(/const cppCode = \`([\s\S]*?)\`;/);
if (match) {
    let cpp = match[1];
    
    // We can evaluate it by compiling a function if we want, but it has variables.
    // Let's just look at the raw string in App.tsx.
    fs.writeFileSync('raw_cpp.txt', cpp);
}
