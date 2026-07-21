fetch('http://127.0.0.1:3000/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: "Mu Server Alpha" })
}).catch(console.error);
fetch('http://127.0.0.1:3000/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: "Mu Server Beta" })
}).catch(console.error);
