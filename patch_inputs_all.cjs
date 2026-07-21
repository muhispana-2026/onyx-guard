const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const fields = [
  'email',
  'password',
  'newProjectName',
  'activeProjectId',
  'actionOnFailure',
  'newFileImportance',
  'simModifiedFile'
];

for (const field of fields) {
  content = content.replace(new RegExp(`value={${field}}`, 'g'), `value={${field} || ""}`);
}

fs.writeFileSync('src/App.tsx', content);
console.log("Patched all remaining inputs");
