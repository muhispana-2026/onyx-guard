const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

// Replace "if (username) {" with "if (username || hwid) {"
content = content.replace("if (username) {", "if (username || hwid) {\\n        const searchUser = username || 'Player_' + (hwid || 'Unknown').substring(0, 6);");

// Replace all subsequent uses of `username` inside that block with `searchUser` (for the DB query and insert)
// But wait, it's easier to just do it via string replacement.
