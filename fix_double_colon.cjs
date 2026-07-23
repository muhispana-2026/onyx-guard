const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const doubleBlock = `    size_t colonPos = host.find(":");
    if (colonPos != std::string::npos) {
        try { port = std::stoi(host.substr(colonPos + 1)); } catch(...) {}
        host = host.substr(0, colonPos);
    }
    size_t colonPos = host.find(":");
    if (colonPos != std::string::npos) {
        try { port = std::stoi(host.substr(colonPos + 1)); } catch(...) {}
        host = host.substr(0, colonPos);
    }`;
    
const doubleBlockFixed = `    size_t colonPos = host.find(":");
    if (colonPos != std::string::npos) {
        try { port = std::stoi(host.substr(colonPos + 1)); } catch(...) {}
        host = host.substr(0, colonPos);
    }`;

// use regex to remove multiple instances of size_t colonPos
code = code.replace(/    size_t colonPos = host\.find\(":"\);\s*if \(colonPos != std::string::npos\) \{\s*try \{ port = std::stoi\(host\.substr\(colonPos \+ 1\)\); \} catch\(\.\.\.\) \{\}\s*host = host\.substr\(0, colonPos\);\s*\}(\s*size_t colonPos = host\.find\(":"\);\s*if \(colonPos != std::string::npos\) \{\s*try \{ port = std::stoi\(host\.substr\(colonPos \+ 1\)\); \} catch\(\.\.\.\) \{\}\s*host = host\.substr\(0, colonPos\);\s*\})+/g, doubleBlockFixed);

fs.writeFileSync('src/App.tsx', code);
