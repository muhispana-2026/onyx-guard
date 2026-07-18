import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { DEFAULT_DUMPS } from './dumps_data';

export const seedDefaultDumps = async (projectId: string) => {
  if (!projectId) return;
  const qDumps = query(collection(db, 'dumps'), where('projectId', '==', projectId));
  const snap = await getDocs(qDumps);
  if (!snap.empty) return; // Already seeded

  const lines = DEFAULT_DUMPS.split('\n').filter(l => l.trim().length > 0);
  console.log(`Seeding ${lines.length} dumps...`);
  
  let added = 0;
  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length > 2) {
      const name = parts[parts.length - 1].replace(/"/g, '');
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      
      await setDoc(doc(db, 'dumps', id), {
        id,
        projectId,
        name: name,
        desc: 'OnyxGuard Default Signature',
        rawRule: line, // Save the raw line so we can use it in C++
        timestamp: new Date().toISOString()
      });
      added++;
    }
  }
  console.log(`Seeded ${added} dumps.`);
};
