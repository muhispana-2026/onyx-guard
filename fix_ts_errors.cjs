const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The heartbeat endpoint is at line 465 roughly.
// I need to revert speedhackSensitivity from everywhere else except heartbeat.

code = code.replace(/res\.json\(\{\s*success: true,\s*speedhackSensitivity: conf\[0\]\.speedhackSensitivity \|\| "1\.80"\s*\}\);/g, 'res.json({ success: true });');

// Re-add to heartbeat endpoint explicitly:
code = code.replace(
  /        \}\s*\}\s*res\.json\(\{ success: true \}\);\s*\} catch \(e: any\) \{/g,
  `        }
      }
      res.json({ success: true, speedhackSensitivity: conf[0].speedhackSensitivity || "1.80" });
    } catch (e: any) {`
);

fs.writeFileSync('server.ts', code);
