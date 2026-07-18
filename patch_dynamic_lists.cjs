const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const dynamicCode = `
// ==========================================
// DYNAMIC REAL-TIME CLOUD LISTS (Firebase)
// ==========================================
struct DynamicSignature {
    DWORD address;
    std::vector<BYTE> signature;
    std::string name;
};
std::vector<std::string> DYNAMIC_WINDOWS;
std::vector<DynamicSignature> DYNAMIC_DUMPS;

void FetchDynamicLists() {
    HINTERNET hInternet = InternetOpenA("OnyxGuard", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
    if (!hInternet) return;

    std::string host = "127.0.0.1";
    std::string path = "/api/dumplist?projectId=\${activeProjectId}";
    size_t protocolPos = AUTH_SERVER_URL.find("://");
    if (protocolPos != std::string::npos) {
        host = AUTH_SERVER_URL.substr(protocolPos + 3);
        size_t slashPos = host.find("/");
        if (slashPos != std::string::npos) {
            path = host.substr(slashPos) + "/dumplist?projectId=\${activeProjectId}";
            host = host.substr(0, slashPos);
        } else {
            path = "/api/dumplist?projectId=\${activeProjectId}";
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
            if (HttpSendRequestA(hRequest, NULL, 0, NULL, 0)) {
                std::string response;
                char buffer[1024];
                DWORD bytesRead;
                while (InternetReadFile(hRequest, buffer, sizeof(buffer), &bytesRead) && bytesRead > 0) {
                    response.append(buffer, bytesRead);
                }

                // Parse response
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
                        std::stringstream ls(line);
                        std::string part;
                        std::vector<std::string> parts;
                        while(std::getline(ls, part, '\\t')) {
                            parts.push_back(part);
                        }
                        if(parts.size() >= 4) {
                            try {
                                DynamicSignature sig;
                                sig.address = std::stoul(parts[1], nullptr, 16);
                                sig.name = parts.back();
                                if(sig.name.size() > 2 && sig.name.front() == '"' && sig.name.back() == '"') {
                                    sig.name = sig.name.substr(1, sig.name.size() - 2);
                                }
                                for(size_t i = 2; i < parts.size() - 1; i++) {
                                    sig.signature.push_back((BYTE)std::stoul(parts[i], nullptr, 16));
                                }
                                DYNAMIC_DUMPS.push_back(sig);
                            } catch(...) {}
                        }
                    }
                }
            }
            InternetCloseHandle(hRequest);
        }
        InternetCloseHandle(hConnect);
    }
    InternetCloseHandle(hInternet);
}

`;

if (!code.includes('FetchDynamicLists()')) {
  // Add struct before IntegrityCheckThread
  code = code.replace(
    /DWORD WINAPI IntegrityCheckThread\(LPVOID lpParam\) \{/,
    dynamicCode + 'DWORD WINAPI IntegrityCheckThread(LPVOID lpParam) {'
  );
  
  // Add FetchDynamicLists call to start of thread
  code = code.replace(
    /DWORD WINAPI IntegrityCheckThread\(LPVOID lpParam\) \{\n/,
    'DWORD WINAPI IntegrityCheckThread(LPVOID lpParam) {\n    FetchDynamicLists();\n'
  );

  // Update ScanForBlacklistedWindows
  code = code.replace(
    /bool ScanForBlacklistedWindows\(\) \{\n    for \(int i = 0; i < sizeof\(BLACKLISTED_WINDOWS\)/,
    `bool ScanForBlacklistedWindows() {\n    for (const auto& win : DYNAMIC_WINDOWS) {\n        if (FindWindowA(NULL, win.c_str()) != NULL) return true;\n    }\n    for (int i = 0; i < sizeof(BLACKLISTED_WINDOWS)`
  );

  // Update ScanMemorySignatures
  code = code.replace(
    /bool ScanMemorySignatures\(\) \{\n    HANDLE hProcess = GetCurrentProcess\(\);/,
    `bool ScanMemorySignatures() {\n    HANDLE hProcess = GetCurrentProcess();\n    for (const auto& sig : DYNAMIC_DUMPS) {\n        BYTE buffer[32];\n        SIZE_T bytesRead;\n        if (ReadProcessMemory(hProcess, (LPCVOID)sig.address, buffer, sig.signature.size(), &bytesRead)) {\n            bool match = true;\n            for (size_t j = 0; j < sig.signature.size() && j < bytesRead; j++) {\n                if (buffer[j] != sig.signature[j]) {\n                    match = false;\n                    break;\n                }\n            }\n            if (match) return true;\n        }\n    }\n`
  );
}

fs.writeFileSync('src/App.tsx', code);
