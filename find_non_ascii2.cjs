const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const cppCodeStart = code.indexOf('const cppCode = useMemo(() => {');
const cppCodeEnd = code.indexOf('  }, [serverUrl, securityToken, clientVersion', cppCodeStart);
const cppCode = code.substring(cppCodeStart, cppCodeEnd);
console.log(cppCode.length);
