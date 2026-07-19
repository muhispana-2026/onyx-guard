const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `    if (AUTH_SERVER_URL.find("https://") == 0) {
        port = INTERNET_DEFAULT_HTTPS_PORT;
        flags |= INTERNET_FLAG_SECURE;
    }`;
const repl1 = `    if (AUTH_SERVER_URL.find("https://") == 0) {
        port = INTERNET_DEFAULT_HTTPS_PORT;
        flags |= INTERNET_FLAG_SECURE | INTERNET_FLAG_IGNORE_CERT_CN_INVALID | INTERNET_FLAG_IGNORE_CERT_DATE_INVALID;
    }`;
code = code.replace(target1, repl1);

const target2 = `        // If we reach here, it was a network error or malformed response
        InternetCloseHandle(hRequest);
        InternetCloseHandle(hConnect);
        if (retry < maxRetries - 1) {
            Sleep(2000); // Wait 2s before retrying
        }`;
const repl2 = `        // If we reach here, it was a network error or malformed response
        InternetCloseHandle(hRequest);
        InternetCloseHandle(hConnect);
        if (retry == maxRetries - 1) {
            g_startupMessage = "Network error: Unable to connect to Authentication Server.";
        }
        if (retry < maxRetries - 1) {
            Sleep(2000); // Wait 2s before retrying
        }`;
code = code.replace(target2, repl2);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed!");
