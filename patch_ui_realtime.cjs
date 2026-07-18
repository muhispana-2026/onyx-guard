const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const uiCheckbox = `
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                    <input 
                      type="checkbox" 
                      checked={enableRealtimeMonitor}
                      onChange={(e) => setEnableRealtimeMonitor(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span>{language === 'es' ? 'Monitoreo de Archivos en Tiempo Real (OS Watcher)' : 'Real-time File Monitor (OS Watcher)'}</span>
                  </label>
`;

if (!code.includes('Monitoreo de Archivos en Tiempo Real')) {
  code = code.replace(
    /<span>\{language === 'es' \? 'Suma MD5 de archivos' : 'Verify Client File Checksums'\}<\/span>\n                  <\/label>/,
    `<span>{language === 'es' ? 'Suma MD5 de archivos' : 'Verify Client File Checksums'}</span>\n                  </label>${uiCheckbox}`
  );
}

fs.writeFileSync('src/App.tsx', code);
