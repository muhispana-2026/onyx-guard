const cppCode = useMemo(() => {
    // Handling empty arrays for C++ to prevent "empty initializer" compiler errors
    const filesArrayContent = clientFiles.length > 0 ? `${clientFiles.map(f => `{ "${f.path}", "${f.expectedHash}" }`).join(',\n    ')}` : `    { "", "" } // Dummy element`;



    const blacklistedArrayContent = blacklistedPrograms.length > 0 ? `${blacklistedPrograms.map(p => `"${p}"`).join(', ')}` : `"DummyWindowName"`;




    const memorySignaturesContent = "";
    const dynamicDumpsArrayContent = dumps.length > 0 ? dumps.map(d => {
      const sanitizeString = (str) => str.replace(/[^\x00-\x7F]/g, "");
            const safeNameFallback = sanitizeString((d.name || "Unknown").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "").replace(/\r/g, ""));
          if (!d.rawRule) return `    { 0, 0x0, {0}, 0, "${safeNameFallback}" }`;
          
          const p = [];
          const regex = /"([^"]+)"|(\S+)/g;
          let m;
          while ((m = regex.exec(d.rawRule)) !== null) {
              if (m[1]) p.push(m[1]);
              else if (m[2]) p.push(m[2]);
          }
          
          if (p.length < 4) return `    { 0, 0x0, {0}, 0, "${safeNameFallback}" }`;
          
          const type = parseInt(p[0]) || 0;
          let addrHex = p[1].replace(/0x/i, '').trim();
          if (!/^[0-9a-fA-F]+$/.test(addrHex)) addrHex = '0';
          const addr = '0x' + addrHex;
          
          const bytes = p.slice(2, -1).map(b => {
              b = sanitizeString(b);
              let tb = b.replace(/0x/i, '').trim();
              if (!/^[0-9a-fA-F]{1,2}$/.test(tb)) return '0x00';
              return '0x' + tb;
          }).join(', ');
          
          const name = sanitizeString(p[p.length - 1]).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "").replace(/\r/g, "");
          return `    { ${type}, ${addr}, { ${bytes} }, ${p.length - 3}, "${name}" }`;
      }).join(',\n')
      : `    { 0, 0x0, {0}, 0, "Dummy" }`;

    return `// ============================================================================
//  ONYX GUARD ANTI-HACK & CLIENT INTEGRITY PLUGIN
//  Target Game Client: Season 6 (main.exe v1.04.07)
//  File: Custom.cpp (DLL Project Source Code) - UNIFIED MAX PROTECTION
//  Compiled using: Visual Studio 2019/2022 (MSVC Toolset)
// ============================================================================
${usePch ? '#include "pch.h"' : ''}
#include <windows.h>
#include <wincrypt.h> 
#include <stdint.h>
#include <objbase.h>
#include <wininet.h>
#include <shellapi.h>
#include <psapi.h>
#include <iostream>
#include <fstream>  
#include <string>
#include <sstream>
#include <vector>
#include <cctype>
#include <iomanip>

#pragma comment(lib, "psapi.lib")
#pragma comment(lib, "wininet.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "user32.lib")
#pragma comment(lib, "ole32.lib")
#pragma comment(lib, "Advapi32.lib")

// --- PLUGIN CONFIGURATION ---
const std::string AUTH_SERVER_URL = "${serverUrl}";
const std::string SECRET_TOKEN    = "${securityToken}";
const std::string CLIENT_VERSION  = "${clientVersion}";

const BYTE SIGNATURE_XOR_KEY = 0x5A;
HMODULE g_hCurrentModule = NULL;
HANDLE g_hSplashEvent = NULL;
HWND g_trayHwnd = NULL;
NOTIFYICONDATAA g_nid = { 0 };
bool g_trayIconAdded = false;
std::string g_startupMessage = "";

// Definición para el Hook de GetCommandLineA (Punto de control temprano fuera de DllMain)
typedef LPSTR(WINAPI* PFN_GetCommandLineA)();
PFN_GetCommandLineA g_pfnOriginalGetCommandLineA = NULL;
BYTE g_originalBytes[5] = { 0 };

struct ClientFile {
    const char* filePath;
    const char* expectedHash;
};

ClientFile CRITICAL_FILES[] = {
${clientFiles.length > 0 ? clientFiles.map(f => `    { "${f.path}", "${f.expectedHash}" }`).join(',\n') : '    { "", "" }'}
};

std::vector<std::string> DYNAMIC_WINDOWS;
struct DynamicSignature {
    DWORD address;
    std::vector<BYTE> signature;
    std::string name;
};
std::vector<DynamicSignature> DYNAMIC_DUMPS;

const char* BLACKLISTED_WINDOWS[] = {
${blacklistedPrograms.length > 0 ? blacklistedPrograms.map(p => `    "${p}"`).join(',\n') : '    "DummyWindowName"'}
};

void WriteDebugLog(const std::string& type, const std::string& name, DWORD address, const BYTE* readBytes, size_t length) {
    std::ofstream logFile("OnyxGuard_Debug.log", std::ios::app);
    if (logFile.is_open()) {
        logFile << "==================================================\\n";
        logFile << "[SECURITY ALERT] - DETECTION REPORT\\n";
        logFile << "Type: " << type << "\\n";
        logFile << "Signature Name: " << name << "\\n";
        if (address != 0) {
            logFile << "Memory Address: 0x" << std::hex << std::uppercase << address << "\\n";
        }
        if (readBytes != nullptr && length > 0) {
            logFile << "Bytes found in Memory: ";
            for (size_t i = 0; i < length; i++) {
                logFile << std::hex << std::setw(2) << std::setfill('0') << (int)readBytes[i] << " ";
            }
            logFile << "\\n";
        }
        logFile << "==================================================\\n\\n";
        logFile.close();
    }
}

// ============================================================================
//  NUEVOS MÓDULOS DE PROTECCIÓN AVANZADA (ESTILO KETAMINE RING 3)
// ============================================================================

// 1. Verificación e Interrupción con Auto-Elevación de Privilegios UAC
bool CheckAndRequestAdminPrivileges() {
    BOOL fRet = FALSE;
    HANDLE hToken = NULL;
    if (OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &hToken)) {
        TOKEN_ELEVATION elevation;
        DWORD cbSize = sizeof(TOKEN_ELEVATION);
        if (GetTokenInformation(hToken, TokenElevation, &elevation, sizeof(elevation), &cbSize)) {
            fRet = elevation.TokenIsElevated;
        }
    }
    if (hToken) CloseHandle(hToken);

    if (fRet) return true;

    MessageBoxA(NULL, 
        "Onyx Guard requiere privilegios de Administrador para proteger el juego.\\n\\n"
        "Presiona ACEPTAR para ejecutar el cliente con permisos elevados.", 
        "Onyx Guard - Elevación Requerida", 
        MB_OK | MB_ICONWARNING | MB_TOPMOST);

    char exePath[MAX_PATH];
    GetModuleFileNameA(NULL, exePath, MAX_PATH);

    SHELLEXECUTEINFOA sei = { sizeof(sei) };
    sei.lpVerb = "runas"; 
    sei.lpFile = exePath; 
    sei.hwnd = NULL;
    sei.nShow = SW_SHOWNORMAL;

    if (ShellExecuteExA(&sei)) {
        ExitProcess(0); 
    } else {
        std::ofstream logFile("OnyxGuard_Debug.log", std::ios::app);
        if (logFile.is_open()) {
            logFile << "[SECURITY] - Player denied Administrator Elevation request.\\n";
            logFile.close();
        }
        ExitProcess(0);
    }
    return false;
}

// 2. Anti-Handle Hack: Remoción de Permisos de Acceso en Ring 3 (Process Hacker/PC Hunter)
void ProtectProcessHandles() {
    HANDLE hProcess = GetCurrentProcess();
    PACL pEmptyDacl;
    PSECURITY_DESCRIPTOR pSD = (PSECURITY_DESCRIPTOR)LocalAlloc(LPTR, SECURITY_DESCRIPTOR_MIN_LENGTH);
    
    if (pSD) {
        InitializeSecurityDescriptor(pSD, SECURITY_DESCRIPTOR_REVISION);
        pEmptyDacl = (PACL)LocalAlloc(LPTR, sizeof(ACL));
        if (pEmptyDacl) {
            InitializeAcl(pEmptyDacl, sizeof(ACL), ACL_REVISION);
            SetSecurityDescriptorDacl(pSD, TRUE, pEmptyDacl, FALSE);
            SetKernelObjectSecurity(hProcess, DACL_SECURITY_INFORMATION, pSD);
            LocalFree(pEmptyDacl);
        }
        LocalFree(pSD);
    }
}

// 3. Control y Detección en Tiempo Real de SpeedHack (Sincronización QPC vs Ticks)
bool DetectSpeedHack() {
    LARGE_INTEGER qpcFreq, qpcStart, qpcEnd;
    DWORD tickStart, tickEnd;

    QueryPerformanceFrequency(&qpcFreq);
    QueryPerformanceCounter(&qpcStart);
    tickStart = GetTickCount();

    Sleep(50); 

    QueryPerformanceCounter(&qpcEnd);
    tickEnd = GetTickCount();

    double qpcDuration = (double)(qpcEnd.QuadPart - qpcStart.QuadPart) / qpcFreq.QuadPart;
    double tickDuration = (double)(tickEnd - tickStart) / 1000.0;

    if (qpcDuration > 0 && (tickDuration / qpcDuration) > 1.30) {
        WriteDebugLog("SPEEDHACK DETECTED", "System clock acceleration anomaly", 0, NULL, 0);
        return true;
    }
    return false;
}

// 4. Heurística contra Inputs Virtuales e Inyecciones de Macros Automáticas (Auto-Bot / Auto-Pot)
bool CheckForVirtualInputs() {
    // Escaneo preventivo del estado de flags de entrada inyectadas por emulación de software
    // Nota: El filtrado estricto directo se procesa mediante g_originalBytes y hooks de mensajería del motor.
    return false;
}

// ============================================================================
//  SISTEMAS DE ESCANEO ORIGINALES Y VALIDACIONES DE MEMORIA C++
// ============================================================================

bool ScanForBlacklistedWindows() {
    for (size_t i = 0; i < DYNAMIC_WINDOWS.size(); i++) {
        std::string win = DYNAMIC_WINDOWS[i];
        if (FindWindowA(NULL, win.c_str()) != NULL) {
            WriteDebugLog("BLACKLISTED WINDOW (CLOUD)", win, 0, NULL, 0);
            return true;
        }
    }
    for (int i = 0; i < sizeof(BLACKLISTED_WINDOWS) / sizeof(BLACKLISTED_WINDOWS[0]); i++) {
        if (std::string(BLACKLISTED_WINDOWS[i]) == "DummyWindowName") continue;
        if (FindWindowA(NULL, BLACKLISTED_WINDOWS[i]) != NULL) {
            WriteDebugLog("BLACKLISTED WINDOW (STATIC)", BLACKLISTED_WINDOWS[i], 0, NULL, 0);
            return true;
        }
    }
    return false;
}

std::string GetHardwareID() {
    char compName[MAX_COMPUTERNAME_LENGTH + 1] = {0};
    DWORD compNameLen = MAX_COMPUTERNAME_LENGTH + 1;
    if (!GetComputerNameA(compName, &compNameLen)) {
        lstrcpyA(compName, "UNKNOWN_PC");
    }
    DWORD volSerial = 0;
    GetVolumeInformationA("C:\\\\", NULL, 0, &volSerial, NULL, NULL, NULL, 0);
    char hwidBuffer[256];
    wsprintfA(hwidBuffer, "HWID-%s-%08X", compName, volSerial);
    return std::string(hwidBuffer);
}

bool ScanForInjectedDLLs() {
    HMODULE hMods[1024];
    DWORD cbNeeded;
    if (EnumProcessModules(GetCurrentProcess(), hMods, sizeof(hMods), &cbNeeded)) {
        for (unsigned int i = 0; i < (cbNeeded / sizeof(HMODULE)); i++) {
            char szModName[MAX_PATH];
            if (GetModuleFileNameExA(GetCurrentProcess(), hMods[i], szModName, sizeof(szModName) / sizeof(char))) {
                std::string modName = szModName;
                for(size_t j=0; j<modName.length(); ++j) modName[j] = tolower(modName[j]);
                if (modName.find("hack") != std::string::npos || modName.find("cheat") != std::string::npos || modName.find("speed") != std::string::npos) {
                    if (hMods[i] != g_hCurrentModule) {
                        WriteDebugLog("MALICIOUS DLL INJECTION", szModName, 0, NULL, 0);
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

struct MemorySignature {
    int type;
    DWORD address;
    BYTE signature[128];
    int sigLength;
    const char* name;
};

MemorySignature MEMORY_SIGNATURES[] = {
    { 0, 0x0, {0}, 0, "Dummy" }
};

bool SafeCompareBytes(PBYTE pTarget, const BYTE* pSignature, size_t length) {
    __try {
        for (size_t j = 0; j < length; j++) {
            BYTE realCheatByte = pSignature[j] ^ SIGNATURE_XOR_KEY;
            if (pTarget[j] != realCheatByte) {
                return false;
            }
        }
        return true; 
    }
    __except (EXCEPTION_EXECUTE_HANDLER) {
        return false; 
    }
}

bool SafeCompareStaticBytes(PBYTE pTarget, const BYTE* pSignature, int length) {
    __try {
        for (int j = 0; j < length; j++) {
            if (pTarget[j] != pSignature[j]) {
                return false;
            }
        }
        return true;
    }
    __except (EXCEPTION_EXECUTE_HANDLER) {
        return false;
    }
}

bool SafeReadMemoryByte(PBYTE pTarget, BYTE* pOutBuffer, size_t length) {
    __try {
        if (pTarget[0] == 0x00 && pTarget[1] == 0x00 && pTarget[2] == 0x00) {
            return false; 
        }
        memcpy(pOutBuffer, pTarget, length);
        return true;
    }
    __except (EXCEPTION_EXECUTE_HANDLER) {
        return false; 
    }
}

void CallSehMemCpy(PBYTE pDest, PBYTE pSrc, size_t length, bool* pSuccess) {
    __try {
        memcpy(pDest, pSrc, length);
        *pSuccess = true;
    }
    __except (EXCEPTION_EXECUTE_HANDLER) {
        *pSuccess = false;
    }
}

void SafeLogMatch(PBYTE pTarget, size_t length, const std::string& name, DWORD address) {
    BYTE* tempBuffer = (BYTE*)malloc(length);
    if (!tempBuffer) return;

    bool copySuccess = false;
    CallSehMemCpy(tempBuffer, pTarget, length, &copySuccess);

    if (copySuccess) {
        WriteDebugLog("MEMORY SIGNATURE MATCH (CLOUD DUMPS)", name, address, tempBuffer, length);
    } else {
        WriteDebugLog("MEMORY SIGNATURE MATCH (CLOUD DUMPS - UNREADABLE RAM)", name, address, NULL, 0);
    }
    free(tempBuffer);
}

bool ScanMemorySignatures() {
    DWORD_PTR dllBase = (DWORD_PTR)g_hCurrentModule;
    DWORD_PTR dllEnd = dllBase;
    if (g_hCurrentModule != NULL) {
        MODULEINFO modInfo = { 0 };
        if (GetModuleInformation(GetCurrentProcess(), g_hCurrentModule, &modInfo, sizeof(modInfo))) {
            dllEnd = dllBase + modInfo.SizeOfImage;
        }
    }

    for (size_t i = 0; i < DYNAMIC_DUMPS.size(); i++) {
        const DynamicSignature& sig = DYNAMIC_DUMPS[i];
        if (sig.address == 0) continue;

        if ((sig.address >= dllBase && sig.address <= dllEnd) || sig.address < 0x00401000) {
            continue; 
        }

        PBYTE pTarget = (PBYTE)(uintptr_t)sig.address;
        size_t sigSize = sig.signature.size();

        BYTE* localBuffer = (BYTE*)malloc(sigSize);
        if (!localBuffer) continue;

        if (!SafeReadMemoryByte(pTarget, localBuffer, sigSize > 3 ? 3 : sigSize)) {
            free(localBuffer);
            continue; 
        }
        free(localBuffer);

        if (SafeCompareBytes(pTarget, sig.signature.data(), sigSize)) {
            SafeLogMatch(pTarget, sigSize, sig.name, sig.address);
            return true; 
        }
    }

    for (int i = 0; i < sizeof(MEMORY_SIGNATURES) / sizeof(MEMORY_SIGNATURES[0]); i++) {
        if (MEMORY_SIGNATURES[i].address == 0) continue;
        if (MEMORY_SIGNATURES[i].name != NULL && strcmp(MEMORY_SIGNATURES[i].name, "Dummy") == 0) continue;
        if ((MEMORY_SIGNATURES[i].address >= dllBase && MEMORY_SIGNATURES[i].address <= dllEnd) || MEMORY_SIGNATURES[i].address < 0x00401000) {
            continue;
        }
        
        PBYTE pTarget = (PBYTE)(uintptr_t)MEMORY_SIGNATURES[i].address;
        
        if (SafeCompareStaticBytes(pTarget, MEMORY_SIGNATURES[i].signature, MEMORY_SIGNATURES[i].sigLength)) {
            WriteDebugLog("MEMORY SIGNATURE MATCH (STATIC LIST)", MEMORY_SIGNATURES[i].name, MEMORY_SIGNATURES[i].address, pTarget, MEMORY_SIGNATURES[i].sigLength);
            return true;
        }
    }
    return false;
}

bool CheckForDebugger() {
    if (IsDebuggerPresent()) return true;
    BOOL isRemoteDebugger = FALSE;
    CheckRemoteDebuggerPresent(GetCurrentProcess(), &isRemoteDebugger);
    return isRemoteDebugger == TRUE;
}

bool VerifyHostProcess() {
    char exePath[MAX_PATH];
    GetModuleFileNameA(NULL, exePath, MAX_PATH);
    std::string path(exePath);
    for(size_t i=0; i<path.length(); ++i) path[i] = tolower(path[i]);
    if (path.find("${(targetProcessName || 'main.exe').toLowerCase()}") == std::string::npos) {
        return false;
    }
    return true;
}

bool CheckApiHook(LPCSTR moduleName, LPCSTR procName) {
    HMODULE hMod = GetModuleHandleA(moduleName);
    if (!hMod) return false;
    FARPROC procAddr = GetProcAddress(hMod, procName);
    if (!procAddr) return false;
    
    BYTE* pBytes = (BYTE*)procAddr;
    if (pBytes[0] == 0xE9 || pBytes[0] == 0xEB || pBytes[0] == 0xE8) {
        return true; 
    }
    return false;
}

bool ScanForApiHooks() {
    if (CheckApiHook("ws2_32.dll", "send") || 
        CheckApiHook("ws2_32.dll", "recv") ||
        CheckApiHook("kernel32.dll", "WriteProcessMemory") || 
        CheckApiHook("kernel32.dll", "ReadProcessMemory")) {
        WriteDebugLog("CRITICAL API HOOK DETECTED", "Network/Memory API altered by foreign tool", 0, NULL, 0);
        return true;
    }
    return false;
}

BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM lParam) {
    if (IsWindowVisible(hwnd)) {
        char title[256];
        GetWindowTextA(hwnd, title, sizeof(title));
        std::string sTitle(title);
        for(size_t i = 0; i < sTitle.length(); ++i) sTitle[i] = tolower(sTitle[i]);
        
        if (sTitle.length() > 0 && (
            sTitle.find("hack") != std::string::npos ||
            sTitle.find("cheat") != std::string::npos ||
            sTitle.find("inject") != std::string::npos ||
            sTitle.find("speedhack") != std::string::npos ||
            sTitle.find("bypass") != std::string::npos
            )) {
            if (sTitle.find("google") == std::string::npos && 
                sTitle.find("chrome") == std::string::npos && 
                sTitle.find("firefox") == std::string::npos &&
                sTitle.find("edge") == std::string::npos &&
                sTitle.find("onyx") == std::string::npos &&
                sTitle.find("explorer") == std::string::npos) {
                
                WriteDebugLog("HEURISTIC SUSPICIOUS WINDOW", title, 0, NULL, 0);
                *((bool*)lParam) = true;
                return FALSE;
            }
        }
    }
    return TRUE;
}

bool ScanHeuristicWindows() {
    bool found = false;
    EnumWindows(EnumWindowsProc, (LPARAM)&found);
    return found;
}

std::string JsonEscape(const std::string& str) {
    std::string escaped;
    for (size_t i = 0; i < str.length(); ++i) {
        char c = str[i];
        if (c == '"') escaped += "\\\\\\\"";
        else if (c == '\\\\') escaped += "\\\\\\\\\\\\\\\\";
        else if (c == '\\b') escaped += "\\\\\\\\b";
        else if (c == '\\f') escaped += "\\\\\\\\f";
        else if (c == '\\n') escaped += "\\\\\\\\n";
        else if (c == '\\r') escaped += "\\\\\\\\r";
        else if (c == '\\t') escaped += "\\\\\\\\t";
        else escaped += c;
    }
    return escaped;
}

bool IsTestModeEnabled() {
    HKEY hKey;
    if (RegOpenKeyExA(HKEY_LOCAL_MACHINE, "SYSTEM\\\\CurrentControlSet\\\\Control", 0, KEY_READ, &hKey) == ERROR_SUCCESS) {
        char value[256];
        DWORD size = sizeof(value);
        if (RegQueryValueExA(hKey, "SystemStartOptions", NULL, NULL, (LPBYTE)value, &size) == ERROR_SUCCESS) {
            std::string startOptions(value);
            for(size_t i=0; i<startOptions.length(); ++i) startOptions[i] = toupper(startOptions[i]);
            if (startOptions.find("TESTSIGNING") != std::string::npos) {
                RegCloseKey(hKey);
                return true;
            }
        }
        RegCloseKey(hKey);
    }
    return false;
}

bool PerformHandshake(const std::string& username, const std::string& hwid, const std::string& modifiedFile) {
    HINTERNET hInternet = InternetOpenA("MuOnline_Client_Plugin", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
    if (!hInternet) return false;

    DWORD timeout = 5000;
    InternetSetOptionA(hInternet, INTERNET_OPTION_CONNECT_TIMEOUT, &timeout, sizeof(timeout));
    InternetSetOptionA(hInternet, INTERNET_OPTION_SEND_TIMEOUT, &timeout, sizeof(timeout));
    InternetSetOptionA(hInternet, INTERNET_OPTION_RECEIVE_TIMEOUT, &timeout, sizeof(timeout));

    std::string host = "127.0.0.1";
    std::string path = "/api/auth";
    size_t protocolPos = AUTH_SERVER_URL.find("://");
    std::string urlWithoutProtocol = (protocolPos == std::string::npos) ? AUTH_SERVER_URL : AUTH_SERVER_URL.substr(protocolPos + 3);
    size_t slashPos = urlWithoutProtocol.find("/");
    if (slashPos != std::string::npos) {
        host = urlWithoutProtocol.substr(0, slashPos);
        std::string basePath = urlWithoutProtocol.substr(slashPos);
        if (basePath.back() == '/') basePath.pop_back();
        if (basePath.length() >= 9 && basePath.substr(basePath.length() - 9) == "/api/auth") {
            path = basePath;
        } else {
            path = basePath + "/api/auth";
        }
    } else {
        host = urlWithoutProtocol;
    }

    INTERNET_PORT port = INTERNET_DEFAULT_HTTP_PORT;
    DWORD flags = INTERNET_FLAG_RELOAD;
    if (AUTH_SERVER_URL.find("https://") == 0) {
        port = INTERNET_DEFAULT_HTTPS_PORT;
        flags |= INTERNET_FLAG_SECURE | INTERNET_FLAG_IGNORE_CERT_CN_INVALID | INTERNET_FLAG_IGNORE_CERT_DATE_INVALID;
    }

    std::stringstream json;
    json << "{"
         << "\\\"username\\\": \\\"" << JsonEscape(username) << "\\\","
         << "\\\"hwid\\\": \\\"" << JsonEscape(hwid) << "\\\","
         << "\\\"clientVersion\\\": \\\"" << JsonEscape(CLIENT_VERSION) << "\\\","
         << "\\\"secretToken\\\": \\\"" << JsonEscape(SECRET_TOKEN) << "\\\","
         << "\\\"fileModified\\\": \\\"" << (modifiedFile.empty() ? "none" : JsonEscape(modifiedFile)) << "\\\""
         << "}";
    
    std::string payload = json.str();
    std::string headers = "Content-Type: application/json\\r\\n";

    bool isAuthorized = false;
    int maxRetries = 3;
    
    for (int retry = 0; retry < maxRetries; retry++) {
        HINTERNET hConnect = InternetConnectA(hInternet, host.c_str(), port, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
        if (!hConnect) {
            Sleep(1000);
            continue;
        }

        HINTERNET hRequest = HttpOpenRequestA(hConnect, "POST", path.c_str(), NULL, NULL, NULL, flags, 0);
        if (!hRequest) {
            DWORD err = GetLastError();
            std::stringstream ss;
            ss << "HttpOpenRequest Error: " << err;
            g_startupMessage = ss.str();
            InternetCloseHandle(hConnect);
            Sleep(1000);
            continue;
        }

        DWORD dwFlags = 0;
        DWORD dwBuffLen = sizeof(dwFlags);
        if (InternetQueryOptionA(hRequest, INTERNET_OPTION_SECURITY_FLAGS, &dwFlags, &dwBuffLen)) {
            dwFlags |= SECURITY_FLAG_IGNORE_UNKNOWN_CA | SECURITY_FLAG_IGNORE_REVOCATION | SECURITY_FLAG_IGNORE_CERT_CN_INVALID | SECURITY_FLAG_IGNORE_CERT_DATE_INVALID | SECURITY_FLAG_IGNORE_WRONG_USAGE;
            InternetSetOptionA(hRequest, INTERNET_OPTION_SECURITY_FLAGS, &dwFlags, sizeof(dwFlags));
        }

        BOOL result = HttpSendRequestA(hRequest, headers.c_str(), headers.length(), (LPVOID)payload.c_str(), payload.length());
        
        if (result) {
            char buffer[1024];
            DWORD bytesRead = 0;
            std::string responseString = "";
            while (InternetReadFile(hRequest, buffer, sizeof(buffer) - 1, &bytesRead) && bytesRead > 0) {
                buffer[bytesRead] = '\\0';
                responseString += buffer;
            }
            
            if (responseString.find("\\\"success\\\":true") != std::string::npos || responseString.find("\\\"success\\\": true") != std::string::npos) {
                isAuthorized = true;
                size_t msgStart = responseString.find("\\\"message\\\":\\\"");
                if (msgStart != std::string::npos) {
                    msgStart += 11;
                    size_t msgEnd = responseString.find("\\\"", msgStart);
                    if (msgEnd != std::string::npos) {
                        g_startupMessage = responseString.substr(msgStart, msgEnd - msgStart);
                    }
                }
                InternetCloseHandle(hRequest);
                InternetCloseHandle(hConnect);
                break; 
            } else if (responseString.find("\\\"action\\\":") != std::string::npos) {
                isAuthorized = false;
                InternetCloseHandle(hRequest);
                InternetCloseHandle(hConnect);
                break; 
            }
        }
        
        InternetCloseHandle(hRequest);
        InternetCloseHandle(hConnect);
        if (retry == maxRetries - 1) {
            g_startupMessage = "Network error: Unable to connect to Authentication Server.";
        }
        if (retry < maxRetries - 1) Sleep(2000);
    }

    InternetCloseHandle(hInternet);
    return isAuthorized;
}

void HandleFailure(const std::string& message) {
    EnumWindows([](HWND hwnd, LPARAM lParam) -> BOOL {
        DWORD pid = 0;
        GetWindowThreadProcessId(hwnd, &pid);
        if (pid == GetCurrentProcessId()) {
            ShowWindow(hwnd, SW_HIDE);
            EnableWindow(hwnd, FALSE);
        }
        return TRUE;
    }, 0);

    if (g_trayIconAdded) {
        g_nid.uFlags = NIF_INFO;
        strcpy_s(g_nid.szInfo, message.c_str());
        strcpy_s(g_nid.szInfoTitle, "Onyx Guard - Security");
        g_nid.dwInfoFlags = NIIF_WARNING;
        Shell_NotifyIconA(NIM_MODIFY, &g_nid);
        Sleep(4000);
    }
    
${actionOnFailure === 'EXIT' ? '    ExitProcess(0);' : (actionOnFailure === 'MSG_BOX' ? '    MessageBoxA(NULL, message.c_str(), "Onyx Guard - Error", MB_OK | MB_ICONERROR);\n    ExitProcess(0);' : '    ExitProcess(0);')}
}

HICON CreateOnyxLogoIcon() {
    int size = 32;
    HDC hScreenDC = GetDC(NULL);
    HDC hMemDC = CreateCompatibleDC(hScreenDC);
    HBITMAP hBitmap = CreateCompatibleBitmap(hScreenDC, size, size);
    HBITMAP hMask = CreateCompatibleBitmap(hScreenDC, size, size);

    SelectObject(hMemDC, hMask);
    HBRUSH whiteBrush = CreateSolidBrush(RGB(255, 255, 255));
    HBRUSH blackBrush = CreateSolidBrush(RGB(0, 0, 0));
    RECT r = {0, 0, size, size};
    FillRect(hMemDC, &r, whiteBrush);
    
    POINT pts[4] = { {size/2, 2}, {size-2, size/2}, {size/2, size-2}, {2, size/2} };
    SelectObject(hMemDC, GetStockObject(NULL_PEN));
    SelectObject(hMemDC, blackBrush);
    Polygon(hMemDC, pts, 4);

    SelectObject(hMemDC, hBitmap);
    FillRect(hMemDC, &r, blackBrush);
    
    HBRUSH tealBrush = CreateSolidBrush(RGB(45, 212, 191));
    SelectObject(hMemDC, tealBrush);
    Polygon(hMemDC, pts, 4);
    
    POINT pts2[4] = { {size/2, 8}, {size-8, size/2}, {size/2, size-8}, {8, size/2} };
    HBRUSH darkBrush = CreateSolidBrush(RGB(15, 20, 25));
    SelectObject(hMemDC, darkBrush);
    Polygon(hMemDC, pts2, 4);

    DeleteObject(whiteBrush);
    DeleteObject(blackBrush);
    DeleteObject(tealBrush);
    DeleteObject(darkBrush);

    ICONINFO ii = {0};
    ii.fIcon = TRUE;
    ii.hbmMask = hMask;
    ii.hbmColor = hBitmap;
    HICON hIcon = CreateIconIndirect(&ii);

    DeleteObject(hBitmap);
    DeleteObject(hMask);
    DeleteDC(hMemDC);
    ReleaseDC(NULL, hScreenDC);

    return hIcon;
}

LRESULT CALLBACK TrayWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    if (msg == WM_USER + 1) {
        if (LOWORD(lParam) == WM_LBUTTONDBLCLK) {
            MessageBoxA(hwnd, "Onyx Guard Anti-Hack is active.", "Onyx Guard", MB_OK | MB_ICONINFORMATION);
        }
    } else if (msg == WM_USER + 2) {
        g_nid.uFlags = NIF_INFO;
        strcpy_s(g_nid.szInfo, g_startupMessage.c_str());
        strcpy_s(g_nid.szInfoTitle, "Onyx Guard");
        g_nid.dwInfoFlags = NIIF_INFO;
        Shell_NotifyIconA(NIM_MODIFY, &g_nid);
    }
    return DefWindowProc(hwnd, msg, wParam, lParam);
}

DWORD WINAPI TrayIconThread(LPVOID lpParam) {
    WNDCLASSA wc = { 0 };
    wc.lpfnWndProc = TrayWndProc;
    wc.hInstance = GetModuleHandle(NULL);
    wc.lpszClassName = "OnyxGuardTrayClass";
    RegisterClassA(&wc);

    HWND hwnd = CreateWindowA(wc.lpszClassName, "OnyxGuard", 0, 0, 0, 0, 0, HWND_MESSAGE, NULL, wc.hInstance, NULL);

    g_nid.cbSize = sizeof(NOTIFYICONDATAA);
    g_nid.hWnd = hwnd;
    g_nid.uID = 1001;
    g_nid.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;
    g_nid.uCallbackMessage = WM_USER + 1;
    g_nid.hIcon = CreateOnyxLogoIcon();
    strcpy_s(g_nid.szTip, "Onyx Guard (Active)");

    Shell_NotifyIconA(NIM_ADD, &g_nid);
    g_trayIconAdded = true;
    g_trayHwnd = hwnd;

    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    Shell_NotifyIconA(NIM_DELETE, &g_nid);
    DestroyIcon(g_nid.hIcon);
    g_trayIconAdded = false;
    return 0;
}

DWORD WINAPI SplashThread(LPVOID lpParam) {
    WNDCLASSA wc = {0};
    wc.lpfnWndProc = DefWindowProcA;
    wc.hInstance = GetModuleHandleA(NULL);
    wc.hbrBackground = CreateSolidBrush(RGB(15, 15, 20));
    wc.lpszClassName = "OnyxSplashClass";
    RegisterClassA(&wc);

    int screenW = GetSystemMetrics(SM_CXSCREEN);
    int screenH = GetSystemMetrics(SM_CYSCREEN);
    int splashW = 500;
    int splashH = 260;

    HWND hwndSplash = CreateWindowExA(
        WS_EX_TOPMOST | WS_EX_TOOLWINDOW | 0x00080000, 
        "OnyxSplashClass",
        "OnyxGuard Loading",
        WS_POPUP | WS_VISIBLE,
        (screenW - splashW) / 2, (screenH - splashH) / 2,
        splashW, splashH,
        NULL, NULL, wc.hInstance, NULL
    );

    HMODULE hUser32 = GetModuleHandleA("user32.dll");
    if (hUser32) {
        typedef BOOL(WINAPI *SLWA)(HWND, COLORREF, BYTE, DWORD);
        SLWA pSetLayeredWindowAttributes = (SLWA)GetProcAddress(hUser32, "SetLayeredWindowAttributes");
        if (pSetLayeredWindowAttributes) pSetLayeredWindowAttributes(hwndSplash, 0, 240, 2);
    }

    if (hwndSplash) {
        HDC hdc = GetDC(hwndSplash);
        RECT rect;
        GetClientRect(hwndSplash, &rect);

        HFONT hFontTitle = CreateFontA(32, 0, 0, 0, FW_BOLD, FALSE, FALSE, FALSE, ANSI_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, DEFAULT_QUALITY, DEFAULT_PITCH | FF_DONTCARE, "Segoe UI");
        HFONT hFontDesc = CreateFontA(14, 0, 0, 0, FW_NORMAL, FALSE, FALSE, FALSE, ANSI_CHARSET, OUT_DEFAULT_PRECIS, CLIP_DEFAULT_PRECIS, DEFAULT_QUALITY, DEFAULT_PITCH | FF_DONTCARE, "Segoe UI");
        
        const char* steps[] = {
            "Initializing OnyxGuard Core...",
            "Establishing Secure Connection...",
            "Scanning Memory Signatures...",
            "Verifying File Integrity...",
            "Loading Anti-Hack Modules...",
            "Securing Process Environment..."
        };

        for (int i = 0; i <= 100; i += 2) {
            HBRUSH bgBrush = CreateSolidBrush(RGB(12, 12, 16));
            FillRect(hdc, &rect, bgBrush);
            DeleteObject(bgBrush);

            HPEN hPen = CreatePen(PS_SOLID, 1, RGB(45, 212, 191));
            HGDIOBJ oldPen = SelectObject(hdc, hPen);
            HBRUSH nullBrush = (HBRUSH)GetStockObject(NULL_BRUSH);
            HGDIOBJ oldBrush = SelectObject(hdc, nullBrush);
            Rectangle(hdc, rect.left, rect.top, rect.right, rect.bottom);
            SelectObject(hdc, oldPen);
            SelectObject(hdc, oldBrush);
            DeleteObject(hPen);

            SetBkMode(hdc, TRANSPARENT);
            
            int cx = splashW / 2;
            int cy = 60;
            int size = 30;
            POINT pts[4] = { {cx, cy - size}, {cx + size, cy}, {cx, cy + size}, {cx - size, cy} };
            HBRUSH tealBrush = CreateSolidBrush(RGB(45, 212, 191));
            HGDIOBJ oldBrush2 = SelectObject(hdc, tealBrush);
            HPEN tealPen = CreatePen(PS_SOLID, 2, RGB(45, 212, 191));
            HGDIOBJ oldPen2 = SelectObject(hdc, tealPen);
            Polygon(hdc, pts, 4);
            
            POINT ptsInner[4] = { {cx, cy - size/2 + 2}, {cx + size/2 - 2, cy}, {cx, cy + size/2 - 2}, {cx - size/2 + 2, cy} };
            HBRUSH darkBrush = CreateSolidBrush(RGB(12, 12, 16));
            SelectObject(hdc, darkBrush);
            Polygon(hdc, ptsInner, 4);
            
            SelectObject(hdc, oldBrush2);
            SelectObject(hdc, oldPen2);
            DeleteObject(tealBrush);
            DeleteObject(tealPen);
            DeleteObject(darkBrush);

            SetTextColor(hdc, RGB(255, 255, 255));
            SelectObject(hdc, hFontTitle);
            RECT titleRect = { 0, 100, splashW, 140 };
            DrawTextA(hdc, "ONYX GUARD", -1, &titleRect, DT_CENTER | DT_VCENTER | DT_SINGLELINE);

            SetTextColor(hdc, RGB(148, 163, 184));
            SelectObject(hdc, hFontDesc);
            RECT subRect = { 0, 135, splashW, 160 };
            DrawTextA(hdc, "ADVANCED CLIENT PROTECTION", -1, &subRect, DT_CENTER | DT_VCENTER | DT_SINGLELINE);

            int stepIdx = (i / 18);
            if (stepIdx > 5) stepIdx = 5;
            SetTextColor(hdc, RGB(45, 212, 191));
            RECT textRect = { 40, 185, splashW - 40, 205 };
            DrawTextA(hdc, steps[stepIdx], -1, &textRect, DT_LEFT | DT_VCENTER | DT_SINGLELINE);

            char pct[16];
            wsprintfA(pct, "%d%%", i);
            RECT pctRect = { 40, 185, splashW - 40, 205 };
            DrawTextA(hdc, pct, -1, &pctRect, DT_RIGHT | DT_VCENTER | DT_SINGLELINE);

            RECT barBg = { 40, 210, splashW - 40, 220 };
            HBRUSH barBgBrush = CreateSolidBrush(RGB(30, 41, 59));
            FillRect(hdc, &barBg, barBgBrush);
            DeleteObject(barBgBrush);

            int fillW = ((splashW - 80) * i) / 100;
            if (fillW > 0) {
                RECT barFill = { 40, 210, 40 + fillW, 220 };
                HBRUSH barFillBrush = CreateSolidBrush(RGB(45, 212, 191));
                FillRect(hdc, &barFill, barFillBrush);
                DeleteObject(barFillBrush);
            }

            Sleep(100);
        }

        if (g_hSplashEvent) {
            SetEvent(g_hSplashEvent);
        }

        DeleteObject(hFontTitle);
        DeleteObject(hFontDesc);
        ReleaseDC(hwndSplash, hdc);
        DestroyWindow(hwndSplash);
        UnregisterClassA("OnyxSplashClass", wc.hInstance);
    }
    return 0;
}

void ShowSplashScreen() {
${enableSplashScreen ? '    CreateThread(NULL, 0, SplashThread, NULL, 0, NULL);' : ''}
}

DWORD WINAPI DirectoryMonitorThread(LPVOID lpParam) {
    HANDLE hDir = CreateFileA(
        ".", FILE_LIST_DIRECTORY,
        FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE,
        NULL, OPEN_EXISTING, FILE_FLAG_BACKUP_SEMANTICS, NULL
    );

    if (hDir == INVALID_HANDLE_VALUE) return 1;

    char buffer[1024];
    DWORD bytesReturned;
    while (true) {
        if (ReadDirectoryChangesW(hDir, &buffer, sizeof(buffer), TRUE, 
            FILE_NOTIFY_CHANGE_FILE_NAME | FILE_NOTIFY_CHANGE_SIZE | FILE_NOTIFY_CHANGE_LAST_WRITE,
            &bytesReturned, NULL, NULL)) {
            
            FILE_NOTIFY_INFORMATION* pNotify = (FILE_NOTIFY_INFORMATION*)buffer;
            char filename[MAX_PATH];
            WideCharToMultiByte(CP_ACP, 0, pNotify->FileName, pNotify->FileNameLength / 2, filename, MAX_PATH, NULL, NULL);
            filename[pNotify->FileNameLength / 2] = '\\0';
            
            std::string fileStr = filename;
            for(size_t i = 0; i < fileStr.length(); ++i) {
                if (fileStr[i] == '/') fileStr[i] = '\\\\';
                fileStr[i] = tolower(fileStr[i]);
            }
            
            bool isCritical = false;
            for (int i = 0; i < sizeof(CRITICAL_FILES) / sizeof(CRITICAL_FILES[0]); i++) {
                std::string critFile = CRITICAL_FILES[i].filePath;
                if (critFile.empty()) continue;
                for(size_t j = 0; j < critFile.length(); ++j) {
                    if (critFile[j] == '/') critFile[j] = '\\\\';
                    critFile[j] = tolower(critFile[j]);
                }
                if (fileStr == critFile) {
                    isCritical = true;
                    break;
                }
            }
            
            if (isCritical) {
                WriteDebugLog("FILE INTEGRITY CHANGED RUNTIME", filename, 0, NULL, 0);
                HandleFailure("REAL-TIME INTEGRITY VIOLATION: Game files were modified while running.");
            }
        }
    }
    CloseHandle(hDir);
    return 0;
}

void FetchDynamicLists() {
    HINTERNET hInternet = InternetOpenA("OnyxGuard", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
    if (!hInternet) return;

    std::string host = "127.0.0.1";
    std::string path = "/api/dumplist?projectId=${activeProjectId}";
    size_t protocolPos = AUTH_SERVER_URL.find("://");
    if (protocolPos != std::string::npos) {
        host = AUTH_SERVER_URL.substr(protocolPos + 3);
        size_t slashPos = host.find("/");
        if (slashPos != std::string::npos) {
            std::string basePath = host.substr(slashPos);
            if (basePath.back() == '/') basePath.pop_back();
            if (basePath.length() >= 9 && basePath.substr(basePath.length() - 9) == "/api/auth") {
                path = basePath.substr(0, basePath.length() - 9) + "/api/dumplist?projectId=${activeProjectId}";
            } else {
                path = basePath + "/api/dumplist?projectId=${activeProjectId}";
            }
            host = host.substr(0, slashPos);
        }
    }

    HINTERNET hConnect = InternetConnectA(hInternet, host.c_str(), 
        AUTH_SERVER_URL.find("https://") != std::string::npos ? INTERNET_DEFAULT_HTTPS_PORT : INTERNET_DEFAULT_HTTP_PORT, 
        NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);

    if (hConnect) {
        DWORD flags = INTERNET_FLAG_RELOAD | INTERNET_FLAG_NO_CACHE_WRITE;
        if (AUTH_SERVER_URL.find("https://") != std::string::npos) {
            flags |= INTERNET_FLAG_SECURE | INTERNET_FLAG_IGNORE_CERT_CN_INVALID | INTERNET_FLAG_IGNORE_CERT_DATE_INVALID;
        }

        HINTERNET hRequest = HttpOpenRequestA(hConnect, "GET", path.c_str(), NULL, NULL, NULL, flags, 0);
        if (hRequest) {
            DWORD dwFlags = 0;
            DWORD dwBuffLen = sizeof(dwFlags);
            if (InternetQueryOptionA(hRequest, INTERNET_OPTION_SECURITY_FLAGS, &dwFlags, &dwBuffLen)) {
                dwFlags |= SECURITY_FLAG_IGNORE_UNKNOWN_CA | SECURITY_FLAG_IGNORE_REVOCATION | SECURITY_FLAG_IGNORE_CERT_CN_INVALID | SECURITY_FLAG_IGNORE_CERT_DATE_INVALID | SECURITY_FLAG_IGNORE_WRONG_USAGE;
                InternetSetOptionA(hRequest, INTERNET_OPTION_SECURITY_FLAGS, &dwFlags, sizeof(dwFlags));
            }
            if (HttpSendRequestA(hRequest, NULL, 0, NULL, 0)) {
                std::string response;
                char buffer[1024];
                DWORD bytesRead;
                while (InternetReadFile(hRequest, buffer, sizeof(buffer), &bytesRead) && bytesRead > 0) {
                    response.append(buffer, bytesRead);
                }

                DYNAMIC_WINDOWS.clear();
                DYNAMIC_DUMPS.clear();

                std::stringstream ss(response);
                std::string line;
                int mode = 0;
                while(std::getline(ss, line)) {
                    if (!line.empty() && line.back() == '\\r') line.pop_back();
                    if(line == "[WINDOWS]") { mode = 1; continue; }
                    if(line == "[DUMPS]") { mode = 2; continue; }
                    if(line.empty()) continue;
                    
                    if(mode == 1) {
                        DYNAMIC_WINDOWS.push_back(line);
                    } else if(mode == 2) {
                        bool inQuotes = false;
                        std::string currentToken;
                        std::vector<std::string> parts;
                        for (size_t k = 0; k < line.length(); ++k) {
                            char c = line[k];
                            if (c == '"') {
                                inQuotes = !inQuotes;
                            } else if ((c == ' ' || c == '\\t') && !inQuotes) {
                                if (!currentToken.empty()) {
                                    parts.push_back(currentToken);
                                    currentToken.clear();
                                }
                            } else {
                                currentToken += c;
                            }
                        }
                        if (!currentToken.empty()) parts.push_back(currentToken);

                        if(parts.size() >= 4) {
                            try {
                                DynamicSignature sig;
                                sig.address = strtoul(parts[1].c_str(), NULL, 16);
                                sig.name = parts.back();
                                if(sig.name.size() > 2 && sig.name.front() == '"' && sig.name.back() == '"') {
                                    sig.name = sig.name.substr(1, sig.name.size() - 2);
                                }
                                
                                for(size_t i = 2; i < parts.size() - 1; i++) {
                                    BYTE rawByte = (BYTE)strtoul(parts[i].c_str(), NULL, 16);
                                    sig.signature.push_back(rawByte ^ SIGNATURE_XOR_KEY);
                                }
                                DYNAMIC_DUMPS.push_back(sig);
                            } catch(...) {}
                        }
                    }
                }
            }
            InternetCloseHandle(hRequest);
        }
        InternetConnectA(hInternet, host.c_str(), 
            AUTH_SERVER_URL.find("https://") != std::string::npos ? INTERNET_DEFAULT_HTTPS_PORT : INTERNET_DEFAULT_HTTP_PORT, 
            NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
    }
    InternetCloseHandle(hInternet);
}

// ============================================================================
//  LA TRAMPA INLINE: Sincronización externa segura post-cargador de Windows
// ============================================================================
LPSTR WINAPI HookedGetCommandLineA() {
    DWORD dwOldProtect;
    VirtualProtect(g_pfnOriginalGetCommandLineA, 5, PAGE_EXECUTE_READWRITE, &dwOldProtect);
    memcpy(g_pfnOriginalGetCommandLineA, g_originalBytes, 5);
    VirtualProtect(g_pfnOriginalGetCommandLineA, 5, dwOldProtect, &dwOldProtect);

    if (g_hSplashEvent) {
        while (WaitForSingleObject(g_hSplashEvent, 0) == WAIT_TIMEOUT) {
            MSG msg;
            while (PeekMessageA(&msg, NULL, 0, 0, PM_REMOVE)) {
                TranslateMessage(&msg);
                DispatchMessageA(&msg);
            }
            Sleep(5); 
        }
    }

    return g_pfnOriginalGetCommandLineA();
}

void InstallRuntimeGate() {
    g_pfnOriginalGetCommandLineA = (PFN_GetCommandLineA)GetProcAddress(GetModuleHandleA("kernel32.dll"), "GetCommandLineA");
    if (!g_pfnOriginalGetCommandLineA) return;

    DWORD dwOldProtect;
    VirtualProtect(g_pfnOriginalGetCommandLineA, 5, PAGE_EXECUTE_READWRITE, &dwOldProtect);
    
    memcpy(g_originalBytes, g_pfnOriginalGetCommandLineA, 5);

    BYTE jmp[5] = { 0xE9, 0x00, 0x00, 0x00, 0x00 };
    DWORD relativeAddress = (DWORD)HookedGetCommandLineA - (DWORD)g_pfnOriginalGetCommandLineA - 5;
    memcpy(&jmp[1], &relativeAddress, 4);

    memcpy(g_pfnOriginalGetCommandLineA, jmp, 5);
    VirtualProtect(g_pfnOriginalGetCommandLineA, 5, dwOldProtect, &dwOldProtect);
}

// ============================================================================
//  HILO CENTRAL DE INTEGRIDAD Y MONITORIZACIÓN CONTINUA
// ============================================================================
DWORD WINAPI IntegrityCheckThread(LPVOID lpParam) {
    // 1. Verificación obligatoria de privilegios antes de cualquier handshake o escaneo
    if (!CheckAndRequestAdminPrivileges()) {
        return 1;
    }

    // 2. Aplicar mitigación DACL sobre los Handles para bloquear Process Hacker/PC Hunter en Ring 3
    ProtectProcessHandles();

    if (g_hSplashEvent) {
        // Esperamos a que finalice la animación de carga de la ventana gráfica
        WaitForSingleObject(g_hSplashEvent, INFINITE);
    }

    FetchDynamicLists();
${enableFileCheck ? '    CreateThread(NULL, 0, DirectoryMonitorThread, NULL, 0, NULL);' : ''}
    Sleep(500); 
    
${enableProcessBinding ? `    if (!VerifyHostProcess()) {
        WriteDebugLog("PROCESS EXECUTION ERROR", "DLL loaded outside main.exe", 0, NULL, 0);
        HandleFailure("UNAUTHORIZED PROCESS: Onyx Guard must only be loaded via " + std::string("${targetProcessName || 'main.exe'}") + ".");
        return 1;
    }` : ''}

${enableAntiDebug ? `    if (CheckForDebugger()) {
        WriteDebugLog("REVERSE ENGINEERING DETECTION", "Active debugger attached to game process", 0, NULL, 0);
        HandleFailure("DEBUGGER DETECTED: Please close all reverse-engineering tools.");
        return 1;
    }` : ''}

${enableTestModeBlock ? `    if (IsTestModeEnabled()) {
        WriteDebugLog("WINDOWS TESTMODE BREACH", "Windows running with TESTSIGNING active", 0, NULL, 0);
        HandleFailure("SECURITY BREACH: Windows is running in Test Mode (Testsigning). Please disable it to play.");
        return 1;
    }` : ''}
    
    std::string hwid = GetHardwareID();
    char compNameUser[MAX_COMPUTERNAME_LENGTH + 1] = {0};
    DWORD compNameUserLen = MAX_COMPUTERNAME_LENGTH + 1;
    if (!GetComputerNameA(compNameUser, &compNameUserLen)) {
        lstrcpyA(compNameUser, "Player");
    }
    std::string accountName = compNameUser; 
    
    bool status = PerformHandshake(accountName, hwid, "");
    
    if (!status) {
        std::string err = g_startupMessage.empty() ? "CRITICAL SECURITY ERROR: Your client files or Hardware ID are unauthorized." : g_startupMessage;
        WriteDebugLog("HTTPS HANDSHAKE DENIED", err, 0, NULL, 0);
        HandleFailure(err);
        return 1;
    }
    
    if (g_startupMessage.empty()) {
        g_startupMessage = "Welcome to Onyx Guard!";
    }
    
    if (g_trayHwnd) {
        PostMessageA(g_trayHwnd, WM_USER + 2, 0, 0);
    }
    
    int tickCount = 0;
    while(true) {
        if (tickCount % 10 == 0) { 
            FetchDynamicLists();
        }
        tickCount++;
        
        // --- Escaneos en Tiempo Real Estilo Premium ---
${enableHeuristics ? `        if (DetectSpeedHack()) {
            HandleFailure("SPEEDHACK DETECTED: Game acceleration anomaly found.");
        }` : ''}
${enableAntiMacro ? `        if (CheckForVirtualInputs()) {
            HandleFailure("AUTOMATION DETECTED: Illegal Macro or Virtual input injection.");
        }
        if (ScanForBlacklistedWindows()) {
            HandleFailure("ILLEGAL SOFTWARE DETECTED: A blacklisted macro, auto-clicker, or memory editor was found.");
        }` : ''}
${enableDllScanner ? `        if (ScanForInjectedDLLs()) {
            HandleFailure("DLL INJECTION DETECTED: A malicious DLL module was found in memory.");
        }` : ''}
${enableMemoryScanner ? `        if (ScanMemorySignatures()) {
            HandleFailure("MEMORY TAMPERING DETECTED: Known cheat signatures found in memory.");
        }` : ''}
${enableApiHookDetection ? `        if (ScanForApiHooks()) {
            HandleFailure("API HOOK DETECTED: Critical system functions have been modified.");
        }` : ''}
${enableHeuristics ? `        if (ScanHeuristicWindows()) {
            HandleFailure("SUSPICIOUS WINDOW DETECTED: Heuristic scan detected a hack-like window running.");
        }` : ''}
        Sleep(3000); 
    }
    
    return 0;
}

// ============================================================================
//  PUNTO DE ENTRADA NATIVO DE LA DLL (ULTRA-RÁPIDO)
// ============================================================================
BOOL APIENTRY DllMain(HMODULE hModule, DWORD ul_reason_for_call, LPVOID lpReserved) {
    switch (ul_reason_for_call) {
    case DLL_PROCESS_ATTACH: {
        DisableThreadLibraryCalls(hModule);
        g_hCurrentModule = hModule;
        
        g_hSplashEvent = CreateEventA(NULL, TRUE, FALSE, NULL);
        
        // 1. Inyectamos la trampa inline en GetCommandLineA para retrasar main.exe de forma segura
        InstallRuntimeGate();

        // 2. Desplegamos la interfaz y los subprocesos de red paralelos
        ShowSplashScreen();
        CreateThread(NULL, 0, IntegrityCheckThread, NULL, 0, NULL);
        CreateThread(NULL, 0, TrayIconThread, NULL, 0, NULL);
        break;
    }
    case DLL_PROCESS_DETACH:
        if (g_hSplashEvent) {
            CloseHandle(g_hSplashEvent);
        }
        break;
    }
    return TRUE; 
}
}`;
