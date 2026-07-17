import express from "express";
import path from "path";
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
      serverUrl: "http://localhost:3000/api/auth",
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
  app.use(express.json());

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
        serverUrl: "http://localhost:3000/api/auth",
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

  // ==========================================
  // DLL AUTHENTICATION ENDPOINT (Game Client)
  // ==========================================
  app.post("/api/auth", async (req, res) => {
    try {
      const { username, hwid, ip, clientVersion, fileModified, token } = req.body;
      const timestamp = new Date().toISOString();
      
      const tokenQuery = await getDocs(query(collection(db, 'config'), where('securityToken', '==', token), limit(1)));
      
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
        await logEntry("BLOCKED", `Modified file detected: ${fileModified}`);
        return res.json({ success: false, action: config.actionOnFailure, message: `Modified file: ${fileModified}` });
      }

      if (config.enableHwidCheck && username) {
        const accQuery = await getDocs(query(collection(db, 'accounts'), where('username', '==', username), where('projectId', '==', projectId), limit(1)));
        
        if (accQuery.empty) {
          await logEntry("BLOCKED", `Account ${username} not registered in DB`);
          return res.json({ success: false, action: config.actionOnFailure, message: "Account not registered" });
        }
        
        const accDoc = accQuery.docs[0];
        const account = accDoc.data();
        
        if (account.status === "BANNED") {
          await logEntry("BLOCKED", `Account is banned`);
          return res.json({ success: false, action: config.actionOnFailure, message: "Banned" });
        }
        
        if (account.hwid && account.hwid !== hwid && account.status !== "UNLOCKED") {
          await logEntry("BLOCKED", `HWID Mismatch. Registered: ${account.hwid}, Given: ${hwid}`);
          return res.json({ success: false, action: config.actionOnFailure, message: "HWID mismatch" });
        }
        
        if ((!account.hwid || account.status === "UNLOCKED") && hwid) {
          await updateDoc(accDoc.ref, { hwid, status: 'ACTIVE', lastLogin: timestamp });
        } else {
          await updateDoc(accDoc.ref, { lastLogin: timestamp });
        }
      }

      await logEntry("ALLOWED", "Handshake accepted");
      res.json({
        success: true,
        action: "CONTINUE",
        message: "Authorization successful",
        sessionToken: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      });
      
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, action: "EXIT", message: "Internal server error" });
    }
  });

  // ==========================================
  // VITE DEV / PRODUCTION MIDDLEWARE
  // ==========================================
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
