const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const str = `  // ==========================================
  // DLL AUTHENTICATION ENDPOINT (Game Client)`;

const rep = `  app.delete("/api/logs", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const snapshot = await getDocs(query(collection(db, 'logs'), where('projectId', '==', projectId)));
      const batchDelete = snapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(batchDelete);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  // ==========================================
  // DLL AUTHENTICATION ENDPOINT (Game Client)`;

code = code.replace(str, rep);
fs.writeFileSync('server.ts', code);
