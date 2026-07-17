const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetPerformHandshakeEnd = `        if (responseString.find("\\"success\\":true") != std::string::npos || 
            responseString.find("\\"success\\": true") != std::string::npos) {
            isAuthorized = true;
        }
    }

    InternetCloseHandle(hRequest);
    InternetCloseHandle(hConnect);
    InternetCloseHandle(hInternet);

    return isAuthorized;`;

const replacementPerformHandshakeEnd = `        if (responseString.find("\\"success\\":true") != std::string::npos || 
            responseString.find("\\"success\\": true") != std::string::npos) {
            isAuthorized = true;
        } else {
            // Write to a log file for debugging
            FILE* f;
            if (fopen_s(&f, "onyx_guard_debug.log", "a") == 0) {
                fprintf(f, "Server Response: %s\\n", responseString.c_str());
                fclose(f);
            }
        }
    } else {
        DWORD err = GetLastError();
        FILE* f;
        if (fopen_s(&f, "onyx_guard_debug.log", "a") == 0) {
            fprintf(f, "HTTP Request Failed. Error Code: %lu\\n", err);
            fclose(f);
        }
    }

    InternetCloseHandle(hRequest);
    InternetCloseHandle(hConnect);
    InternetCloseHandle(hInternet);

    return isAuthorized;`;

code = code.replace(targetPerformHandshakeEnd, replacementPerformHandshakeEnd);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched C++ Error Logging!");
