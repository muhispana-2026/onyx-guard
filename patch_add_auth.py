import re

with open('server.ts', 'r') as f:
    content = f.read()

auth_endpoint = """
  app.post("/api/auth", async (req, res) => {
    try {
      res.json({ success: true, message: "Authorized" });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
"""

if 'app.post("/api/auth"' not in content:
    content = content.replace('  app.get("/api/health"', auth_endpoint + '\n  app.get("/api/health"')
    with open('server.ts', 'w') as f:
        f.write(content)
