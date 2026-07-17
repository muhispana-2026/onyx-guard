const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Find the dashboard tab section
const startDashboard = "{activeTab === 'dashboard' && (";
const endDashboard = "          {/* TAB 4: INTERACTIVE CLIENT-SERVER SIMULATOR */}";

let startIdx = code.indexOf(startDashboard);
let endIdx = code.indexOf(endDashboard);

if (startIdx !== -1 && endIdx !== -1) {
    let dashboardCode = code.substring(startIdx, endIdx);

    // Increase padding and gap
    dashboardCode = dashboardCode.replace(/gap-6/g, "gap-8");
    dashboardCode = dashboardCode.replace(/p-5 md:p-6/g, "p-8 md:p-10");
    dashboardCode = dashboardCode.replace(/gap-4/g, "gap-6");
    dashboardCode = dashboardCode.replace(/mt-6/g, "mt-8");
    dashboardCode = dashboardCode.replace(/rounded-xl/g, "rounded-2xl");
    dashboardCode = dashboardCode.replace(/bg-slate-900/g, "bg-slate-900/60 backdrop-blur-xl");
    
    // Add subtle glow to the panels
    dashboardCode = dashboardCode.replace(/shadow-xl/g, "shadow-[0_8px_40px_rgba(0,0,0,0.6)] border-amber-900/30");
    dashboardCode = dashboardCode.replace(/border-slate-800/g, "border-slate-700/60");

    // Enhance table headers
    dashboardCode = dashboardCode.replace(/bg-slate-900/g, "bg-slate-800/80 backdrop-blur-sm text-amber-500 font-bold uppercase tracking-widest text-xs");
    
    // Enhance log blocks
    dashboardCode = dashboardCode.replace(/p-3\.5/g, "p-5");
    dashboardCode = dashboardCode.replace(/text-xs/g, "text-sm");
    dashboardCode = dashboardCode.replace(/text-\[10px\]/g, "text-xs");
    dashboardCode = dashboardCode.replace(/text-\[9px\]/g, "text-[10px]");

    // Update the main code
    code = code.substring(0, startIdx) + dashboardCode + code.substring(endIdx);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched Dashboard layout");
} else {
    console.log("Could not find dashboard section");
}
