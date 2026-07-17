const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const str = `                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            alert(language === 'es' ? 'Archivo cargado con éxito para análisis.' : 'File uploaded successfully for parsing.');
                          }
                        }}`;

const rep = `                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const content = event.target?.result;
                              if (typeof content === 'string') {
                                const lines = content.split('\\n');
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
                            };
                            reader.readAsText(file);
                          }
                        }}`;

code = code.replace(str, rep);
fs.writeFileSync('src/App.tsx', code);
