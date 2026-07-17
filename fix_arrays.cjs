const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `  const cppCode = useMemo(() => {
    return \`// ============================================================================`,
  `  const cppCode = useMemo(() => {
    // Handling empty arrays for C++ to prevent "empty initializer" compiler errors
    const filesArrayContent = clientFiles.length > 0 
      ? clientFiles.map(f => \`    { "\${f.path}", "\${f.expectedHash}" }\`).join(',\\n')
      : \`    { "", "" } // Dummy element to prevent empty array compilation error\`;
      
    const blacklistedArrayContent = blacklistedPrograms.length > 0
      ? blacklistedPrograms.map(p => \`    "\${p}"\`).join(',\\n')
      : \`    "DummyWindowName" // Dummy element to prevent empty array compilation error\`;

    return \`// ============================================================================`
);

code = code.replace(
  `// ============================================================================
//  ONYX GUARD ANTI-HACK & CLIENT INTEGRITY PLUGIN
//  Target Game Client: Season 6 (main.exe v\${clientVersion})
//  File: Custom.cpp (DLL Project Source Code)
//  Compiled using: Visual Studio 2019/2022 (MSVC Toolset)
// ============================================================================

#include <windows.h>`,
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

#include <windows.h>`
);

code = code.replace(
  `ClientFile CRITICAL_FILES[] = {
\${clientFiles.map(f => \`    { "\${f.path}", "\${f.expectedHash}" }\`).join(',\\n')}
};`,
  `ClientFile CRITICAL_FILES[] = {
\${filesArrayContent}
};`
);

code = code.replace(
  `const char* BLACKLISTED_WINDOWS[] = {
\${blacklistedPrograms.map(p => \`    "\${p}"\`).join(',\\n')}
};

bool ScanForBlacklistedWindows() {
    for (int i = 0; i < sizeof(BLACKLISTED_WINDOWS) / sizeof(BLACKLISTED_WINDOWS[0]); i++) {
        if (FindWindowA(NULL, BLACKLISTED_WINDOWS[i]) != NULL) {
            return true;
        }
    }
    return false;
}\` : ''}`,
  `const char* BLACKLISTED_WINDOWS[] = {
\${blacklistedArrayContent}
};

bool ScanForBlacklistedWindows() {
    for (int i = 0; i < sizeof(BLACKLISTED_WINDOWS) / sizeof(BLACKLISTED_WINDOWS[0]); i++) {
        if (std::string(BLACKLISTED_WINDOWS[i]) == "DummyWindowName") continue;
        if (FindWindowA(NULL, BLACKLISTED_WINDOWS[i]) != NULL) {
            return true;
        }
    }
    return false;
}\` : ''}`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Replaced successfully!");
