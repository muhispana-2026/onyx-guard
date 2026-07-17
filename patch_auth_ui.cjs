const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const t = `  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl" />
        </div>
        
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl shadow-2xl max-w-md w-full relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-slate-800 p-4 rounded-full border border-slate-700 shadow-inner">
              <Shield className="w-12 h-12 text-amber-500" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-2 font-serif tracking-wide">
            OnyxGuard
          </h1>
          <p className="text-slate-400 mb-8 font-medium">Authentication Required</p>
          
          <button 
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }`;

const r = `  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden font-sans">
        {/* Modern Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-emerald-500/10"></div>
        
        {/* Glow Spheres */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 p-8 z-10">
          
          {/* Left Side: Brand Showcase */}
          <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start space-y-8">
            <div className="relative inline-flex p-4 bg-gradient-to-br from-amber-500/20 to-amber-900/20 rounded-2xl border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
              <Shield className="w-20 h-20 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse" />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-500 font-serif tracking-tight drop-shadow-sm">
                OnyxGuard
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 font-light max-w-xl leading-relaxed">
                Enterprise-grade client authentication & HWID protection framework.
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-500 pt-4">
              <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Real-time Protection
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                Zero-Trust Auth
              </div>
            </div>
          </div>

          {/* Right Side: Login Panel */}
          <div className="w-full max-w-md">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              {/* Subtle hover effect light */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mb-8 shadow-inner">
                  <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Secure Access</h2>
                <p className="text-slate-400 mb-10 text-center text-sm">
                  Please authenticate with your organizational Google account to continue to the dashboard.
                </p>
                
                <button 
                  onClick={loginWithGoogle}
                  className="w-full flex items-center justify-center gap-4 bg-white text-slate-900 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-[0_4px_14px_0_rgba(255,255,255,0.2)]"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-base tracking-wide">Continue with Google</span>
                </button>
              </div>
            </div>
            
            <p className="text-center text-slate-600 text-xs mt-6 font-mono">
              v{config.clientVersion} // ENCRYPTED SESSION
            </p>
          </div>
          
        </div>
      </div>
    );
  }`;

if(code.includes(t)) {
    code = code.replace(t, r);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched App.tsx");
} else {
    console.log("Not found in App.tsx");
}
