typedef unsigned int DWORD;
typedef unsigned char BYTE;
struct MemorySignature {
    int type;
    DWORD address;
    BYTE signature[32];
    int sigLength;
    const char* name;
};
MemorySignature MEMORY_SIGNATURES[] = {
    { 1, 0x00400000, { 0x8B, 0x55 }, 2, "Cheat Engine" }
};
