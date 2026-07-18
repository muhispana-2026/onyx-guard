const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update activeTab state type
code = code.replace(
  /useState\<'architecture' \| 'generator' \| 'dashboard' \| 'sandbox' \| 'guide'\>\('architecture'\);/,
  "useState<string>('architecture');"
);

// Add AI Monitor tab button right after Dumps tab button
const dumpsTabBtn = `        <button
          onClick={() => setActiveTab('dumps')}
          className={\`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 \${
            activeTab === 'dumps' 
              ? 'border-amber-500 text-amber-500' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }\`}
        >
          <Database className="w-4 h-4" />
          {language === 'es' ? 'Volcados de Memoria' : 'Memory Dumps'}
        </button>`;

const aiTabBtn = `        <button
          onClick={() => setActiveTab('aimonitor')}
          className={\`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 \${
            activeTab === 'aimonitor' 
              ? 'border-blue-500 text-blue-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }\`}
        >
          <Brain className="w-4 h-4" />
          {language === 'es' ? 'IA Monitor' : 'AI Monitor'}
        </button>`;

code = code.replace(dumpsTabBtn, dumpsTabBtn + '\n' + aiTabBtn);

// Make sure Brain icon is imported
if (!code.includes('Brain,')) {
  code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { Brain, $1 } from 'lucide-react';");
}

fs.writeFileSync('src/App.tsx', code);
