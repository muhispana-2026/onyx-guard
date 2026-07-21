const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

let startIndex = code.indexOf('const cppCode = useMemo(() => {');
let endIndex = code.indexOf('  }, [', startIndex);
console.log(code.substring(startIndex, endIndex));
