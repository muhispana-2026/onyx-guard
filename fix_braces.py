with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

replacement = """            } else if (responseString.find("\\\"action\\\":") != std::string::npos) {
                isAuthorized = false;
                size_t msgStart = responseString.find("\\\"message\\\":\\\"");
                if (msgStart != std::string::npos) {
                    msgStart += 11;
                    size_t msgEnd = responseString.find("\\\"", msgStart);
                    if (msgEnd != std::string::npos) {
                        g_startupMessage = responseString.substr(msgStart, msgEnd - msgStart);
                    }
                }
                InternetCloseHandle(hRequest);
                InternetCloseHandle(hConnect);
                break; 
             }
        }
        InternetCloseHandle(hRequest);
        InternetCloseHandle(hConnect);
"""

start_idx = -1
for i in range(1240, 1270):
    if "} else if (responseString.find" in lines[i] and "action" in lines[i]:
        start_idx = i
        break

end_idx = -1
for i in range(start_idx, 1280):
    if "if (retry == maxRetries - 1) {" in lines[i]:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    lines[start_idx:end_idx] = [replacement]
    with open('src/App.tsx', 'w') as f:
        f.writelines(lines)
    print("Fixed.")
else:
    print("Could not find boundaries")
