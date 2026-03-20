'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Phone, MapPin, Menu as MenuIcon, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

export default function Navbar({ cartCount, onCartClick }: { cartCount: number, onCartClick: () => void }) {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8',
                isScrolled ? 'py-3 glass' : 'py-6 bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-brand-blue dark:bg-brand-gold p-1 rounded-lg rotate-12 group-hover:rotate-0 transition-transform shadow-lg">
                        <div className="bg-white p-0.5 rounded-md overflow-hidden">
                            <img src="/images/logo.png" alt="Delicious Pizza Logo" className="w-10 h-10 object-contain" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-brand-blue dark:text-white tracking-tighter leading-none">
                            DELICIOUS PIZZA
                        </h1>
                    </div>
                </Link>

                <div className="hidden lg:flex items-center gap-8">
                    <Link href="#menu" className="font-semibold text-brand-blue dark:text-blue-100 hover:text-brand-gold dark:hover:text-brand-gold transition-colors">Menu</Link>
                    <Link href="#offers" className="font-semibold text-brand-blue dark:text-blue-100 hover:text-brand-gold dark:hover:text-brand-gold transition-colors">Offers</Link>
                    <Link href="#contact" className="font-semibold text-brand-blue dark:text-blue-100 hover:text-brand-gold dark:hover:text-brand-gold transition-colors">Contact</Link>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-brand-blue dark:text-brand-gold hover:scale-110 active:scale-95 transition-all shadow-sm border border-gray-200 dark:border-slate-700"
                    >
                        {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <div className="hidden sm:flex flex-col items-end">
                        <div className="flex items-center gap-1 text-brand-blue dark:text-white font-bold">
                            <Phone size={14} className="fill-brand-blue dark:fill-white" />
                            <span>7047237888</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                            <MapPin size={10} />
                            <span>Durgapur-13</span>
                        </div>
                    </div>

                    <button
                        onClick={onCartClick}
                        className="relative p-2 bg-brand-blue dark:bg-brand-gold text-white dark:text-slate-900 rounded-full hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg"
                    >
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    <button className="lg:hidden p-2 text-brand-blue dark:text-white">
                        <MenuIcon size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
