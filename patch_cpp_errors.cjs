const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix preprocessor newlines
code = code.replace(/#include <windows\.h>#include <objbase\.h>/g, '#include <windows.h>\\n#include <objbase.h>');
code = code.replace(/#include <psapi\.h>#pragma comment\(lib, "psapi\.lib"\)/g, '#include <psapi.h>\\n#pragma comment(lib, "psapi.lib")');

// Fix DllMain case initialization
code = code.replace(
  /case DLL_PROCESS_ATTACH:\n        \/\/ Disable unnecessary thread execution logs to optimize performance/,
  'case DLL_PROCESS_ATTACH: {\\n        // Disable unnecessary thread execution logs to optimize performance'
);

code = code.replace(
  /        CreateThread\(NULL, 0, IntegrityCheckThread, NULL, 0, NULL\);\n        break;\n    case DLL_THREAD_ATTACH:/,
  '        CreateThread(NULL, 0, IntegrityCheckThread, NULL, 0, NULL);\\n        break;\\n    }\\n    case DLL_THREAD_ATTACH:'
);

fs.writeFileSync('src/App.tsx', code);
