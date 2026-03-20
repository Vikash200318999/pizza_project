
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgePercent, Truck } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-transparent">
            {/* Decorative elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/10 text-brand-red rounded-full font-bold text-sm mb-6">
                        <BadgePercent size={18} />
                        <span>GET FLAT 20% DISCOUNT ON RS. 500+</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-brand-blue leading-[1.1] mb-6">
                        Freshly Baked <br />
                        <span className="text-brand-gold">Delicious Pizza</span> <br />
                        With Love.
                    </h1>

                    <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                        Experience the authentic taste of artisanal pizzas and bakery items made with fresh dough and premium ingredients.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button className="btn-primary text-lg">
                            Order Online <ArrowRight size={20} />
                        </button>
                        <div className="flex items-center gap-3 px-4 py-2">
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-brand-gold">
                                <Truck size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-brand-blue leading-none">FREE DELIVERY</p>
                                <p className="text-xs text-gray-500 font-medium tracking-wide">ON ALL APP ORDERS</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="customer" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                            <span className="text-brand-blue font-bold">1,000+</span> Regular Customers
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative"
                >
                    {/* Replace with actual generated image later */}
                    <div className="relative z-10 w-full aspect-square rounded-full border-[16px] border-white shadow-2xl overflow-hidden animate-spin-slow">
                        <img
                            src="/images/pizzas/hero.png"
                            alt="Delicious Pizza"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Floating elements */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute top-[10%] -left-[10%] z-20 glass p-4 rounded-2xl flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">100%</div>
                        <p className="text-sm font-bold text-brand-blue">PURE VEG<br /><span className="text-[10px] text-gray-400">ONLY FRESH INGREDIENTS</span></p>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                        className="absolute bottom-[20%] -right-[5%] z-20 glass p-4 rounded-2xl shadow-xl"
                    >
                        <p className="text-xs font-bold text-gray-400 mb-1 tracking-widest uppercase">Popular</p>
                        <p className="text-sm font-black text-brand-blue">Paneer Makhani</p>
                        <p className="text-brand-gold font-bold">₹189 onwards</p>
                    </motion.div>
                </motion.div>
            </div>

            <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 100s linear infinite;
        }
        .animate-spin-slow:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    );
}
