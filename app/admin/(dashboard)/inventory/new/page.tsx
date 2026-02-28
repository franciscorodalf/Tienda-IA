import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { createProductAction } from '@/app/admin/(dashboard)/inventory/actions';

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
                {/* Aviso de auto-generación de SKU */}
                <div className="bg-gray-50 border border-gray-100 px-4 py-3 flex items-center gap-3">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Product SKU</span>
                    <span className="text-[9px] text-gray-400 font-mono">— Se generará automáticamente al guardar</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Product Name</label>
                        <input type="text" name="name" required className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="e.g. Minimalist Cotton Tee" />
                    </div>

                    <div className="col-span-2">
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
                            <option value="shoes">Shoes</option>
                            <option value="bags">Bags</option>
                        </select>
                    </div>
                </div>

                {/* Colors, Sizes, Features */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Colors <span className="normal-case text-gray-300 font-normal">(separados por coma, ej: Negro, Blanco, Rojo)</span>
                        </label>
                        <input type="text" name="colors" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="Negro, Blanco, Gris" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Sizes <span className="normal-case text-gray-300 font-normal">(separados por coma, ej: XS, S, M, L, XL)</span>
                        </label>
                        <input type="text" name="sizes" defaultValue="XS, S, M, L, XL" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="XS, S, M, L, XL" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Features / Details <span className="normal-case text-gray-300 font-normal">(separados por coma, opcionales)</span>
                        </label>
                        <input type="text" name="features" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="100% algodón, Corte regular, Lavable a máquina" />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Image URL (Optional)</label>
                    <input type="url" name="imageUrl" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="https://..." />
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                    <div className="flex-1">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Stock Inicial (unidades)</label>
                        <input type="number" name="stockQuantity" min="0" defaultValue="10" className="w-full bg-gray-50 border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                    </div>
                </div>

                <button type="submit" className="w-full bg-black text-white px-5 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black/90 transition-colors mt-8">
                    <Save size={16} /> Save Product
                </button>
            </form>
        </div>
    );
}
