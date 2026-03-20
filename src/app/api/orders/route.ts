// Force Node.js runtime — required for firebase-admin (not compatible with Edge)
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// ─── Firebase Admin Init ───────────────────────────────────────────────────────
function getDb(): admin.firestore.Firestore | null {
  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey      = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey) return null;

  // Vercel stores env vars with literal \n — convert them back to real newlines
  const privateKey = rawKey.includes('\\n') ? rawKey.replace(/\\n/g, '\n') : rawKey;

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
    }
    return admin.firestore();
  } catch (e) {
    console.error('Firebase init error:', e);
    return null;
  }
}

// ─── Local Filesystem Fallback (dev mode) ────────────────────────────────────
const LOCAL_PATH = path.join(process.cwd(), 'data', 'orders.json');

function localRead(): any[] {
  try {
    if (!fs.existsSync(LOCAL_PATH)) {
      fs.mkdirSync(path.dirname(LOCAL_PATH), { recursive: true });
      fs.writeFileSync(LOCAL_PATH, '[]');
    }
    return JSON.parse(fs.readFileSync(LOCAL_PATH, 'utf-8'));
  } catch { return []; }
}

function localWrite(orders: any[]) {
  try {
    fs.mkdirSync(path.dirname(LOCAL_PATH), { recursive: true });
    fs.writeFileSync(LOCAL_PATH, JSON.stringify(orders, null, 2));
  } catch (e) { console.error('localWrite error', e); }
}

// ─── GET — list all orders ────────────────────────────────────────────────────
export async function GET() {
  try {
    const db = getDb();
    if (db) {
      const snap = await db.collection('orders').orderBy('timestamp', 'desc').get();
      return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    return NextResponse.json(localRead());
  } catch (e: any) {
    console.error('GET /api/orders error:', e);
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}

// ─── POST — save a new order ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const order = { timestamp: new Date().toISOString(), status: 'placed', ...body };

    if (db) {
      const ref = await db.collection('orders').add(order);
      return NextResponse.json({ success: true, orderId: ref.id });
    }

    // dev fallback
    const orders = localRead();
    const withId = { ...order, id: `ORD-${Date.now()}` };
    orders.unshift(withId);
    localWrite(orders);
    return NextResponse.json({ success: true, orderId: withId.id });

  } catch (e: any) {
    console.error('POST /api/orders error:', e);
    return NextResponse.json({ error: e?.message || 'Failed to save order' }, { status: 500 });
  }
}

// ─── PATCH — update order status ─────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const db = getDb();
    const updatedAt = new Date().toISOString();

    if (db) {
      await db.collection('orders').doc(id).update({ status, updatedAt });
      return NextResponse.json({ success: true });
    }

    const orders = localRead().map((o: any) => o.id === id ? { ...o, status, updatedAt } : o);
    localWrite(orders);
    return NextResponse.json({ success: true });

  } catch (e: any) {
    console.error('PATCH /api/orders error:', e);
    return NextResponse.json({ error: e?.message || 'Failed to update order' }, { status: 500 });
  }
}

// ─── PUT — get latest order by phone number ───────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const { phone } = await req.json();
    const db = getDb();

    if (db) {
      const snap = await db.collection('orders')
        .where('phone', '==', phone)
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get();
      if (snap.empty) return NextResponse.json({ order: null });
      const doc = snap.docs[0];
      return NextResponse.json({ order: { id: doc.id, ...doc.data() } });
    }

    const orders = localRead();
    const match = orders.find((o: any) => o.phone === phone);
    return NextResponse.json({ order: match || null });

  } catch (e: any) {
    console.error('PUT /api/orders error:', e);
    return NextResponse.json({ error: e?.message || 'Failed to fetch order' }, { status: 500 });
  }
}
