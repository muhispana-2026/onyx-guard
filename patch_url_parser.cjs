const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const portParsing = `    INTERNET_PORT port = INTERNET_DEFAULT_HTTP_PORT;
    DWORD flags = INTERNET_FLAG_RELOAD;
    if (AUTH_SERVER_URL.find("https://") == 0) {
        port = INTERNET_DEFAULT_HTTPS_PORT;
        flags |= INTERNET_FLAG_SECURE | INTERNET_FLAG_IGNORE_CERT_CN_INVALID | INTERNET_FLAG_IGNORE_CERT_DATE_INVALID;
    }
    size_t colonPos = host.find(":");
    if (colonPos != std::string::npos) {
        try { port = std::stoi(host.substr(colonPos + 1)); } catch(...) {}
        host = host.substr(0, colonPos);
    }
`;

code = code.replace(
  /    INTERNET_PORT port = INTERNET_DEFAULT_HTTP_PORT;\s*DWORD flags = INTERNET_FLAG_RELOAD;\s*if \(AUTH_SERVER_URL\.find\("https:\/\/"\) == 0\) \{\s*port = INTERNET_DEFAULT_HTTPS_PORT;\s*flags \|= INTERNET_FLAG_SECURE \| INTERNET_FLAG_IGNORE_CERT_CN_INVALID \| INTERNET_FLAG_IGNORE_CERT_DATE_INVALID;\s*\}/g,
  portParsing
);

const portParsing2 = `                    DWORD flags = INTERNET_FLAG_RELOAD | INTERNET_FLAG_NO_CACHE_WRITE;
                    if (AUTH_SERVER_URL.find("https://") != std::string::npos) flags |= INTERNET_FLAG_SECURE;
                    
                    INTERNET_PORT bPort = AUTH_SERVER_URL.find("https://") != std::string::npos ? INTERNET_DEFAULT_HTTPS_PORT : INTERNET_DEFAULT_HTTP_PORT;
                    size_t bColonPos = bHost.find(":");
                    if (bColonPos != std::string::npos) {
                        try { bPort = std::stoi(bHost.substr(bColonPos + 1)); } catch(...) {}
                        bHost = bHost.substr(0, bColonPos);
                    }
                    
                    HINTERNET hConn = InternetConnectA(hInternet, bHost.c_str(), bPort, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);`;

code = code.replace(
  /                    HINTERNET hConn = InternetConnectA\(hInternet, bHost\.c_str\(\),\s*AUTH_SERVER_URL\.find\("https:\/\/"\) != std::string::npos \? INTERNET_DEFAULT_HTTPS_PORT : INTERNET_DEFAULT_HTTP_PORT, \s*NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0\);\s*if \(hConn\) \{\s*DWORD flags = INTERNET_FLAG_RELOAD \| INTERNET_FLAG_NO_CACHE_WRITE;\s*if \(AUTH_SERVER_URL\.find\("https:\/\/"\) != std::string::npos\) flags \|= INTERNET_FLAG_SECURE;/g,
  portParsing2 + "\n                    if (hConn) {"
);

fs.writeFileSync('src/App.tsx', code);
