'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingBag, Menu, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
}

export const Navbar = ({ searchQuery, setSearchQuery }: NavbarProps) => {
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
                <div className="hidden lg:flex items-center gap-8 text-sm font-semibold uppercase tracking-widest text-black">
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
                <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-medium tracking-widest text-black">
                    <Link href="/">AURA</Link>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-6">
                    {searchQuery !== undefined && setSearchQuery !== undefined ? (
                        <div className="relative flex items-center group hidden md:flex">
                            <input
                                type="text"
                                placeholder="SEARCH..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-0 opacity-0 group-hover:w-48 group-hover:opacity-100 focus:w-48 focus:opacity-100 transition-all duration-300 ease-in-out bg-transparent border-b border-gray-300 px-0 py-1 text-xs uppercase tracking-widest focus:outline-none focus:border-black text-black placeholder:text-gray-400 mr-2"
                            />
                            <Search className="w-5 h-5 text-black" />
                        </div>
                    ) : (
                        <button className="text-black hover:text-gray-500 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                    )}

                    <Link href="/login" className="text-black hover:text-gray-500 transition-colors">
                        <User className="w-5 h-5" />
                    </Link>

                    <button
                        className="relative group text-black hover:text-gray-500 transition-colors"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </motion.div>
        </nav>
    );
};
