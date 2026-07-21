const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
    /const blacklistedArrayContent = blacklistedPrograms\.length > 0 \? `\$\{blacklistedPrograms\.map\(p => `"\$\{p\}"`\)\.join\(\', \'\)\}` : `"DummyWindowName"`;/,
    "const parsedBlacklisted = blacklistedProgramsText.split(',').map(s => s.trim()).filter(Boolean);\n    const blacklistedArrayContent = parsedBlacklisted.length > 0 ? `${parsedBlacklisted.map(p => `\\\"${p}\\\"`).join(', ')}` : `\\\"DummyWindowName\\\"`;"
);

content = content.replace(
    /\$\{blacklistedPrograms\.length > 0 \? blacklistedPrograms\.map\(p => `    "\$\{p\}"`\)\.join\(\',\\n\'\) : \'    "DummyWindowName"\'\}/g,
    "${(() => { const parsed = blacklistedProgramsText.split(',').map(s=>s.trim()).filter(Boolean); return parsed.length > 0 ? parsed.map(p => `    \\\"${p}\\\"`).join(',\\n') : '    \\\"DummyWindowName\\\"'; })()}"
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched array generation!");
