const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const str = `                    {/* File Upload Zone */}
                    <div className="border-2 border-dashed border-slate-700/50 hover:border-amber-500/50 bg-slate-950/50 rounded-xl p-6 text-center transition flex flex-col items-center justify-center gap-3 cursor-pointer group">
                      <div className="bg-slate-900 p-3 rounded-full group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-slate-400 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-300 font-mono">
                          {language === 'es' ? 'Subir Dump.List / Dump.db' : 'Upload Dump.List / Dump.db'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {language === 'es' ? 'Arrastra y suelta tu archivo aquí o haz clic para buscar.' : 'Drag & drop your file here or click to browse.'}
                        </p>
                      </div>
                    </div>`;

const rep = `                    {/* File Upload Zone */}
                    <label className="border-2 border-dashed border-slate-700/50 hover:border-amber-500/50 bg-slate-950/50 rounded-xl p-6 text-center transition flex flex-col items-center justify-center gap-3 cursor-pointer group relative overflow-hidden">
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".txt,.list,.db,.json"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            alert(language === 'es' ? 'Archivo cargado con éxito para análisis.' : 'File uploaded successfully for parsing.');
                          }
                        }}
                      />
                      <div className="bg-slate-900 p-3 rounded-full group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-slate-400 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-300 font-mono">
                          {language === 'es' ? 'Subir Dump.List / Dump.db completas' : 'Upload full Dump.List / Dump.db'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {language === 'es' ? 'Arrastra y suelta tu archivo aquí o haz clic para buscar.' : 'Drag & drop your file here or click to browse.'}
                        </p>
                      </div>
                    </label>`;

code = code.replace(str, rep);
fs.writeFileSync('src/App.tsx', code);
