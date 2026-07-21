const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const fields = [
  'serverUrl',
  'clientVersion',
  'securityToken',
  'blacklistedProgramsText',
  'targetProcessName',
  'searchTerm',
  'newAccUser',
  'newAccHwid',
  'newFilePath',
  'newFileHash',
  'newDumpName',
  'newDumpDesc',
  'simUsername',
  'simHwid',
  'simIp',
  'simClientVersion',
];

for (const field of fields) {
  content = content.replace(new RegExp(`value={${field}}`, 'g'), `value={${field} || ""}`);
}

fs.writeFileSync('src/App.tsx', content);
console.log("Patched inputs");
