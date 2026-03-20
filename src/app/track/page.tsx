'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Pizza, CheckCircle2, Clock, Truck, PartyPopper, ChevronRight, Phone, MapPin, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface OrderItem { name: string; size: string; quantity: number; price: number; }
interface Order {
  id: string;
  timestamp: string;
  status: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  name: string;
  phone: string;
  address: string;
  cart: OrderItem[];
  total: number;
  paymentMethod: string;
}

const STEPS = [
  { key: 'placed',           icon: CheckCircle2,   label: 'Order Placed',       desc: 'We received your order!' },
  { key: 'confirmed',        icon: CheckCircle2,   label: 'Confirmed',           desc: 'Kitchen confirmed your order.' },
  { key: 'preparing',        icon: Pizza,          label: 'Being Prepared',      desc: 'Our chefs are cooking for you!' },
  { key: 'out_for_delivery', icon: Truck,          label: 'Out for Delivery',    desc: 'Your order is on the way!' },
  { key: 'delivered',        icon: PartyPopper,    label: 'Delivered!',          desc: 'Enjoy your meal! 🎉' },
];

const STATUS_INDEX: Record<string, number> = {
  placed: 0, confirmed: 1, preparing: 2, out_for_delivery: 3, delivered: 4,
};

const ETA: Record<string, string> = {
  placed: '30–35 min', confirmed: '25–30 min', preparing: '15–20 min',
  out_for_delivery: '5–10 min', delivered: 'Delivered!',
};

export default function TrackPage() {
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // auto-load from localStorage if redirected from checkout
  useEffect(() => {
    const saved = localStorage.getItem('last_order_phone');
    if (saved) { setPhone(saved); }
  }, []);

  const fetchOrder = useCallback(async (ph?: string) => {
    const searchPhone = ph || phone;
    if (!searchPhone.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: searchPhone.trim() }),
      });
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
        setSearched(true);
      } else {
        setOrder(null);
        setError('No order found for this phone number. Double-check and try again.');
        setSearched(true);
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [phone]);

  // Auto-search if redirected with phone
  useEffect(() => {
    const saved = localStorage.getItem('last_order_phone');
    if (saved && !searched) {
      fetchOrder(saved);
    }
  }, [fetchOrder, searched]);

  // Auto-refresh every 15 seconds while order is active
  useEffect(() => {
    if (!order || order.status === 'delivered') return;
    const timer = setInterval(() => fetchOrder(), 15000);
    return () => clearInterval(timer);
  }, [order, fetchOrder]);

  const stepIndex = order ? (STATUS_INDEX[order.status] ?? 0) : -1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Nav */}
      <nav className="bg-brand-blue text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <Link href="/" className="flex items-center gap-2 font-black text-lg">
          <Pizza className="text-brand-gold" />
          Delicious Pizza
        </Link>
        <span className="text-sm text-white/70 font-semibold">Track My Order</span>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-slate-700">
          <h1 className="text-2xl font-black text-brand-blue mb-1">Where's my order?</h1>
          <p className="text-sm text-gray-500 mb-4">Enter the phone number you used while ordering.</p>
          <div className="flex gap-3">
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchOrder()}
              className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 focus:outline-none focus:border-brand-blue font-semibold"
            />
            <button
              onClick={() => fetchOrder()}
              disabled={loading}
              className="bg-brand-blue text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? <RotateCcw size={18} className="animate-spin" /> : <Search size={18} />}
              Track
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-500 font-semibold">{error}</p>}
        </div>

        {/* Order Card */}
        {order && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {/* ETA Banner */}
            <div className={`rounded-2xl p-5 mb-6 flex items-center justify-between text-white shadow-lg
              ${order.status === 'delivered' ? 'bg-green-500' : 'bg-brand-blue'}`}>
              <div>
                <p className="text-white/80 text-sm font-semibold">Estimated Time</p>
                <p className="text-3xl font-black">{ETA[order.status] || '30–35 min'}</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm">Order ID</p>
                <p className="font-mono text-xs font-bold">{order.id?.slice(0, 12)}...</p>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6 mb-6">
              <h2 className="font-black text-brand-blue mb-6 text-lg">Order Progress</h2>
              <div className="space-y-4">
                {STEPS.map((step, i) => {
                  const done = i <= stepIndex;
                  const active = i === stepIndex;
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      {/* Icon + line */}
                      <div className="flex flex-col items-center">
                        <motion.div
                          animate={active ? { scale: [1, 1.15, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all
                            ${done ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'}`}
                        >
                          <Icon size={18} />
                        </motion.div>
                        {i < STEPS.length - 1 && (
                          <div className={`w-0.5 h-8 mt-1 rounded-full transition-all ${i < stepIndex ? 'bg-brand-blue' : 'bg-gray-200 dark:bg-slate-700'}`} />
                        )}
                      </div>
                      {/* Text */}
                      <div className="pt-1.5">
                        <p className={`font-black ${done ? 'text-brand-blue' : 'text-gray-400'}`}>{step.label}</p>
                        {active && <p className="text-sm text-gray-500 mt-0.5">{step.desc}</p>}
                      </div>
                      {active && (
                        <span className="ml-auto mt-1 text-xs font-bold text-brand-gold bg-brand-gold/10 px-2 py-1 rounded-full">Current</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6 mb-6">
              <h2 className="font-black text-brand-blue mb-4 text-lg">Order Details</h2>
              {/* Delivery info */}
              <div className="space-y-2 mb-4 pb-4 border-b dark:border-slate-700 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone size={14} className="text-brand-gold shrink-0" />
                  <span className="font-semibold">{order.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin size={14} className="text-brand-gold shrink-0 mt-0.5" />
                  <span>{order.address}</span>
                </div>
              </div>
              {/* Items */}
              <div className="space-y-2">
                {order.cart?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.name}{' '}
                      <span className="text-gray-400">({item.size}) ×{item.quantity}</span>
                    </span>
                    <span className="font-bold text-brand-blue">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between font-black text-brand-blue border-t dark:border-slate-700 pt-2 mt-2">
                  <span>Total Paid</span>
                  <span>₹{order.total?.toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center text-sm text-gray-400 space-y-2">
              <p>Need help? Call us at <a href="tel:7047237888" className="font-bold text-brand-blue underline">7047237888</a></p>
              <Link href="/" className="inline-flex items-center gap-1 text-brand-blue font-bold hover:underline">
                ← Add More Items <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}

        {searched && !order && !error && (
          <div className="text-center py-10 text-gray-400">
            <Search size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
