with open('server.ts', 'r') as f:
    content = f.read()

create_queries = """
    const { createPool } = await import('./src/db/index.ts');
    const pool = createPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id text PRIMARY KEY NOT NULL,
        name text NOT NULL
      );
      CREATE TABLE IF NOT EXISTS config (
        project_id text PRIMARY KEY NOT NULL,
        server_url text NOT NULL,
        client_version text NOT NULL,
        security_token text NOT NULL,
        action_on_failure text DEFAULT 'MSG_BOX' NOT NULL,
        enable_hwid_check boolean DEFAULT true,
        enable_file_check boolean DEFAULT true,
        enable_realtime_monitor boolean DEFAULT true,
        enable_multi_client_block boolean DEFAULT false,
        multi_client_limit integer,
        enable_anti_macro boolean DEFAULT false,
        enable_anti_debug boolean DEFAULT true,
        enable_dll_scanner boolean DEFAULT true,
        enable_memory_scanner boolean DEFAULT true,
        enable_splash_screen boolean,
        enable_process_binding boolean,
        enable_api_hook_detection boolean,
        enable_heuristics boolean,
        enable_test_mode_block boolean,
        enable_watchdog boolean,
        enable_payload_encryption boolean,
        blacklisted_programs text[],
        license_expiration text
      );
      CREATE TABLE IF NOT EXISTS accounts (
        id text PRIMARY KEY NOT NULL,
        project_id text NOT NULL,
        username text NOT NULL,
        hwid text,
        ip text,
        status text DEFAULT 'ACTIVE',
        last_login text,
        last_heartbeat text,
        unban_time text,
        hwid_reset_count integer DEFAULT 0,
        notes text
      );
      CREATE TABLE IF NOT EXISTS file_rules (
        id text PRIMARY KEY NOT NULL,
        project_id text NOT NULL,
        file_path text NOT NULL,
        expected_hash text NOT NULL,
        importance text DEFAULT 'HIGH' NOT NULL,
        file_size text DEFAULT 'Unknown'
      );
      CREATE TABLE IF NOT EXISTS dumps (
        id text PRIMARY KEY NOT NULL,
        project_id text NOT NULL,
        name text NOT NULL,
        "desc" text,
        raw_rule text NOT NULL,
        timestamp text NOT NULL
      );
      CREATE TABLE IF NOT EXISTS logs (
        id text PRIMARY KEY NOT NULL,
        project_id text NOT NULL,
        type text NOT NULL,
        message text NOT NULL,
        timestamp text NOT NULL
      );
    `);
"""

content = content.replace('const existingProjects = await db.select().from(projects).limit(1);', create_queries + '\n    const existingProjects = await db.select().from(projects).limit(1);')

with open('server.ts', 'w') as f:
    f.write(content)
