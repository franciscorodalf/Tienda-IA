import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { createProductAction } from '../actions';

export default function NewProductPage() {
    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <header className="mb-12">
                <Link href="/admin/inventory" className="text-xs text-gray-500 hover:text-black uppercase tracking-widest font-bold flex items-center gap-2 mb-6 transition-colors">
                    <ArrowLeft size={14} /> Back to Inventory
                </Link>
                <h1 className="text-3xl font-light tracking-tight text-black flex items-center gap-3">
                    NEW PRODUCT
                </h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-mono">
                    Add a new item to your store
                </p>
            </header>

            <form action={createProductAction} className="space-y-8 bg-white p-8 border border-gray-100 shadow-sm">
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Product Name</label>
                        <input type="text" name="name" required className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="e.g. Minimalist Cotton Tee" />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Product ID / SKU</label>
                        <input type="text" name="productId" required className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="e.g. TEE-001" />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Price (EUR)</label>
                        <input type="number" step="0.01" name="price" required className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="e.g. 29.99" />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
                    <textarea name="description" rows={4} required className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none" placeholder="Brief product description..."></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6 items-center">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Category</label>
                        <select name="category" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors">
                            <option value="tops">Tops</option>
                            <option value="bottoms">Bottoms</option>
                            <option value="accessories">Accessories</option>
                            <option value="outerwear">Outerwear</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Image URL (Optional)</label>
                    <input type="url" name="imageUrl" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="https://..." />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <input type="checkbox" id="stock" name="stock" defaultChecked className="w-4 h-4 text-black border-gray-300 focus:ring-black" />
                    <label htmlFor="stock" className="text-xs uppercase tracking-widest font-bold text-black">Product is currently in stock</label>
                </div>

                <button type="submit" className="w-full bg-black text-white px-5 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/90 transition-colors mt-8">
                    <Save size={16} /> Save Product
                </button>
            </form>
        </div>
    );
}
