import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json');

function readOrders() {
  try {
    if (!fs.existsSync(ordersFilePath)) {
      fs.mkdirSync(path.dirname(ordersFilePath), { recursive: true });
      fs.writeFileSync(ordersFilePath, '[]');
    }
    const data = fs.readFileSync(ordersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeOrders(orders: any[]) {
  fs.mkdirSync(path.dirname(ordersFilePath), { recursive: true });
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
}

export async function GET() {
  const orders = readOrders();
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orders = readOrders();

    const newOrder = {
      id: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'new',
      ...body,
    };

    orders.unshift(newOrder); // latest first
    writeOrders(orders);

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error) {
    console.error('Order save error:', error);
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const orders = readOrders();
    const updated = orders.map((o: any) => o.id === id ? { ...o, status } : o);
    writeOrders(updated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
