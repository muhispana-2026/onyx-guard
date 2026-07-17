const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetHWID = `std::string GetHardwareID() {
    std::string hwid = "HWID-";
    GUID uuid;
    if (CoCreateGuid(&uuid) == S_OK) {
        char guidStr[40];
        sprintf_s(guidStr, "%08X-%04X-%04X-%02X%02X-%02X%02X%02X%02X%02X%02X",
            uuid.Data1, uuid.Data2, uuid.Data3,
            uuid.Data4[0], uuid.Data4[1], uuid.Data4[2], uuid.Data4[3],
            uuid.Data4[4], uuid.Data4[5], uuid.Data4[6], uuid.Data4[7]);
        hwid += guidStr;
    } else {
        hwid += "FALLBACK-8F9D-4B1A-9E2F";
    }
    // Limit to keep string tidy
    return hwid.substr(0, 24);
}`;

const replacementHWID = `std::string GetHardwareID() {
    char compName[MAX_COMPUTERNAME_LENGTH + 1];
    DWORD compNameLen = sizeof(compName);
    GetComputerNameA(compName, &compNameLen);
    
    std::string hwid = "HWID-";
    hwid += compName;
    return hwid;
}`;

code = code.replace(targetHWID, replacementHWID);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched C++ HWID");
