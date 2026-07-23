const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We need to replace `responseString.find("\"speedhackSensitivity\":\"");`
// with `responseString.find("\\\"speedhackSensitivity\\\":\\\"");`
code = code.replace(
  /responseString\.find\("\\"speedhackSensitivity\\":\\""\);/g,
  'responseString.find("\\\\\\"speedhackSensitivity\\\\\\":\\\\\\"");'
);

code = code.replace(
  /responseString\.find\("\\"", sensStart\);/g,
  'responseString.find("\\\\\\"", sensStart);'
);

fs.writeFileSync('src/App.tsx', code);
