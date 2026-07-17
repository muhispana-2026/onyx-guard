const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                  {/* Left: Dump List Table */}
                  <div className="lg:col-span-8">
                    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">`;

const replacement = `                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
                  {/* Left: Dump List Table */}
                  <div className="lg:col-span-8 flex flex-col gap-4">
                    
                    {/* File Upload Zone */}
                    <div className="border-2 border-dashed border-slate-700/50 hover:border-amber-500/50 bg-slate-950/50 rounded-xl p-6 text-center transition flex flex-col items-center justify-center gap-3 cursor-pointer group">
                      <div className="bg-slate-900 p-3 rounded-full group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-slate-400 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-300 font-mono">
                          {language === 'es' ? 'Subir Dump.List / Dump.db' : 'Upload Dump.List / Dump.db'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {language === 'es' ? 'Arrastra y suelta tu archivo aquí o haz clic para buscar.' : 'Drag & drop your file here or click to browse.'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Updated Dump section successfully.");
} else {
  console.log("Target string not found.");
}
