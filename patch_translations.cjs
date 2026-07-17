const fs = require('fs');
let code = fs.readFileSync('src/translations.ts', 'utf8');

const targetEn = `      colAction: "Actions",
      statusActive: "ACTIVE (LOCKED)",
      statusBanned: "PERMANENT BANNED",`;

const replacementEn = `      colAction: "Actions",
      statusActive: "ACTIVE (LOCKED)",
      statusBanned: "PERMANENT BANNED",
      hackerDumps: "Hacker Process Dumps (Dump.List)",
      hackerDumpsDesc: "Register known hacker tool names (e.g. CheatEngine.exe, Haste.dll) to build the Dump.List/Dump.db blocked process database.",
      colHackName: "Hack Process Name",
      colHackDesc: "Description / Danger Level",
      addDumpRule: "Register Dump Rule",
      processName: "Process / Hack name (e.g. speedhack.exe)",`;

code = code.replace(targetEn, replacementEn);

const targetEs = `      colAction: "Acciones",
      statusActive: "ACTIVO (BLOQUEADO A HWID)",
      statusBanned: "BANEADO PERMANENTE",`;

const replacementEs = `      colAction: "Acciones",
      statusActive: "ACTIVO (BLOQUEADO A HWID)",
      statusBanned: "BANEADO PERMANENTE",
      hackerDumps: "Archivos Dump de Hackers (Dump.List)",
      hackerDumpsDesc: "Registra nombres de herramientas hacker (ej. CheatEngine.exe) para armar la base de datos de procesos bloqueados Dump.List o Dump.db.",
      colHackName: "Nombre del Proceso Hacker",
      colHackDesc: "Descripción / Nivel de Peligro",
      addDumpRule: "Registrar Regla Dump",
      processName: "Proceso / Nombre (ej. speedhack.exe)",`;

code = code.replace(targetEs, replacementEs);
fs.writeFileSync('src/translations.ts', code);
