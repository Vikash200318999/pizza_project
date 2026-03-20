'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pizza, User, Phone, Sparkles, ChevronRight } from 'lucide-react';

interface UserProfile {
  name: string;
  phone: string;
}

interface AuthModalProps {
  onLogin: (user: UserProfile) => void;
}

export default function AuthModal({ onLogin }: AuthModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || !/^[0-9]{10}$/.test(phone.trim())) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    const profile = { name: name.trim(), phone: phone.trim() };
    localStorage.setItem('user_profile', JSON.stringify(profile));
    onLogin(profile);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-blue/95 backdrop-blur-md">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/5 text-9xl select-none"
            style={{ left: `${(i % 4) * 28}%`, top: `${Math.floor(i / 4) * 55}%` }}
            animate={{ rotate: [0, 360], y: [0, -20, 0] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'linear' }}
          >
            🍕
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-blue to-slate-700 p-8 text-center">
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl mb-3"
          >🍕</motion.div>
          <h1 className="text-3xl font-black text-white">Delicious Pizza</h1>
          <p className="text-white/70 mt-1 font-medium">Fresh Dough • Made with Love</p>
          <div className="flex items-center justify-center gap-1 mt-3 text-brand-gold text-sm font-bold">
            <Sparkles size={14} />
            <span>Order food & track it live!</span>
            <Sparkles size={14} />
          </div>
        </div>

        {/* Form */}
        <div className="p-8 space-y-5">
          <div>
            <h2 className="text-xl font-black text-brand-blue mb-1">Welcome! 👋</h2>
            <p className="text-sm text-gray-500">Tell us who you are so we can deliver to you.</p>
          </div>

          {/* Name */}
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-brand-blue font-semibold transition-colors"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              placeholder="10-digit phone number"
              value={phone}
              maxLength={10}
              onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-brand-blue font-semibold transition-colors"
            />
          </div>

          {error && (
            <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className="text-sm text-red-500 font-semibold">
              ⚠️ {error}
            </motion.p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-brand-blue text-white font-black py-4 rounded-xl text-lg hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20"
          >
            Start Ordering <ChevronRight size={20} />
          </button>

          <p className="text-xs text-center text-gray-400">
            We only use your phone number to show you your order status. No spam ever.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
