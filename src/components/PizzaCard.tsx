'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { MenuItem } from '@/data/menu';
import { cn } from '@/lib/utils';

interface PizzaCardProps {
    pizza: MenuItem;
    onAddToCart: (pizza: MenuItem, size: string) => void;
}

export default function PizzaCard({ pizza, onAddToCart }: PizzaCardProps) {
    const priceKeys = Object.keys(pizza.price);
    const [size, setSize] = React.useState<string>(priceKeys[0] || 'S');

    // Reset size if price keys change (when category changes)
    React.useEffect(() => {
        if (!pizza.price[size]) {
            setSize(priceKeys[0]);
        }
    }, [pizza.id, priceKeys, size]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card group hover:border-brand-gold/30 transition-colors h-full flex flex-col"
        >
            <div className="relative h-60 overflow-hidden shrink-0">
                <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                    <div className="w-3 h-3 border-2 border-green-600 flex items-center justify-center p-0.5">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                    </div>
                    <span className="text-[10px] font-black text-green-700 tracking-wider">100% VEG</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-12">
                    <h3 className="text-xl font-black text-white leading-tight">{pizza.name}</h3>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                <p className="text-sm text-gray-500 mb-6 flex-1">
                    {pizza.description}
                </p>

                {priceKeys.length > 1 && (
                    <div className="flex items-center justify-between gap-2 mb-6 p-1 bg-gray-200/50 dark:bg-slate-800/80 rounded-xl border border-gray-100 dark:border-slate-700">
                        {priceKeys.map((s) => (
                            <button
                                key={s}
                                onClick={() => setSize(s)}
                                className={cn(
                                    "flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all duration-300",
                                    size === s
                                        ? "bg-brand-blue text-white shadow-md scale-[1.05] dark:bg-brand-gold dark:text-slate-900"
                                        : "text-slate-600 dark:text-slate-200 bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 border border-slate-200 dark:border-slate-700"
                                )}
                            >
                                {s.toUpperCase()}
                                <span className="block text-[8px] opacity-70">₹{pizza.price[s]}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 leading-none uppercase">Price</span>
                        <span className="text-2xl font-black text-brand-blue dark:text-brand-gold">₹{pizza.price[size]}</span>
                    </div>

                    <button
                        onClick={() => onAddToCart(pizza, size)}
                        className="flex-1 bg-brand-gold hover:bg-brand-blue text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg shadow-brand-gold/20"
                    >
                        <ShoppingCart size={18} className="transition-transform group-hover/btn:-translate-y-1" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
