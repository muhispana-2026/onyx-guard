const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The original close for the first large div (which is the Player Hardware Profiles):
const endProfilesTarget = `                    </form>
                  </div>

                  {/* Right: Security MD5 Client File Hashing Rules (4 cols) */}
                  <div className="lg:col-span-4 flex flex-col gap-6">`;

const endProfilesReplacement = `                    </form>
                  </div>
                </div>
              </div>

              {/* Module 2: File Integrity Rules */}
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-900 text-amber-500 font-bold uppercase tracking-widest text-xs">
                            <th className="p-3">{t.dashboard.colFile || (language === 'es' ? 'Ruta relativa' : 'File path')}</th>
                            <th className="p-3">{t.dashboard.colHash || 'MD5 Hash'}</th>
                            <th className="p-3">{t.dashboard.colImportance || 'Importance'}</th>
                            <th className="p-3 text-right">{t.dashboard.colAction || 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {clientFiles.map(file => (
                            <tr key={file.id} className="hover:bg-slate-900/50 transition">
                              <td className="p-3">
                                <div className="flex items-center gap-2 font-bold text-slate-200">
                                  <FileCheck className="w-4 h-4 text-amber-500 shrink-0" />
                                  <span className="truncate max-w-[200px]">{file.path}</span>
                                </div>
                              </td>
                              <td className="p-3 font-mono text-amber-300/80 text-xs">
                                {file.expectedHash}
                                <div className="text-[10px] text-slate-500 mt-0.5">{language === 'es' ? 'Tamaño: ' : 'Size: '}{file.fileSize}</div>
                              </td>
                              <td className="p-3">
                                <span className={\`px-1.5 py-0.5 rounded text-[9px] uppercase font-mono font-bold \${
                                  file.importance === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/10' :
                                  file.importance === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-500/10' :
                                  'bg-slate-800 text-slate-400'
                                }\`}>{file.importance === 'CRITICAL' && language === 'es' ? 'CRÍTICO' : file.importance}</span>
                              </td>
                              <td className="p-3 text-right">
                                <button 
                                  onClick={() => deleteFile(file.id)}
                                  className="text-slate-500 hover:text-red-400 transition"
                                  title="Delete file integrity rule"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {clientFiles.length === 0 && (
                            <tr>
                              <td colSpan={4} className="p-8 text-center text-slate-500 font-mono text-xs">
                                {language === 'es' ? 'No hay reglas configuradas.' : 'No rules configured.'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col gap-6">`;

// And then we need to replace the inner file adding form to remove the old list and just keep the form.
const endInnerFileFormTarget = `                      </h3>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-6">
                      
                      <div className="space-y-3">
                        {clientFiles.map(file => (
                          <div key={file.id} className="p-3 bg-slate-900 rounded border border-slate-800 text-[11px] leading-tight flex flex-col gap-1.5 relative group">
                            <button 
                              onClick={() => deleteFile(file.id)}
                              className="absolute top-2.5 right-2.5 text-slate-500 hover:text-red-400 transition cursor-pointer opacity-0 group-hover:opacity-100"
                              title="Delete file integrity rule"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="flex items-center gap-1.5 font-bold text-slate-200">
                              <FileCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="truncate max-w-[150px]">{file.path}</span>
                              <span className={\`text-[8px] px-1 rounded uppercase font-mono \${
                                file.importance === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/10' :
                                file.importance === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-500/10' :
                                'bg-slate-800 text-slate-400'
                              }\`}>{file.importance === 'CRITICAL' && language === 'es' ? 'CRÍTICO' : file.importance}</span>
                            </div>
                            <div className="text-xs font-mono text-amber-300 font-semibold truncate bg-slate-950 p-1 rounded">
                              MD5: {file.expectedHash}
                            </div>
                            <div className="text-xs text-slate-500">
                              {language === 'es' ? 'Tamaño de archivo: ' : 'Size check: '}{file.fileSize}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* File Add form */}`;

const endInnerFileFormReplacement = `                      </h3>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
                      {/* File Add form */}`;


if(code.includes(endProfilesTarget) && code.includes(endInnerFileFormTarget)) {
    code = code.replace(endProfilesTarget, endProfilesReplacement);
    code = code.replace(endInnerFileFormTarget, endInnerFileFormReplacement);
    // Also we need to close the div correctly at the end of the form
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched layout main grid parts");
} else {
    console.log("Did not find target");
}

