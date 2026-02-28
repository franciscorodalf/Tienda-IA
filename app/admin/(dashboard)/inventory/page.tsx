import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Image as ImageIcon, Box, Euro, Trash2 } from 'lucide-react';
import { deleteProductAction } from './actions';

export default async function InventoryPage() {
    // Al ser Server Component, traemos la BD sin latencias de frontend
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="animate-fade-in">
            <header className="mb-12 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-black flex items-center gap-3">
                        INVENTORY <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{products.length} Items</span>
                    </h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-mono">
                        Manage your products catalog & stock
                    </p>
                </div>
                <Link href="/admin/inventory/new" className="flex items-center gap-2 bg-black hover:bg-black/80 transition-colors text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest">
                    <Plus size={14} /> New Product
                </Link>
            </header>

            {/* Inventory Table Container */}
            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-[9px] uppercase tracking-[0.2em] text-gray-400">
                            <th className="px-6 py-4 font-bold">Product Name</th>
                            <th className="px-6 py-4 font-bold">ID</th>
                            <th className="px-6 py-4 font-bold">Category</th>
                            <th className="px-6 py-4 font-bold">Price</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-12 bg-gray-100 flex-shrink-0">
                                            {p.imageUrl ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover grayscale opacity-90" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={14} /></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-black uppercase">{p.name}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 line-clamp-1 max-w-xs">{p.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-1">{p.productId}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">{p.category}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-light text-black flex items-center gap-1">
                                        <Euro size={12} className="text-gray-400" />
                                        {p.price.toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {p.stock ? (
                                        <span className="text-[9px] font-bold text-green-700 bg-green-50 px-2 py-1 uppercase tracking-widest flex items-center gap-1 w-max">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1"></span> In Stock
                                        </span>
                                    ) : (
                                        <span className="text-[9px] font-bold text-red-700 bg-red-50 px-2 py-1 uppercase tracking-widest flex items-center gap-1 w-max">
                                            Out of Stock
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button className="text-[10px] uppercase font-bold text-gray-400 hover:text-black hover:underline tracking-widest">
                                            Edit
                                        </button>
                                        <form action={deleteProductAction.bind(null, p.id)}>
                                            <button type="submit" className="text-red-400 hover:text-red-600 transition-colors" title="Delete Product">
                                                <Trash2 size={14} />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="w-full py-20 flex flex-col items-center justify-center">
                        <Box size={40} className="text-gray-300 mb-4" />
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">No products found in DB.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
