const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const cppCodeStart = code.indexOf('const cppCode = useMemo(() => {');
const cppCodeEnd = code.indexOf('}`;  }, [serverUrl,', cppCodeStart);
const cppCode = code.substring(cppCodeStart, cppCodeEnd);

let nonAscii = [];
for (let i = 0; i < cppCode.length; i++) {
  if (cppCode.charCodeAt(i) > 127) {
    nonAscii.push({ line: cppCode.substring(0, i).split('\n').length, char: cppCode[i], code: cppCode.charCodeAt(i), context: cppCode.substring(i - 20, i + 20) });
  }
}
console.log(nonAscii);
