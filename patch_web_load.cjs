const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "if (data.blacklistedPrograms !== undefined) setBlacklistedProgramsText((data.blacklistedPrograms || []).join(', '));",
  "if (data.blacklistedPrograms !== undefined) setBlacklistedProgramsText((data.blacklistedPrograms || []).join(', '));\n        if (data.speedhackSensitivity !== undefined) setSpeedhackSensitivity(data.speedhackSensitivity);"
);

fs.writeFileSync('src/App.tsx', code);
