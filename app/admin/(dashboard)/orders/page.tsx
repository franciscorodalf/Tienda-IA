import React from 'react';
import { prisma } from '@/lib/prisma';
import { Truck, Package, Euro, ArrowRight, XCircle } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            customer: true,
            items: {
                include: { product: true }
            }
        }
    });

    async function updateStatus(id: string, formData: FormData) {
        'use server';
        const status = formData.get('status') as string;
        await prisma.order.update({
            where: { id },
            data: { status }
        });
        revalidatePath('/admin/orders');
    }

    return (
        <div className="animate-fade-in">
            <header className="mb-12">
                <h1 className="text-3xl font-light tracking-tight text-black flex items-center gap-3">
                    ORDERS <span className="text-sm bg-black text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">{orders.length} TOTAL</span>
                </h1>
                <p className="text-sm text-gray-500 uppercase tracking-widest mt-2 font-mono">
                    Track and fulfill customer purchases
                </p>
            </header>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-[0.2em] text-gray-500">
                            <th className="px-6 py-4 font-bold">Order ID</th>
                            <th className="px-6 py-4 font-bold">Customer</th>
                            <th className="px-6 py-4 font-bold">Date</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold">Total</th>
                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o) => (
                            <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-black uppercase tracking-widest">#{o.id.slice(-6)}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-base font-bold text-black uppercase">{o.customer.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">{o.customer.email}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600 uppercase tracking-widest font-medium">{new Date(o.createdAt).toLocaleDateString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <form action={updateStatus.bind(null, o.id)}>
                                        <select
                                            name="status"
                                            defaultValue={o.status}
                                            onChange={(e) => e.target.form?.requestSubmit()}
                                            className={`text-sm font-bold px-3 py-2 uppercase tracking-widest cursor-pointer outline-none rounded-md ${o.status === 'DELIVERED' ? 'text-green-800 bg-green-100' :
                                                o.status === 'SHIPPED' ? 'text-blue-800 bg-blue-100' :
                                                    o.status === 'CANCELLED' ? 'text-red-800 bg-red-100' :
                                                        'text-yellow-800 bg-yellow-100'
                                                }`}
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="PAID">PAID</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                        </select>
                                    </form>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-base font-medium text-black flex items-center gap-1">
                                        <Euro size={16} className="text-gray-500" />
                                        {o.total.toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-sm text-gray-600 uppercase tracking-widest font-medium">
                                        {o.items.length} items
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-20 text-center">
                                    <Package size={40} className="text-gray-300 mb-4 mx-auto" />
                                    <p className="text-sm uppercase tracking-widest text-gray-500 font-bold">No orders yet.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
