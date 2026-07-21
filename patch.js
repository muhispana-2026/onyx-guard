const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const migrationCode = `
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
    } catch (e) {
      console.log('Migration error:', e.message);
    }
  }
  await pool.end();
}

async function startServer() {
  await runMigrations();
`;

code = code.replace('async function startServer() {', migrationCode);
fs.writeFileSync('server.ts', code);
