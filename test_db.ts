import fs from "fs";
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const fbConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const appAdmin = initializeApp({
  projectId: fbConfig.projectId,
  credential: applicationDefault(),
});
const db = getFirestore(appAdmin, fbConfig.firestoreDatabaseId);

async function run() {
  try {
    const snapshot = await db.collection('projects').get();
    console.log("Success", snapshot.docs.length);
  } catch(e) {
    console.error("Error", e);
  }
}
run();
