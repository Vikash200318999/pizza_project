
'use client';

import React from 'react';
import { Phone, MapPin, Instagram, Facebook, Clock, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer id="contact" className="bg-brand-blue text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-white p-1 rounded-lg italic font-black text-brand-blue text-xl w-10 h-10 flex items-center justify-center">
                                DP
                            </div>
                            <div>
                                <h3 className="text-2xl font-black leading-none uppercase">Delicious Pizza</h3>
                            </div>
                        </div>
                        <p className="text-blue-100 text-sm leading-relaxed mb-6 italic opacity-80">
                            "Prepared with Love. A bite of Love."
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://www.instagram.com/delicious_pizza_benachity?utm_source=qr&igsh=bXZzOTBuMjI2NHl5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-gold transition-colors"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-brand-gold">Contact Us</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="text-brand-gold shrink-0" size={20} />
                                <p className="text-blue-100 text-sm">
                                    Benachity Opp. Agrani Lane,<br />
                                    Durgapur - 713213, WB
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="text-brand-gold shrink-0" size={20} />
                                <p className="text-blue-100 font-bold">7047237888</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-brand-gold">Opening Hours</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Clock className="text-brand-gold shrink-0" size={20} />
                                <div className="text-blue-100 text-sm">
                                    <p className="font-bold">Mon - Sun</p>
                                    <p className="opacity-70">10:00 AM - 10:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-brand-gold">Newsletter</h4>
                        <p className="text-blue-100 text-sm mb-4">Subscribe to get latest offers and discounts.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:border-brand-gold transition-colors"
                            />
                            <button className="bg-brand-gold text-brand-blue px-4 py-2 rounded-xl font-bold text-sm hover:bg-white transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-blue-200">
                    <p>© 2024 Delicious Pizza. All Rights Reserved.</p>
                    <div className="flex items-center gap-1">
                        Made with <Heart size={14} className="fill-brand-red text-brand-red" /> in Durgapur
                    </div>
                </div>
            </div>
        </footer>
    );
}
