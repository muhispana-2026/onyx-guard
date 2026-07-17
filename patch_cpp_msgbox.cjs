const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetPerformHandshake = `bool PerformHandshake(const std::string& username, const std::string& hwid, const std::string& modifiedFile) {
    HINTERNET hInternet = InternetOpenA("MuOnline_Client_Plugin", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
    if (!hInternet) return false;`;

const replacementPerformHandshake = `bool PerformHandshake(const std::string& username, const std::string& hwid, const std::string& modifiedFile) {
    HINTERNET hInternet = InternetOpenA("MuOnline_Client_Plugin", INTERNET_OPEN_TYPE_DIRECT, NULL, NULL, 0);
    if (!hInternet) {
        MessageBoxA(NULL, "InternetOpenA failed.", "Onyx Debug", MB_OK);
        return false;
    }`;

code = code.replace(targetPerformHandshake, replacementPerformHandshake);

const targetConnect = `    HINTERNET hConnect = InternetConnectA(hInternet, host.c_str(), port, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
    if (!hConnect) {
        InternetCloseHandle(hInternet);
        return false;
    }

    HINTERNET hRequest = HttpOpenRequestA(hConnect, "POST", path.c_str(), NULL, NULL, NULL, flags, 0);
    if (!hRequest) {
        InternetCloseHandle(hConnect);
        InternetCloseHandle(hInternet);
        return false;
    }`;

const replacementConnect = `    HINTERNET hConnect = InternetConnectA(hInternet, host.c_str(), port, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
    if (!hConnect) {
        std::string err = "InternetConnectA failed. Host: " + host + " Port: " + std::to_string(port) + " Error: " + std::to_string(GetLastError());
        MessageBoxA(NULL, err.c_str(), "Onyx Debug", MB_OK);
        InternetCloseHandle(hInternet);
        return false;
    }

    HINTERNET hRequest = HttpOpenRequestA(hConnect, "POST", path.c_str(), NULL, NULL, NULL, flags, 0);
    if (!hRequest) {
        std::string err = "HttpOpenRequestA failed. Path: " + path + " Error: " + std::to_string(GetLastError());
        MessageBoxA(NULL, err.c_str(), "Onyx Debug", MB_OK);
        InternetCloseHandle(hConnect);
        InternetCloseHandle(hInternet);
        return false;
    }`;

code = code.replace(targetConnect, replacementConnect);

const targetSend = `    BOOL result = HttpSendRequestA(hRequest, headers.c_str(), headers.length(), (LPVOID)payload.c_str(), payload.length());
    
    bool isAuthorized = false;
    if (result) {
        char buffer[1024];
        DWORD bytesRead = 0;
        std::string responseString = "";
        while (InternetReadFile(hRequest, buffer, sizeof(buffer) - 1, &bytesRead) && bytesRead > 0) {
            buffer[bytesRead] = '\\0';
            responseString += buffer;
        }
        
        // Simple JSON response check (Looking for "success":true)
        if (responseString.find("\\"success\\":true") != std::string::npos) {
            isAuthorized = true;
        }
    }

    InternetCloseHandle(hRequest);
    InternetCloseHandle(hConnect);
    InternetCloseHandle(hInternet);
    return isAuthorized;`;

const replacementSend = `    BOOL result = HttpSendRequestA(hRequest, headers.c_str(), headers.length(), (LPVOID)payload.c_str(), payload.length());
    
    bool isAuthorized = false;
    if (result) {
        char buffer[1024];
        DWORD bytesRead = 0;
        std::string responseString = "";
        while (InternetReadFile(hRequest, buffer, sizeof(buffer) - 1, &bytesRead) && bytesRead > 0) {
            buffer[bytesRead] = '\\0';
            responseString += buffer;
        }
        
        if (responseString.find("\\"success\\":true") != std::string::npos || responseString.find("\\"success\\": true") != std::string::npos) {
            isAuthorized = true;
        } else {
            std::string err = "Server rejected auth.\\nResponse: " + responseString;
            MessageBoxA(NULL, err.c_str(), "Onyx Debug", MB_OK);
        }
    } else {
        std::string err = "HttpSendRequestA failed. Error: " + std::to_string(GetLastError());
        MessageBoxA(NULL, err.c_str(), "Onyx Debug", MB_OK);
    }

    InternetCloseHandle(hRequest);
    InternetCloseHandle(hConnect);
    InternetCloseHandle(hInternet);
    return isAuthorized;`;

code = code.replace(targetSend, replacementSend);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched C++ MsgBox!");
