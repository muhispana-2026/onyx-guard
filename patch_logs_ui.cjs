const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const funcs = `
  const handleClearLogs = async () => {
    if (!window.confirm(language === 'es' ? '¿Seguro que deseas eliminar todos los registros?' : 'Are you sure you want to clear all logs?')) return;
    try {
      await fetch('/api/logs', { method: 'DELETE', headers: { 'x-project-id': activeProjectId } });
      setLogs([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Type,Username,Status,Reason,HWID,IP,Version\\n"
      + logs.map(l => \`\${l.timestamp},\${l.type},\${l.username},\${l.status},"\${l.reason}",\${l.hwid},\${l.ip},\${l.clientVersion}\`).join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "onyx_guard_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;

const insertPoint = `  const handleDeleteProject = async () => {`;
code = code.replace(insertPoint, funcs + '\\n  const handleDeleteProject = async () => {');

const buttonsStr = `                  <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0 self-end sm:self-auto text-sm font-mono">
                    <button 
                      onClick={() => setLogFilter('ALL')}`;

const buttonsRep = `                  <div className="flex items-center gap-4 shrink-0 self-end sm:self-auto">
                    <div className="flex items-center gap-2">
                        <button onClick={handleDownloadLogs} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded transition text-sm flex items-center gap-1 border border-slate-700">
                           <Download className="w-4 h-4" /> {language === 'es' ? 'Descargar' : 'Download'}
                        </button>
                        <button onClick={handleClearLogs} className="bg-red-950/40 hover:bg-red-900/60 text-red-400 px-3 py-1.5 rounded transition text-sm flex items-center gap-1 border border-red-900/50">
                           <Trash2 className="w-4 h-4" /> {language === 'es' ? 'Limpiar' : 'Clear'}
                        </button>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-sm font-mono">
                    <button 
                      onClick={() => setLogFilter('ALL')}`;
code = code.replace(buttonsStr, buttonsRep);

fs.writeFileSync('src/App.tsx', code);
