const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const t = `          {/* TAB 3: SERVER DASHBOARD & REALTIME OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              
              {/* Dashboard Layout Header */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">`;

const r = `          {/* TAB 3: HWID PROFILES */}
          {activeTab === 'hardware' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">`;

// Split the hardware part from dashboard
code = code.replace(t, r);

// Find the end of Hardware profiles and inject the dashboard activeTab for real-time events.
const t2 = `                </div>
              </div>

              {/* Module 2: File Integrity Rules */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">`;

const r2 = `                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FILE INTEGRITY */}
          {activeTab === 'integrity' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">`;

code = code.replace(t2, r2);

// Split hacker dumps
const t3 = `                      {/* File Add form */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hacker Process Dumps Section */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">`;

const r3 = `                      {/* File Add form */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HACKER DUMPS */}
          {activeTab === 'dumps' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">`;
code = code.replace(t3, r3);


// Split dashboard (Real-time events)
const t4 = `                  </div>
                </div>
              </div>

              {/* Real-Time Connections Activity Log feed */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">`;

const r4 = `                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DASHBOARD (REAL-TIME EVENTS) */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 md:p-6 shadow-xl">`;
code = code.replace(t4, r4);

fs.writeFileSync('src/App.tsx', code);
