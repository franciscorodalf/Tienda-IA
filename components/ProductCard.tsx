'use client';

import React from 'react';
import { Product } from '@/lib/data';
import { motion } from 'framer-motion';

interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    return (
        <motion.div
            layoutId={`product-${product.id}`}
            onClick={() => onClick(product)}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative cursor-pointer"
        >
            {/* Cards are brutalist/minimalist: Just image and text, no borders */}
            <div className="aspect-[3/4] overflow-hidden bg-gray-900 rounded-sm relative">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />

                {/* Overlay info on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-black px-6 py-2 uppercase text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-colors">
                        Quick View
                    </button>
                </div>

                {!product.stock && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                        Sold Out
                    </div>
                )}
            </div>

            <div className="mt-4 flex flex-col gap-1">
                <h3 className="text-sm font-bold uppercase tracking-wide text-white group-hover:underline decoration-1 underline-offset-4">
                    {product.name}
                </h3>
                <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
                    <span>{product.category}</span>
                    <span className="text-white font-medium">${product.price.toFixed(2)}</span>
                </div>
            </div>
        </motion.div>
    );
};
