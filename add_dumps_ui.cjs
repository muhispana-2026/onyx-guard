const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `              {/* Real-Time Connections Activity Log feed */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">`;

const replacement = `              {/* Hacker Process Dumps Section */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-amber-100 font-serif uppercase tracking-wide flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-500" /> {t.dashboard.hackerDumps}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {t.dashboard.hackerDumpsDesc}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                  {/* Left: Dump List Table */}
                  <div className="lg:col-span-8">
                    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-900 text-amber-500 font-bold uppercase tracking-widest text-xs">
                            <th className="p-3">{t.dashboard.colHackName}</th>
                            <th className="p-3">{t.dashboard.colHackDesc}</th>
                            <th className="p-3 text-right">{t.dashboard.colAction}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                          {dumps.map(dump => (
                            <tr key={dump.id} className="hover:bg-slate-900/50 transition">
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Terminal className="w-4 h-4 text-slate-500" />
                                  <span className="font-mono text-amber-200">{dump.name}</span>
                                </div>
                              </td>
                              <td className="p-3 text-xs text-slate-400">{dump.desc}</td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => setDumps(dumps.filter(d => d.id !== dump.id))}
                                  className="text-slate-500 hover:text-red-400 transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {dumps.length === 0 && (
                            <tr>
                              <td colSpan={3} className="p-8 text-center text-slate-500 font-mono text-xs">
                                No dump rules configured.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right: Add Dump Form */}
                  <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
                      <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider font-serif mb-2">
                        {t.dashboard.addDumpRule}
                      </h3>
                      <form onSubmit={handleAddDump} className="flex flex-col gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1 font-mono">
                            {t.dashboard.processName}
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g. CheatEngine.exe" 
                            value={newDumpName}
                            onChange={(e) => setNewDumpName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-amber-200 focus:border-amber-500 focus:outline-none font-mono"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1 font-mono">
                            {t.dashboard.colHackDesc}
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g. Memory Editor" 
                            value={newDumpDesc}
                            onChange={(e) => setNewDumpDesc(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-300 focus:border-amber-500 focus:outline-none"
                            required
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="w-full bg-red-950/40 hover:bg-red-900 text-red-400 font-bold px-4 py-2.5 rounded text-sm transition mt-2 border border-red-500/20 flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> {t.dashboard.addDumpRule}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-Time Connections Activity Log feed */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Added Hacker Process Dumps section successfully.");
} else {
  console.log("Target string not found.");
}
