const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://neondb_owner:npg_YCXROLEMA1q4@ep-aged-wildflower-avo2wax6.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require' });

async function seed() {
    const proj1 = 'proj_' + Date.now();
    const proj2 = 'proj_' + (Date.now() + 1);
    
    await pool.query(`INSERT INTO projects (id, name) VALUES ($1, $2)`, [proj1, 'Mu Server Alpha']);
    await pool.query(`INSERT INTO projects (id, name) VALUES ($1, $2)`, [proj2, 'Mu Server Beta']);
    
    await pool.query(`
        INSERT INTO config (
            project_id, server_url, client_version, security_token, 
            action_on_failure, enable_hwid_check, enable_file_check, 
            enable_realtime_monitor, enable_multi_client_block, 
            enable_anti_macro, enable_anti_debug, enable_dll_scanner, enable_memory_scanner
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `, [proj1, '', '1.00.00', 'TOKEN_' + proj1, 'MSG_BOX', true, true, true, false, false, true, true, true]);
    
    await pool.query(`
        INSERT INTO config (
            project_id, server_url, client_version, security_token, 
            action_on_failure, enable_hwid_check, enable_file_check, 
            enable_realtime_monitor, enable_multi_client_block, 
            enable_anti_macro, enable_anti_debug, enable_dll_scanner, enable_memory_scanner
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `, [proj2, '', '1.00.00', 'TOKEN_' + proj2, 'MSG_BOX', true, true, true, false, false, true, true, true]);
    
    console.log('Seeded projects in Neon DB');
}

seed().catch(console.error).finally(() => pool.end());
