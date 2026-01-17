import React from 'react';
import { Product } from '@/lib/data';
import { X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            {/* Image Section */}
                            <div className="w-full md:w-1/2 bg-gray-100 relative h-64 md:h-auto">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                                <div className="mb-6">
                                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">{product.category}</span>
                                    <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-2">{product.name}</h2>
                                    <div className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</div>
                                </div>

                                <div className="prose prose-sm text-gray-800 mb-8 font-medium">
                                    <p>{product.description}</p>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.stock ? 'En Stock' : 'Agotado'}
                                        </span>
                                    </div>

                                    <button className="w-full py-4 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                                        <ShoppingBag size={20} />
                                        Añadir al Carrito
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
