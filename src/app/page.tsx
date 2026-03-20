'use client';

import React, { useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';
import { MenuItem } from '@/data/menu';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShoppingBag, Plus, Minus, Trash2, CheckCircle2, Clock,
  CreditCard, Banknote, AlertCircle, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

type CartStep = 'cart' | 'details' | 'payment' | 'success' | 'expired';

const PAYMENT_SECONDS = 120; // 2 minutes

export default function Home() {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [cartStep, setCartStep] = React.useState<CartStep>('cart');
  const [paymentMethod, setPaymentMethod] = React.useState<'qr' | 'cod'>('qr');
  const [customer, setCustomer] = React.useState({ name: '', phone: '', address: '' });
  const [timeLeft, setTimeLeft] = React.useState(PAYMENT_SECONDS);
  const [isSaving, setIsSaving] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (!isCartOpen) setCartStep('cart');
  }, [isCartOpen]);

  // Countdown timer
  React.useEffect(() => {
    if (cartStep === 'payment' && paymentMethod === 'qr') {
      setTimeLeft(PAYMENT_SECONDS);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setCartStep('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current!);
    }
  }, [cartStep, paymentMethod]);

  const addToCart = (item: MenuItem, size: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.size === size);
      if (existing) {
        return prev.map(i => i.id === item.id && i.size === size ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, image: item.image, price: item.price[size], size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, size: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => item.id === id && item.size === size ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
        .filter(item => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discount = cartTotal >= 500 ? cartTotal * 0.2 : 0;
  const finalTotal = Math.round(cartTotal - discount);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerPercent = (timeLeft / PAYMENT_SECONDS) * 100;
  const timerColor = timeLeft > 60 ? '#22c55e' : timeLeft > 30 ? '#f59e0b' : '#ef4444';

  const proceedToPayment = () => {
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      alert('Please fill in all delivery details!');
      return;
    }
    setCartStep('payment');
  };

  const saveOrder = useCallback(async (method: 'qr' | 'cod') => {
    setIsSaving(true);
    // persist phone for tracking page
    localStorage.setItem('last_order_phone', customer.phone);
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          cart,
          total: finalTotal,
          paymentMethod: method,
        }),
      });
    } catch (e) {
      console.error('Could not save order', e);
    } finally {
      setIsSaving(false);
    }
  }, [cart, customer, finalTotal]);

  const handlePaid = async () => {
    clearInterval(timerRef.current!);
    await saveOrder('qr');
    setCartStep('success');
    // Also ping WhatsApp
    const msg = buildWhatsAppMsg('UPI / QR');
    setTimeout(() => { window.open(`https://wa.me/917047237888?text=${msg}`, '_blank'); setCart([]); }, 1500);
  };

  const handleCOD = async () => {
    await saveOrder('cod');
    setCartStep('success');
    const msg = buildWhatsAppMsg('Cash on Delivery');
    setTimeout(() => { window.open(`https://wa.me/917047237888?text=${msg}`, '_blank'); setCart([]); }, 1500);
  };

  const buildWhatsAppMsg = (method: string) => {
    return `*Order from Delicious Pizza (${method})*%0A%0A` +
      cart.map(item => `- ${item.name} (${item.size}) ×${item.quantity} = ₹${item.price * item.quantity}`).join('%0A') +
      `%0A%0A*Subtotal: ₹${cartTotal}*` +
      (discount > 0 ? `%0A*Discount (20%): - ₹${discount.toFixed(0)}*` : '') +
      `%0A*Final Total: ₹${finalTotal}*%0A%0A*Name:* ${customer.name}%0A*Phone:* ${customer.phone}%0A*Address:* ${customer.address}`;
  };

  // Dynamic UPI QR URL
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`upi://pay?pa=vikasg9987@oksbi&pn=Vikas%20Gaud&am=${finalTotal}&cu=INR&tn=DeliciousPizza`)}`;

  return (
    <main className="min-h-screen selection:bg-brand-blue selection:text-white relative bg-transparent">
      <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      <Hero />
      <Menu onAddToCart={addToCart} />
      <Footer />

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-[70] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between bg-brand-blue text-white shrink-0">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-brand-gold" />
                  <h2 className="text-xl font-black">
                    {cartStep === 'cart' ? 'YOUR CART' : cartStep === 'details' ? 'DELIVERY DETAILS' : cartStep === 'payment' ? 'SCAN & PAY' : cartStep === 'success' ? 'ORDER PLACED!' : 'TIME EXPIRED'}
                  </h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X /></button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">

                {/* STEP: Cart */}
                {cartStep === 'cart' && (
                  <div className="p-6 space-y-6">
                    {cart.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
                        <ShoppingBag size={80} className="mb-4" />
                        <p className="font-bold text-xl uppercase tracking-widest text-brand-blue">Your cart is empty</p>
                        <p className="text-sm mt-2">Add some delicious items!</p>
                      </div>
                    ) : cart.map(item => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0">
                          <img src={item.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.name} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-brand-blue">{item.name}</h4>
                            <span className="font-black text-brand-blue">₹{item.price * item.quantity}</span>
                          </div>
                          <p className="text-xs text-brand-gold font-bold mb-3 uppercase tracking-wider">Type: {item.size}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-gray-100 dark:border-slate-700 rounded-lg p-1 bg-gray-50 dark:bg-slate-800">
                              <button onClick={() => updateQuantity(item.id, item.size, -1)} className="p-1 hover:text-brand-red transition-colors"><Minus size={16} /></button>
                              <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.size, 1)} className="p-1 hover:text-green-600 transition-colors"><Plus size={16} /></button>
                            </div>
                            <button onClick={() => updateQuantity(item.id, item.size, -item.quantity)} className="text-gray-300 hover:text-brand-red transition-colors opacity-0 group-hover:opacity-100">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* STEP: Delivery Details */}
                {cartStep === 'details' && (
                  <div className="p-6 space-y-5">
                    <p className="text-sm text-gray-500">Please fill in your details below.</p>
                    <div className="space-y-4">
                      <input type="text" placeholder="Full Name *" value={customer.name}
                        onChange={e => setCustomer({ ...customer, name: e.target.value })}
                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:border-brand-blue" />
                      <input type="tel" placeholder="Phone Number *" value={customer.phone}
                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:border-brand-blue" />
                      <textarea placeholder="Full Delivery Address *" value={customer.address}
                        onChange={e => setCustomer({ ...customer, address: e.target.value })}
                        className="w-full p-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 h-24 focus:outline-none focus:border-brand-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-600 mb-3">Payment Method</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setPaymentMethod('qr')}
                          className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'qr' ? 'border-brand-gold bg-brand-gold/10' : 'border-gray-100 dark:border-slate-700 text-gray-400 hover:border-brand-blue'}`}>
                          <CreditCard size={24} />
                          <span className="font-bold text-sm">Pay via UPI</span>
                        </button>
                        <button onClick={() => setPaymentMethod('cod')}
                          className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cod' ? 'border-brand-gold bg-brand-gold/10' : 'border-gray-100 dark:border-slate-700 text-gray-400 hover:border-brand-blue'}`}>
                          <Banknote size={24} />
                          <span className="font-bold text-sm">Cash on Delivery</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP: QR Payment */}
                {cartStep === 'payment' && paymentMethod === 'qr' && (
                  <div className="p-6 flex flex-col items-center text-center space-y-4">
                    {/* Circular Timer */}
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                        <circle cx="48" cy="48" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                        <circle cx="48" cy="48" r="42" fill="none" stroke={timerColor} strokeWidth="8"
                          strokeDasharray={264} strokeDashoffset={264 - (timerPercent / 100) * 264}
                          strokeLinecap="round" className="transition-all duration-1000" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-black" style={{ color: timerColor }}>
                          {minutes}:{seconds.toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-500 flex items-center gap-1"><Clock size={14} /> Pay within 2 minutes</p>

                    {/* QR Code */}
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                      <img src={qrUrl} alt="UPI QR Code" className="w-[220px] h-[220px]" />
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 w-full text-left space-y-1">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Payment Details</p>
                      <p className="font-black text-2xl text-brand-blue">₹{finalTotal}</p>
                      <p className="text-sm text-gray-500">UPI ID: <span className="font-bold text-gray-800 dark:text-white">vikasg9987@oksbi</span></p>
                      <p className="text-sm text-gray-500">Name: <span className="font-bold text-gray-800 dark:text-white">Vikas Gaud</span></p>
                    </div>

                    <p className="text-sm text-gray-400">Open any UPI app (Google Pay, PhonePe, Paytm) → Scan QR → Pay → Come back and click below.</p>
                  </div>
                )}

                {/* STEP: COD confirmation */}
                {cartStep === 'payment' && paymentMethod === 'cod' && (
                  <div className="p-6 space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                      <Banknote size={40} className="text-yellow-600 mx-auto mb-2" />
                      <p className="font-black text-yellow-700 text-lg">Cash on Delivery</p>
                      <p className="text-2xl font-black text-brand-blue mt-1">₹{finalTotal}</p>
                      <p className="text-sm text-gray-500 mt-2">Please keep the exact change ready for the delivery person.</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 space-y-1 text-sm">
                      <p><span className="font-bold text-gray-500">Name:</span> {customer.name}</p>
                      <p><span className="font-bold text-gray-500">Phone:</span> {customer.phone}</p>
                      <p><span className="font-bold text-gray-500">Address:</span> {customer.address}</p>
                    </div>
                  </div>
                )}

                {/* STEP: Success */}
                {cartStep === 'success' && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                      <CheckCircle2 size={80} className="text-green-500 mb-2" />
                    </motion.div>
                    <h2 className="text-2xl font-black text-brand-blue">Order Confirmed! 🎉</h2>
                    <div className="bg-brand-blue/5 rounded-xl p-4 w-full space-y-2">
                      <div className="flex items-center justify-center gap-2 text-brand-blue">
                        <Clock size={20} className="text-brand-gold" />
                        <p className="font-black text-lg">25–30 minutes</p>
                      </div>
                      <p className="text-sm text-gray-500">Estimated preparation time</p>
                    </div>
                    <p className="text-sm text-gray-400 max-w-[260px]">Thank you, {customer.name}! We're sending your order details to WhatsApp. 📱</p>
                    <Link href="/track"
                      className="mt-2 flex items-center gap-2 bg-brand-blue text-white font-black px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
                      <ExternalLink size={16} /> Track My Order
                    </Link>
                  </div>
                )}

                {/* STEP: Timer expired */}
                {cartStep === 'expired' && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <AlertCircle size={80} className="text-brand-red" />
                    <h2 className="text-2xl font-black text-brand-red">Time Expired!</h2>
                    <p className="text-gray-500 max-w-[260px]">Your payment window has expired. Please try again.</p>
                    <button onClick={() => setCartStep('payment')} className="btn-primary px-8 py-3">Try Again</button>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="shrink-0 p-6 border-t dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                {cartStep === 'cart' && cart.length > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500">Subtotal</span>
                      <span className="font-bold">₹{cartTotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between items-center text-brand-red text-sm font-bold">
                        <span>Discount (20%)</span><span>−₹{discount.toFixed(0)}</span>
                      </div>
                    )}
                    {cartTotal < 500 && (
                      <p className="text-[11px] text-brand-red font-bold text-center bg-brand-red/10 py-1 rounded-md">
                        Add ₹{500 - cartTotal} more to get 20% off!
                      </p>
                    )}
                    <div className="flex justify-between items-center border-t dark:border-slate-800 pt-3">
                      <span className="font-black text-brand-blue">Total</span>
                      <span className="text-2xl font-black text-brand-blue dark:text-brand-gold">₹{finalTotal}</span>
                    </div>
                    <button onClick={() => setCartStep('details')} className="w-full btn-primary py-4 text-lg">Proceed to Checkout →</button>
                  </>
                )}

                {cartStep === 'details' && (
                  <div className="space-y-2">
                    <div className="flex justify-between font-black text-brand-blue text-lg"><span>Total</span><span>₹{finalTotal}</span></div>
                    <button onClick={proceedToPayment} className="w-full btn-primary py-4 text-lg">
                      {paymentMethod === 'qr' ? 'Proceed to Pay →' : 'Confirm COD Order →'}
                    </button>
                    <button onClick={() => setCartStep('cart')} className="w-full py-2 text-sm font-bold text-gray-400 hover:text-brand-blue transition-colors">← Back to Cart</button>
                  </div>
                )}

                {cartStep === 'payment' && paymentMethod === 'qr' && (
                  <button onClick={handlePaid} disabled={isSaving}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl text-lg transition-colors disabled:opacity-50">
                    {isSaving ? 'Saving order...' : "✅ I've Paid!"}
                  </button>
                )}

                {cartStep === 'payment' && paymentMethod === 'cod' && (
                  <div className="space-y-2">
                    <button onClick={handleCOD} disabled={isSaving}
                      className="w-full btn-primary py-4 text-lg disabled:opacity-50">
                      {isSaving ? 'Saving...' : '🛵 Confirm Order'}
                    </button>
                    <button onClick={() => setCartStep('details')} className="w-full py-2 text-sm font-bold text-gray-400 hover:text-brand-blue transition-colors">← Back</button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
