const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetConnect = `    HINTERNET hConnect = InternetConnectA(hInternet, host.c_str(), INTERNET_DEFAULT_HTTP_PORT, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
    if (!hConnect) {
        InternetCloseHandle(hInternet);
        return false;
    }

    HINTERNET hRequest = HttpOpenRequestA(hConnect, "POST", path.c_str(), NULL, NULL, NULL, INTERNET_FLAG_RELOAD, 0);`;

const replacementConnect = `    INTERNET_PORT port = INTERNET_DEFAULT_HTTP_PORT;
    DWORD flags = INTERNET_FLAG_RELOAD;
    if (AUTH_SERVER_URL.find("https://") == 0) {
        port = INTERNET_DEFAULT_HTTPS_PORT;
        flags |= INTERNET_FLAG_SECURE;
    }

    HINTERNET hConnect = InternetConnectA(hInternet, host.c_str(), port, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);
    if (!hConnect) {
        InternetCloseHandle(hInternet);
        return false;
    }

    HINTERNET hRequest = HttpOpenRequestA(hConnect, "POST", path.c_str(), NULL, NULL, NULL, flags, 0);`;

code = code.replace(targetConnect, replacementConnect);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched HTTPS!");
