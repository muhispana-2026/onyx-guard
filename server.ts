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

const PORT = 3000;

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
  
const originalError = console.error;
console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('BloomFilter')) return;
    if (args[0] && args[0].message && args[0].message.includes('BloomFilter')) return;
    originalError(...args);
};

const app = express();
app.set('trust proxy', true);
  
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
      let config: any = {};
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
    
  app.post("/api/heartbeat", async (req, res) => {
    try {
      const { username, hwid, secretToken } = req.body;
      
      const projQuery = await getDocs(query(collection(db, 'projects'), where('secretToken', '==', secretToken), limit(1)));
      if (projQuery.empty) {
        return res.status(401).json({ success: false });
      }
      const project = projQuery.docs[0].data();
      const projectId = project.id;
      
      if (username) {
        const accQuery = await getDocs(query(collection(db, 'accounts'), where('username', '==', username), where('projectId', '==', projectId), limit(1)));
        if (!accQuery.empty) {
          const account = accQuery.docs[0].data();
          
          if (account.status === 'BANNED' || account.status === 'TEMP_BANNED') {
            return res.json({ success: false, action: "EXIT" });
          }
          
          await updateDoc(doc(db, 'accounts', accQuery.docs[0].id), { 
            lastHeartbeat: new Date().toISOString(),
            status: account.status === 'ACTIVE' || account.status === 'ONLINE' ? 'ONLINE' : account.status
          });
        }
      }

      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: (e as Error).message });
    }
  });

  app.post(["/api/report", "/api/auth"], async (req, res) => {
    try {
      const { username, hwid, secretToken, reason } = req.body;
      let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      if (Array.isArray(ip)) ip = ip[0];
      
      const projQuery = await getDocs(query(collection(db, 'projects'), where('secretToken', '==', secretToken), limit(1)));
      if (projQuery.empty) {
        return res.status(401).json({ success: false });
      }
      const project = projQuery.docs[0].data();
      const projectId = project.id;
      
      const timestamp = new Date().toISOString();
      const logId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      await setDoc(doc(db, 'logs', logId), {
        id: logId,
        projectId,
        type: "BLOCKED",
        message: `HACK DETECTED [${username || 'Unknown'} - ${hwid || 'Unknown'}]: ${reason}`,
        timestamp
      });

      // Auto ban - we set the unban time to 5 minutes from now
      if (username) {
        
      const accQuery = await getDocs(query(collection(db, 'accounts'), where('username', '==', username), where('projectId', '==', projectId), limit(1)));
      let account;
      
      if (!accQuery.empty) {
        account = accQuery.docs[0].data();
        if (account.status === 'BANNED') {
          return res.json({ success: false, action: 'EXIT', message: "This account has been permanently banned." });
        }
        if (account.status === 'TEMP_BANNED') {
          if (account.unbanTime && new Date(account.unbanTime) > new Date()) {
             return res.json({ success: false, action: 'EXIT', message: "Security violation. Please remove the cheat and wait 5 minutes before logging in." });
          } else {
             // Ban expired, restore account
             await updateDoc(doc(db, 'accounts', accQuery.docs[0].id), { status: 'ONLINE', unbanTime: null });
             account.status = 'ONLINE';
          }
        }
      }
      
      if (accQuery.empty) {

          const newAccountId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
          await setDoc(doc(db, 'accounts', newAccountId), {
            id: newAccountId,
            projectId,
            username,
            hwid: hwid || 'Unknown',
            status: 'ACTIVE',
            ip: ip,
            lastLogin: timestamp
          });
          await console.log("ALLOWED", `Auto-registered account ${username} with HWID ${hwid}`);
          return res.json({
            success: true,
            action: "CONTINUE",
            message: "Bienvenido a Onyx Guard! Se ha registrado su PC de forma segura en nuestro sistema.",
            sessionToken: Math.random().toString(36).substring(2, 15)
          });
        }
        
        const accDoc = accQuery.docs[0];
        account = accDoc.data();
        
        if (account.status === "BANNED") {
          await console.log("BLOCKED", `Account is banned`);
          return res.json({ success: false, action: 'EXIT', message: "Banned" });
        }
        
        if (!account.hwid || account.hwid === 'Unknown' || account.hwid === '') {
          await updateDoc(doc(db, 'accounts', account.id), { hwid: hwid, ip: ip, lastLogin: timestamp });
          await console.log("ALLOWED", `Locked existing account ${username} to HWID ${hwid}`);
        } else if (account.hwid !== hwid) {
          await console.log("BLOCKED", `HWID mismatch (Expected: ${account.hwid}, Got: ${hwid})`);
          return res.json({ success: false, action: 'EXIT', message: "HWID mismatch" });
        } else {
          await updateDoc(doc(db, 'accounts', account.id), { ip: ip, lastLogin: timestamp });
        }
      }

      await console.log("ALLOWED", "Authorization successful");
      res.json({
        success: true,
        action: "CONTINUE",
        message: "Bienvenido de vuelta! Onyx Guard lo ha autenticado exitosamente y protege su conexion.",
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
