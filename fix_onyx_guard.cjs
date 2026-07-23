const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /if \(data\.serverUrl && !data\.serverUrl\.includes\('onyx-guard'\)\) \{ setServerUrl\(data\.serverUrl\); \} else \{ setServerUrl\(window\.location\.origin \+ '\/api\/auth'\); \}/g,
  "if (data.serverUrl) { setServerUrl(data.serverUrl); } else { setServerUrl(window.location.origin + '/api/auth'); }"
);

fs.writeFileSync('src/App.tsx', code);
