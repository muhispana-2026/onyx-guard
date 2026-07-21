const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix the multi-line .join(',')
code = code.replace(/\}\)\.join\(\',\n\'\)/g, "}).join(',\\n')");
code = code.replace(/\}\)\.join\(\',\r\n\'\)/g, "}).join(',\\n')");

// We actually want the JS string to be "\\n" so that it prints a newline in C++.
// Wait, no! If the JS string is "\\n" it prints "\n" in C++.
// If the JS string is "\n" it prints a real newline in C++.
// Let's use `join(',\\n')` which means backslash n, and the template string will evaluate it to `\n` (newline character)? NO!
// In JS, `join(',\\n')` has a literal backslash and n.
// To get a newline character, we need `join(',\n')`.
// So we should write `join(',\\n')` in the JS CODE as `join(',\\n')` which is an escaped newline, i.e., `join(',\n')`.

fs.writeFileSync('src/App.tsx', code);
