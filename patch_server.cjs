const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const dumpListEndpoint = `
  // ==========================================
  // DLL REAL-TIME DUMPLIST ENDPOINT
  // ==========================================
  app.get("/api/dumplist", async (req, res) => {
    try {
      const projectId = req.query.projectId || "DEFAULT";
      
      const configQuery = await getDocs(query(collection(db, 'config'), where('projectId', '==', projectId), limit(1)));
      let config = {};
      if (!configQuery.empty) config = configQuery.docs[0].data();

      let out = "[WINDOWS]\\n";
      if (config.blacklistedPrograms && Array.isArray(config.blacklistedPrograms)) {
        for (const w of config.blacklistedPrograms) {
          out += w + "\\n";
        }
      }

      out += "[DUMPS]\\n";
      const dumpsQuery = await getDocs(query(collection(db, 'dumps'), where('projectId', '==', projectId)));
      for (const doc of dumpsQuery.docs) {
        const d = doc.data();
        if (d.rawRule) {
          out += d.rawRule + "\\n";
        }
      }
      
      res.type('text/plain').send(out);
    } catch(e) {
      res.status(500).send("ERROR");
    }
  });

`;

code = code.replace(
  /  \/\/ ==========================================\n  \/\/ DLL AUTHENTICATION ENDPOINT/,
  dumpListEndpoint + "  // ==========================================\n  // DLL AUTHENTICATION ENDPOINT"
);

fs.writeFileSync('server.ts', code);
