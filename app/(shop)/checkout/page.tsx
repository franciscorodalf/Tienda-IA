'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState(false);

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-[var(--foreground)]">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center space-y-6 max-w-lg"
                >
                    <CheckCircle2 size={64} strokeWidth={1} className="text-black" />
                    <h1 className="text-4xl font-light uppercase tracking-widest text-black">Order Confirmed</h1>
                    <p className="text-gray-500 font-medium tracking-wide uppercase text-xs leading-relaxed">
                        Thank you for your purchase. Your order is being processed and will be shipped shortly. Welcome to the AURA experience.
                    </p>
                    <Link
                        href="/"
                        className="mt-8 px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                        Return to Store
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-[var(--foreground)]">
                <p className="text-gray-500 uppercase tracking-widest text-sm mb-6">Your cart is empty.</p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800"
                >
                    Back to Shop
                </Link>
            </div>
        );
    }

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        clearCart();
        setIsSuccess(true);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
            <nav className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <Link href="/" className="flex items-center gap-2 uppercase font-bold tracking-widest text-xs hover:text-gray-500 transition-colors">
                    <ArrowLeft size={16} /> Back to Store
                </Link>
                <div className="text-lg font-medium tracking-widest">AURA</div>
                <div className="w-[100px]"></div> {/* Spacer */}
            </nav>

            <main className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* Form side */}
                <div className="lg:col-span-7">
                    <h2 className="text-2xl font-light uppercase tracking-widest mb-10 text-black">Checkout</h2>

                    <form onSubmit={handleCheckout} className="space-y-12">
                        {/* Shipping */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-2">Shipping Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="text" placeholder="First Name" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-xs uppercase tracking-wide focus:outline-none focus:border-black" />
                                <input required type="text" placeholder="Last Name" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-xs uppercase tracking-wide focus:outline-none focus:border-black" />
                            </div>
                            <input required type="email" placeholder="Email Address" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-xs uppercase tracking-wide focus:outline-none focus:border-black" />
                            <input required type="text" placeholder="Address" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-xs uppercase tracking-wide focus:outline-none focus:border-black" />
                            <div className="grid grid-cols-3 gap-4">
                                <input required type="text" placeholder="City" className="col-span-1 bg-gray-50 border border-gray-200 px-4 py-3 text-xs uppercase tracking-wide focus:outline-none focus:border-black" />
                                <input required type="text" placeholder="Postal / Zip" className="col-span-1 bg-gray-50 border border-gray-200 px-4 py-3 text-xs uppercase tracking-wide focus:outline-none focus:border-black" />
                                <input required type="text" placeholder="Country" className="col-span-1 bg-gray-50 border border-gray-200 px-4 py-3 text-xs uppercase tracking-wide focus:outline-none focus:border-black" />
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-2">Payment</h3>
                            <input required type="text" placeholder="Card Number" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-xs uppercase tracking-wide focus:outline-none focus:border-black" />
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="text" placeholder="MM/YY" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-xs uppercase tracking-wide focus:outline-none focus:border-black" />
                                <input required type="text" placeholder="CVC" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-xs uppercase tracking-wide focus:outline-none focus:border-black" />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-5 text-white bg-black uppercase font-bold text-xs tracking-widest hover:bg-gray-800 transition-colors">
                            Complete Order • ${(cartTotal).toFixed(2)}
                        </button>
                    </form>
                </div>

                {/* Summary side */}
                <div className="lg:col-span-5 bg-gray-50 p-8 border border-gray-100 h-fit sticky top-24">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-4 mb-6">Order Summary</h3>

                    <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                        {items.map(item => (
                            <div key={item.cartId} className="flex gap-4">
                                <div className="w-16 h-20 bg-gray-200 flex-shrink-0">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between">
                                        <p className="text-xs font-bold uppercase tracking-wide text-black">{item.name}</p>
                                        <p className="text-xs font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                                        {item.selectedSize} / {item.selectedColor} — Qty: {item.quantity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-6 space-y-3">
                        <div className="flex justify-between text-xs font-medium uppercase tracking-widest text-gray-500">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium uppercase tracking-widest text-gray-500">
                            <span>Shipping</span>
                            <span>Complimentary</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-black pt-4 border-t border-gray-200">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
