const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const dumpsBtnMatch = `              <button 
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

const aiMonitorBtn = `
              <button 
                id="tab-aimonitor"
                onClick={() => setActiveTab('aimonitor')}
                className={\`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all \${
                  activeTab === 'aimonitor' 
                    ? 'bg-blue-500/10 text-blue-300 border-l-2 border-blue-500 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }\`}
              >
                <Brain className="w-4 h-4 shrink-0 text-blue-400" />
                <div className="leading-none">
                  <div className="text-sm text-blue-400/90">{language === 'es' ? 'Monitor IA' : 'AI Monitor'}</div>
                  <span className="text-[9px] text-blue-500/70 font-mono">{language === 'es' ? 'Analisis Inteligente' : 'Smart Analysis'}</span>
                </div>
              </button>`;

if (code.includes('tab-dumps')) {
  // Regex to safely replace it since the above exact string might have slightly different whitespace
  code = code.replace(
    /(<button[^>]+id="tab-dumps"[\s\S]*?<\/button>)/,
    "$1" + aiMonitorBtn
  );
  
  // Make sure Brain is imported
  if (!code.includes('Brain,')) {
    code = code.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { Brain, $1 } from 'lucide-react';");
  }
}

fs.writeFileSync('src/App.tsx', code);
