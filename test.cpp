#include <vector>
typedef unsigned char BYTE;
typedef unsigned int DWORD;

struct MemorySignature {
    int type;
    DWORD address;
    BYTE signature[32];
    int sigLength;
    const char* name;
};

MemorySignature MEMORY_SIGNATURES[] = {
    { 0, 0x0, {0}, 0, "Dummy" }
};
