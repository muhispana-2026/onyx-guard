const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const badJsonStr = `std::string hJson = "{\\"username\\":\\"" + JsonEscape(accountName) + "\\",\\"hwid\\":\\"" + JsonEscape(hwid) + "\\",\\"secretToken\\":\\"" + JsonEscape(SECRET_TOKEN) + "\\"}";`;
const goodJsonStr = 'std::string hJson = "{\\\\\\"username\\\\\\":\\\\\\"" + JsonEscape(accountName) + "\\\\\\",\\\\\\"hwid\\\\\\":\\\\\\"" + JsonEscape(hwid) + "\\\\\\",\\\\\\"secretToken\\\\\\":\\\\\\"" + JsonEscape(SECRET_TOKEN) + "\\\\\\"}";';

content = content.replace(badJsonStr, goodJsonStr);

// Let's also fix the multiline header if it broke
const badHeader = `std::string hHeaders = "Content-Type: application/json
                            ";`;
const goodHeader = 'std::string hHeaders = "Content-Type: application/json\\\\r\\\\n";';
content = content.replace(badHeader, goodHeader);

// It could also just be a single line with an actual \r\n in the string literal. 
// A better regex replacement for the headers:
content = content.replace(/std::string hHeaders = "Content-Type: application\/json[\s\S]*?";/, goodHeader);

fs.writeFileSync('src/App.tsx', content);
