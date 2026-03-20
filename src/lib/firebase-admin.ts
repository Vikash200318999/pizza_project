/**
 * Firebase Admin SDK — server-side only (API routes)
 * Falls back to local filesystem if env vars are not set (dev mode).
 */
import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;

function getAdminApp() {
  if (admin.apps.length > 0) return admin.apps[0]!;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) return null;

  return admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

export function getFirestore(): admin.firestore.Firestore | null {
  if (db) return db;
  const app = getAdminApp();
  if (!app) return null;
  db = admin.firestore(app);
  return db;
}
