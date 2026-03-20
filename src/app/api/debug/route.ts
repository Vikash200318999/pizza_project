// Debug endpoint — shows exactly which env vars are present and any Firebase init errors
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

export async function GET() {
  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey      = process.env.FIREBASE_PRIVATE_KEY;

  const hasProjectId   = !!projectId;
  const hasClientEmail = !!clientEmail;
  const hasPrivateKey  = !!rawKey;
  const keyPreview     = rawKey ? rawKey.slice(0, 40) + '...' : 'MISSING';
  const privateKey     = rawKey?.includes('\\n') ? rawKey.replace(/\\n/g, '\n') : rawKey;

  let firebaseStatus = 'not attempted';
  let firebaseError  = '';

  try {
    if (projectId && clientEmail && privateKey) {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
        });
      }
      const db = admin.firestore();
      await db.collection('orders').limit(1).get();
      firebaseStatus = 'connected';
    } else {
      firebaseStatus = 'missing env vars';
    }
  } catch (e: any) {
    firebaseStatus = 'error';
    firebaseError  = e?.message || String(e);
  }

  return NextResponse.json({
    hasProjectId, hasClientEmail, hasPrivateKey,
    keyPreview,
    firebaseStatus, firebaseError,
    nodeVersion: process.version,
  });
}
