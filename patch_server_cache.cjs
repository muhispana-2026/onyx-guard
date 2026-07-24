const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const cacheDeclaration = `
const dumplistCache = new Map<string, { data: string, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
`;

code = code.replace('const app = express();', cacheDeclaration + '\nconst app = express();');

const dumplistStart = `app.get("/api/dumplist", async (req, res) => {
    try {
      const projectId = req.query.projectId as string || "DEFAULT";`;

const dumplistCached = dumplistStart + `
      const now = Date.now();
      if (dumplistCache.has(projectId) && (now - dumplistCache.get(projectId)!.timestamp) < CACHE_TTL) {
        return res.type('text/plain').send(dumplistCache.get(projectId)!.data);
      }
`;

code = code.replace(dumplistStart, dumplistCached);

const dumplistEnd = `res.type('text/plain').send(out);`;
const dumplistEndCached = `
      dumplistCache.set(projectId, { data: out, timestamp: now });
      res.type('text/plain').send(out);
`;

code = code.replace(dumplistEnd, dumplistEndCached);

fs.writeFileSync('server.ts', code);
