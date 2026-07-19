const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            } else if (responseString.find("\\"action\\":") != std::string::npos) {
                // If it successfully reached server and server explicitly rejected, do not retry
                size_t msgStart = responseString.find("\\"message\\":\\"");
                if (msgStart != std::string::npos) {
                    msgStart += 11;
                    size_t msgEnd = responseString.find("\\"", msgStart);
                    if (msgEnd != std::string::npos) {
                        std::string msg = responseString.substr(msgStart, msgEnd - msgStart);
                        g_startupMessage = msg;
                    }
                }
                InternetCloseHandle(hRequest);
                InternetCloseHandle(hConnect);
                break;
            }
        }`;

const repl = `            } else if (responseString.find("\\"action\\":") != std::string::npos) {
                // If it successfully reached server and server explicitly rejected, do not retry
                size_t msgStart = responseString.find("\\"message\\":\\"");
                if (msgStart != std::string::npos) {
                    msgStart += 11;
                    size_t msgEnd = responseString.find("\\"", msgStart);
                    if (msgEnd != std::string::npos) {
                        std::string msg = responseString.substr(msgStart, msgEnd - msgStart);
                        g_startupMessage = msg;
                    }
                }
                InternetCloseHandle(hRequest);
                InternetCloseHandle(hConnect);
                break;
            } else {
                g_startupMessage = "Server returned invalid response. Check URL (Dev URL blocks access).";
            }
        }`;
code = code.replace(target, repl);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed fallback error!");
