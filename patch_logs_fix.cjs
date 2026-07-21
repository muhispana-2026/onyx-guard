const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The server sends type ("INFO", "BLOCKED") but the frontend expects status ("ALLOWED", "BLOCKED_*")
// and reason but the server sends message.

content = content.replace(
  "  status: 'ALLOWED' | 'BLOCKED_HWID' | 'BLOCKED_HASH' | 'BLOCKED_VERSION' | 'BANNED';",
  "  status: 'ALLOWED' | 'BLOCKED_HWID' | 'BLOCKED_HASH' | 'BLOCKED_VERSION' | 'BANNED' | 'BLOCKED';\n  type?: string;\n  message?: string;"
);

content = content.replace(
  "      if (logFilter === 'ALLOWED') return matchesSearch && log.status === 'ALLOWED';",
  "      if (logFilter === 'ALLOWED') return matchesSearch && (log.status === 'ALLOWED' || log.type === 'INFO');"
);

content = content.replace(
  "      if (logFilter === 'BLOCKED') return matchesSearch && log.status !== 'ALLOWED';",
  "      if (logFilter === 'BLOCKED') return matchesSearch && log.status !== 'ALLOWED' && log.type !== 'INFO';"
);

content = content.replace(
  "                  {logs.filter(l => l.status !== 'ALLOWED').length} {t.header.attempts}",
  "                  {logs.filter(l => l.status !== 'ALLOWED' && l.type !== 'INFO').length} {t.header.attempts}"
);

// Fix AI logs filter if there are any
content = content.replace(
  "logs.filter(l => l.reason.includes('AI Analysis:') || l.reason.includes('IA detectó'))",
  "logs.filter(l => (l.reason && (l.reason.includes('AI Analysis:') || l.reason.includes('IA detectó'))) || (l.message && (l.message.includes('AI Analysis:') || l.message.includes('IA detectó'))))"
);

content = content.replace(
  "logs.filter(l => l.reason.includes('AI Analysis:') || l.reason.includes('IA detectó'))",
  "logs.filter(l => (l.reason && (l.reason.includes('AI Analysis:') || l.reason.includes('IA detectó'))) || (l.message && (l.message.includes('AI Analysis:') || l.message.includes('IA detectó'))))"
);

// Fix mapped logs status coloring
content = content.replace(
  "                          log.status === 'ALLOWED' ",
  "                          (log.status === 'ALLOWED' || log.type === 'INFO') "
);

content = content.replace(
  "                              log.status === 'ALLOWED' ",
  "                              (log.status === 'ALLOWED' || log.type === 'INFO') "
);

content = content.replace(
  "                              {log.status === 'ALLOWED' ? (language === 'es' ? 'PERMITIDO' : 'ALLOWED') : (language === 'es' ? 'RECHAZADO' : 'BLOCKED')}",
  "                              {(log.status === 'ALLOWED' || log.type === 'INFO') ? (language === 'es' ? 'PERMITIDO' : 'ALLOWED') : (language === 'es' ? 'RECHAZADO' : 'BLOCKED')}"
);

content = content.replace(
  "                          {log.status !== 'ALLOWED' ? (",
  "                          {(log.status !== 'ALLOWED' && log.type !== 'INFO') ? ("
);

content = content.replace(
  "                          <span>{log.reason}</span>",
  "                          <span>{log.reason || log.message}</span>"
);


fs.writeFileSync('src/App.tsx', content);
console.log("Patched UI logic");
