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
                    CUSTOMERS <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{customers.length} REGISTRATIONS</span>
                </h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-mono">
                    View and manage your user base
                </p>
            </header>

            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-[9px] uppercase tracking-[0.2em] text-gray-400">
                            <th className="px-6 py-4 font-bold">User</th>
                            <th className="px-6 py-4 font-bold">Role</th>
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
                                            <UserCircle size={28} className="text-gray-300" />
                                            <div>
                                                <p className="text-xs font-bold text-black uppercase">{c.name}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{c.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[9px] font-bold px-2 py-1 uppercase tracking-widest ${c.role === 'ADMIN' ? 'text-purple-700 bg-purple-50' : 'text-gray-700 bg-gray-100'
                                            }`}>
                                            {c.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-black flex items-center gap-2">
                                            <ShoppingBag size={14} className="text-gray-400" />
                                            {c.orders.length}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-light text-black">
                                            €{ltv.toFixed(2)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {customers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <UserCircle size={40} className="text-gray-300 mb-4 mx-auto" />
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">No customers registered yet.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
