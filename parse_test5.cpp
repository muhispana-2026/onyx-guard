#include <iostream>
#include <string>
int main() {
    std::string s = "test\"test";
    std::cout << s.find("\"", 0) << std::endl;
    return 0;
}
