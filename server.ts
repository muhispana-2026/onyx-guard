import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy' });
import { createServer as createViteServer } from "vite";
import cors from "cors";

import fs from "fs";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, setDoc, getDoc, updateDoc, deleteDoc, query, where, limit } from 'firebase/firestore';

const fbConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const firebaseApp = initializeApp(fbConfig);
const db = getFirestore(firebaseApp, fbConfig.firestoreDatabaseId);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

async function seedData() {
  const projectsSnapshot = await getDocs(query(collection(db, 'projects'), limit(1)));
  if (projectsSnapshot.empty) {
    const defaultProjectId = "project_alpha";
    await setDoc(doc(db, 'projects', defaultProjectId), { id: defaultProjectId, name: "Mu Server Alpha" });
    await setDoc(doc(db, 'projects', "project_beta"), { id: "project_beta", name: "Mu Server Beta" });

    await setDoc(doc(db, 'config', defaultProjectId), {
      serverUrl: "https://onyx-guard.onrender.com/api/auth",
      clientVersion: "1.04.05",
      securityToken: "MU-SEC-X99-2024",
      actionOnFailure: "EXIT",
      enableHwidCheck: true,
      enableFileCheck: true,
      enableMultiClientBlock: true,
      projectId: defaultProjectId
    });
  }
}

// Call seed in background
seedData().catch(console.error);

async function startServer() {
  const app = express();
  
  app.use(cors());
    app.use((req, res, next) => {
    if (req.path === '/api/auth') {
        if (req.headers['x-payload-encrypted'] === 'true') {
            express.raw({ type: '*/*' })(req, res, next);
        } else {
            express.json()(req, res, next);
        }
    } else {
        express.json()(req, res, next);
    }
  });

  const getProjectId = (req: express.Request) => req.headers['x-project-id'] as string || 'project_alpha';

  // ==========================================
  // DASHBOARD API ROUTES (Admin Panel)
  // ==========================================

  // -- Projects --
  app.get("/api/projects", async (req, res) => {
    try {
      const snapshot = await getDocs(collection(db, 'projects'));
      const projects = snapshot.docs.map(doc => doc.data());
      res.json(projects);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });
  
  app.post("/api/projects", async (req, res) => {
    try {
      const { name } = req.body;
      const id = "proj_" + Date.now().toString();
      
      await setDoc(doc(db, 'projects', id), { id, name });
      
      await setDoc(doc(db, 'config', id), {
        serverUrl: "https://onyx-guard.onrender.com/api/auth",
        clientVersion: "1.00.00",
        securityToken: "TOKEN_" + id.toUpperCase(),
        actionOnFailure: "MSG_BOX",
        enableHwidCheck: true,
        enableFileCheck: true,
        enableMultiClientBlock: false,
        projectId: id
      });
      
      res.json({ success: true, id, name });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // We should theoretically delete config, accounts, files, etc. 
      // But for this simple app, we can just delete the project document
      await deleteDoc(doc(db, 'projects', id));
      await deleteDoc(doc(db, 'config', id));
      
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  // -- Configuration --
  app.get("/api/config", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const docSnap = await getDoc(doc(db, 'config', projectId));
      res.json(docSnap.exists() ? docSnap.data() : {});
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.post("/api/config", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const data = req.body;
      data.projectId = projectId; // ensure it's there
      await setDoc(doc(db, 'config', projectId), data, { merge: true });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  // -- Accounts --
  app.get("/api/accounts", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const snapshot = await getDocs(query(collection(db, 'accounts'), where('projectId', '==', projectId)));
      const accounts = snapshot.docs.map(d => d.data());
      accounts.sort((a, b) => (a.username || '').localeCompare(b.username || ''));
      res.json(accounts);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.post("/api/accounts", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const { username, hwid } = req.body;
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      
      const accountData = { id, projectId, username, hwid: hwid || null, status: 'ACTIVE' };
      await setDoc(doc(db, 'accounts', id), accountData);
      
      res.json({ success: true, account: accountData });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put("/api/accounts/:id/status", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const { status } = req.body;
      const { id } = req.params;
      
      const docRef = doc(db, 'accounts', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data()?.projectId === projectId) {
        await updateDoc(docRef, { status });
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/accounts/:id", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const { id } = req.params;
      
      const docRef = doc(db, 'accounts', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data()?.projectId === projectId) {
        await deleteDoc(docRef);
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // -- File Rules --
  app.get("/api/files", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const snapshot = await getDocs(query(collection(db, 'file_rules'), where('projectId', '==', projectId)));
      res.json(snapshot.docs.map(d => d.data()));
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.post("/api/files", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const { filePath, expectedHash, importance, fileSize } = req.body;
      const id = Date.now().toString();
      await setDoc(doc(db, 'file_rules', id), {
        id, projectId, filePath, expectedHash, importance, fileSize: fileSize || "Unknown"
      });
      res.json({ success: true, id });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const { id } = req.params;
      const docRef = doc(db, 'file_rules', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data()?.projectId === projectId) {
        await deleteDoc(docRef);
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  // -- Logs --
  app.get("/api/logs", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const snapshot = await getDocs(query(collection(db, 'logs'), where('projectId', '==', projectId)));
      const logs = snapshot.docs.map(d => d.data());
      logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      res.json(logs.slice(0, 100));
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.delete("/api/logs", async (req, res) => {
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
  // DLL REAL-TIME DUMPLIST ENDPOINT
  // ==========================================
  app.get("/api/dumplist", async (req, res) => {
    try {
      const projectId = req.query.projectId || "DEFAULT";
      
      const configQuery = await getDocs(query(collection(db, 'config'), where('projectId', '==', projectId), limit(1)));
      let config = {};
      if (!configQuery.empty) config = configQuery.docs[0].data();

      let out = "[WINDOWS]\n";
      if (config.blacklistedPrograms && Array.isArray(config.blacklistedPrograms)) {
        for (const w of config.blacklistedPrograms) {
          out += w + "\n";
        }
      }

      out += "[DUMPS]\n";
      const dumpsQuery = await getDocs(query(collection(db, 'dumps'), where('projectId', '==', projectId)));
      for (const doc of dumpsQuery.docs) {
        const d = doc.data();
        if (d.rawRule) {
          out += d.rawRule + "\n";
        }
      }
      
      res.type('text/plain').send(out);
    } catch(e) {
      res.status(500).send("ERROR");
    }
  });

  // ==========================================
  // DLL AUTHENTICATION ENDPOINT (Game Client)
  // ==========================================
    app.post("/api/auth", async (req, res) => {
    try {
      let parsedBody = req.body;
      if (Buffer.isBuffer(req.body) || req.headers['x-payload-encrypted'] === 'true') {
          const buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body.toString());
          try {
              const str = buffer.toString('utf8');
              const json = JSON.parse(str);
              if (json && typeof json === 'object') {
                  parsedBody = json;
              }
          } catch (e) { }
          
          if (!parsedBody || Object.keys(parsedBody).length === 0 || Buffer.isBuffer(parsedBody)) {
              const configs = await getDocs(collection(db, 'config'));
              let decryptedStr = "";
              for (const doc of configs.docs) {
                  const token = doc.data().securityToken;
                  if (!token) continue;
                  const decrypted = Buffer.alloc(buffer.length);
                  for (let i = 0; i < buffer.length; i++) {
                      decrypted[i] = buffer[i] ^ token.charCodeAt(i % token.length);
                  }
                  try {
                      const str = decrypted.toString('utf8');
                      JSON.parse(str);
                      decryptedStr = str;
                      break;
                  } catch (e) {}
              }
              if (!decryptedStr) {
                  return res.json({ success: false, action: "EXIT", message: "Invalid encrypted payload" });
              }
              parsedBody = JSON.parse(decryptedStr);
          }
      }
      const { username, hwid, ip, clientVersion, fileModified, token, secretToken } = parsedBody;
      const actualToken = token || secretToken;
      const timestamp = new Date().toISOString();
      
      const tokenQuery = await getDocs(query(collection(db, 'config'), where('securityToken', '==', actualToken), limit(1)));
      
      if (tokenQuery.empty) {
        return res.json({ success: false, action: "EXIT", message: "Invalid token" });
      }
      
      const configDoc = tokenQuery.docs[0];
      const config = configDoc.data();
      const projectId = config.projectId;
      
      const logEntry = async (status: string, reason: string) => {
        const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
        await setDoc(doc(db, 'logs', id), {
          id, projectId, timestamp, type: 'CONNECTION', username: username || 'Unknown', 
          status, reason, hwid: hwid || 'Unknown', ip: ip || 'Unknown', clientVersion: clientVersion || 'Unknown'
        });
      };

      if (config.licenseExpiration) {
        const expDate = new Date(config.licenseExpiration);
        if (new Date() > expDate) {
          await logEntry("BLOCKED", `Anti-Hack license expired on ${config.licenseExpiration}`);
          return res.json({ success: false, action: config.actionOnFailure, message: "Anti-Hack License Expired" });
        }
      }

      if (clientVersion !== config.clientVersion) {
        await logEntry("BLOCKED", `Client version mismatch (Expected: ${config.clientVersion})`);
        return res.json({ success: false, action: config.actionOnFailure, message: "Invalid version" });
      }

      if (config.enableFileCheck && fileModified && fileModified !== 'none') {
        let isSafe = false;
        try {
            if (process.env.GEMINI_API_KEY) {
                const prompt = `Analiza este archivo de juego modificado en un entorno de Mu Online: '${fileModified}'. ¿Es un hack/cheat conocido (como Cheat Engine, Haste, SpeedHack, AutoClicker, WPE Pro) o es un archivo inofensivo (como un log de error, un archivo de texto, o configuracion visual)? Responde SOLO con 'HACK' o 'SEGURO'.`;
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                const aiResult = response.text.trim().toUpperCase();
                if (aiResult.includes('SEGURO')) {
                    isSafe = true;
                    await logEntry("ALLOWED", `AI Analysis: ${fileModified} was deemed SAFE by Onyx Guard AI.`);
                } else {
                    await logEntry("BLOCKED", `AI Analysis: ${fileModified} detected as HACK/CHEAT by Onyx Guard AI.`);
                }
            }
        } catch (e) {
            console.error("AI Analysis error:", e);
        }

        if (!isSafe) {
            await logEntry("BLOCKED", `Modified file detected: ${fileModified}`);
            return res.json({ success: false, action: config.actionOnFailure, message: `Onyx Guard AI detectó modificación maliciosa: ${fileModified}` });
        }
      }

      if (config.enableMultiClientBlock && hwid) {
        const activeClientsQuery = await getDocs(query(collection(db, 'logs'), where('projectId', '==', projectId), where('hwid', '==', hwid), where('status', '==', 'ALLOWED')));
        // Simplified multi-client check (just checking recent allowed logins within 5 mins for same HWID)
        const recentLogins = activeClientsQuery.docs.filter(d => {
            const timeDiff = new Date().getTime() - new Date(d.data().timestamp).getTime();
            return timeDiff < 5 * 60 * 1000;
        });
        const limitClients = config.multiClientLimit || 3;
        if (recentLogins.length >= limitClients) {
            await logEntry("BLOCKED", `Multi-client limit reached (${limitClients})`);
            return res.json({ success: false, action: config.actionOnFailure, message: `Multi-client limit reached (${limitClients})` });
        }
      }

      if (config.enableHwidCheck && username) {
        const accQuery = await getDocs(query(collection(db, 'accounts'), where('username', '==', username), where('projectId', '==', projectId), limit(1)));
        
        if (accQuery.empty) {
          const newAccountId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
          await setDoc(doc(db, 'accounts', newAccountId), {
            id: newAccountId,
            projectId,
            username,
            hwid: hwid || 'Unknown',
            status: 'ACTIVE',
            lastLogin: timestamp
          });
          await logEntry("ALLOWED", `Auto-registered account ${username} with HWID ${hwid}`);
          return res.json({
            success: true,
            action: "CONTINUE",
            message: "Usted ha sido autenticado por Onyx Guard, disfrute del juego",
            sessionToken: Math.random().toString(36).substring(2, 15)
          });
        }
        
        const accDoc = accQuery.docs[0];
        const account = accDoc.data();
        
        if (account.status === "BANNED") {
          await logEntry("BLOCKED", `Account is banned`);
          return res.json({ success: false, action: config.actionOnFailure, message: "Banned" });
        }
        
        if (account.hwid && account.hwid !== hwid) {
          await logEntry("BLOCKED", `HWID mismatch (Expected: ${account.hwid}, Got: ${hwid})`);
          return res.json({ success: false, action: config.actionOnFailure, message: "HWID mismatch" });
        }
        
        await updateDoc(doc(db, 'accounts', account.id), { lastLogin: timestamp });
      }

      await logEntry("ALLOWED", "Authorization successful");
      res.json({
        success: true,
        action: "CONTINUE",
        message: "Bienvenido",
        sessionToken: Math.random().toString(36).substring(2, 15)
      });
      
    } catch (e: any) {
      res.status(500).json({ success: false, action: "EXIT", message: "Internal server error" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API Server running on port ${PORT}`);
  });
}

startServer();
