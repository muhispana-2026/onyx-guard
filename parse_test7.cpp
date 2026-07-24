#include <iostream>
#include <string>
int main() {
    std::string responseString = "{\"success\":true,\"action\":\"CONTINUE\",\"message\":\"Bienvenido, test, tu equipo ha sido registrado en nuestro sistema. Disfrute del juego.\",\"sessionToken\":\"rg9n5rcgyap\",\"speedhackSensitivity\":\"1.80\"}";
    size_t msgStart = responseString.find("\"message\":\"");
    if (msgStart != std::string::npos) {
        msgStart += 11;
        size_t msgEnd = responseString.find("\"", msgStart);
        if (msgEnd != std::string::npos) {
            std::cout << "Msg: " << responseString.substr(msgStart, msgEnd - msgStart) << std::endl;
        }
    }
    return 0;
}
