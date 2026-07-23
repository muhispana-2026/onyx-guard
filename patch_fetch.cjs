const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const fetchPatch = `                path = basePath + "/api/dumplist?projectId=\${activeProjectId}";
            }
            host = host.substr(0, slashPos);
        }
    }
    
    INTERNET_PORT cPort = AUTH_SERVER_URL.find("https://") != std::string::npos ? INTERNET_DEFAULT_HTTPS_PORT : INTERNET_DEFAULT_HTTP_PORT;
    size_t cColonPos = host.find(":");
    if (cColonPos != std::string::npos) {
        try { cPort = std::stoi(host.substr(cColonPos + 1)); } catch(...) {}
        host = host.substr(0, cColonPos);
    }
    
    HINTERNET hConnect = InternetConnectA(hInternet, host.c_str(), cPort, NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0);`;

code = code.replace(
  /                path = basePath \+ "\/api\/dumplist\?projectId=\$\{activeProjectId\}";\s*\}\s*host = host\.substr\(0, slashPos\);\s*\}\s*\}\s*HINTERNET hConnect = InternetConnectA\(hInternet, host\.c_str\(\), \s*AUTH_SERVER_URL\.find\("https:\/\/"\) != std::string::npos \? INTERNET_DEFAULT_HTTPS_PORT : INTERNET_DEFAULT_HTTP_PORT, \s*NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0\);/g,
  fetchPatch
);

fs.writeFileSync('src/App.tsx', code);
