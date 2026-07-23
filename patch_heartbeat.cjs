const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
                        if (HttpSendRequestA(hReq, hHeaders.c_str(), hHeaders.length(), (LPVOID)hJson.c_str(), hJson.length())) {
                            char buffer[512];
                            DWORD bytesRead = 0;
                            std::string responseString = "";
                            while (InternetReadFile(hReq, buffer, sizeof(buffer) - 1, &bytesRead) && bytesRead > 0) {
                                buffer[bytesRead] = '\\0';
                                responseString += buffer;
                            }
                            
                            size_t sensStart = responseString.find("\\"speedhackSensitivity\\":\\"");
                            if (sensStart != std::string::npos) {
                                sensStart += 24;
                                size_t sensEnd = responseString.find("\\"", sensStart);
                                if (sensEnd != std::string::npos) {
                                    try {
                                        g_speedhackSensitivity = std::stod(responseString.substr(sensStart, sensEnd - sensStart));
                                    } catch (...) {}
                                }
                            }
                        }
                        InternetCloseHandle(hReq);`;

code = code.replace(/                        HttpSendRequestA\(hReq, hHeaders\.c_str\(\), hHeaders\.length\(\), \(LPVOID\)hJson\.c_str\(\), hJson\.length\(\)\);\s*InternetCloseHandle\(hReq\);/g, replacement);

fs.writeFileSync('src/App.tsx', code);
