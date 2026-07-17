const express = require('express');
const app = express();
app.use((req, res, next) => {
    if (req.path === '/api/auth' && req.headers['x-payload-encrypted'] === 'true') {
      express.raw({ type: '*/*' })(req, res, next);
    } else {
      express.json()(req, res, next);
    }
});
app.post('/api/auth', (req, res) => {
    console.log("body type:", typeof req.body, "isBuffer:", Buffer.isBuffer(req.body));
    res.send("ok");
});
app.listen(3001, () => console.log('started'));
