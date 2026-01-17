import React from 'react';
import { Product } from '@/lib/data';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                {!product.stock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Agotado
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="text-xs text-gray-700 mb-1 uppercase tracking-wide font-medium">{product.category}</div>
                <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2 group-hover:text-black">{product.name}</h3>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-900 hover:bg-black hover:text-white transition-colors"
                        aria-label="Añadir al carrito"
                    >
                        <ShoppingBag size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
