const fs = require('fs');
let code = fs.readFileSync('src/translations.ts', 'utf8');

const tEn = `      dashboardSub: "HWIDs & File hashes",`;
const rEn = `      dashboardSub: "Real-time events",
      hardware: "Hardware Profiles",
      hardwareSub: "Registered HWIDs",
      integrity: "File Integrity",
      integritySub: "MD5 Hashing rules",
      dumps: "Process Dumps",
      dumpsSub: "Blocked hacks & tools",`;

code = code.replace(tEn, rEn);

const tEs = `      dashboardSub: "HWIDs y Hashes de Archivos",`;
const rEs = `      dashboardSub: "Eventos en vivo",
      hardware: "Perfiles de Hardware",
      hardwareSub: "HWIDs Registrados",
      integrity: "Integridad de Archivos",
      integritySub: "Reglas de Hash MD5",
      dumps: "Volcados de Procesos",
      dumpsSub: "Hacks bloqueados",`;

code = code.replace(tEs, rEs);

fs.writeFileSync('src/translations.ts', code);
