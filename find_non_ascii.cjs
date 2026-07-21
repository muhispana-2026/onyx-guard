const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const cppCode = code.substring(code.indexOf('const cppCode = useMemo(() => {'), code.indexOf('  }, [serverUrl, securityToken, clientVersion'));

let nonAscii = [];
for (let i = 0; i < cppCode.length; i++) {
  if (cppCode.charCodeAt(i) > 127) {
    nonAscii.push({ index: i, char: cppCode[i], code: cppCode.charCodeAt(i), context: cppCode.substring(i - 20, i + 20) });
  }
}
console.log(nonAscii);
