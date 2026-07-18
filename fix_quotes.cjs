const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    'size_t msgStart = responseString.find("\\"message\\":\\"");',
    'size_t msgStart = responseString.find("\\\\\\"message\\\\\\":\\\\\\"");'
);

code = code.replace(
    'size_t msgEnd = responseString.find("\\"", msgStart);',
    'size_t msgEnd = responseString.find("\\\\\\"", msgStart);'
);

fs.writeFileSync('src/App.tsx', code);
