const http = require('http');

http.get('http://localhost:3000/api/auth', (res) => {
  console.log(res.statusCode);
});
