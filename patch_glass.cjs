const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard card styles with glassmorphic styles
code = code.replace(/className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl/g, 'className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/60 p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.6)] border-amber-900/30');

// Replace sidebar nav card
code = code.replace(/className="bg-slate-900 rounded-xl border border-slate-800\/80 p-4 shadow-lg"/g, 'className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/60 p-6 shadow-2xl border-amber-900/30"');

// Replace lg:col-span-9 gap-6 with gap-8
code = code.replace(/<div className="lg:col-span-9 flex flex-col gap-6">/g, '<div className="lg:col-span-9 flex flex-col gap-8">');

// Dashboard tab inner cards (Database Management Panel, etc.)
// Some were already patched, but let's make sure things like terminal logs are updated.
code = code.replace(/<div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">/g, '<div className="bg-slate-950/50 backdrop-blur-md rounded-2xl border border-slate-800/80 overflow-x-auto shadow-inner">');

fs.writeFileSync('src/App.tsx', code);
console.log("Patched to glassmorphism");
