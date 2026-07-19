const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The issue reported is: 
// Errores:
// falta la comilla de cierre
// nueva línea en literal de cadena
// falta la comilla de cierre
// nueva línea en literal de cadena
// se esperaba ';'
// error de sintaxis: falta ';' delante del identificador 'payload'
// falta la comilla de cierre
// nueva línea en literal de cadena
// falta la comilla de cierre
// nueva línea en literal de cadena
// se esperaba ';'
// error de sintaxis: 'bool' debe estar precedido de ';'
// el identificador "isAuthorized" no está definido

// This implies that the generated C++ code contains literal newlines inside a string literal, because of missing escaping.
// Let's check what the user's browser produces.
// Oh wait! In JS, if you have a template literal:
// headers += "X-Payload-Encrypted: true\r\n";
// The C++ compiler will see a literal newline because \r\n are evaluated by JS before being stringified!
// To output \r\n to the C++ code, JS needs \\r\\n!

const target1 = `    std::string headers = "Content-Type: application/json\\r\\n";`;
const replacement1 = `    std::string headers = "Content-Type: application/json\\\\r\\\\n";`;
code = code.replace(target1, replacement1);

const target2 = `    headers += "X-Payload-Encrypted: true\\r\\n";`;
const replacement2 = `    headers += "X-Payload-Encrypted: true\\\\r\\\\n";`;
code = code.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed headers newlines in JS template!");
