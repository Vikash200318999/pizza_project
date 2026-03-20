'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Phone, MapPin, Clock, CheckCircle2, XCircle, RefreshCw, Lock } from 'lucide-react';

interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  timestamp: string;
  status: 'new' | 'confirmed' | 'preparing' | 'done';
  name: string;
  phone: string;
  address: string;
  cart: OrderItem[];
  total: number;
  paymentMethod: string;
}

const ADMIN_PASSWORD = 'pizza@admin2024';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-300',
  preparing: 'bg-orange-100 text-orange-700 border-orange-300',
  done: 'bg-green-100 text-green-700 border-green-300',
};

const STATUS_LABELS: Record<string, string> = {
  new: '🆕 New',
  confirmed: '✅ Confirmed',
  preparing: '👨‍🍳 Preparing',
  done: '🎉 Done',
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
      setLastRefresh(new Date());
    } catch {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [authed, fetchOrders]);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password. Try again.');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-blue to-slate-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-black text-brand-blue">Admin Panel</h1>
            <p className="text-sm text-gray-400 mt-1">Delicious Pizza — Order Dashboard</p>
          </div>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 mb-3 focus:outline-none focus:border-brand-blue"
          />
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Login
          </button>
        </motion.div>
      </div>
    );
  }

  const newCount = orders.filter(o => o.status === 'new').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-blue text-white px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <ShoppingBag className="text-brand-gold" />
          <div>
            <h1 className="text-lg font-black">Delicious Pizza — Admin</h1>
            {lastRefresh && (
              <p className="text-xs text-white/60">Last updated: {lastRefresh.toLocaleTimeString()}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {newCount > 0 && (
            <span className="bg-brand-gold text-brand-blue text-xs font-black px-3 py-1 rounded-full animate-pulse">
              {newCount} NEW
            </span>
          )}
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors text-sm font-bold"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {['new', 'confirmed', 'preparing', 'done'].map(s => (
            <div key={s} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-2xl font-black text-brand-blue">
                {orders.filter(o => o.status === s).length}
              </p>
              <p className="text-sm text-gray-500 font-semibold mt-1">{STATUS_LABELS[s]}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <ShoppingBag size={60} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold text-xl">No orders yet</p>
            <p className="text-sm">Orders will appear here as customers checkout.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-white rounded-xl shadow-sm border-l-4 overflow-hidden ${order.status === 'new' ? 'border-brand-gold' : order.status === 'done' ? 'border-green-500' : 'border-brand-blue'}`}
              >
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    {/* Left: Customer info */}
                    <div className="space-y-2 flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-400">{order.id}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{new Date(order.timestamp).toLocaleString('en-IN')}</span>
                      </div>
                      <h3 className="text-lg font-black text-brand-blue">{order.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-brand-gold shrink-0" />
                        <a href={`tel:${order.phone}`} className="font-bold hover:text-brand-blue">{order.phone}</a>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-brand-gold shrink-0 mt-0.5" />
                        <span>{order.address}</span>
                      </div>
                    </div>

                    {/* Middle: Items */}
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Items</p>
                      <div className="space-y-1">
                        {order.cart?.map((item: OrderItem, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">{item.name} <span className="text-gray-400">({item.size}) ×{item.quantity}</span></span>
                            <span className="font-bold text-brand-blue">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-dashed mt-2 pt-2 flex justify-between font-black text-brand-blue">
                        <span>Total</span>
                        <span>₹{order.total?.toFixed(0)}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Payment: {order.paymentMethod === 'qr' ? '📱 UPI / QR' : '💵 Cash on Delivery'}</p>
                    </div>

                    {/* Right: Status controls */}
                    <div className="flex flex-col items-end gap-3 min-w-[160px]">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                      <div className="flex flex-col gap-1 w-full">
                        {order.status !== 'done' && (
                          <>
                            {order.status === 'new' && (
                              <button onClick={() => updateStatus(order.id, 'confirmed')}
                                className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 font-bold">
                                ✅ Confirm
                              </button>
                            )}
                            {order.status === 'confirmed' && (
                              <button onClick={() => updateStatus(order.id, 'preparing')}
                                className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 font-bold">
                                👨‍🍳 Start Preparing
                              </button>
                            )}
                            {order.status === 'preparing' && (
                              <button onClick={() => updateStatus(order.id, 'done')}
                                className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 font-bold">
                                🎉 Mark Done
                              </button>
                            )}
                          </>
                        )}
                        {order.status === 'done' && (
                          <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                            <CheckCircle2 size={14} /> Completed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
