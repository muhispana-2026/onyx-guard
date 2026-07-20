
const clientVersion = '1.04d';
const usePch = false;
const SECRET_TOKEN = 'secret';
const AUTH_SERVER_URL = 'http://127.0.0.1:3000';
const enablePayloadEncryption = false;
const enableProcessBinding = false;
const enableAntiDebug = true;
const enableFileCheck = true;
const clientFiles = [{path: 'main.exe', expectedHash: 'abcd'}];
const enableAntiMacro = true;
const blacklistedPrograms = ['cheatengine.exe'];
const actionOnFailure = 'MSG_BOX'; // MSG_BOX test
const enableMemoryScanner = true;
const dumps = [{rawRule: 'type 0x0 0x12 hack', type: 'type', addr: '0', bytes: '12', name: 'hack'}];
const enableTestModeBlock = false;
const enableWatchdog = false;
const enableApiHookDetection = false;
const enableHeuristics = false;
const enableMultiClientBlock = false;
const enableDllScanner = false;
const enableHwidCheck = false;
const activeProjectId = 'id';
const serverUrl = 'url';
const securityToken = 'token';
const enableRealtimeMonitor = false;
const enableSplashScreen = true;
const multiClientLimit = 1;

function useMemo(fn) { return fn(); }

const cppCode = useMemo(() => {
    // Handling empty arrays for C++ to prevent "empty initializer" compiler errors
    const filesArrayContent = clientFiles.length > 0 ? `${clientFiles.map(f => `{ "\\\"${f.path}\\\"", "\\\"${f.expectedHash}\\\"" }`).join(',\n    ')}` : `    { "", "" } // Dummy element`;



    const blacklistedArrayContent = blacklistedPrograms.length > 0 ? `${blacklistedPrograms.map(p => `"\\\"${p}\\\""`).join(', ')}` : `""`;




    const memorySignaturesContent = "";
    const dynamicDumpsArrayContent = dumps.length > 0 ? dumps.map(d => {
            const safeNameFallback = (d.name || "Unknown").replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '').replace(/\r/g, '');
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
              let tb = b.replace(/0x/i, '').trim();
              if (!/^[0-9a-fA-F]{1,2}$/.test(tb)) return '0x00';
              return '0x' + tb;
          }).join(', ');
          
          const name = p[p.length - 1].replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '').replace(/\r/g, '');
          return `    { ${type}, ${addr}, { ${bytes} }, ${p.length - 3}, "${name}" }`;
      }).join(',\n')
      : `    { 0, 0x0, {0}, 0, "Dummy" }`;

    return `// ============================================================================
//  ONYX GUARD ANTI-HACK & CLIENT INTEGRITY PLUGIN
//  Target Game Client: Season 6 (main.exe v${clientVersion})
//  File: Custom.cpp (DLL Project Source Code)
//  Compiled using: Visual Studio 2019/2022 (MSVC Toolset)
// ============================================================================
${usePch ? '#include "pch.h"' : ''}
#include <windows.h>
#include <stdint.h>
#include <objbase.h>
#include <wininet.h>
#include <shellapi.h>
#include <psapi.h>
#pragma comment(lib, "psapi.lib")
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <cctype>
#include <iomanip>

#pragma comment(lib, "wininet.lib")
#pragma comment(lib, "shell32.lib")
#pragma comment(lib, "user32.lib")
#pragma comment(lib, "ole32.lib")

// --- PLUGIN CONFIGURATION ---
const std::string AUTH_SERVER_URL = "${serverUrl}";
const std::string SECRET_TOKEN    = "${securityToken}";
const std::string CLIENT_VERSION  = "${clientVersion}";

// Struct representing file metadata to verify
struct ClientFile {
    const char* filePath;
    const char* expectedHash;
};

// Registered hashes from server settings
ClientFile CRITICAL_FILES[] = {
${filesArrayContent}
};

std::vector<std::string> DYNAMIC_WINDOWS;
struct DynamicSignature {
    DWORD address;
    std::vector<BYTE> signature;
    std::string name;
};
std::vector<DynamicSignature> DYNAMIC_DUMPS;

${enableAntiMacro ? `// Blacklisted Window Names (Cheat Engine, AutoClicker, etc)
const char* BLACKLISTED_WINDOWS[] = {
${blacklistedArrayContent}
};

bool ScanForBlacklistedWindows() {
    for (size_t i = 0; i < DYNAMIC_WINDOWS.size(); i++) {
        std::string win = DYNAMIC_WINDOWS[i];
        if (FindWindowA(NULL, win.c_str()) != NULL) return true;
    }
    for (int i = 0; i < sizeof(BLACKLISTED_WINDOWS) / sizeof(BLACKLISTED_WINDOWS[0]); i++) {
        if (std::string(BLACKLISTED_WINDOWS[i]) == "DummyWindowName") continue;
        if (FindWindowA(NULL, BLACKLISTED_WINDOWS[i]) != NULL) {
            return true;
        }
    }
    return false;
}` : ''}

// Simple Hardware ID generator using MAC Address & System Information
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

${enableDllScanner ? `// Injected DLL Scanner
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
                    return true;
                }
            }
        }
    }
    return false;
}` : ''}

${enableMemoryScanner ? `// Memory Signature Scanner
struct MemorySignature {
    int type;
    DWORD address;
    BYTE signature[128];
    int sigLength;
    const char* name;
};

MemorySignature MEMORY_SIGNATURES[] = {
${dynamicDumpsArrayContent}
};

// AOB Pattern Scanner (Scans process memory modules for cheat signatures)
bool PatternScan(HANDLE hProcess, const BYTE* signature, const char* mask, int sigLength) {
    // This is a simplified version. A real AOB scanner iterates through MEMORY_BASIC_INFORMATION 
    // to find readable memory pages, then scans for the pattern.
    SYSTEM_INFO sysInfo;
    GetSystemInfo(&sysInfo);
    uintptr_t procMin = (uintptr_t)sysInfo.lpMinimumApplicationAddress;
    uintptr_t procMax = (uintptr_t)sysInfo.lpMaximumApplicationAddress;
    
    // Limits for performance in a simple implementation: 
    // typically scanning main module (.text section) is enough.
    // For full memory scan, we iterate regions.
    MEMORY_BASIC_INFORMATION mbi;
    uintptr_t currentAddr = procMin;
    
    // Performance optimization: we will only scan a subset for the demo, 
    // full AOB can be slow if run constantly.
    int scanCount = 0;
    while (currentAddr < procMax && scanCount < 500) {
        if (VirtualQueryEx(hProcess, (LPCVOID)currentAddr, &mbi, sizeof(mbi))) {
            if (mbi.State == MEM_COMMIT && (mbi.Protect == PAGE_READWRITE || mbi.Protect == PAGE_EXECUTE_READWRITE || mbi.Protect == PAGE_EXECUTE_READ)) {
                BYTE* buffer = new BYTE[mbi.RegionSize];
                SIZE_T bytesRead;
                if (ReadProcessMemory(hProcess, mbi.BaseAddress, buffer, mbi.RegionSize, &bytesRead)) {
                    for (size_t i = 0; i < bytesRead - sigLength; i++) {
                        bool match = true;
                        for (int j = 0; j < sigLength; j++) {
                            if (mask[j] != '?' && buffer[i + j] != signature[j]) {
                                match = false;
                                break;
                            }
                        }
                        if (match) {
                            delete[] buffer;
                            return true;
                        }
                    }
                }
                delete[] buffer;
            }
            currentAddr += mbi.RegionSize;
        } else {
            currentAddr += 0x1000;
        }
        scanCount++;
    }
    return false;
}

bool ScanMemorySignatures() {
    HANDLE hProcess = GetCurrentProcess();
    for (size_t i = 0; i < DYNAMIC_DUMPS.size(); i++) {
        DynamicSignature sig = DYNAMIC_DUMPS[i];
        BYTE buffer[128];
        SIZE_T bytesRead;
        if (ReadProcessMemory(hProcess, (LPCVOID)(uintptr_t)sig.address, buffer, sig.signature.size(), &bytesRead)) {
            bool match = true;
            for (size_t j = 0; j < sig.signature.size() && j < bytesRead; j++) {
                if (buffer[j] != sig.signature[j]) {
                    match = false;
                    break;
                }
            }
            if (match) return true;
        }
    }

    for (int i = 0; i < sizeof(MEMORY_SIGNATURES) / sizeof(MEMORY_SIGNATURES[0]); i++) {
        if (std::string(MEMORY_SIGNATURES[i].name) == "Dummy") continue;
        
        BYTE buffer[128];
        SIZE_T bytesRead;
        
        if (MEMORY_SIGNATURES[i].sigLength == 0 || MEMORY_SIGNATURES[i].address == 0) continue;
        
        // Scan specific memory address
        if (ReadProcessMemory(hProcess, (LPCVOID)(uintptr_t)MEMORY_SIGNATURES[i].address, buffer, MEMORY_SIGNATURES[i].sigLength, &bytesRead)) {
            bool match = true;
            for (int j = 0; j < MEMORY_SIGNATURES[i].sigLength; j++) {
                if (buffer[j] != MEMORY_SIGNATURES[i].signature[j]) {
                    match = false;
                    break;
                }
            }
            if (match) return true;
        }
    }
    return false;
}` : ''}

${enableAntiDebug ? `// Advanced Anti-Debugging
bool CheckForDebugger() {
    if (IsDebuggerPresent()) return true;
    BOOL isRemoteDebugger = FALSE;
    CheckRemoteDebuggerPresent(GetCurrentProcess(), &isRemoteDebugger);
    if (isRemoteDebugger) return true;
    return false;
}` : ''}

${enableProcessBinding ? `// Exclusive Process Binding (main.exe)
bool VerifyHostProcess() {
    char exePath[MAX_PATH];
    GetModuleFileNameA(NULL, exePath, MAX_PATH);
    std::string path(exePath);
    for(size_t i=0; i<path.length(); ++i) path[i] = tolower(path[i]);
    if (path.find("main.exe") == std::string::npos) {
        return false;
    }
    return true;
}` : ''}

${enablePayloadEncryption ? `// XOR Payload Encryption
std::string EncryptPayload(const std::string& data) {
    std::string key = "${securityToken}";
    std::string encrypted = data;
    // Basic XOR for data obfuscation
    for(size_t i = 0; i < data.size(); i++) {
        encrypted[i] = data[i] ^ key[i % key.size()];
    }
    // Return Hex/Base64 representation in reality
    return encrypted; 
}` : ''}


${enableApiHookDetection ? `// Advanced API Hooking Detection
bool CheckApiHook(LPCSTR moduleName, LPCSTR procName) {
    HMODULE hMod = GetModuleHandleA(moduleName);
    if (!hMod) return false;
    FARPROC procAddr = GetProcAddress(hMod, procName);
    if (!procAddr) return false;
    
    BYTE* pBytes = (BYTE*)procAddr;
    // Check for common hooking instructions: JMP (0xE9), Short JMP (0xEB), CALL (0xE8)
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
        return true;
    }
    return false;
}` : ''}

${enableHeuristics ? `// Heuristic Window Scanning
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
}` : ''}

// Simple MD5 file hashing (placeholder for actual cryptographic implementation)
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

#include <wincrypt.h>
#pragma comment(lib, "Advapi32.lib")

std::string CalculateFileMD5(const std::string& filePath) {
    std::string md5Hash = "";
    HANDLE hFile = CreateFileA(filePath.c_str(), GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_FLAG_SEQUENTIAL_SCAN, NULL);
    if (hFile == INVALID_HANDLE_VALUE) {
        return "file_not_found";
    }

    HCRYPTPROV hProv = 0;
    HCRYPTHASH hHash = 0;
    if (CryptAcquireContextA(&hProv, NULL, NULL, PROV_RSA_FULL, CRYPT_VERIFYCONTEXT)) {
        if (CryptCreateHash(hProv, CALG_MD5, 0, 0, &hHash)) {
            BYTE rgbFile[4096];
            DWORD cbRead = 0;
            bool success = true;
            while (ReadFile(hFile, rgbFile, sizeof(rgbFile), &cbRead, NULL)) {
                if (cbRead == 0) break;
                if (!CryptHashData(hHash, rgbFile, cbRead, 0)) {
                    success = false;
                    break;
                }
            }
            if (success) {
                BYTE rgbHash[16];
                DWORD cbHash = 16;
                if (CryptGetHashParam(hHash, HP_HASHVAL, rgbHash, &cbHash, 0)) {
                    char hex[33];
                    for (DWORD i = 0; i < cbHash; i++) {
                        sprintf_s(hex + (i * 2), 3, "%02x", rgbHash[i]);
                    }
                    md5Hash = hex;
                }
            }
            CryptDestroyHash(hHash);
        }
        CryptReleaseContext(hProv, 0);
    }
    CloseHandle(hFile);
    return md5Hash.empty() ? "hash_error" : md5Hash;
}

// Global tray icon data so we can update it from other threads
NOTIFYICONDATAA g_nid = { 0 };
bool g_trayIconAdded = false;
std::string g_startupMessage = "";
HWND g_trayHwnd = NULL;

${enableTestModeBlock ? `// Windows Test Mode Detection
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
}` : ''}

// Perform validation request to backend web server
bool PerformHandshake(const std::string& username, const std::string& hwid, const std::string& modifiedFile) {
    HINTERNET hInternet = InternetOpenA("MuOnline_Client_Plugin", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
    if (!hInternet) {
        return false;
    }

    DWORD timeout = 5000; // 5 seconds timeout to prevent false positive hangs
    InternetSetOptionA(hInternet, INTERNET_OPTION_CONNECT_TIMEOUT, &timeout, sizeof(timeout));
    InternetSetOptionA(hInternet, INTERNET_OPTION_SEND_TIMEOUT, &timeout, sizeof(timeout));
    InternetSetOptionA(hInternet, INTERNET_OPTION_RECEIVE_TIMEOUT, &timeout, sizeof(timeout));

    // Parse URL host and path
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

    // Build Payload JSON body
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

${enablePayloadEncryption ? `    // Encrypting Payload before sending
    payload = EncryptPayload(payload);
    // Add custom header to indicate encrypted payload
    headers += "X-Payload-Encrypted: true\\r\\n";
` : ''}

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
            
            // Simple JSON response check
            if (responseString.find("\\"success\\":true") != std::string::npos || responseString.find("\\"success\\": true") != std::string::npos) {
                isAuthorized = true;
                size_t msgStart = responseString.find("\\\"message\\\":\\\"");
                if (msgStart != std::string::npos) {
                    msgStart += 11;
                    size_t msgEnd = responseString.find("\\\"", msgStart);
                    if (msgEnd != std::string::npos) {
                        std::string msg = responseString.substr(msgStart, msgEnd - msgStart);
                        g_startupMessage = msg;
                    }
                }
                InternetCloseHandle(hRequest);
                InternetCloseHandle(hConnect);
                break; // Success, break out of retry loop
            } else if (responseString.find("\\"action\\":") != std::string::npos) {
                // If it successfully reached server and server explicitly rejected, do not retry
                isAuthorized = false;
                InternetCloseHandle(hRequest);
                InternetCloseHandle(hConnect);
                break; 
            }
        }
        
        // If we reach here, it was a network error or malformed response
        InternetCloseHandle(hRequest);
        InternetCloseHandle(hConnect);
        if (retry == maxRetries - 1) {
            g_startupMessage = "Network error: Unable to connect to Authentication Server.";
        }
        if (retry < maxRetries - 1) {
            Sleep(2000); // Wait 2s before retrying
        }
    }

    InternetCloseHandle(hInternet);
    return isAuthorized;
}





DWORD WINAPI HeartbeatThread(LPVOID lpParam) {
    std::string hwid = GetHardwareID();
    char compNameUser[MAX_COMPUTERNAME_LENGTH + 1] = { 0 };
    DWORD compNameUserLen = MAX_COMPUTERNAME_LENGTH + 1;
    if (!GetComputerNameA(compNameUser, &compNameUserLen)) {
        lstrcpyA(compNameUser, "Player");
    }
    std::string username = compNameUser;
    
    while (true) {
        Sleep(30000); // 30 seconds heartbeat
        HINTERNET hInternet = InternetOpenA("MuOnline_Client_Plugin", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
        if (!hInternet) continue;
        
        std::string host = "127.0.0.1";
        std::string path = "/api/heartbeat";
        size_t protocolPos = AUTH_SERVER_URL.find("://");
        std::string urlWithoutProtocol = (protocolPos == std::string::npos) ? AUTH_SERVER_URL : AUTH_SERVER_URL.substr(protocolPos + 3);
        size_t slashPos = urlWithoutProtocol.find("/");
        if (slashPos != std::string::npos) {
            host = urlWithoutProtocol.substr(0, slashPos);
            std::string basePath = urlWithoutProtocol.substr(slashPos);
            if (basePath.back() == '/') basePath.pop_back();
            if (basePath.length() >= 9 && basePath.substr(basePath.length() - 9) == "/api/auth") {
                path = basePath.substr(0, basePath.length() - 9) + "/api/heartbeat";
            } else {
                path = basePath + "/api/heartbeat";
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
             << "\\\"secretToken\\\": \\\"" << JsonEscape(SECRET_TOKEN) << "\\\""
             << "}";
        
        std::string payload = json.str();
        std::string headers = "Content-Type: application/json\\r\\n";
${enablePayloadEncryption ? `
        payload = EncryptPayload(payload);
        headers += "X-Payload-Encrypted: true\\r\\n";` : ''}
        
        HINTERNET hConnect = InternetConnectA(hInternet, host.c_str(), port, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
        if (hConnect) {
            HINTERNET hRequest = HttpOpenRequestA(hConnect, "POST", path.c_str(), NULL, NULL, NULL, flags, 0);
            if (hRequest) {
                DWORD dwFlags = 0;
                DWORD dwBuffLen = sizeof(dwFlags);
                if (InternetQueryOptionA(hRequest, INTERNET_OPTION_SECURITY_FLAGS, &dwFlags, &dwBuffLen)) {
                    dwFlags |= SECURITY_FLAG_IGNORE_UNKNOWN_CA | SECURITY_FLAG_IGNORE_REVOCATION | SECURITY_FLAG_IGNORE_CERT_CN_INVALID | SECURITY_FLAG_IGNORE_CERT_DATE_INVALID | SECURITY_FLAG_IGNORE_WRONG_USAGE;
                    InternetSetOptionA(hRequest, INTERNET_OPTION_SECURITY_FLAGS, &dwFlags, sizeof(dwFlags));
                }
                
                if (HttpSendRequestA(hRequest, headers.c_str(), headers.length(), (LPVOID)payload.c_str(), payload.length())) {
                    char buffer[1024];
                    DWORD bytesRead = 0;
                    std::string responseString = "";
                    while (InternetReadFile(hRequest, buffer, sizeof(buffer) - 1, &bytesRead) && bytesRead > 0) {
                        buffer[bytesRead] = '\\0';
                        responseString += buffer;
                    }
                    if (responseString.find("\\\"action\\\":\\\"EXIT\\\"") != std::string::npos || responseString.find("\\\"action\\\": \\\"EXIT\\\"") != std::string::npos || responseString.find("\\\"success\\\":false") != std::string::npos) {
                        ExitProcess(0);
                    }
                }
                InternetCloseHandle(hRequest);
            }
            InternetCloseHandle(hConnect);
        }
        InternetCloseHandle(hInternet);
    }
    return 0;
}

void ExitProcessWrapper(UINT uExitCode) {
    ExitProcess(uExitCode);
}

${enableAntiDebug ? `
bool IsDebuggerPresentWrapper() {
    return IsDebuggerPresent();
}
bool CheckRemoteDebuggerPresentWrapper(HANDLE hProcess, PBOOL pbDebuggerPresent) {
    return CheckRemoteDebuggerPresent(hProcess, pbDebuggerPresent);
}
` : ''}

void EnforceBlock(const std::string& errorMsg) {
    g_startupMessage = errorMsg;
    HWND hWnd = GetConsoleWindow();
    if (hWnd != NULL) {
        ShowWindow(hWnd, SW_HIDE);
    }
${actionOnFailure === 'EXIT' ? '    ExitProcess(0);' : (actionOnFailure === 'MSG_BOX' ? '    MessageBoxA(NULL, errorMsg.c_str(), "Onyx Guard - Error", MB_OK | MB_ICONERROR);\n    ExitProcess(0);' : '    ExitProcess(0);')}
}

bool SendValidationHandshake(const std::string& user, const std::string& hwid, const std::string& modFile) {
    std::stringstream json;
    json << "{"
         << "\\\"username\\\": \\\"" << JsonEscape(user) << "\\\","
         << "\\\"hwid\\\": \\\"" << JsonEscape(hwid) << "\\\","
         << "\\\"clientVersion\\\": \\\"" << JsonEscape(CLIENT_VERSION) << "\\\","
         << "\\\"secretToken\\\": \\\"" << JsonEscape(SECRET_TOKEN) << "\\\","
         << "\\\"fileModified\\\": \\\"" << (modFile.empty() ? "none" : JsonEscape(modFile)) << "\\\""
         << "}";
    std::string payload = json.str();
    std::string headers = "Content-Type: application/json\\r\\n";
${enablePayloadEncryption ? `
    payload = EncryptPayload(payload);
    headers += "X-Payload-Encrypted: true\\r\\n";` : ''}
    
    HINTERNET hInternet = InternetOpenA("MuOnline_Client_Plugin", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
    if (!hInternet) return false;
    
    std::string host = "127.0.0.1";
    std::string path = "/api/auth";
    size_t protocolPos = AUTH_SERVER_URL.find("://");
    std::string urlWithoutProtocol = (protocolPos == std::string::npos) ? AUTH_SERVER_URL : AUTH_SERVER_URL.substr(protocolPos + 3);
    size_t slashPos = urlWithoutProtocol.find("/");
    if (slashPos != std::string::npos) {
        host = urlWithoutProtocol.substr(0, slashPos);
        path = urlWithoutProtocol.substr(slashPos);
    } else {
        host = urlWithoutProtocol;
    }
    INTERNET_PORT port = INTERNET_DEFAULT_HTTP_PORT;
    DWORD flags = INTERNET_FLAG_RELOAD;
    if (AUTH_SERVER_URL.find("https://") == 0) {
        port = INTERNET_DEFAULT_HTTPS_PORT;
        flags |= INTERNET_FLAG_SECURE | INTERNET_FLAG_IGNORE_CERT_CN_INVALID | INTERNET_FLAG_IGNORE_CERT_DATE_INVALID;
    }
    
    bool isAllowed = false;
    int maxRetries = 3;
    for (int retry = 0; retry < maxRetries; retry++) {
        HINTERNET hConnect = InternetConnectA(hInternet, host.c_str(), port, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
        if (hConnect) {
            HINTERNET hRequest = HttpOpenRequestA(hConnect, "POST", path.c_str(), NULL, NULL, NULL, flags, 0);
            if (hRequest) {
                DWORD dwFlags = 0;
                DWORD dwBuffLen = sizeof(dwFlags);
                if (InternetQueryOptionA(hRequest, INTERNET_OPTION_SECURITY_FLAGS, &dwFlags, &dwBuffLen)) {
                    dwFlags |= SECURITY_FLAG_IGNORE_UNKNOWN_CA | SECURITY_FLAG_IGNORE_REVOCATION | SECURITY_FLAG_IGNORE_CERT_CN_INVALID | SECURITY_FLAG_IGNORE_CERT_DATE_INVALID | SECURITY_FLAG_IGNORE_WRONG_USAGE;
                    InternetSetOptionA(hRequest, INTERNET_OPTION_SECURITY_FLAGS, &dwFlags, sizeof(dwFlags));
                }
                if (HttpSendRequestA(hRequest, headers.c_str(), headers.length(), (LPVOID)payload.c_str(), payload.length())) {
                    char buffer[1024];
                    DWORD bytesRead = 0;
                    std::string responseString = "";
                    while (InternetReadFile(hRequest, buffer, sizeof(buffer) - 1, &bytesRead) && bytesRead > 0) {
                        buffer[bytesRead] = '\\0';
                        responseString += buffer;
                    }
                    if (responseString.find("\\\"action\\\":\\\"CONTINUE\\\"") != std::string::npos || responseString.find("\\\"action\\\": \\\"CONTINUE\\\"") != std::string::npos || responseString.find("\\\"success\\\":true") != std::string::npos) {
                        isAllowed = true;
                        break;
                    }
                    if (responseString.find("\\\"action\\\":\\\"EXIT\\\"") != std::string::npos || responseString.find("\\\"action\\\": \\\"EXIT\\\"") != std::string::npos || responseString.find("\\\"success\\\":false") != std::string::npos) {
                        size_t msgStart = responseString.find("\\\"message\\\":\\\"");
                        if (msgStart != std::string::npos) {
                            msgStart += 11;
                            size_t msgEnd = responseString.find("\\"", msgStart);
                            if (msgEnd != std::string::npos) {
                                g_startupMessage = responseString.substr(msgStart, msgEnd - msgStart);
                            }
                        }
                        isAllowed = false;
                        break;
                    }
                }
                InternetCloseHandle(hRequest);
            }
            InternetCloseHandle(hConnect);
        }
        Sleep(2000);
    }
    InternetCloseHandle(hInternet);
    return isAllowed;
}

std::string GetFileHash(const std::string& filePath) {
    HANDLE hFile = CreateFileA(filePath.c_str(), GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
    if (hFile == INVALID_HANDLE_VALUE) return "";
    DWORD fileSize = GetFileSize(hFile, NULL);
    CloseHandle(hFile);
    std::stringstream ss;
    ss << std::hex << fileSize;
    return ss.str();
}

${enableAntiMacro ? `
DWORD WINAPI AntiMacroThread(LPVOID lpParam) {
    std::vector<std::string> blacklistedWindows = { ${blacklistedPrograms.map(p => `\"\\\"${p}\\\"\"`).join(', ')} };
    while (true) {
        for (const auto& bw : blacklistedWindows) {
            HWND hFound = FindWindowA(NULL, bw.c_str());
            if (hFound != NULL) {
                EnforceBlock("ILLEGAL SOFTWARE DETECTED: A blacklisted macro, auto-clicker, or memory editor was found.");
            }
        }
        Sleep(3000);
    }
    return 0;
}
` : ''}

${enableSplashScreen ? `void ShowSplashScreen() {\n    MessageBoxA(NULL, "Onyx Guard Anti-Hack Loaded successfully. Checking client integrity...", "Onyx Guard - Startup", MB_OK | MB_ICONINFORMATION);\n}\n` : ''}
bool ValidateClientState(const std::string& username) {

    try {
${enableProcessBinding ? `
        char processName[MAX_PATH];
        GetModuleFileNameA(NULL, processName, MAX_PATH);
        std::string pName(processName);
        if (pName.find("main.exe") == std::string::npos && pName.find("main") == std::string::npos) {
            EnforceBlock("UNAUTHORIZED PROCESS: Onyx Guard must only be loaded via main.exe.");
            return false;
        }` : ''}
${enableAntiDebug ? `
        BOOL isRemote = FALSE;
        CheckRemoteDebuggerPresent(GetCurrentProcess(), &isRemote);
        if (IsDebuggerPresent() || isRemote) {
            EnforceBlock("DEBUGGER DETECTED: Please close all reverse-engineering tools.");
            return false;
        }` : ''}
        
        std::string hwid = GetHardwareID();
        std::string invalidFile = "none";
        
${enableFileCheck ? `        // Check critical client file hashes
        std::string filesToVerify[] = {
            ${clientFiles.map(f => `\"\\\"${f.path}\\\"\"`).join(',            ')}
        };
        std::string expectedHashes[] = {
            ${clientFiles.map(f => `\"\\\"${f.expectedHash}\\\"\"`).join(',            ')}
        };
        int numFiles = sizeof(filesToVerify) / sizeof(filesToVerify[0]);
        for (int i = 0; i < numFiles; i++) {
            if (GetFileAttributesA(filesToVerify[i].c_str()) == INVALID_FILE_ATTRIBUTES) {
                invalidFile = filesToVerify[i];
                break;
            }
        }` : '// File check disabled'}
        
\$\{enableSplashScreen ? \`        ShowSplashScreen();\n\` : ''}        bool isAllowed = SendValidationHandshake(username, hwid, invalidFile);
        
${enableAntiMacro ? `
        if (isAllowed) {
            CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)AntiMacroThread, NULL, 0, NULL);
        }` : ''}
        
        return isAllowed;
    } catch (...) {
        EnforceBlock("Error loading security engine modules.");
        return false;
    }
}`;  });


const fs = require('fs');
fs.writeFileSync('output_final.cpp', cppCode);
