const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetOpenReq = `        HINTERNET hRequest = HttpOpenRequestA(hConnect, "POST", path.c_str(), NULL, NULL, NULL, flags, 0);
        if (!hRequest) {
            InternetCloseHandle(hConnect);
            Sleep(1000);
            continue;
        }

        BOOL result = HttpSendRequestA(hRequest, headers.c_str(), headers.length(), (LPVOID)payload.c_str(), payload.length());
        
        if (result) {`;

const replOpenReq = `        HINTERNET hRequest = HttpOpenRequestA(hConnect, "POST", path.c_str(), NULL, NULL, NULL, flags, 0);
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
        
        if (result) {`;

const targetFallback = `            } else {
                g_startupMessage = "Server returned invalid response. Check URL (Dev URL blocks access).";
            }
        }`;

const replFallback = `            } else {
                g_startupMessage = "Server returned invalid response. Check URL (Dev URL blocks access).";
            }
        } else {
            DWORD err = GetLastError();
            std::stringstream ss;
            ss << "Connection Error: " << err << " - Could not reach server.";
            g_startupMessage = ss.str();
        }
    }`;

code = code.replace(targetOpenReq, replOpenReq);
code = code.replace(targetFallback, replFallback);

// Also fix GET request
const targetGet = `        HINTERNET hRequest = HttpOpenRequestA(hConnect, "GET", path.c_str(), NULL, NULL, NULL, flags, 0);
        if (hRequest) {
            if (HttpSendRequestA(hRequest, NULL, 0, NULL, 0)) {`;
            
const replGet = `        HINTERNET hRequest = HttpOpenRequestA(hConnect, "GET", path.c_str(), NULL, NULL, NULL, flags, 0);
        if (hRequest) {
            DWORD dwFlags = 0;
            DWORD dwBuffLen = sizeof(dwFlags);
            if (InternetQueryOptionA(hRequest, INTERNET_OPTION_SECURITY_FLAGS, &dwFlags, &dwBuffLen)) {
                dwFlags |= SECURITY_FLAG_IGNORE_UNKNOWN_CA | SECURITY_FLAG_IGNORE_REVOCATION | SECURITY_FLAG_IGNORE_CERT_CN_INVALID | SECURITY_FLAG_IGNORE_CERT_DATE_INVALID | SECURITY_FLAG_IGNORE_WRONG_USAGE;
                InternetSetOptionA(hRequest, INTERNET_OPTION_SECURITY_FLAGS, &dwFlags, sizeof(dwFlags));
            }
            if (HttpSendRequestA(hRequest, NULL, 0, NULL, 0)) {`;

code = code.replace(targetGet, replGet);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed C++ SSL and Error handling!");
