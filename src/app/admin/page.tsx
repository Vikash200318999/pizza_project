'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Phone, MapPin, RefreshCw, Lock, Bell, Search, X } from 'lucide-react';

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

const ADMIN_PASSWORD = 'pizza@admin2024';

const STATUS_FLOW = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'] as const;
const STATUS_LABELS: Record<string, string> = {
  placed: '🆕 Placed', confirmed: '✅ Confirmed',
  preparing: '👨‍🍳 Preparing', out_for_delivery: '🛵 Out for Delivery', delivered: '🎉 Delivered',
};
const STATUS_COLORS: Record<string, string> = {
  placed: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-300',
  preparing: 'bg-orange-100 text-orange-700 border-orange-300',
  out_for_delivery: 'bg-purple-100 text-purple-700 border-purple-300',
  delivered: 'bg-green-100 text-green-700 border-green-300',
};

function nextStatus(current: string): string | null {
  const idx = STATUS_FLOW.indexOf(current as any);
  return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
}
function nextLabel(current: string): string {
  const n = nextStatus(current);
  return n ? `→ Mark as ${STATUS_LABELS[n]}` : '✅ Completed';
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [search, setSearch] = useState('');
  const [newCount, setNewCount] = useState(0);
  const audioCtx = useRef<AudioContext | null>(null);

  // Must be called during a user gesture to unlock AudioContext
  const initAudio = useCallback(() => {
    try {
      if (!audioCtx.current) {
        audioCtx.current = new AudioContext();
      } else if (audioCtx.current.state === 'suspended') {
        audioCtx.current.resume();
      }
    } catch {}
  }, []);

  const playChime = useCallback(() => {
    try {
      const ctx = audioCtx.current;
      if (!ctx || ctx.state === 'suspended') return;
      // Three ascending notes for a pleasant new-order chime
      [[660, 0], [880, 0.18], [1100, 0.36]].forEach(([freq, when]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + when);
        gain.gain.setValueAtTime(0.35, ctx.currentTime + when);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + when + 0.3);
        osc.start(ctx.currentTime + when);
        osc.stop(ctx.currentTime + when + 0.3);
      });
    } catch {}
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data: Order[] = await res.json();
      const prevNew = orders.filter(o => o.status === 'placed').length;
      const currNew = data.filter(o => o.status === 'placed').length;
      if (currNew > prevNew && orders.length > 0) playChime();
      setOrders(data);
      setNewCount(currNew);
      setLastRefresh(new Date());
    } catch {}
    finally { setLoading(false); }
  }, [orders, playChime]);

  useEffect(() => {
    if (!authed) return;
    fetchOrders();
    const t = setInterval(fetchOrders, 20000);
    return () => clearInterval(t);
  }, [authed]); // eslint-disable-line

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
  };

  const filtered = orders.filter(o =>
    !search || o.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.phone?.includes(search) || o.id?.includes(search)
  );

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-blue to-slate-800 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-black text-brand-blue">Admin Panel</h1>
            <p className="text-sm text-gray-400 mt-1">Delicious Pizza — Dashboard</p>
          </div>
          <input type="password" placeholder="Admin password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (password === ADMIN_PASSWORD) { initAudio(); setAuthed(true); setPwError(''); }
                else setPwError('Incorrect password.');
              }
            }}
            className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 mb-3 focus:outline-none focus:border-brand-blue" />
          {pwError && <p className="text-sm text-red-500 mb-3">{pwError}</p>}
          <button onClick={() => {
              if (password === ADMIN_PASSWORD) { initAudio(); setAuthed(true); setPwError(''); }
              else setPwError('Incorrect password.');
            }}
            className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
            Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-blue text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <ShoppingBag className="text-brand-gold" />
          <div>
            <h1 className="text-lg font-black leading-tight">Delicious Pizza — Orders</h1>
            {lastRefresh && <p className="text-xs text-white/60">Refreshed: {lastRefresh.toLocaleTimeString()}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {newCount > 0 && (
            <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
              className="bg-brand-gold text-brand-blue text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
              <Bell size={12} /> {newCount} NEW
            </motion.span>
          )}
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name / phone…"
              className="bg-white/10 text-white placeholder:text-white/40 text-sm pl-8 pr-4 py-2 rounded-lg focus:outline-none focus:bg-white/20 w-48" />
            {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2"><X size={12} className="text-white/50" /></button>}
          </div>
          <button onClick={fetchOrders} disabled={loading}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm font-bold transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {STATUS_FLOW.map(s => (
            <div key={s} className={`rounded-xl p-4 shadow-sm border ${orders.filter(o => o.status === s).length > 0 && s === 'placed' ? 'border-brand-gold bg-brand-gold/5' : 'bg-white border-gray-100'}`}>
              <p className="text-2xl font-black text-brand-blue">{orders.filter(o => o.status === s).length}</p>
              <p className="text-xs text-gray-500 font-semibold mt-0.5 leading-tight">{STATUS_LABELS[s]}</p>
            </div>
          ))}
        </div>

        {/* Orders List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <ShoppingBag size={60} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold text-xl">{search ? 'No matching orders' : 'No orders yet'}</p>
            <p className="text-sm">Orders will appear as customers checkout.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filtered.map((order, i) => {
                const next = nextStatus(order.status);
                return (
                  <motion.div key={order.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`bg-white rounded-xl shadow-sm border-l-4 overflow-hidden
                      ${order.status === 'placed' ? 'border-brand-gold' : order.status === 'delivered' ? 'border-green-500' : 'border-brand-blue'}`}>
                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        {/* Customer info */}
                        <div className="space-y-1.5 flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="font-mono">{order.id?.slice(0, 14)}</span>
                            <span>•</span>
                            <span>{new Date(order.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                          </div>
                          <h3 className="text-lg font-black text-brand-blue">{order.name}</h3>
                          <a href={`tel:${order.phone}`} className="flex items-center gap-2 text-sm font-bold hover:text-brand-blue">
                            <Phone size={13} className="text-brand-gold" />{order.phone}
                          </a>
                          <div className="flex items-start gap-2 text-sm text-gray-500">
                            <MapPin size={13} className="text-brand-gold shrink-0 mt-0.5" />{order.address}
                          </div>
                        </div>

                        {/* Items */}
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Items</p>
                          <div className="space-y-1">
                            {order.cart?.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-700">{item.name} <span className="text-gray-400">({item.size}) ×{item.quantity}</span></span>
                                <span className="font-bold text-brand-blue">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-dashed mt-2 pt-2 flex justify-between font-black text-brand-blue text-sm">
                            <span>Total</span><span>₹{order.total?.toFixed(0)}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {order.paymentMethod === 'qr' ? '📱 UPI / QR' : '💵 Cash on Delivery'}
                          </p>
                        </div>

                        {/* Status + Action */}
                        <div className="flex flex-col items-end gap-3 min-w-[180px]">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_COLORS[order.status]}`}>
                            {STATUS_LABELS[order.status]}
                          </span>
                          {next ? (
                            <button onClick={() => updateStatus(order.id, next)}
                              className="text-xs bg-brand-blue text-white px-4 py-2 rounded-xl hover:opacity-90 font-bold w-full text-center transition-opacity">
                              {nextLabel(order.status)}
                            </button>
                          ) : (
                            <p className="text-xs text-green-600 font-bold">✅ Order Complete</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
