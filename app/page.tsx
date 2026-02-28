'use client';

import React, { useState } from 'react';
import { products, Product } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { Navbar } from '@/components/Navbar';
import { ProductModal } from '@/components/ProductModal';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { setIsCartOpen, itemCount } = useCart();

  // Extract unique categories
  const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-full bg-[var(--background)] text-[var(--foreground)]">

      {/* New Floating Navbar */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-end overflow-hidden pb-12 px-6">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gray-100 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center opacity-90 object-top"></div>
        </div>

        <div className="relative z-10 w-full flex flex-col items-start gap-4">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="text-4xl md:text-6xl font-light tracking-tight text-black"
          >
            STUDIO COLLECTION
          </motion.h1>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="mt-4 bg-transparent border border-black text-black px-8 py-3 uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            View Collection
          </motion.button>
        </div>
      </section>

      {/* Filters & Grid */}
      <main className="max-w-[1800px] mx-auto py-16 px-8 sm:px-16 md:px-24 lg:px-32">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">

          <div className="flex flex-wrap md:justify-center gap-8 border-b border-gray-200 pb-3 w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={clsx(
                  "text-xs uppercase tracking-widest pb-1 transition-all",
                  selectedCategory === cat
                    ? "text-black border-b border-black"
                    : "text-gray-400 hover:text-black"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-24 lg:gap-x-12">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={setSelectedProduct}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center text-gray-400 text-xs uppercase tracking-widest">
            No items found in this category
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 py-16 px-6 mt-20">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <h3 className="text-xl font-medium tracking-wide mb-4">AURA</h3>
            <p className="text-gray-500 text-xs uppercase tracking-widest max-w-xs">Contemporary minimalism. Essential pieces for your wardrobe.</p>
          </div>
          <div className="grid grid-cols-2 gap-12 text-xs uppercase tracking-widest text-gray-500">
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-black transition-colors">Instagram</a>
              <a href="#" className="hover:text-black transition-colors">TikTok</a>
              <a href="#" className="hover:text-black transition-colors">Pinterest</a>
            </div>
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-black transition-colors">Shipping</a>
              <a href="#" className="hover:text-black transition-colors">Returns</a>
              <a href="#" className="hover:text-black transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
