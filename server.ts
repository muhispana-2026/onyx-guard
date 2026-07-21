import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import { db } from "./src/db/index.ts";
import { projects, config, accounts, fileRules, logs, dumps } from "./src/db/schema.ts";
import { eq, desc, and } from "drizzle-orm";

const PORT = 3000;

async function seedData() {
  try {
    const existingProjects = await db.select().from(projects).limit(1);
    if (existingProjects.length === 0) {
      const defaultProjectId = "project_alpha";
      await db.insert(projects).values([
        { id: defaultProjectId, name: "Mu Server Alpha" },
        { id: "project_beta", name: "Mu Server Beta" }
      ]);
      await db.insert(config).values({
        projectId: defaultProjectId,
        serverUrl: "https://onyx-guard.onrender.com/api/auth",
        clientVersion: "1.04.05",
        securityToken: "MU-SEC-X99-2024",
        actionOnFailure: "EXIT",
        enableHwidCheck: true,
        enableFileCheck: true,
        enableMultiClientBlock: true
      });
    }
  } catch (error) {
    console.error("Seed failed:", error);
  }
}

seedData();


async function runMigrations() {
  const { createPool } = await import('./src/db/index.ts');
  const pool = createPool();
  const queries = [
    "ALTER TABLE config ADD COLUMN IF NOT EXISTS enable_splash_screen boolean",
    "ALTER TABLE config ADD COLUMN IF NOT EXISTS enable_process_binding boolean",
    "ALTER TABLE config ADD COLUMN IF NOT EXISTS enable_api_hook_detection boolean",
    "ALTER TABLE config ADD COLUMN IF NOT EXISTS enable_heuristics boolean",
    "ALTER TABLE config ADD COLUMN IF NOT EXISTS enable_test_mode_block boolean",
    "ALTER TABLE config ADD COLUMN IF NOT EXISTS enable_watchdog boolean",
    "ALTER TABLE config ADD COLUMN IF NOT EXISTS enable_payload_encryption boolean",
    "ALTER TABLE config ADD COLUMN IF NOT EXISTS blacklisted_programs text[]",
    "ALTER TABLE config ADD COLUMN IF NOT EXISTS license_expiration text",
    "ALTER TABLE config ADD COLUMN IF NOT EXISTS multi_client_limit integer"
  ];
  for (const q of queries) {
    try {
      await pool.query(q);
    } catch (e: any) {
      console.log('Migration error:', e.message);
    }
  }
  await pool.end();
}

async function startServer() {
  await runMigrations();
  
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('BloomFilter')) return;
    if (args[0] && args[0].message && args[0].message.includes('BloomFilter')) return;
    originalError(...args);
  };

  const app = express();
  app.set('trust proxy', true);

  app.get('/api/migrate-db', async (req, res) => {
    try {
      const { createPool } = await import('./src/db/index.ts');
      const pool = createPool();
      const queries = [
        "ALTER TABLE config ADD COLUMN IF NOT EXISTS enable_splash_screen boolean",
        "ALTER TABLE config ADD COLUMN IF NOT EXISTS enable_process_binding boolean",
        "ALTER TABLE config ADD COLUMN IF NOT EXISTS enable_api_hook_detection boolean",
        "ALTER TABLE config ADD COLUMN IF NOT EXISTS enable_heuristics boolean",
        "ALTER TABLE config ADD COLUMN IF NOT EXISTS enable_test_mode_block boolean",
        "ALTER TABLE config ADD COLUMN IF NOT EXISTS enable_watchdog boolean",
        "ALTER TABLE config ADD COLUMN IF NOT EXISTS enable_payload_encryption boolean",
        "ALTER TABLE config ADD COLUMN IF NOT EXISTS blacklisted_programs text[]",
        "ALTER TABLE config ADD COLUMN IF NOT EXISTS license_expiration text",
        "ALTER TABLE config ADD COLUMN IF NOT EXISTS multi_client_limit integer"
      ];
      let results = [];
      for (const q of queries) {
        try {
          await pool.query(q);
          results.push(`Success: ${q}`);
        } catch (e: any) {
          results.push(`Error on ${q}: ${e.message}`);
        }
      }
      res.send(`<pre>Migration finished:\n${results.join('\n')}</pre>`);
    } catch (e: any) {
      res.send(`<pre>Fatal error: ${e.message}</pre>`);
    }
  });

  app.use(cors({ origin: "*" }));

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

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // -- Projects --
  app.get("/api/projects", async (req, res) => {
    try {
      const allProjects = await db.select().from(projects);
      res.json(allProjects);
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });
  
  app.post("/api/projects", async (req, res) => {
    try {
      const { name } = req.body;
      const id = "proj_" + Date.now().toString();
      await db.insert(projects).values({ id, name });
      await db.insert(config).values({
        projectId: id,
        serverUrl: "https://onyx-guard.onrender.com/api/auth",
        clientVersion: "1.00.00",
        securityToken: "TOKEN_" + id.toUpperCase(),
        actionOnFailure: "MSG_BOX",
        enableHwidCheck: true,
        enableFileCheck: true,
        enableMultiClientBlock: false
      });
      res.json({ success: true, id, name });
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(config).where(eq(config.projectId, id));
      await db.delete(projects).where(eq(projects.id, id));
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });

  // -- Configuration --
  app.get("/api/config", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const confs = await db.select().from(config).where(eq(config.projectId, projectId));
      res.json(confs.length > 0 ? confs[0] : {});
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });

  app.post("/api/config", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const data = { ...req.body, projectId };
      // Upsert
      const existing = await db.select().from(config).where(eq(config.projectId, projectId));
      if (existing.length > 0) {
        await db.update(config).set(data).where(eq(config.projectId, projectId));
      } else {
        await db.insert(config).values(data);
      }
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });

  // -- Accounts --
  app.get("/api/accounts", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const accs = await db.select().from(accounts).where(eq(accounts.projectId, projectId));
      accs.sort((a, b) => (a.username || '').localeCompare(b.username || ''));
      res.json(accs);
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });

  app.post("/api/accounts", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const { username, hwid } = req.body;
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      const accountData = { id, projectId, username, hwid: hwid || null, status: 'ACTIVE' };
      await db.insert(accounts).values(accountData);
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
      const existing = await db.select().from(accounts).where(eq(accounts.id, id));
      if (existing.length > 0 && existing[0].projectId === projectId) {
        await db.update(accounts).set({ status }).where(eq(accounts.id, id));
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });

  app.delete("/api/accounts/:id", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const { id } = req.params;
      const existing = await db.select().from(accounts).where(eq(accounts.id, id));
      if (existing.length > 0 && existing[0].projectId === projectId) {
        await db.delete(accounts).where(eq(accounts.id, id));
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });

  // -- File Rules --
  app.get("/api/files", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const files = await db.select().from(fileRules).where(eq(fileRules.projectId, projectId));
      res.json(files);
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });

  app.post("/api/files", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const { filePath, expectedHash, importance, fileSize } = req.body;
      const id = Date.now().toString();
      await db.insert(fileRules).values({
        id, projectId, filePath, expectedHash, importance, fileSize: fileSize || "Unknown"
      });
      res.json({ success: true, id });
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const { id } = req.params;
      const existing = await db.select().from(fileRules).where(eq(fileRules.id, id));
      if (existing.length > 0 && existing[0].projectId === projectId) {
        await db.delete(fileRules).where(eq(fileRules.id, id));
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });

  // -- Dumps --
  app.get("/api/dumps", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const data = await db.select().from(dumps).where(eq(dumps.projectId, projectId)).orderBy(desc(dumps.timestamp));
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });

  app.post("/api/dumps", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const { name, desc, rawRule } = req.body;
      const id = Date.now().toString();
      const timestamp = new Date().toISOString();
      await db.insert(dumps).values({
        id, projectId, name, desc, rawRule, timestamp
      });
      res.json({ success: true, id });
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });

  // -- Logs --
  app.get("/api/logs", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const logData = await db.select().from(logs).where(eq(logs.projectId, projectId)).orderBy(desc(logs.timestamp)).limit(100);
      res.json(logData);
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });

  app.delete("/api/logs", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      await db.delete(logs).where(eq(logs.projectId, projectId));
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });

  // -- Dumplist endpoint --
  app.get("/api/dumplist", async (req, res) => {
    try {
      const projectId = req.query.projectId as string || "DEFAULT";
      
      const configData = await db.select().from(config).where(eq(config.projectId, projectId));
      let conf: any = {};
      if (configData.length > 0) conf = configData[0];

      let out = "[WINDOWS]\n";
      if (conf.blacklistedPrograms && Array.isArray(conf.blacklistedPrograms)) {
        for (const w of conf.blacklistedPrograms) {
          out += w + "\n";
        }
      }

      out += "[DUMPS]\n";
      const dumpsData = await db.select().from(dumps).where(eq(dumps.projectId, projectId));
      for (const d of dumpsData) {
        if (d.rawRule) {
          out += d.rawRule + "\n";
        }
      }
      
      res.type('text/plain').send(out);
    } catch(e) {
      res.status(500).send("ERROR");
    }
  });

  // -- Auth endpoint --
  app.post("/api/heartbeat", async (req, res) => {
    try {
      const { username, hwid, secretToken } = req.body;
      const conf = await db.select().from(config).where(eq(config.securityToken, secretToken));
      if (conf.length === 0) return res.status(401).json({ success: false });
      const projectId = conf[0].projectId;
      
      if (username) {
        const projectAccs = await db.select().from(accounts).where(and(eq(accounts.username, username), eq(accounts.projectId, projectId)));
        if (projectAccs.length > 0) {
          const account = projectAccs[0];
          if (account.status === 'BANNED' || account.status === 'TEMP_BANNED') {
            return res.json({ success: false, action: "EXIT" });
          }
          await db.update(accounts).set({
            lastHeartbeat: new Date().toISOString(),
            status: account.status === 'ACTIVE' || account.status === 'ONLINE' ? 'ONLINE' : account.status
          }).where(eq(accounts.id, account.id));
        }
      }

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post(["/api/report", "/api/auth"], async (req, res) => {
    try {
      const { username, hwid, secretToken, reason } = req.body;
      let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      if (Array.isArray(ip)) ip = ip[0];
      
      const conf = await db.select().from(config).where(eq(config.securityToken, secretToken));
      if (conf.length === 0) return res.status(401).json({ success: false });
      const projectId = conf[0].projectId;
      const timestamp = new Date().toISOString();

      if (reason) {
        const logId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
        await db.insert(logs).values({
          id: logId,
          projectId,
          type: "BLOCKED",
          message: `HACK DETECTED [${username || 'Unknown'} - ${hwid || 'Unknown'}]: ${reason}`,
          timestamp
        });
      }

      if (username) {
        const projectAccs = await db.select().from(accounts).where(and(eq(accounts.username, username), eq(accounts.projectId, projectId)));
        
        if (projectAccs.length > 0) {
          let account = projectAccs[0];
          if (account.status === 'BANNED') {
            return res.json({ success: false, action: 'EXIT', message: "This account has been permanently banned." });
          }
          if (account.status === 'TEMP_BANNED') {
            if (account.unbanTime && new Date(account.unbanTime) > new Date()) {
               return res.json({ success: false, action: 'EXIT', message: "Security violation. Please wait 5 minutes." });
            } else {
               await db.update(accounts).set({ status: 'ONLINE', unbanTime: null }).where(eq(accounts.id, account.id));
               account.status = 'ONLINE';
            }
          }

          if (account.status === "BANNED") {
            return res.json({ success: false, action: 'EXIT', message: "Banned" });
          }
          
          if (!account.hwid || account.hwid === 'Unknown' || account.hwid === '') {
            await db.update(accounts).set({ hwid, ip, lastLogin: timestamp }).where(eq(accounts.id, account.id));
          } else if (account.hwid !== hwid) {
            return res.json({ success: false, action: 'EXIT', message: "HWID mismatch" });
          } else {
            await db.update(accounts).set({ ip, lastLogin: timestamp }).where(eq(accounts.id, account.id));
          }
        } else {
          const newAccountId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
          await db.insert(accounts).values({
            id: newAccountId,
            projectId,
            username,
            hwid: hwid || 'Unknown',
            status: 'ACTIVE',
            ip: ip as string,
            lastLogin: timestamp
          });
          return res.json({
            success: true,
            action: "CONTINUE",
            message: "Welcome! Registered PC successfully.",
            sessionToken: Math.random().toString(36).substring(2, 15)
          });
        }
      }

      res.json({
        success: true,
        action: "CONTINUE",
        message: "Authentication successful.",
        sessionToken: Math.random().toString(36).substring(2, 15)
      });
      
    } catch (e: any) {
      res.status(500).json({ success: false, action: "EXIT", message: "Internal server error: " + e.message });
      console.error(e);
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
    
    // Auto-ping to keep Render free tier awake (runs every 14 minutes)
    const renderUrl = process.env.RENDER_EXTERNAL_URL;
    if (renderUrl) {
      console.log(`Starting auto-ping to ${renderUrl} to prevent sleep mode...`);
      setInterval(() => {
        fetch(`${renderUrl}/api/health`)
          .then(res => res.json())
          .then(data => console.log(`[Auto-Ping] Server awake:`, data.timestamp))
          .catch(err => console.error(`[Auto-Ping] Error:`, err.message));
      }, 14 * 60 * 1000); // 14 minutes
    }
  });
}

startServer();
