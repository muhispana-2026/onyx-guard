#include <iostream>
#include <string>

int main() {
    std::string headers = "Content-Type: application/json\r\n";
    if (headers.find('\r') != std::string::npos && headers.find('\n') != std::string::npos) {
        std::cout << "Contains CR and LF" << std::endl;
    }
    return 0;
}
