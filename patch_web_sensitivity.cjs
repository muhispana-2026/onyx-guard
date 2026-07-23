const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state for speedhackSensitivity
code = code.replace(
  /const \[blacklistedProgramsText, setBlacklistedProgramsText\] = useState<string>\('Cheat Engine, AutoClicker, SpeedHack, WPE PRO, OllyDbg, Wireshark'\);/,
  `const [blacklistedProgramsText, setBlacklistedProgramsText] = useState<string>('Cheat Engine, AutoClicker, SpeedHack, WPE PRO, OllyDbg, Wireshark');
  const [speedhackSensitivity, setSpeedhackSensitivity] = useState<string>('1.80');`
);

// 2. Fetch from config on load
code = code.replace(
  /if \(data\.blacklistedPrograms\) setBlacklistedProgramsText\(data\.blacklistedPrograms\.join\(', '\)\);/,
  `if (data.blacklistedPrograms) setBlacklistedProgramsText(data.blacklistedPrograms.join(', '));
        if (data.speedhackSensitivity) setSpeedhackSensitivity(data.speedhackSensitivity);`
);

// 3. Save to config (in two places)
code = code.replace(
  /blacklistedPrograms: blacklistedProgramsText\.split\(','\)\.map\(s => s\.trim\(\)\)\.filter\(Boolean\), licenseExpiration/,
  `blacklistedPrograms: blacklistedProgramsText.split(',').map(s => s.trim()).filter(Boolean), licenseExpiration, speedhackSensitivity`
);

code = code.replace(
  /blacklistedProgramsText, licenseExpiration, activeProjectId, loadedProjectId\]\);/g,
  `blacklistedProgramsText, licenseExpiration, speedhackSensitivity, activeProjectId, loadedProjectId]);`
);

// 4. Add to UI
const uiPatch = `
                <div className="bg-slate-900 border border-slate-700/50 rounded p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold text-slate-200">Anti-SpeedHack</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-400">Sensibilidad (Umbral de aceleración):</label>
                      <input 
                        type="text"
                        value={speedhackSensitivity}
                        onChange={(e) => setSpeedhackSensitivity(e.target.value)}
                        className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 font-mono focus:border-amber-500 focus:outline-none text-xs text-center"
                        placeholder="1.80"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Ajusta el límite de aceleración permitido antes de ser detectado como speedhack (por defecto: 1.80). Los cambios se aplican en tiempo real al cliente conectado.</p>
                </div>
`;

code = code.replace(
  /<div className="bg-slate-900 border border-slate-700\/50 rounded p-4">\s*<div className="flex items-center gap-2 mb-4">\s*<FileKey className="w-4 h-4 text-emerald-500" \/>/g,
  uiPatch + '\n\n                <div className="bg-slate-900 border border-slate-700/50 rounded p-4">\n                  <div className="flex items-center gap-2 mb-4">\n                    <FileKey className="w-4 h-4 text-emerald-500" />'
);

fs.writeFileSync('src/App.tsx', code);
