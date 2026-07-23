const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const uiPatch = `
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <label className="block text-slate-400 font-mono mb-1 text-[10px]">
                      {language === 'es' ? 'SENSIBILIDAD ANTI-SPEEDHACK:' : 'ANTI-SPEEDHACK SENSITIVITY:'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text"
                        value={speedhackSensitivity}
                        onChange={(e) => setSpeedhackSensitivity(e.target.value)}
                        className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-amber-400 font-mono focus:border-amber-500 focus:outline-none text-xs text-center"
                        placeholder="1.80"
                      />
                      <span className="text-[10px] text-slate-500">
                        {language === 'es' ? '(Umbral de aceleración, por defecto 1.80. Menor es más estricto)' : '(Acceleration threshold, default 1.80. Lower is stricter)'}
                      </span>
                    </div>
                  </div>
`;

code = code.replace(
  /                  \{\/\* Advanced Security \*\/\}/g,
  uiPatch + '\\n                  {/* Advanced Security */}'
);

fs.writeFileSync('src/App.tsx', code);
