const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /bg-slate-800\/80 backdrop-blur-sm text-amber-500 font-bold uppercase tracking-widest text-(?:sm|xs)\/60 backdrop-blur-xl/g;
code = code.replace(regex, 'bg-slate-900');

// Also fix `rounded-2xl border border-slate-700/60 p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.6)] border-amber-900/30` back to `rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl`
code = code.replace(/bg-slate-900 rounded-2xl border border-slate-700\/60 p-8 md:p-10 shadow-\[0_8px_40px_rgba\(0,0,0,0\.6\)\] border-amber-900\/30/g, 'bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl');

// Clean up some other things:
code = code.replace(/border-slate-700\/60/g, 'border-slate-800');

fs.writeFileSync('src/App.tsx', code);
