const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. useState
content = content.replace(
  "const [blacklistedPrograms, setBlacklistedPrograms] = useState<string[]>(['Cheat Engine', 'AutoClicker', 'SpeedHack', 'WPE PRO', 'OllyDbg', 'Wireshark']);",
  "const [blacklistedProgramsText, setBlacklistedProgramsText] = useState<string>('Cheat Engine, AutoClicker, SpeedHack, WPE PRO, OllyDbg, Wireshark');"
);

// 2. data fetch
content = content.replace(
  "if (data.blacklistedPrograms !== undefined) setBlacklistedPrograms(data.blacklistedPrograms || []);",
  "if (data.blacklistedPrograms !== undefined) setBlacklistedProgramsText((data.blacklistedPrograms || []).join(', '));"
);

// 3. fetch POST
content = content.replace(
  "enableWatchdog, blacklistedPrograms, licenseExpiration",
  "enableWatchdog, blacklistedPrograms: blacklistedProgramsText.split(',').map(s => s.trim()).filter(Boolean), licenseExpiration"
);

// 4. useEffect dependency
content = content.replace(
  "enableWatchdog, blacklistedPrograms, licenseExpiration, activeProjectId",
  "enableWatchdog, blacklistedProgramsText, licenseExpiration, activeProjectId"
);

// 5. C++ generation string arrays
content = content.replace(
  "const blacklistedArrayContent = blacklistedPrograms.length > 0 ? `${blacklistedPrograms.map(p => `\\\"${p}\\\"`).join(', ')}` : `\\\"DummyWindowName\\\"`;",
  "const parsedBlacklisted = blacklistedProgramsText.split(',').map(s => s.trim()).filter(Boolean);\n    const blacklistedArrayContent = parsedBlacklisted.length > 0 ? `${parsedBlacklisted.map(p => `\\\"${p}\\\"`).join(', ')}` : `\\\"DummyWindowName\\\"`;"
);

content = content.replace(
  "${blacklistedPrograms.length > 0 ? blacklistedPrograms.map(p => `    \\\"${p}\\\"`).join(',\\n') : '    \\\"DummyWindowName\\\"'}",
  "${(() => { const parsed = blacklistedProgramsText.split(',').map(s=>s.trim()).filter(Boolean); return parsed.length > 0 ? parsed.map(p => `    \\\"${p}\\\"`).join(',\\n') : '    \\\"DummyWindowName\\\"'; })()}"
);

// 6. useEffect dependencies for C++ generation
content = content.replace(
  "enableAntiMacro, blacklistedPrograms, clientFiles,",
  "enableAntiMacro, blacklistedProgramsText, clientFiles,"
);

// 7. Input element
const oldInput = `                      <input 
                        type="text" 
                        value={blacklistedPrograms.join(', ')}
                        onChange={(e) => setBlacklistedPrograms(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 font-mono focus:border-amber-500 focus:outline-none text-xs"
                        placeholder="Cheat Engine, AutoClicker, SpeedHack"
                      />`;
const newInput = `                      <input 
                        type="text" 
                        value={blacklistedProgramsText}
                        onChange={(e) => setBlacklistedProgramsText(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 font-mono focus:border-amber-500 focus:outline-none text-xs"
                        placeholder="Cheat Engine, AutoClicker, SpeedHack"
                      />`;

content = content.replace(oldInput, newInput);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched src/App.tsx successfully");
