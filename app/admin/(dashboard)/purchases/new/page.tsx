import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { createPurchaseOrderAction } from '@/app/admin/(dashboard)/purchases/actions';

const COUNTRY_FLAG: Record<string, string> = {
    'Spain': '🇪🇸', 'Portugal': '🇵🇹', 'France': '🇫🇷',
    'Italy': '🇮🇹', 'Germany': '🇩🇪', 'Turkey': '🇹🇷',
    'Morocco': '🇲🇦', 'China': '🇨🇳', 'Vietnam': '🇻🇳', 'India': '🇮🇳',
    'Netherlands': '🇳🇱', 'Belgium': '🇧🇪', 'Poland': '🇵🇱',
    'Romania': '🇷🇴', 'USA': '🇺🇸', 'Brazil': '🇧🇷', 'Mexico': '🇲🇽',
};

export default async function NewPurchaseOrderPage({
    searchParams,
}: {
    searchParams: Promise<{ supplierId?: string }>;
}) {
    const params = await searchParams;
    const suppliers = await (prisma as any).supplier.findMany({ orderBy: { name: 'asc' } });
    const selectedSupplierId = params.supplierId || suppliers[0]?.id;

    const supplierProducts = selectedSupplierId
        ? await (prisma.product as any).findMany({
            where: { supplierId: selectedSupplierId },
            orderBy: { name: 'asc' },
        })
        : [];

    const selectedSupplier = suppliers.find((s: any) => s.id === selectedSupplierId);
    const expectedDate = new Date();
    if (selectedSupplier) {
        expectedDate.setDate(expectedDate.getDate() + selectedSupplier.leadTimeDays);
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
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">New Purchase Order</h1>
                <p className="text-sm text-gray-500 mt-1">Request new stock from a supplier</p>
            </div>

            <form action={createPurchaseOrderAction} className="space-y-6">
                {/* Supplier Selector */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">1. Select Supplier</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {suppliers.map((s: any) => {
                            const isSelected = s.id === selectedSupplierId;
                            const flag = COUNTRY_FLAG[s.country] ?? '🌍';
                            return (
                                <Link
                                    key={s.id}
                                    href={`/admin/purchases/new?supplierId=${s.id}`}
                                    className={`p-4 rounded-lg border-2 transition-all flex flex-col gap-1 ${isSelected
                                        ? 'border-gray-900 bg-gray-900 text-white'
                                        : 'border-gray-100 bg-white hover:border-gray-300 text-gray-700'
                                        }`}
                                >
                                    <span className="text-sm font-semibold">{s.name}</span>
                                    <span className={`text-xs flex items-center gap-1.5 ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                                        {flag} {s.country}
                                        <span className="mx-1">·</span>
                                        <Clock size={11} /> {s.leadTimeDays} days
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Hidden field con el supplierId seleccionado */}
                    <input type="hidden" name="supplierId" value={selectedSupplierId ?? ''} />

                    {selectedSupplier && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
                            <Clock size={14} />
                            Estimated arrival: <strong className="text-gray-800">
                                {expectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </strong>
                        </div>
                    )}
                </div>

                {/* Products for selected supplier */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">2. Products to Order</h2>

                    {supplierProducts.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">
                            {selectedSupplierId
                                ? 'This supplier has no products assigned yet.'
                                : 'Select a supplier to see their products.'}
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {supplierProducts.map((p: any) => (
                                <div key={p.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                                    {/* Product image */}
                                    <div className="w-10 h-12 bg-gray-100 flex-shrink-0 overflow-hidden rounded">
                                        {p.imageUrl && (
                                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>

                                    {/* Name + current stock */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Stock actual:&nbsp;
                                            <span className={`font-semibold ${p.stockQuantity <= p.stockAlert ? 'text-red-600' : 'text-gray-600'}`}>
                                                {p.stockQuantity} uds
                                            </span>
                                        </p>
                                    </div>

                                    {/* Unit cost input — usa p.id como clave */}
                                    <div className="flex flex-col items-end gap-1">
                                        <label className="text-[10px] text-gray-400 uppercase tracking-widest">Coste/ud (€)</label>
                                        <input
                                            type="number"
                                            name={`cost_${p.id}`}
                                            min="0"
                                            step="0.01"
                                            defaultValue={(p.price * 0.5).toFixed(2)}
                                            className="w-24 text-sm text-right border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-gray-900"
                                        />
                                    </div>

                                    {/* Quantity input */}
                                    <div className="flex flex-col items-end gap-1">
                                        <label className="text-[10px] text-gray-400 uppercase tracking-widest">Cantidad</label>
                                        <input
                                            type="number"
                                            name={`qty_${p.id}`}
                                            min="0"
                                            defaultValue={0}
                                            className="w-20 text-sm text-center border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-gray-900"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">3. Notes (optional)</h2>
                    <textarea
                        name="notes"
                        rows={3}
                        placeholder="Any special instructions for this order..."
                        className="w-full text-sm border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-900 resize-none text-gray-700 placeholder:text-gray-300"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={supplierProducts.length === 0}
                    className="w-full bg-gray-900 text-white py-3.5 text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Create Purchase Order
                </button>
            </form>
        </div>
    );
}
