import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebase-admin';
import fs from 'fs';
import path from 'path';

// ─── Local Filesystem Fallback (for dev without Firebase) ────────────────────
const LOCAL_PATH = path.join(process.cwd(), 'data', 'orders.json');

function localRead() {
  try {
    if (!fs.existsSync(LOCAL_PATH)) {
      fs.mkdirSync(path.dirname(LOCAL_PATH), { recursive: true });
      fs.writeFileSync(LOCAL_PATH, '[]');
    }
    return JSON.parse(fs.readFileSync(LOCAL_PATH, 'utf-8'));
  } catch { return []; }
}

function localWrite(orders: any[]) {
  fs.mkdirSync(path.dirname(LOCAL_PATH), { recursive: true });
  fs.writeFileSync(LOCAL_PATH, JSON.stringify(orders, null, 2));
}

// ─── GET all orders ───────────────────────────────────────────────────────────
export async function GET() {
  const db = getFirestore();

  if (db) {
    const snapshot = await db.collection('orders').orderBy('timestamp', 'desc').get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(orders);
  }

  // fallback
  return NextResponse.json(localRead());
}

// ─── POST — create new order ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getFirestore();

    const newOrder = {
      timestamp: new Date().toISOString(),
      status: 'placed',
      ...body,
    };

    if (db) {
      const ref = await db.collection('orders').add(newOrder);
      return NextResponse.json({ success: true, orderId: ref.id });
    }

    // fallback
    const orders = localRead();
    const withId = { ...newOrder, id: `ORD-${Date.now()}` };
    orders.unshift(withId);
    localWrite(orders);
    return NextResponse.json({ success: true, orderId: withId.id });

  } catch (error) {
    console.error('Order save error:', error);
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
  }
}

// ─── PATCH — update order status ──────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const db = getFirestore();

    if (db) {
      await db.collection('orders').doc(id).update({ status, updatedAt: new Date().toISOString() });
      return NextResponse.json({ success: true });
    }

    // fallback
    const orders = localRead();
    const updated = orders.map((o: any) => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o);
    localWrite(updated);
    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// ─── PATCH by phone ───────────────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const { phone } = await req.json();
    const db = getFirestore();

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

    // fallback
    const orders = localRead();
    const match = orders.find((o: any) => o.phone === phone);
    return NextResponse.json({ order: match || null });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
