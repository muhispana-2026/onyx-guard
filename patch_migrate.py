with open('server.ts', 'r') as f:
    content = f.read()

endpoint = """
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
      res.send(`<pre>Migration finished:\\n${results.join('\\n')}</pre>`);
    } catch (e: any) {
      res.send(`<pre>Fatal error: ${e.message}</pre>`);
    }
  });
"""

if '/api/migrate-db' not in content:
    content = content.replace('app.set(\'trust proxy\', true);', 'app.set(\'trust proxy\', true);\n' + endpoint)
    with open('server.ts', 'w') as f:
        f.write(content)
