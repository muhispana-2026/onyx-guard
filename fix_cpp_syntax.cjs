const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The problematic lines:
// size_t sensStart = responseString.find(""speedhackSensitivity":"");
// size_t sensEnd = responseString.find(""", sensStart);

code = code.replace(
  /size_t sensStart = responseString\.find\(""\speedhackSensitivity"":""\);/g,
  'size_t sensStart = responseString.find("\\\\"speedhackSensitivity\\\\":\\\\"");'
);

code = code.replace(
  /size_t sensEnd = responseString\.find\(""", sensStart\);/g,
  'size_t sensEnd = responseString.find("\\\\"", sensStart);'
);

fs.writeFileSync('src/App.tsx', code);
