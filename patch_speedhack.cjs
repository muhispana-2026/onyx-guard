const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const original = `    Sleep(50); 

    QueryPerformanceCounter(&qpcEnd);
    tickEnd = GetTickCount();

    double qpcDuration = (double)(qpcEnd.QuadPart - qpcStart.QuadPart) / qpcFreq.QuadPart;
    double tickDuration = (double)(tickEnd - tickStart) / 1000.0;

    if (qpcDuration > 0 && (tickDuration / qpcDuration) > 1.30) {`;

const fixed = `    Sleep(250); 

    QueryPerformanceCounter(&qpcEnd);
    tickEnd = GetTickCount();

    double qpcDuration = (double)(qpcEnd.QuadPart - qpcStart.QuadPart) / qpcFreq.QuadPart;
    double tickDuration = (double)(tickEnd - tickStart) / 1000.0;

    if (qpcDuration > 0 && (tickDuration / qpcDuration) > 1.80) {`;

content = content.replace(original, fixed);
fs.writeFileSync('src/App.tsx', content);
