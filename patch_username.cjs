const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetUser = `    // Connect to the web API to validate player login & computer HWID
    // In actual production, username can be retrieved from launcher launch parameters
    std::string accountName = "PlayerInGame";`;

const replacementUser = `    // Connect to the web API to validate player login & computer HWID
    // In actual production, username can be retrieved from launcher launch parameters
    char compNameUser[MAX_COMPUTERNAME_LENGTH + 1];
    DWORD compNameUserLen = sizeof(compNameUser);
    GetComputerNameA(compNameUser, &compNameUserLen);
    std::string accountName = compNameUser;`;

code = code.replace(targetUser, replacementUser);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched C++ username");
