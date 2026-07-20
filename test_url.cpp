#include <iostream>
#include <string>

int main() {
    std::string AUTH_SERVER_URL = "https://ais-dev-h2vywcvn6xvdzf4t2sbkzu-258992696762.us-east5.run.app/api/auth";
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
    
    std::cout << "HOST: " << host << std::endl;
    std::cout << "PATH: " << path << std::endl;
    return 0;
}
