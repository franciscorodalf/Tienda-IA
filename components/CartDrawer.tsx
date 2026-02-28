'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
    const { isCartOpen, setIsCartOpen, items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();
    const router = useRouter();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--background)] border-l border-[var(--muted)] shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[var(--muted)] flex items-center justify-between">
                            <h2 className="text-sm font-medium uppercase tracking-widest text-[var(--foreground)] flex items-center gap-2">
                                <ShoppingBag size={20} />
                                Cart ({items.length})
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-[var(--muted)] rounded-full transition-colors text-[var(--foreground)]"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-[var(--muted)]/50 space-y-4">
                                    <ShoppingBag size={48} />
                                    <p className="uppercase tracking-widest text-sm font-bold">Your cart is empty</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.cartId}
                                        className="flex gap-4 p-4 border border-[var(--muted)] bg-[var(--muted)]/10"
                                    >
                                        <div className="w-20 h-24 bg-[var(--muted)] flex-shrink-0 overflow-hidden">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-sm uppercase text-[var(--foreground)] text-balance leading-tight">{item.name}</h3>
                                                    <button onClick={() => removeItem(item.cartId)} className="text-red-500 hover:text-red-400">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-500 uppercase mt-1 tracking-wide">
                                                    {item.selectedSize} / {item.selectedColor}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-end mt-4">
                                                <div className="flex items-center border border-[var(--muted)]">
                                                    <button
                                                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                                        className="p-1 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-mono font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                        className="p-1 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <span className="font-mono font-bold text-[var(--foreground)]">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-[var(--muted)] bg-[var(--background)]">
                            <div className="flex justify-between items-center mb-6 text-sm font-medium uppercase tracking-widest text-[var(--foreground)]">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={() => {
                                    import('react-hot-toast').then(({ default: toast }) => {
                                        toast.error('El sistema de pagos de Stripe se encuentra actualmente en entorno de pruebas (Sandbox). El checkout está desactivado.', {
                                            style: {
                                                background: 'var(--foreground)',
                                                color: 'var(--background)',
                                                borderRadius: '0px',
                                                fontSize: '12px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }
                                        });
                                    });
                                }}
                                disabled={items.length === 0}
                                className="w-full py-4 bg-black text-white uppercase text-xs font-medium tracking-widest hover:bg-gray-800 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                Checkout
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
