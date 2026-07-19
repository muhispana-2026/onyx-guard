const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add states
code = code.replace(
  'const [enableProcessBinding, setEnableProcessBinding] = useState(true);',
  `const [enableProcessBinding, setEnableProcessBinding] = useState(true);
  const [enableApiHookDetection, setEnableApiHookDetection] = useState(true);
  const [enableHeuristics, setEnableHeuristics] = useState(true);`
);

// Update fetch body
code = code.replace(
  'enableProcessBinding, enablePayloadEncryption',
  'enableProcessBinding, enablePayloadEncryption, enableApiHookDetection, enableHeuristics'
);

// Update dependency array (first)
code = code.replace(
  'enableProcessBinding, enablePayloadEncryption, blacklistedPrograms, licenseExpiration, activeProjectId, loadedProjectId',
  'enableProcessBinding, enablePayloadEncryption, enableApiHookDetection, enableHeuristics, blacklistedPrograms, licenseExpiration, activeProjectId, loadedProjectId'
);

// Update dependency array for cpp code
code = code.replace(
  'enableProcessBinding, usePch]',
  'enableProcessBinding, usePch, enableApiHookDetection, enableHeuristics]'
);

// Add to UI
const uiInsert = `                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                      <input 
                        type="checkbox" 
                        checked={enableApiHookDetection}
                        onChange={(e) => setEnableApiHookDetection(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>{language === 'es' ? 'Detección de Hooks de API (Avanzado)' : 'API Hooking Detection (Advanced)'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                      <input 
                        type="checkbox" 
                        checked={enableHeuristics}
                        onChange={(e) => setEnableHeuristics(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>{language === 'es' ? 'Escaneo Heurístico (Ventanas sospechosas)' : 'Heuristic Scanning (Suspicious Windows)'}</span>
                    </label>`;

code = code.replace(
  /<span>\{language === 'es' \? 'Escáner de Inyección de DLL' : 'DLL Injection Scanner'\}<\/span>\s*<\/label>/,
  `<span>{language === 'es' ? 'Escáner de Inyección de DLL' : 'DLL Injection Scanner'}</span>
                    </label>
${uiInsert}`
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated.');
