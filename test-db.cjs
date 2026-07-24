const mysql = require('mysql2/promise');

async function test() {
  try {
    console.log("Conectando...");
    const connection = await mysql.createConnection({
      host: '149.56.233.24',
      user: 'darkmuon_onyxcms',
      password: 'gm18809125*',
      database: 'darkmuon_onyxguard'
    });
    console.log("¡Conexión Exitosa!");
    const [rows] = await connection.execute('SHOW TABLES');
    console.log("Tablas en la base de datos:", rows);
    await connection.end();
  } catch (error) {
    console.error("Error conectando a la base de datos:", error.message);
  }
}

test();
