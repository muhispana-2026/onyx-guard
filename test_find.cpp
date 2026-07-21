#include <iostream>
#include <string>

int main() {
    std::string responseString = "{\"success\":false,\"action\":\"EXIT\",\"message\":\"Internal server error: Failed\"}";
    size_t msgStart = responseString.find("\"message\":\"");
    if (msgStart != std::string::npos) {
        msgStart += 11;
        size_t msgEnd = responseString.find("\"", msgStart);
        std::cout << "Msg: " << responseString.substr(msgStart, msgEnd - msgStart) << std::endl;
    }
    return 0;
}
