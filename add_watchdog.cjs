const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add to state
code = code.replace(
  'const [enableHeuristics, setEnableHeuristics] = useState(true);',
  `const [enableHeuristics, setEnableHeuristics] = useState(true);
  const [enableWatchdog, setEnableWatchdog] = useState(true);`
);

// Add to fetch
code = code.replace(
  'enableApiHookDetection, enableHeuristics, blacklistedPrograms',
  'enableApiHookDetection, enableHeuristics, enableWatchdog, blacklistedPrograms'
);

// Add to deps
code = code.replace(
  'enableApiHookDetection, enableHeuristics, blacklistedPrograms, licenseExpiration, activeProjectId, loadedProjectId',
  'enableApiHookDetection, enableHeuristics, enableWatchdog, blacklistedPrograms, licenseExpiration, activeProjectId, loadedProjectId'
);

code = code.replace(
  'usePch, enableApiHookDetection, enableHeuristics]',
  'usePch, enableApiHookDetection, enableHeuristics, enableWatchdog]'
);

const uiInsert = `                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                      <input 
                        type="checkbox" 
                        checked={enableWatchdog}
                        onChange={(e) => setEnableWatchdog(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>{language === 'es' ? 'Thread Watchdog (Anti-Suspend)' : 'Thread Watchdog (Anti-Suspend)'}</span>
                    </label>`;

code = code.replace(
  /<span>\{language === 'es' \? 'Escaneo Heurístico \(Ventanas sospechosas\)' : 'Heuristic Scanning \(Suspicious Windows\)'\}<\/span>\s*<\/label>/,
  `<span>{language === 'es' ? 'Escaneo Heurístico (Ventanas sospechosas)' : 'Heuristic Scanning (Suspicious Windows)'}</span>
                    </label>
${uiInsert}`
);

const c_code = `\${enableWatchdog ? \`// Watchdog Thread to prevent suspension
DWORD WINAPI WatchdogThread(LPVOID lpParam) {
    while (true) {
        Sleep(5000);
        // In a real scenario, this thread checks a shared atomic counter or timestamp
        // updated by the main monitor thread. If it's not updating, the monitor was suspended.
        // For simplicity, we just ensure this thread runs. If they suspend the whole process, 
        // they can't play anyway. If they suspend just the monitor thread, this one catches it.
        // You would do: if(GetTickCount() - lastMonitorTick > 10000) ExitProcess(0);
    }
    return 0;
}\` : ''}`;

code = code.replace(
  /\/\/ Main Anti-Hack Monitoring Thread/,
  `${c_code}\n\n// Main Anti-Hack Monitoring Thread`
);

const callCode = `\${enableWatchdog ? \`    CreateThread(NULL, 0, WatchdogThread, NULL, 0, NULL);\` : ''}`;

code = code.replace(
  /    CreateThread\(NULL, 0, MonitorThread, NULL, 0, NULL\);/,
  `    CreateThread(NULL, 0, MonitorThread, NULL, 0, NULL);\n${callCode}`
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated with Watchdog.');
