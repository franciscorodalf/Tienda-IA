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
            className="group relative cursor-pointer"
        >
            {/* Cards are brutalist/minimalist: Just image and text, no borders */}
            <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-opacity duration-700 opacity-90 group-hover:opacity-100"
                />

                {/* Overlay info on hover */}
                <div className="absolute inset-0 bg-transparent flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white text-black px-6 py-2 text-[10px] font-medium tracking-widest border border-gray-200 shadow-sm hover:border-black transition-colors">
                        QUICK VIEW
                    </button>
                </div>

                {!product.stock && (
                    <div className="absolute top-2 right-2 bg-black text-white text-[9px] font-medium px-2 py-1 uppercase tracking-widest">
                        Sold Out
                    </div>
                )}
            </div>

            <div className="mt-6 flex flex-col space-y-2">
                <h3 className="text-[11px] font-medium uppercase tracking-widest text-black group-hover:text-gray-600 transition-colors leading-snug">
                    {product.name}
                </h3>
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-500 pt-2 border-t border-gray-100">
                    <span>{product.category}</span>
                    <span className="text-black font-semibold">${product.price.toFixed(2)}</span>
                </div>
            </div>
        </motion.div>
    );
};
