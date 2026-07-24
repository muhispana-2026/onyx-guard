const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace('if (tickCount % 10 == 0) {', 'if (tickCount % 100 == 0) { // Every 5 minutes');
code = code.replace('if (tickCount % 20 == 0) {', 'if (tickCount % 60 == 0) { // Every 3 minutes');

fs.writeFileSync('src/App.tsx', code);
