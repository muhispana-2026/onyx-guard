const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('sqlite.db');

db.serialize(() => {
  db.run("UPDATE config SET serverUrl = 'http://127.0.0.1:3000/api/auth' WHERE serverUrl = 'https://onyx-guard.onrender.com/api/auth'");
});

db.close();
