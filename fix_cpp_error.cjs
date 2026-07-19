const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            } else if (responseString.find("\\"action\\":") != std::string::npos) {
                // If it successfully reached server and server explicitly rejected, do not retry
                isAuthorized = false;
                InternetCloseHandle(hRequest);
                InternetCloseHandle(hConnect);
                break; 
            }`;

const replacement = `            } else if (responseString.find("\\"action\\":") != std::string::npos) {
                // If it successfully reached server and server explicitly rejected, do not retry
                isAuthorized = false;
                size_t msgStart = responseString.find("\\"message\\":\\"");
                if (msgStart != std::string::npos) {
                    msgStart += 11;
                    size_t msgEnd = responseString.find("\\"", msgStart);
                    if (msgEnd != std::string::npos) {
                        g_startupMessage = responseString.substr(msgStart, msgEnd - msgStart);
                    }
                }
                InternetCloseHandle(hRequest);
                InternetCloseHandle(hConnect);
                break; 
            }`;

code = code.replace(target, replacement);

const target2 = `        HandleFailure("CRITICAL SECURITY ERROR: Your client files or Hardware ID are unauthorized.");`;
const replacement2 = `        std::string err = g_startupMessage.empty() ? "CRITICAL SECURITY ERROR: Your client files or Hardware ID are unauthorized." : g_startupMessage;
        HandleFailure(err);`;
code = code.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
