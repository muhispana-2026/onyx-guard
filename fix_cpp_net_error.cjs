const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add ignore cert flags to POST request
const target1 = `    if (AUTH_SERVER_URL.find("https://") == 0) {
        port = INTERNET_DEFAULT_HTTPS_PORT;
        flags |= INTERNET_FLAG_SECURE;
    }`;
const repl1 = `    if (AUTH_SERVER_URL.find("https://") == 0) {
        port = INTERNET_DEFAULT_HTTPS_PORT;
        flags |= INTERNET_FLAG_SECURE | INTERNET_FLAG_IGNORE_CERT_CN_INVALID | INTERNET_FLAG_IGNORE_CERT_DATE_INVALID;
    }`;
code = code.replace(target1, repl1);

// 2. Add Network Error message if HttpSendRequestA fails or if response doesn't match
const target2 = `        BOOL sent = HttpSendRequestA(hRequest, headers.c_str(), headers.length(), (LPVOID)payload.c_str(), payload.length());
        if (sent) {
            char buffer[1024];
            DWORD bytesRead = 0;
            std::string responseString = "";`;

const repl2 = `        BOOL sent = HttpSendRequestA(hRequest, headers.c_str(), headers.length(), (LPVOID)payload.c_str(), payload.length());
        if (sent) {
            char buffer[1024];
            DWORD bytesRead = 0;
            std::string responseString = "";`;
// Wait, I need to find the exact block to replace.

fs.writeFileSync('fix_cpp_net_error.cjs.tmp', code);
