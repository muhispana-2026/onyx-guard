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
             }\n"""

if '} else if (responseString.find("\\\"action\\\":")' in lines[1250]:
    lines[1250:1256] = [replacement]
    with open('src/App.tsx', 'w') as f:
        f.writelines(lines)
    print("Replaced successfully")
else:
    print("Line 1250 does not match:", lines[1250])
