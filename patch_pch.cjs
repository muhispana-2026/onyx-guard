const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add the state variable
code = code.replace(
  "const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'csharp'>('cpp');",
  "const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'csharp'>('cpp');\n  const [usePch, setUsePch] = useState(true);"
);

// Add it to the cppCode generation
code = code.replace(
  `// ============================================================================
//  ONYX GUARD ANTI-HACK & CLIENT INTEGRITY PLUGIN
//  Target Game Client: Season 6 (main.exe v\${clientVersion})
//  File: Custom.cpp (DLL Project Source Code)
//  Compiled using: Visual Studio 2019/2022 (MSVC Toolset)
// ============================================================================

// [!] IMPORTANTE PARA VISUAL STUDIO:
// Si recibes el error "unexpected end of file while looking for precompiled header directive"
// significa que tienes los "Encabezados Precompilados" (Precompiled Headers) activados 
// en las propiedades de tu proyecto. Tienes dos opciones:
// 1. Descomenta la siguiente linea (o agregala hasta arriba del archivo):
// #include "pch.h"
// 2. O ve a Propiedades del Proyecto -> C/C++ -> Encabezados Precompilados y desactivalos.

#include <windows.h>`,
  `// ============================================================================
//  ONYX GUARD ANTI-HACK & CLIENT INTEGRITY PLUGIN
//  Target Game Client: Season 6 (main.exe v\${clientVersion})
//  File: Custom.cpp (DLL Project Source Code)
//  Compiled using: Visual Studio 2019/2022 (MSVC Toolset)
// ============================================================================
\${usePch ? '\\n#include "pch.h"\\n' : ''}
#include <windows.h>`
);

// Add it to the useMemo dependencies
code = code.replace(
  "enablePayloadEncryption, enableAntiDebug, enableProcessBinding]);",
  "enablePayloadEncryption, enableAntiDebug, enableProcessBinding, usePch]);"
);

// Add the UI toggle
const toggleHTML = `
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                    <input 
                      type="checkbox" 
                      checked={enableAntiDebug}
`;

const toggleReplacement = `
                  {selectedLanguage === 'cpp' && (
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-4 pt-4 border-t border-slate-800">
                      <input 
                        type="checkbox" 
                        checked={usePch}
                        onChange={(e) => setUsePch(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>{language === 'es' ? 'Incluir #include "pch.h" (Para Visual Studio)' : 'Include #include "pch.h" (For Visual Studio)'}</span>
                    </label>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 mt-1">
                    <input 
                      type="checkbox" 
                      checked={enableAntiDebug}
`;

code = code.replace(toggleHTML, toggleReplacement);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched!");
