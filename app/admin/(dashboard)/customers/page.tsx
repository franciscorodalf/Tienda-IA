import React from 'react';
import { prisma } from '@/lib/prisma';
import { UserCircle, ShoppingBag } from 'lucide-react';

export default async function CustomersPage() {
    const customers = await prisma.customer.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            orders: true
        }
    });

    return (
        <div className="animate-fade-in">
            <header className="mb-12">
                <h1 className="text-3xl font-light tracking-tight text-black flex items-center gap-3">
                    CUSTOMERS <span className="text-sm bg-black text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">{customers.length} REGISTRATIONS</span>
                </h1>
                <p className="text-sm text-gray-500 uppercase tracking-widest mt-2 font-mono">
                    View and manage your user base
                </p>
            </header>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-[0.2em] text-gray-500">
                            <th className="px-6 py-4 font-bold">User</th>
                            <th className="px-6 py-4 font-bold">Joined</th>
                            <th className="px-6 py-4 font-bold">Total Orders</th>
                            <th className="px-6 py-4 font-bold text-right">Lifetime Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((c) => {
                            const ltv = c.orders.reduce((acc, order) => acc + order.total, 0);

                            return (
                                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <UserCircle size={32} className="text-gray-400" />
                                            <div>
                                                <p className="text-base font-bold text-black uppercase">{c.name}</p>
                                                <p className="text-sm text-gray-500 mt-1">{c.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600 uppercase tracking-widest font-medium">
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-base font-bold text-black flex items-center gap-2">
                                            <ShoppingBag size={18} className="text-gray-500" />
                                            {c.orders.length}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-base font-medium text-black">
                                            €{ltv.toFixed(2)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {customers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-20 text-center">
                                    <UserCircle size={40} className="text-gray-300 mb-4 mx-auto" />
                                    <p className="text-sm uppercase tracking-widest text-gray-500 font-bold">No customers registered yet.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
