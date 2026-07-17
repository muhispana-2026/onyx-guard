const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const t = `          {/* TAB 3: SERVER AUTH DASHBOARD & HWID MANAGER */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              
              {/* Dashboard Layout Header */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">`;

const r = `          {/* TAB 3: HWID PROFILES */}
          {activeTab === 'hardware' && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              
              {/* Dashboard Layout Header */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">`;

code = code.replace(t, r);
fs.writeFileSync('src/App.tsx', code);
