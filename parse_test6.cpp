#include <iostream>
#include <string>
int main() {
    std::string s = "{\"message\":\"Hello\"}";
    std::cout << "1: " << s.find("\\\"message\\\":\\\"") << std::endl;
    std::cout << "2: " << s.find("\"message\":\"") << std::endl;
    return 0;
}
