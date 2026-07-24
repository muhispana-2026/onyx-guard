const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /size_t msgStart = responseString\.find\("\\\\"message\\\\":\\\\""\);/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const substr = content.substring(match.index, match.index + 500);
  console.log("MATCH:\n", substr);
}
