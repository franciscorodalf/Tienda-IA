'use client';

import React, { useState } from 'react';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import clsx from 'clsx';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Extract unique categories
  const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter products
  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full lg:hidden text-gray-900">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">T</div>
              <span className="text-xl font-bold tracking-tight text-gray-900">Tienda.IA</span>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-black transition-colors" size={18} />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/10 transition-all outline-none text-gray-900 placeholder:text-gray-500 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full relative text-gray-900">
              <ShoppingCart size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-black rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
              <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Banner */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Novedades</h1>
          <p className="text-gray-700 font-medium">Descubre las últimas tendencias de la temporada.</p>
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto pb-6 gap-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                selectedCategory === cat
                  ? "bg-black text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500">
              <p>No se encontraron productos en esta categoría.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
