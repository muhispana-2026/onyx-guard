const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /        InternetConnectA\(hInternet, host\.c_str\(\), \s*AUTH_SERVER_URL\.find\("https:\/\/"\) != std::string::npos \? INTERNET_DEFAULT_HTTPS_PORT : INTERNET_DEFAULT_HTTP_PORT, \s*NULL, NULL, INTERNET_SERVICE_HTTP, 0, 0\);\s*/g,
  ""
);

fs.writeFileSync('src/App.tsx', code);
