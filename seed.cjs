const mysql = require('mysql2/promise');
async function test() {
  try {
    const pool = mysql.createPool('mysql://darkmuon_onyxcms:gm18809125*@149.56.233.24:3306/darkmuon_onyxguard');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        name TEXT NOT NULL
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS config (
        project_id VARCHAR(255) PRIMARY KEY NOT NULL,
        server_url TEXT,
        client_version TEXT,
        security_token TEXT,
        action_on_failure VARCHAR(50) NOT NULL DEFAULT 'MSG_BOX',
        enable_hwid_check BOOLEAN DEFAULT true,
        enable_file_check BOOLEAN DEFAULT true,
        enable_realtime_monitor BOOLEAN DEFAULT true,
        enable_multi_client_block BOOLEAN DEFAULT false,
        multi_client_limit INT,
        enable_anti_macro BOOLEAN DEFAULT false,
        enable_anti_debug BOOLEAN DEFAULT true,
        enable_dll_scanner BOOLEAN DEFAULT true,
        enable_memory_scanner BOOLEAN DEFAULT true,
        enable_splash_screen BOOLEAN,
        enable_process_binding BOOLEAN,
        enable_api_hook_detection BOOLEAN,
        enable_heuristics BOOLEAN,
        enable_test_mode_block BOOLEAN,
        enable_watchdog BOOLEAN,
        enable_payload_encryption BOOLEAN,
        blacklisted_programs JSON,
        license_expiration TEXT,
        speedhack_sensitivity TEXT
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        project_id VARCHAR(255) NOT NULL,
        username TEXT,
        hwid TEXT,
        ip TEXT,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        last_login TEXT,
        last_heartbeat TEXT,
        unban_time TEXT,
        hwid_reset_count INT DEFAULT 0,
        notes TEXT
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS file_rules (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        project_id VARCHAR(255) NOT NULL,
        file_path TEXT,
        expected_hash TEXT,
        importance TEXT,
        file_size TEXT
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dumps (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        project_id VARCHAR(255) NOT NULL,
        name TEXT,
        \`desc\` TEXT,
        raw_rule TEXT,
        timestamp TEXT
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id VARCHAR(255) PRIMARY KEY NOT NULL,
        project_id VARCHAR(255) NOT NULL,
        type TEXT,
        message TEXT,
        timestamp TEXT,
        username TEXT,
        hwid TEXT,
        ip TEXT,
        client_version TEXT,
        reason TEXT
      );
    `);
    console.log("Tablas creadas");
    const [rows] = await pool.query("SHOW TABLES");
    console.log(rows);
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
}
test();
