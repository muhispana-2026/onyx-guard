const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const reportCode = `
void ReportViolation(const std::string& reason) {
    HINTERNET hInternet = InternetOpenA("MuOnline_Client_Plugin", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
    if (!hInternet) return;
    
    DWORD timeout = 5000;
    DWORD secureProtocols = 0x00000800;
    InternetSetOptionA(hInternet, 31, &secureProtocols, sizeof(secureProtocols));
    InternetSetOptionA(hInternet, INTERNET_OPTION_CONNECT_TIMEOUT, &timeout, sizeof(timeout));
    InternetSetOptionA(hInternet, INTERNET_OPTION_SEND_TIMEOUT, &timeout, sizeof(timeout));
    InternetSetOptionA(hInternet, INTERNET_OPTION_RECEIVE_TIMEOUT, &timeout, sizeof(timeout));

    std::string host = "127.0.0.1";
    std::string path = "/api/report";
    size_t protocolPos = AUTH_SERVER_URL.find("://");
    std::string urlWithoutProtocol = (protocolPos == std::string::npos) ? AUTH_SERVER_URL : AUTH_SERVER_URL.substr(protocolPos + 3);
    size_t slashPos = urlWithoutProtocol.find("/");
    if (slashPos != std::string::npos) {
        host = urlWithoutProtocol.substr(0, slashPos);
        path = urlWithoutProtocol.substr(slashPos);
        if (path.back() == '/') path.pop_back();
        if (path.find("/api/auth") != std::string::npos) {
            path.replace(path.find("/api/auth"), 9, "/api/report");
        } else if (path.find("/api/report") == std::string::npos) {
            path += "/api/report";
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

    std::string hwid = GetHardwareID();
    char compNameUser[MAX_COMPUTERNAME_LENGTH + 1] = {0};
    DWORD compNameLen = MAX_COMPUTERNAME_LENGTH + 1;
    GetComputerNameA(compNameUser, &compNameLen);
    std::string username = std::string(compNameUser);

    std::stringstream json;
    json << "{"
         << "\\\"username\\\": \\\"" << JsonEscape(username) << "\\\","
         << "\\\"hwid\\\": \\\"" << JsonEscape(hwid) << "\\\","
         << "\\\"clientVersion\\\": \\\"" << JsonEscape(CLIENT_VERSION) << "\\\","
         << "\\\"secretToken\\\": \\\"" << JsonEscape(SECRET_TOKEN) << "\\\","
         << "\\\"reason\\\": \\\"" << JsonEscape(reason) << "\\\""
         << "}";

    std::string payload = json.str();
    std::string headers = "Content-Type: application/json\\r\\n";

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
            HttpSendRequestA(hRequest, headers.c_str(), headers.length(), (LPVOID)payload.c_str(), payload.length());
            InternetCloseHandle(hRequest);
        }
        InternetCloseHandle(hConnect);
    }
    InternetCloseHandle(hInternet);
}

void HandleFailure(const std::string& message) {
    ReportViolation(message);`;

code = code.replace("void HandleFailure(const std::string& message) {", reportCode);
fs.writeFileSync('src/App.tsx', code);
