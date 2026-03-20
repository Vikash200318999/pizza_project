import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({ error: 'Razorpay keys are missing. Please add them to .env.local and restart the server.' }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id, key_secret });
    const body = await req.json();
    const { amount } = body;

    const options = {
      amount: Math.round(amount * 100), // amount in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
  }
}
