'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingBag, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = () => {
    const { setIsCartOpen, itemCount } = useCart();

    return (
        <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="
          flex items-center gap-8 px-8 py-4
          bg-neutral-900/60 backdrop-blur-xl border border-white/10
          rounded-full shadow-2xl shadow-black/50
        "
            >
                {/* Mobile Menu Icon */}
                <button className="lg:hidden text-gray-400 hover:text-white transition-colors">
                    <Menu className="w-5 h-5" />
                </button>

                {/* Navigation Links */}
                <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                    <Link href="/" className="hover:text-white transition-colors hover:scale-105 transform">
                        Shop
                    </Link>
                    <Link href="/about" className="hover:text-white transition-colors hover:scale-105 transform">
                        About
                    </Link>
                    <Link href="/archive" className="hover:text-white transition-colors hover:scale-105 transform">
                        Archive
                    </Link>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-4 bg-white/20"></div>

                {/* Icons */}
                <div className="flex items-center gap-6">
                    <button className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
                        <Search className="w-4 h-4" />
                    </button>

                    <button
                        className="relative group text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-3 h-3 bg-white text-black rounded-full text-[8px] flex items-center justify-center font-bold">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </motion.div>
        </nav>
    );
};
