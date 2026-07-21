const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Include a heartbeat in the integrity check loop
const checkStr = `        if (tickCount % 10 == 0) { 
            FetchDynamicLists();
        }`;
        
const newCheckStr = `        if (tickCount % 10 == 0) { 
            FetchDynamicLists();
        }
        if (tickCount % 20 == 0) {
            // Heartbeat
            HINTERNET hNet = InternetOpenA("MuOnline", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
            if (hNet) {
                std::string bHost = "127.0.0.1";
                std::string bPath = "/api/heartbeat";
                size_t pPos = AUTH_SERVER_URL.find("://");
                if (pPos != std::string::npos) {
                    bHost = AUTH_SERVER_URL.substr(pPos + 3);
                    size_t sPos = bHost.find("/");
                    if (sPos != std::string::npos) {
                        bPath = bHost.substr(sPos);
                        bHost = bHost.substr(0, sPos);
                        if (bPath.back() == '/') bPath.pop_back();
                        if (bPath.length() >= 9 && bPath.substr(bPath.length() - 9) == "/api/auth") {
                            bPath = bPath.substr(0, bPath.length() - 9) + "/api/heartbeat";
                        } else {
                            bPath = bPath + "/api/heartbeat";
                        }
                    }
                }
                
                HINTERNET hConn = InternetConnectA(hNet, bHost.c_str(), 
                    AUTH_SERVER_URL.find("https://") != std::string::npos ? INTERNET_DEFAULT_HTTPS_PORT : INTERNET_DEFAULT_HTTP_PORT, 
                    NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
                if (hConn) {
                    DWORD flags = INTERNET_FLAG_RELOAD | INTERNET_FLAG_NO_CACHE_WRITE;
                    if (AUTH_SERVER_URL.find("https://") != std::string::npos) flags |= INTERNET_FLAG_SECURE;
                    HINTERNET hReq = HttpOpenRequestA(hConn, "POST", bPath.c_str(), NULL, NULL, NULL, flags, 0);
                    if (hReq) {
                        std::string hJson = "{\\\"username\\\":\\\"" + JsonEscape(accountName) + "\\\",\\\"hwid\\\":\\\"" + JsonEscape(hwid) + "\\\",\\\"secretToken\\\":\\\"" + JsonEscape(SECRET_TOKEN) + "\\\"}";
                        std::string hHeaders = "Content-Type: application/json\\r\\n";
                        HttpSendRequestA(hReq, hHeaders.c_str(), hHeaders.length(), (LPVOID)hJson.c_str(), hJson.length());
                        InternetCloseHandle(hReq);
                    }
                    InternetCloseHandle(hConn);
                }
                InternetCloseHandle(hNet);
            }
        }`;

content = content.replace(checkStr, newCheckStr);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched UI C++ generator for heartbeat");
