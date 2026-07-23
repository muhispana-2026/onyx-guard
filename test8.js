const express = require('express');
const app = express();
app.get('/', (req, res) => res.json({ success: false, action: "EXIT", message: "Invalid Security Token or Project Not Found." }));
app.listen(3001, () => {
  const http = require('http');
  http.get('http://localhost:3001', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => { console.log(data); process.exit(0); });
  });
});
