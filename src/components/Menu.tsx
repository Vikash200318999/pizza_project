'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menu, MenuItem, Category } from '@/data/menu';
import PizzaCard from './PizzaCard';
import { cn } from '@/lib/utils';
import { UtensilsCrossed, Star, Flame, Cake, Cookie, Croissant, Sandwich, Pizza as PizzaIcon } from 'lucide-react';

interface MenuProps {
    onAddToCart: (item: MenuItem, size: string) => void;
}

const categories = [
    { id: 'signature', name: 'Signature', icon: Star, color: 'text-amber-500' },
    { id: 'premium', name: 'Premium', icon: UtensilsCrossed, color: 'text-blue-500' },
    { id: 'supreme', name: 'Supreme', icon: Flame, color: 'text-red-500' },
    { id: 'cakes', name: 'Cakes', icon: Cake, color: 'text-pink-500' },
    { id: 'pastry', name: 'Pastry', icon: Cookie, color: 'text-orange-500' },
    { id: 'desserts', name: 'Desserts', icon: Cookie, color: 'text-purple-500' },
    { id: 'breads', name: 'Breads', icon: Croissant, color: 'text-yellow-600' },
    { id: 'snacks', name: 'Snacks', icon: Sandwich, color: 'text-green-600' },
] as const;

export default function Menu({ onAddToCart }: MenuProps) {
    const [activeTab, setActiveTab] = React.useState<Category>('signature');

    const filteredMenu = menu.filter((item) => item.category === activeTab);

    return (
        <section id="menu" className="py-24 bg-transparent">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-brand-blue mb-4 leading-tight">
                        Our Delicious <span className="text-brand-gold italic">Menu</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto font-medium">
                        Explore our wide range of freshly baked items, from artisanal pizzas to delightful cakes and desserts. 100% vegetarian and prepared with love.
                    </p>
                </div>

                {/* Categories Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id as Category)}
                            className={cn(
                                "px-6 py-3 rounded-2xl font-black transition-all duration-300 flex items-center gap-2 border-2 outline-none text-sm",
                                activeTab === cat.id
                                    ? "bg-brand-blue border-brand-blue text-white shadow-xl scale-110"
                                    : "bg-white border-gray-100 text-gray-400 hover:border-brand-blue/30 hover:text-brand-blue"
                            )}
                        >
                            <cat.icon size={18} className={activeTab === cat.id ? "text-white" : cat.color} />
                            {cat.name.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredMenu.map((item) => (
                            <PizzaCard
                                key={item.id}
                                pizza={item}
                                onAddToCart={onAddToCart}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredMenu.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 font-bold">No items found in this category.</p>
                    </div>
                )}

            </div>
        </section>
    );
}
