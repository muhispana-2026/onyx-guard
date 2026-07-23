#include <iostream>
#include <string>

int main() {
    std::string AUTH_SERVER_URL = "http://localhost:3000";
    std::string host = "127.0.0.1";
    std::string path = "/api/auth";
    
    size_t protocolPos = AUTH_SERVER_URL.find("://");
    std::string urlWithoutProtocol = (protocolPos == std::string::npos) ? AUTH_SERVER_URL : AUTH_SERVER_URL.substr(protocolPos + 3);
    
    size_t slashPos = urlWithoutProtocol.find("/");
    if (slashPos != std::string::npos) {
        host = urlWithoutProtocol.substr(0, slashPos);
        std::string basePath = urlWithoutProtocol.substr(slashPos);
        if (basePath.back() == '/') basePath.pop_back();
        if (basePath.length() >= 9 && basePath.substr(basePath.length() - 9) == "/api/auth") {
            path = basePath;
        } else {
            path = basePath + "/api/auth";
        }
    } else {
        host = urlWithoutProtocol;
    }
    
    int port = 80;
    DWORD flags = 0; // INTERNET_FLAG_RELOAD
    if (AUTH_SERVER_URL.find("https://") == 0) {
        port = 443;
    }
    
    std::cout << "Host: " << host << std::endl;
    std::cout << "Port: " << port << std::endl;
    
    return 0;
}
