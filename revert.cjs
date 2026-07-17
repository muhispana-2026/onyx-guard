const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Revert glassmorphism
code = code.replace(/className="bg-slate-900\/60 backdrop-blur-xl rounded-2xl border border-slate-700\/60 p-8 md:p-10 shadow-\[0_8px_40px_rgba\(0,0,0,0\.6\)\] border-amber-900\/30/g, 'className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl');
code = code.replace(/className="bg-slate-900\/60 backdrop-blur-xl rounded-2xl border border-slate-700\/60 p-6 shadow-2xl border-amber-900\/30"/g, 'className="bg-slate-900 rounded-xl border border-slate-800/80 p-4 shadow-lg"');
code = code.replace(/<div className="lg:col-span-9 flex flex-col gap-8">/g, '<div className="lg:col-span-9 flex flex-col gap-6">');
code = code.replace(/<main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">/g, '<main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">');
code = code.replace(/<div className="bg-slate-950\/50 backdrop-blur-md rounded-2xl border border-slate-800\/80 overflow-x-auto shadow-inner">/g, '<div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">');

// Also revert the dashboard patch changes (from patch_dashboard.cjs)
code = code.replace(/bg-slate-800\/80 backdrop-blur-sm text-amber-500 font-bold uppercase tracking-widest text-xs/g, 'bg-slate-900');

fs.writeFileSync('src/App.tsx', code);
