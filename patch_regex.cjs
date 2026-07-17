const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /{language === 'es' \? 'Motor de Seguridad y Memoria' : 'Security & Memory Engine'}\s*<\/h4>/;

const replacement = `{language === 'es' ? 'Motor de Seguridad y Memoria' : 'Security & Memory Engine'}
                    </h4>
                  {selectedLanguage === 'cpp' && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                        <input 
                          type="checkbox" 
                          checked={usePch}
                          onChange={(e) => setUsePch(e.target.checked)}
                          className="accent-amber-500"
                        />
                        <span>{language === 'es' ? 'Incluir #include "pch.h" (Evita error C1010 de Precompiled Headers)' : 'Include #include "pch.h" (Prevents C1010 Error)'}</span>
                      </label>
                    </div>
                  )}
                  <h4 className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-2 mt-4 pt-4 border-t border-slate-800">
                    Opciones / Options
                  </h4>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched with regex!");
