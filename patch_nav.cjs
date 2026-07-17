const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const t = `              <button 
                id="tab-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={\`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all \${
                  activeTab === 'dashboard' 
                    ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }\`}
              >
                <Database className="w-4 h-4 shrink-0" />
                <div className="leading-none">
                  <div className="text-sm">{t.nav.dashboard}</div>
                  <span className="text-[9px] text-slate-500 font-mono">{t.nav.dashboardSub}</span>
                </div>
              </button>`;

const r = `              <button 
                id="tab-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={\`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all \${
                  activeTab === 'dashboard' 
                    ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }\`}
              >
                <Activity className="w-4 h-4 shrink-0" />
                <div className="leading-none">
                  <div className="text-sm">{t.nav.dashboard}</div>
                  <span className="text-[9px] text-slate-500 font-mono">{t.nav.dashboardSub}</span>
                </div>
              </button>

              <button 
                id="tab-hardware"
                onClick={() => setActiveTab('hardware')}
                className={\`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all \${
                  activeTab === 'hardware' 
                    ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }\`}
              >
                <Database className="w-4 h-4 shrink-0" />
                <div className="leading-none">
                  <div className="text-sm">{t.nav.hardware || (language === 'es' ? 'Perfiles de Hardware' : 'Hardware Profiles')}</div>
                  <span className="text-[9px] text-slate-500 font-mono">{t.nav.hardwareSub || (language === 'es' ? 'HWIDs Registrados' : 'Registered HWIDs')}</span>
                </div>
              </button>

              <button 
                id="tab-integrity"
                onClick={() => setActiveTab('integrity')}
                className={\`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all \${
                  activeTab === 'integrity' 
                    ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }\`}
              >
                <FileCheck className="w-4 h-4 shrink-0" />
                <div className="leading-none">
                  <div className="text-sm">{t.nav.integrity || (language === 'es' ? 'Integridad de Archivos' : 'File Integrity')}</div>
                  <span className="text-[9px] text-slate-500 font-mono">{t.nav.integritySub || (language === 'es' ? 'Reglas de Hash MD5' : 'MD5 Hashing rules')}</span>
                </div>
              </button>

              <button 
                id="tab-dumps"
                onClick={() => setActiveTab('dumps')}
                className={\`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all \${
                  activeTab === 'dumps' 
                    ? 'bg-amber-500/10 text-amber-200 border-l-2 border-amber-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }\`}
              >
                <Shield className="w-4 h-4 shrink-0 text-red-400" />
                <div className="leading-none">
                  <div className="text-sm text-red-400/90">{t.nav.dumps || (language === 'es' ? 'Volcados de Procesos' : 'Process Dumps')}</div>
                  <span className="text-[9px] text-red-500/70 font-mono">{t.nav.dumpsSub || (language === 'es' ? 'Hacks bloqueados' : 'Blocked hacks')}</span>
                </div>
              </button>`;

code = code.replace(t, r);
code = code.replace(/import \{ ([^}]+) \} from 'lucide-react';/, (match, p1) => {
    if (!p1.includes('Activity')) p1 += ', Activity';
    return `import { ${p1} } from 'lucide-react';`;
});

fs.writeFileSync('src/App.tsx', code);
