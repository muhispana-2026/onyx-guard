const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{language === 'es' ? 'Seguridad Avanzada (Nivel Pro)' : 'Advanced Security (Pro Level)'}
                    </h4>`;

const replacement = `{language === 'es' ? 'Seguridad Avanzada (Nivel Pro)' : 'Advanced Security (Pro Level)'}
                    </h4>

                  {selectedLanguage === 'cpp' && (
                    <div className="mb-4 pb-4 border-b border-slate-800">
                      <h4 className="text-amber-500 font-bold uppercase tracking-wider text-[10px] mb-2 opacity-80">
                        {language === 'es' ? 'Compilador (Visual Studio)' : 'Compiler (Visual Studio)'}
                      </h4>
                      <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                        <input 
                          type="checkbox" 
                          checked={usePch}
                          onChange={(e) => setUsePch(e.target.checked)}
                          className="accent-amber-500"
                        />
                        <span>{language === 'es' ? 'Incluir #include "pch.h" (Evita error C1010)' : 'Include #include "pch.h" (Prevents C1010 Error)'}</span>
                      </label>
                    </div>
                  )}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched UI 3!");
