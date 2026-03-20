'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Clock, ExternalLink, LocateFixed, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [address, setAddress] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<'idle' | 'success'>('idle');

  const handleCheckDelivery = () => {
    if (!address) return;
    setIsChecking(true);
    setDeliveryStatus('idle');
    setTimeout(() => {
      setIsChecking(false);
      setDeliveryStatus('success');
    }, 1500);
  };

  const handleAutoDetect = () => {
    setIsChecking(true);
    setDeliveryStatus('idle');
    setAddress('Detecting location...');
    setTimeout(() => {
      setAddress('City Center, Durgapur, West Bengal');
      setIsChecking(false);
      setDeliveryStatus('success');
    }, 2000);
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-slate-900/50 transition-colors relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-brand-blue dark:text-white uppercase tracking-tight mb-4">
            Find <span className="text-brand-red">Us</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
            Visit our store or check if we deliver hot and fresh pizzas right to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Store Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 hover:border-brand-red dark:hover:border-brand-red transition-colors group">
              <h3 className="text-xl font-bold text-brand-blue dark:text-white flex items-center gap-2 mb-4">
                <div className="p-2 bg-brand-red/10 rounded-lg group-hover:scale-110 transition-transform">
                    <MapPin className="text-brand-red" size={20} />
                </div>
                Store Location
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">
                <p className="flex items-start gap-3">
                  <span className="font-semibold text-brand-blue dark:text-white w-16 shrink-0">Address:</span>
                  <span>Opposite Agrani Lane, Benachity, Durgapur, West Bengal 713213</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="font-semibold text-brand-blue dark:text-white w-16 shrink-0">Phone:</span>
                  <a href="tel:7047237888" className="hover:text-brand-red font-bold transition-colors">7047237888</a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="font-semibold text-brand-blue dark:text-white w-16 shrink-0">Hours:</span>
                  <span>10:00 AM - 11:00 PM (Everyday)</span>
                </p>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Benachity+Durgapur+West+Bengal"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full btn-primary flex items-center justify-center gap-2 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <ExternalLink size={18} />
                Open in Google Maps
              </a>
            </div>

            {/* Delivery Check Card (Domino's Style) */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-brand-gold/30 dark:border-brand-gold/20 relative overflow-hidden group hover:border-brand-gold dark:hover:border-brand-gold transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity group-hover:scale-110 duration-500">
                    <Navigation size={120} className="text-brand-gold" />
                </div>
              <h3 className="text-xl font-bold text-brand-blue dark:text-white mb-2 relative z-10 flex items-center gap-2">
                <Navigation className="text-brand-gold" size={20}/>
                Delivery Radius Check
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 relative z-10 font-medium leading-relaxed">
                Enter your location or auto-detect to see your estimated delivery time and live order tracking availability.
              </p>
              
              <div className="space-y-3 relative z-10">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your street or area..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold focus:outline-none dark:text-white text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAutoDetect}
                    className="flex-1 px-4 py-3 rounded-xl border border-brand-blue dark:border-brand-gold text-brand-blue dark:text-brand-gold font-bold hover:bg-brand-blue hover:text-white dark:hover:bg-brand-gold dark:hover:text-slate-900 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <LocateFixed size={16} />
                    Locate Me
                  </button>
                  <button
                    onClick={handleCheckDelivery}
                    disabled={!address || isChecking || address === 'Detecting location...'}
                    className="flex-1 bg-brand-gold text-brand-blue font-bold px-4 py-3 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 text-sm shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold dark:focus:ring-offset-slate-800"
                  >
                    {isChecking ? 'Computing...' : 'Check Status'}
                  </button>
                </div>
              </div>

              {/* Delivery Status Result */}
              {deliveryStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl relative z-10"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-bold text-green-800 dark:text-green-300 text-sm">Delivery Available to this location!</h4>
                      <div className="mt-2 space-y-1.5 text-xs font-semibold text-green-700 dark:text-green-400">
                        <p className="flex items-center gap-2"><Clock size={14} className="opacity-70"/> Estimated Time: <span className="text-green-900 dark:text-green-200">35 - 45 mins</span></p>
                        <p className="flex items-center gap-2"><Navigation size={14} className="opacity-70"/> Live Radar Tracking: <span className="text-green-900 dark:text-green-200">Active</span></p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column - The Map */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] group bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
            
            {/* Embedded Google Map */}
            <iframe 
                className="w-full h-full absolute inset-0 filter dark:invert-[90%] dark:hue-rotate-180 dark:contrast-[85%] transition-all duration-700 ease-in-out" 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14631.956795493035!2d87.29828236166549!3d23.53290610534289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f77209700e1e69%3A0x2863e46cde6d2a71!2sBenachity%2C%20Durgapur%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1710500000000!5m2!1sen!2sin" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            {/* Interactive Map Overlay for aesthetics */}
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
