'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingBag, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = () => {
    const { setIsCartOpen, itemCount } = useCart();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-white/90 backdrop-blur-md border-b border-gray-100">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="w-full flex items-center justify-between px-6 py-4 max-w-[1800px]"
            >
                {/* Mobile Menu Icon */}
                <button className="lg:hidden text-black hover:text-gray-600 transition-colors">
                    <Menu className="w-5 h-5" />
                </button>

                {/* Navigation Links */}
                <div className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-widest text-black">
                    <Link href="/" className="hover:text-gray-500 transition-colors">
                        Shop
                    </Link>
                    <Link href="/about" className="hover:text-gray-500 transition-colors">
                        About
                    </Link>
                    <Link href="/archive" className="hover:text-gray-500 transition-colors">
                        Archive
                    </Link>
                </div>

                {/* Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 text-lg font-medium tracking-widest text-black">
                    <Link href="/">AURA</Link>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-6">
                    <button className="text-black hover:text-gray-500 transition-colors">
                        <Search className="w-4 h-4" />
                    </button>

                    <button
                        className="relative group text-black hover:text-gray-500 transition-colors"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-black text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </motion.div>
        </nav>
    );
};
