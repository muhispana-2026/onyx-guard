const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex2 = /                HINTERNET hConn = InternetConnectA\(hNet, bHost\.c_str\(\), \s*AUTH_SERVER_URL\.find\("https:\/\/"\) != std::string::npos \? INTERNET_DEFAULT_HTTPS_PORT : INTERNET_DEFAULT_HTTP_PORT, \s*NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0\);\s*if \(hConn\) \{\s*DWORD flags = INTERNET_FLAG_RELOAD \| INTERNET_FLAG_NO_CACHE_WRITE;\s*if \(AUTH_SERVER_URL\.find\("https:\/\/"\) != std::string::npos\) flags \|= INTERNET_FLAG_SECURE;/g;

const repl2 = `                INTERNET_PORT bPort = AUTH_SERVER_URL.find("https://") != std::string::npos ? INTERNET_DEFAULT_HTTPS_PORT : INTERNET_DEFAULT_HTTP_PORT;
                size_t bColonPos = bHost.find(":");
                if (bColonPos != std::string::npos) {
                    try { bPort = std::stoi(bHost.substr(bColonPos + 1)); } catch(...) {}
                    bHost = bHost.substr(0, bColonPos);
                }
                HINTERNET hConn = InternetConnectA(hNet, bHost.c_str(), bPort, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
                if (hConn) {
                    DWORD flags = INTERNET_FLAG_RELOAD | INTERNET_FLAG_NO_CACHE_WRITE;
                    if (AUTH_SERVER_URL.find("https://") != std::string::npos) flags |= INTERNET_FLAG_SECURE;`;

code = code.replace(regex2, repl2);

fs.writeFileSync('src/App.tsx', code);
