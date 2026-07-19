const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetLine = `                "{{\\"username\\":\\"{0}\\",\\"hwid\\":\\"{1}\\",\\"clientVersion\\":\\"{2}\\",\\"secretToken\\":\\"{3}\\",\\"fileModified\\":\\"{4}\"}}",`;
const replacementLine = `                "{{\\\\\\"username\\\\\\":\\\\\\"{0}\\\\\\",\\\\\\"hwid\\\\\\":\\\\\\"{1}\\\\\\",\\\\\\"clientVersion\\\\\\":\\\\\\"{2}\\\\\\",\\\\\\"secretToken\\\\\\":\\\\\\"{3}\\\\\\",\\\\\\"fileModified\\\\\\":\\\\\\"{4}\\\\\\"}}",`;

code = code.replace(targetLine, replacementLine);
fs.writeFileSync('src/App.tsx', code);
console.log("Done");
