import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Clock, CheckCircle, Send, Package } from 'lucide-react';

type POStatus = 'DRAFT' | 'SENT' | 'CONFIRMED' | 'RECEIVED';

const STATUS_CONFIG: Record<POStatus, { label: string; color: string }> = {
    DRAFT: { label: 'Borrador', color: 'text-gray-600 bg-gray-100' },
    SENT: { label: 'Enviado', color: 'text-blue-700 bg-blue-50' },
    CONFIRMED: { label: 'Confirmado', color: 'text-yellow-700 bg-yellow-50' },
    RECEIVED: { label: 'Recibido', color: 'text-green-700 bg-green-50' },
};

export default async function PurchasesPage() {
    const pos = await (prisma as any).purchaseOrder.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            supplier: true,
            items: { include: { product: true } },
        },
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Purchase Orders</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Track supplier orders and restock your inventory
                    </p>
                </div>
                <Link
                    href="/admin/purchases/new"
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 transition-colors text-white px-4 py-2.5 text-sm font-medium rounded-md"
                >
                    <Plus size={16} /> New Purchase Order
                </Link>
            </div>

            {/* PO Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-widest text-gray-400 font-bold">
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Supplier</th>
                            <th className="px-6 py-4">Items</th>
                            <th className="px-6 py-4">Expected</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pos.map((po: any) => {
                            const cfg = STATUS_CONFIG[po.status as POStatus] ?? STATUS_CONFIG.DRAFT;
                            const totalUnits = po.items.reduce((acc: number, i: any) => acc + i.quantityOrdered, 0);
                            return (
                                <tr key={po.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            #{po.id.slice(-6).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-gray-900">{po.supplier.name}</p>
                                        <p className="text-xs text-gray-400">{po.supplier.country}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">
                                            {po.items.length} SKUs · {totalUnits} uds
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {po.expectedAt ? (
                                            <span className="text-sm text-gray-700 flex items-center gap-1">
                                                <Clock size={13} className="text-gray-400" />
                                                {new Date(po.expectedAt).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                })}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                                            {cfg.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {po.status !== 'RECEIVED' && (
                                            <Link
                                                href={`/admin/purchases/${po.id}`}
                                                className="text-sm font-medium text-gray-600 hover:text-black underline underline-offset-2 transition-colors"
                                            >
                                                Manage →
                                            </Link>
                                        )}
                                        {po.status === 'RECEIVED' && (
                                            <span className="text-sm text-green-600 flex items-center justify-end gap-1 font-medium">
                                                <CheckCircle size={14} /> Completado
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {pos.length === 0 && (
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                        <Package size={40} className="text-gray-200 mb-4" />
                        <p className="text-sm font-medium text-gray-400">No purchase orders yet.</p>
                        <Link
                            href="/admin/purchases/new"
                            className="mt-4 text-sm text-gray-600 hover:text-black underline underline-offset-2"
                        >
                            Create your first PO →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
