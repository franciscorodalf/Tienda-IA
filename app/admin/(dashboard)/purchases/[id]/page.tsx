

import { advancePOStatusAction } from '@/app/admin/(dashboard)/purchases/actions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle2, Send, Package, Truck } from 'lucide-react';
import { redirect } from 'next/navigation';

type POStatus = 'DRAFT' | 'SENT' | 'CONFIRMED' | 'RECEIVED';

const STEPS: { status: POStatus; label: string; icon: any }[] = [
    { status: 'DRAFT', label: 'Borrador', icon: Package },
    { status: 'SENT', label: 'Enviado', icon: Send },
    { status: 'CONFIRMED', label: 'Confirmado', icon: Clock },
    { status: 'RECEIVED', label: 'Recibido', icon: CheckCircle2 },
];

const BUTTON_LABELS: Record<string, string> = {
    DRAFT: 'Marcar como Enviado al Proveedor',
    SENT: 'Marcar como Confirmado',
    CONFIRMED: 'Confirmar Recepción de Mercancía',
};

export default async function PurchaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const po = await (prisma as any).purchaseOrder.findUnique({
        where: { id },
        include: {
            supplier: true,
            items: { include: { product: true } },
        },
    });

    if (!po) redirect('/admin/purchases');

    const currentStepIndex = STEPS.findIndex(s => s.status === po.status);
    const isCompleted = po.status === 'RECEIVED';
    const totalCost = po.items.reduce(
        (acc: number, i: any) => acc + i.unitCost * i.quantityOrdered,
        0
    );

    async function handleAdvance() {
        'use server';
        await advancePOStatusAction(id, po.status);
    }

    return (
        <div className="space-y-8 max-w-3xl">
            {/* Header */}
            <div>
                <Link
                    href="/admin/purchases"
                    className="text-sm text-gray-500 hover:text-black flex items-center gap-1.5 mb-5 transition-colors"
                >
                    <ArrowLeft size={14} /> Back to Purchase Orders
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                            Purchase Order <span className="font-mono text-gray-400 text-lg">#{po.id.slice(-6).toUpperCase()}</span>
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {po.supplier.name} · {po.supplier.country}
                            {po.expectedAt && (
                                <span className="ml-3 text-gray-400">
                                    <Clock size={12} className="inline mr-1" />
                                    Llegada est. {new Date(po.expectedAt).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                    })}
                                </span>
                            )}
                        </p>
                    </div>
                    {isCompleted && (
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                            <CheckCircle2 size={15} /> Completado
                        </span>
                    )}
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Estado del Pedido</h2>
                <div className="flex items-center gap-0">
                    {STEPS.map((step, idx) => {
                        const isDone = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;
                        const Icon = step.icon;
                        return (
                            <div key={step.status} className="flex items-center flex-1 last:flex-none">
                                <div className={`flex flex-col items-center gap-1.5`}>
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isDone
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-300'
                                        } ${isCurrent ? 'ring-4 ring-gray-200' : ''}`}>
                                        <Icon size={16} />
                                    </div>
                                    <span className={`text-[10px] font-semibold uppercase tracking-widest ${isDone ? 'text-gray-700' : 'text-gray-300'}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {idx < STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 mb-4 ${idx < currentStepIndex ? 'bg-gray-900' : 'bg-gray-100'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Advance Button */}
                {!isCompleted && (
                    <form action={handleAdvance} className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-3 text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            {BUTTON_LABELS[po.status] || 'Avanzar estado'}
                        </button>
                        {po.status === 'CONFIRMED' && (
                            <p className="text-xs text-center text-gray-400 mt-2">
                                Al confirmar, el stock se actualizara automaticamente en Inventario
                            </p>
                        )}
                    </form>
                )}
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Productos Pedidos</h2>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-50 bg-gray-50 text-xs uppercase tracking-widest text-gray-400">
                            <th className="px-6 py-3">Producto</th>
                            <th className="px-6 py-3 text-right">Cantidad</th>
                            <th className="px-6 py-3 text-right">Coste/ud</th>
                            <th className="px-6 py-3 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {po.items.map((item: any) => (
                            <tr key={item.id} className="border-b border-gray-50">
                                <td className="px-6 py-3">
                                    <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                                    <p className="text-xs text-gray-400">{item.product.productId}</p>
                                </td>
                                <td className="px-6 py-3 text-right text-sm text-gray-700">{item.quantityOrdered} uds</td>
                                <td className="px-6 py-3 text-right text-sm text-gray-700">€{item.unitCost.toFixed(2)}</td>
                                <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                                    €{(item.unitCost * item.quantityOrdered).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t border-gray-100 bg-gray-50">
                            <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-gray-500 text-right uppercase tracking-widest">Total Cost</td>
                            <td className="px-6 py-3 text-right text-base font-bold text-gray-900">€{totalCost.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Notes */}
            {po.notes && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-yellow-700 mb-2">Notas</p>
                    <p className="text-sm text-yellow-800">{po.notes}</p>
                </div>
            )}
        </div>
    );
}
