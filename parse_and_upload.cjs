// Script to parse the provided DB file and upload to firestore directly from agent
const fs = require('fs');
const content = fs.readFileSync('Dump.List (1).db', 'utf8');
const lines = content.split(/[\r\n]+/);

let parsed = [];
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('//')) {
    const parts = trimmed.split(/[\t]+/).filter(Boolean);
    let name = trimmed;
    if (parts.length > 2) {
      name = parts[parts.length - 1].replace(/"/g, '');
    } else {
      const spaceParts = trimmed.split(/[\s]+/).filter(Boolean);
      if (spaceParts.length > 2) {
          name = spaceParts[spaceParts.length - 1].replace(/"/g, '');
      }
    }
    parsed.push({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      projectId: "onyx-1", // Using default fallback ID
      name: name,
      desc: 'Imported Signature',
      rawRule: trimmed,
      timestamp: new Date().toISOString()
    });
  }
}
console.log(`Parsed ${parsed.length} signatures`);
fs.writeFileSync('parsed_hacks.json', JSON.stringify(parsed, null, 2));
