import re

with open('server.ts', 'r') as f:
    content = f.read()

del_endpoint = """
  app.delete("/api/dumps/:id", async (req, res) => {
    try {
      const projectId = getProjectId(req);
      const { id } = req.params;
      const existing = await db.select().from(dumps).where(eq(dumps.id, id));
      if (existing.length > 0 && existing[0].projectId === projectId) {
        await db.delete(dumps).where(eq(dumps.id, id));
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message, details: e.cause ? e.cause.message : (e.original ? e.original.message : String(e)) });
    }
  });
"""

if 'app.delete("/api/dumps/:id"' not in content:
    content = content.replace('  app.get("/api/logs"', del_endpoint + '\n  app.get("/api/logs"')
    with open('server.ts', 'w') as f:
        f.write(content)
