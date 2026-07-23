#include <iostream>
#include <string>

int main() {
    std::string responseString = "{\"speedhackSensitivity\":\"2.5\"}";
    double g_speedhackSensitivity = 1.80;
    
    size_t sensStart = responseString.find("\"speedhackSensitivity\":\"");
    if (sensStart != std::string::npos) {
        sensStart += 24;
        size_t sensEnd = responseString.find("\"", sensStart);
        if (sensEnd != std::string::npos) {
            try {
                g_speedhackSensitivity = std::stod(responseString.substr(sensStart, sensEnd - sensStart));
            } catch (...) {}
        }
    }
    
    std::cout << g_speedhackSensitivity << std::endl;
    return 0;
}
