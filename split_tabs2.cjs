const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const str1 = `                  {/* Right: Security MD5 Client File Hashing Rules (4 cols) */}`;
const rep1 = `                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FILE INTEGRITY */}
          {activeTab === 'integrity' && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-amber-100 font-serif uppercase tracking-wide flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-amber-400" /> {t.dashboard.fileIntegrityRules || (language === 'es' ? 'Reglas de Lista de Integridad de Archivos' : 'File Integrity Checklist Rules')}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {t.dashboard.fileIntegrityRulesDesc || (language === 'es' ? 'La API evalúa las sumas de comprobación MD5 entrantes con esta lista estática.' : 'The API evaluates incoming MD5 hash matches against this static checklist.')}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
                  {/* Left: MD5 Client File Hashing Rules */}`;
code = code.replace(str1, rep1);


const str2 = `              {/* Hacker Process Dumps Section */}`;
const rep2 = `              </div>
            </div>
          )}

          {/* TAB 5: HACKER DUMPS */}
          {activeTab === 'dumps' && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              {/* Hacker Process Dumps Section */}`;
code = code.replace(str2, rep2);


const str3 = `              {/* Real-Time Connections Activity Log feed */}`;
const rep3 = `              </div>
            </div>
          )}

          {/* TAB 6: DASHBOARD (REAL-TIME EVENTS) */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              {/* Real-Time Connections Activity Log feed */}`;
code = code.replace(str3, rep3);

fs.writeFileSync('src/App.tsx', code);
