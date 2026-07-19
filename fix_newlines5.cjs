const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The file currently contains literal \r and \n in the string.
// Let's replace the whole section carefully.

const target = '    std::string payload = json.str();\n    std::string headers = "Content-Type: application/json\r\n";\n\n${enablePayloadEncryption ? `    // Encrypting Payload before sending\n    payload = EncryptPayload(payload);\n    // Add custom header to indicate encrypted payload\n    headers += "X-Payload-Encrypted: true\r\n";\n` : \'\'}';

const replacement = '    std::string payload = json.str();\n    std::string headers = "Content-Type: application/json\\\\r\\\\n";\n\n${enablePayloadEncryption ? `    // Encrypting Payload before sending\n    payload = EncryptPayload(payload);\n    // Add custom header to indicate encrypted payload\n    headers += "X-Payload-Encrypted: true\\\\r\\\\n";\n` : \'\'}';

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Fixed exact match!");
} else {
    console.log("Not found, falling back to regex.");
    // Wait, let's just use regex for "Content-Type: application/json\r\n" where it has actual newlines
    code = code.replace(/Content-Type: application\/json\r\n/g, 'Content-Type: application/json\\\\r\\\\n');
    code = code.replace(/X-Payload-Encrypted: true\r\n/g, 'X-Payload-Encrypted: true\\\\r\\\\n');
    fs.writeFileSync('src/App.tsx', code);
    console.log("Fixed with regex!");
}
