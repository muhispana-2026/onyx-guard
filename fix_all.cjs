const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix real-time bug
code = code.replace(
`                std::string critFile = CRITICAL_FILES[i].filePath;
                for(size_t j = 0; j < critFile.length(); ++j) {`,
`                std::string critFile = CRITICAL_FILES[i].filePath;
                if (critFile.empty()) continue;
                for(size_t j = 0; j < critFile.length(); ++j) {`
);

// 2. Fix Dropdown text
code = code.replace(
`                      <option value="MSG_BOX">
                        {language === 'es' ? 'Mostrar cuadro de alerta + ExitProcess' : 'MessageBox alert + ExitProcess'}
                      </option>`,
`                      <option value="MSG_BOX">
                        {language === 'es' ? 'Notificación en reloj (Tray) + ExitProcess' : 'Tray Notification + ExitProcess'}
                      </option>`
);

// 3. Fix C# MessageBox
code = code.replace(
`            \${actionOnFailure === 'EXIT' ? '            Process.GetCurrentProcess().Kill();' : (actionOnFailure === 'MSG_BOX' ? '            MessageBox.Show(errorMsg, "Onyx Guard", MessageBoxButtons.OK, MessageBoxIcon.Error);\\n            Process.GetCurrentProcess().Kill();' : '            Process.GetCurrentProcess().Kill();')}`,
`            \${actionOnFailure === 'EXIT' ? '            Process.GetCurrentProcess().Kill();' : (actionOnFailure === 'MSG_BOX' ? '            // En C# usamos solo Kill sin popup si se quiere tray (requeriría wrapper)\\n            Process.GetCurrentProcess().Kill();' : '            Process.GetCurrentProcess().Kill();')}`
);

// 4. Fix Multi-Client MessageBox
code = code.replace(
`                MessageBoxA(NULL, "Maximum allowed clients reached on this PC!", "OnyxGuard", MB_OK | MB_ICONWARNING);
                ExitProcess(0);`,
`                HandleFailure("MULTI-CLIENT DETECTED: Maximum allowed clients reached on this PC!");
                return FALSE;`
);

code = code.replace(
`            MessageBoxA(NULL, "Multi-Client is disabled on this server!", "OnyxGuard", MB_OK | MB_ICONWARNING);
            ExitProcess(0);`,
`            HandleFailure("MULTI-CLIENT DETECTED: Multi-Client is disabled on this server!");
            return FALSE;`
);


fs.writeFileSync('src/App.tsx', code);
console.log('Fixed all');
