const token = 'MU_SECURE_TOKEN_2026_X';
const buf = require('fs').readFileSync('test.bin');
console.log("buf length:", buf.length);
const decrypted = Buffer.alloc(buf.length);
for (let i = 0; i < buf.length; i++) {
    decrypted[i] = buf[i] ^ token.charCodeAt(i % token.length);
}
console.log(decrypted.toString('utf8'));
