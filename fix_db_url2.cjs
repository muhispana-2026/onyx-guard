const Database = require('better-sqlite3');
const db = new Database('sqlite.db');

const stmt = db.prepare("UPDATE config SET serverUrl = 'http://127.0.0.1:3000/api/auth' WHERE serverUrl = 'https://onyx-guard.onrender.com/api/auth'");
stmt.run();
db.close();
