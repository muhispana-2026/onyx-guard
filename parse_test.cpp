#include <iostream>
#include <string>

int main() {
    std::string responseString = "{\"success\":true,\"action\":\"CONTINUE\",\"message\":\"Bienvenido nuevamente test, disfruta del juego.\",\"sessionToken\":\"8vnydv5zoe8\",\"speedhackSensitivity\":\"1.80\"}";
    std::string g_startupMessage = "";
    
    size_t msgStart = responseString.find("\"message\":\"");
    if (msgStart != std::string::npos) {
        msgStart += 11;
        size_t msgEnd = msgStart; 
        while ((msgEnd = responseString.find("\"", msgEnd)) != std::string::npos) { 
            if (msgEnd > 0 && responseString[msgEnd - 1] != '\\') break; 
            msgEnd++; 
        }

        if (msgEnd != std::string::npos) {
            g_startupMessage = responseString.substr(msgStart, msgEnd - msgStart);
        }
    }
    
    std::cout << "Msg: " << g_startupMessage << std::endl;
    return 0;
}
