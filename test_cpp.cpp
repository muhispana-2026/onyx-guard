#include <iostream>
#include <string>

int main() {
    std::string test = "hello\"world";
    size_t pos = test.find("\"", 0);
    std::cout << pos << std::endl;
    return 0;
}
