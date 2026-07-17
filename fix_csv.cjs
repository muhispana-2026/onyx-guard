const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const str1 = '      + "Timestamp,Type,Username,Status,Reason,HWID,IP,Version"';
const str2 = '      + logs.map(l => `${l.timestamp},${l.type},${l.username},${l.status},"${l.reason}",${l.hwid},${l.ip},${l.clientVersion}`).join("");';

const rep1 = '      + "Timestamp,Type,Username,Status,Reason,HWID,IP,Version\\n"';
const rep2 = '      + logs.map(l => `${l.timestamp},${l.type},${l.username},${l.status},"${l.reason}",${l.hwid},${l.ip},${l.clientVersion}`).join("\\n");';

code = code.replace(str1, rep1);
code = code.replace(str2, rep2);

fs.writeFileSync('src/App.tsx', code);
