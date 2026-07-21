import fs from "fs";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const fbConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const firebaseApp = initializeApp(fbConfig);
const db = getFirestore(firebaseApp, fbConfig.firestoreDatabaseId);

async function run() {
  const snapshot = await getDocs(collection(db, 'config'));
  for (const document of snapshot.docs) {
    const data = document.data();
    if (data.serverUrl === "http://localhost:3000/api/auth" || data.serverUrl === "https://auth.mymuonline.com/api/validate") {
      await updateDoc(doc(db, 'config', document.id), {
        serverUrl: "https://onyx-guard.onrender.com/api/auth"
      });
      console.log(`Updated config for project: ${document.id}`);
    }
  }
  console.log("Done");
  process.exit(0);
}
run();
