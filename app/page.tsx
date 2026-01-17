'use client';

import React, { useState } from 'react';
import { products, Product } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { Navbar } from '@/components/Navbar';
import { ProductModal } from '@/components/ProductModal';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { setIsCartOpen, itemCount } = useCart();

  // Extract unique categories
  const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter products
  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-full bg-[var(--background)] text-[var(--foreground)]">

      {/* New Floating Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {/* Abstract/Dark Video or Image Background */}
          <div className="w-full h-full bg-neutral-900 bg-[url('https://images.unsplash.com/photo-1594968155916-2f7823e2006e?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-transparent"></div>
        </div>

        <div className="relative z-10 text-center flex flex-col items-center gap-6 px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none"
          >
            Chaos<br />Theory
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-lg uppercase tracking-[0.3em] text-gray-400 max-w-md"
          >
            Fall / Winter 2026 Collection
          </motion.p>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 bg-white text-black px-10 py-4 uppercase font-bold tracking-widest text-sm hover:scale-105 transition-transform"
          >
            Shop Now
          </motion.button>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-white text-black py-3 overflow-hidden whitespace-nowrap border-y border-black">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-12 text-6xl font-black uppercase tracking-tighter opacity-80"
        >
          {Array(10).fill("New Drop Available Now • ").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </motion.div>
      </div>

      {/* Filters & Grid */}
      <main className="max-w-[1800px] mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold uppercase tracking-tighter mb-2">Inventory</h2>
            <p className="text-gray-500 uppercase tracking-widest text-xs">Only limited pieces available</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={clsx(
                  "px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all",
                  selectedCategory === cat
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-gray-500 border-gray-800 hover:border-gray-600 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={setSelectedProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center text-gray-600 uppercase tracking-widest">
            No items found in this category
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--muted)] py-20 px-6">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <h3 className="text-2xl font-bold uppercase tracking-tighter mb-4">Tienda.IA</h3>
            <p className="text-gray-500 text-sm max-w-xs">Futuristic streetwear powered by artificial intelligence. Redefining digital commerce.</p>
          </div>
          <div className="grid grid-cols-2 gap-12 text-sm uppercase tracking-wide text-gray-500">
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-white">Instagram</a>
              <a href="#" className="hover:text-white">TikTok</a>
              <a href="#" className="hover:text-white">Twitter</a>
            </div>
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-white">Shipping</a>
              <a href="#" className="hover:text-white">Returns</a>
              <a href="#" className="hover:text-white">FAQ</a>
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
