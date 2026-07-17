const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

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
