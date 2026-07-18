import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import fbConfig from '../firebase-applet-config.json';

export const app = initializeApp(fbConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app, fbConfig.firestoreDatabaseId);
