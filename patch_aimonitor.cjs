const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const aiMonitorContent = `
          {activeTab === 'aimonitor' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Brain className="w-48 h-48" />
                </div>
                
                <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2 mb-2 relative z-10">
                  <Brain className="w-5 h-5" />
                  {language === 'es' ? 'OnyxGuard IA - Monitor en Tiempo Real' : 'OnyxGuard AI - Real-time Monitor'}
                </h3>
                <p className="text-slate-400 mb-6 relative z-10 max-w-3xl text-sm">
                  {language === 'es' 
                    ? 'La Inteligencia Artificial de OnyxGuard utiliza modelos de aprendizaje profundo (Gemini) para analizar comportamientos anómalos, inyecciones de memoria y modificaciones de archivos no registradas. Aquí puedes ver sus veredictos en tiempo real.'
                    : 'OnyxGuard AI uses deep learning models (Gemini) to analyze anomalous behaviors, memory injections, and unregistered file modifications. Here you can see its verdicts in real-time.'}
                </p>

                <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 h-[500px] overflow-y-auto font-mono text-xs">
                  {logs.filter(l => l.reason.includes('AI Analysis:') || l.reason.includes('IA detectó')).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-4">
                      <Brain className="w-12 h-12 opacity-20" />
                      <p>{language === 'es' ? 'No hay eventos de IA registrados aún.' : 'No AI events logged yet.'}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {logs.filter(l => l.reason.includes('AI Analysis:') || l.reason.includes('IA detectó')).map((log, i) => (
                        <div key={log.id} className={\`p-3 rounded border \${log.status === 'ALLOWED' ? 'bg-blue-900/10 border-blue-900/30' : 'bg-red-900/10 border-red-900/30'} flex flex-col gap-2\`}>
                          <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                            <span className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                            <span className={\`px-2 py-0.5 rounded text-[10px] font-bold \${log.status === 'ALLOWED' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}\`}>
                              {log.status === 'ALLOWED' ? 'VEREDICTO: SEGURO' : 'VEREDICTO: AMENAZA DETECTADA'}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <span className="text-slate-500">Player:</span> <span className="text-slate-300">{log.username}</span>
                            </div>
                            <div className="flex-1">
                              <span className="text-slate-500">HWID:</span> <span className="text-slate-300">{log.hwid}</span>
                            </div>
                          </div>
                          <div className="mt-1 flex items-start gap-2">
                            <Brain className={\`w-4 h-4 mt-0.5 \${log.status === 'ALLOWED' ? 'text-blue-400' : 'text-red-400'}\`} />
                            <span className={\`\${log.status === 'ALLOWED' ? 'text-blue-300' : 'text-red-300'}\`}>
                              {log.reason}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
`;

code = code.replace(
  /          \{activeTab === 'dashboard' && \(/,
  aiMonitorContent + "\n          {activeTab === 'dashboard' && ("
);

fs.writeFileSync('src/App.tsx', code);
