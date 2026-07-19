const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state for bulk uploading files
code = code.replace(
    'const [isUploadingDumps, setIsUploadingDumps] = useState(false);',
    'const [isUploadingDumps, setIsUploadingDumps] = useState(false);\n  const [isUploadingFiles, setIsUploadingFiles] = useState(false);'
);

// 2. Add bulk upload UI next to the "Add File" section
const searchStr = `<div className="flex flex-col md:flex-row gap-2">
                        <button 
                          onClick={handleAddFile}
                          className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded shadow shadow-amber-500/20 transition whitespace-nowrap"
                        >
                          {t.dashboard.addFileRule || (language === 'es' ? 'Agregar Regla' : 'Add Rule')}
                        </button>
                      </div>`;

const replaceStr = `<div className="flex flex-col md:flex-row gap-2">
                        <button 
                          onClick={handleAddFile}
                          className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded shadow shadow-amber-500/20 transition whitespace-nowrap"
                        >
                          {t.dashboard.addFileRule || (language === 'es' ? 'Agregar Regla' : 'Add Rule')}
                        </button>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <label className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-700 hover:border-amber-500 border-dashed rounded text-sm text-slate-400 hover:text-amber-400 cursor-pointer transition">
                          <Upload className="w-4 h-4" />
                          {isUploadingFiles ? (language === 'es' ? 'Cargando MD5...' : 'Uploading MD5...') : (language === 'es' ? 'Cargar Lista MD5 (txt)' : 'Bulk Upload MD5 List (txt)')}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept=".txt,.list" 
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0] && activeProjectId) {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onload = async (event) => {
                                  const content = event.target?.result;
                                  if (typeof content === 'string') {
                                    const lines = content.split(/\\r?\\n/);
                                    const newFiles = [];
                                    for (const line of lines) {
                                      const trimmed = line.trim();
                                      if (!trimmed || trimmed.startsWith('//')) continue;
                                      
                                      // match format like: filename.ext md5hash  or  filename.ext: md5hash or filename.ext = md5hash
                                      const match = trimmed.match(/^(.+?)[\\s:=|]+([a-fA-F0-9]{32})$/);
                                      if (match) {
                                          newFiles.push({
                                            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                                            projectId: activeProjectId,
                                            filePath: match[1].trim().replace(/^"/, '').replace(/"$/, ''),
                                            expectedHash: match[2].trim().toLowerCase(),
                                            importance: 'HIGH',
                                            fileSize: 'Unknown'
                                          });
                                      }
                                    }
                                    
                                    if (newFiles.length === 0) {
                                        alert(language === 'es' ? 'No se encontraron hashes MD5 válidos en el archivo.' : 'No valid MD5 hashes found in the file.');
                                        return;
                                    }
                                    
                                    try {
                                      setIsUploadingFiles(true);
                                      const CHUNK_SIZE = 500;
                                      for (let i = 0; i < newFiles.length; i += CHUNK_SIZE) {
                                        const chunk = newFiles.slice(i, i + CHUNK_SIZE);
                                        const batch = writeBatch(db);
                                        chunk.forEach(f => {
                                          batch.set(doc(db, 'file_rules', f.id), f);
                                        });
                                        await batch.commit();
                                      }
                                      alert(language === 'es' ? \`Se subieron \${newFiles.length} archivos a la lista de integridad.\` : \`Uploaded \${newFiles.length} files to integrity list.\`);
                                      
                                      // refresh
                                      fetch('/api/files', { headers: { 'x-project-id': activeProjectId } })
                                        .then(r => r.json())
                                        .then(data => { if(Array.isArray(data)) setClientFiles(data.map(f => ({ ...f, path: f.filePath }))); });
                                        
                                    } catch(e) {
                                      console.error(e);
                                      alert("Error uploading files to database.");
                                    } finally {
                                      setIsUploadingFiles(false);
                                    }
                                  }
                                };
                                reader.readAsText(file);
                                e.target.value = '';
                              }
                            }}
                            disabled={isUploadingFiles}
                          />
                        </label>
                      </div>`;

code = code.replace(searchStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
