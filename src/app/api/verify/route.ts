import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    
    // Hash HMAC SHA256
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
      return NextResponse.json({ message: 'Payment verified successfully', isOk: true }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid payment signature', isOk: false }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ message: 'Payment verification failed', error }, { status: 500 });
  }
}
