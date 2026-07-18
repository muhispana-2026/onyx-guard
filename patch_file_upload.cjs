const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldUpload = `                            reader.onload = (event) => {
                              const content = event.target?.result;
                              if (typeof content === 'string') {
                                const lines = content.split('');
                                const newDumps = [];
                                for (const line of lines) {
                                  const trimmed = line.trim();
                                  if (trimmed && !trimmed.startsWith('//')) {
                                    newDumps.push({
                                      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                                      name: trimmed,
                                      desc: 'Imported'
                                    });
                                  }
                                }
                                setDumps(prev => [...newDumps, ...prev]);
                                alert(language === 'es' ? \`Se cargaron \${newDumps.length} firmas de volcado.\` : \`Loaded \${newDumps.length} dump signatures.\`);
                              }
                            };`;

const newUpload = `                            reader.onload = async (event) => {
                              const content = event.target?.result;
                              if (typeof content === 'string') {
                                const lines = content.split('\\n');
                                const newDumps = [];
                                for (const line of lines) {
                                  const trimmed = line.trim();
                                  if (trimmed && !trimmed.startsWith('//')) {
                                    const parts = trimmed.split('\\t');
                                    const name = parts.length > 2 ? parts[parts.length - 1].replace(/"/g, '') : trimmed;
                                    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
                                    newDumps.push({
                                      id,
                                      projectId: activeProjectId,
                                      name: name,
                                      desc: 'Imported Signature',
                                      rawRule: trimmed,
                                      timestamp: new Date().toISOString()
                                    });
                                  }
                                }
                                
                                // Batch upload to firestore
                                try {
                                  await Promise.all(newDumps.map(d => setDoc(doc(db, 'dumps', d.id), d)));
                                  alert(language === 'es' ? \`Se subieron \${newDumps.length} firmas a la base de datos de OnyxGuard.\` : \`Uploaded \${newDumps.length} signatures to OnyxGuard DB.\`);
                                } catch(e) {
                                  console.error(e);
                                  alert("Error uploading dumps to database.");
                                }
                              }
                            };`;

code = code.replace(oldUpload, newUpload);
fs.writeFileSync('src/App.tsx', code);
