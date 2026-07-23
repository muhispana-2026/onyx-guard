const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Insert #include <tlhelp32.h>
content = content.replace('#include <psapi.h>', '#include <psapi.h>\n#include <tlhelp32.h>');

const suspendCode = `
void SuspendAllOtherThreads() {
    HANDLE hThreadSnap = CreateToolhelp32Snapshot(TH32CS_SNAPTHREAD, 0);
    if (hThreadSnap != INVALID_HANDLE_VALUE) {
        THREADENTRY32 te32;
        te32.dwSize = sizeof(THREADENTRY32);
        if (Thread32First(hThreadSnap, &te32)) {
            DWORD currentProcessId = GetCurrentProcessId();
            DWORD currentThreadId = GetCurrentThreadId();
            do {
                if (te32.th32OwnerProcessID == currentProcessId && te32.th32ThreadID != currentThreadId) {
                    HANDLE hThread = OpenThread(THREAD_SUSPEND_RESUME, FALSE, te32.th32ThreadID);
                    if (hThread) {
                        SuspendThread(hThread);
                        CloseHandle(hThread);
                    }
                }
            } while (Thread32Next(hThreadSnap, &te32));
        }
        CloseHandle(hThreadSnap);
    }
}

void HandleFailure(const std::string& message) {
    SuspendAllOtherThreads();
`;

content = content.replace('void HandleFailure(const std::string& message) {\n', suspendCode);

fs.writeFileSync('src/App.tsx', content);
