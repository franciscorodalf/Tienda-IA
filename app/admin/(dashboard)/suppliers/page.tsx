import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Globe, Clock, Mail, Package, Trash2, Plus } from 'lucide-react';
import { createSupplierAction, deleteSupplierAction } from './actions';

const COUNTRY_FLAG: Record<string, string> = {
    'Spain': '🇪🇸', 'Portugal': '🇵🇹', 'France': '🇫🇷', 'Italy': '🇮🇹',
    'Germany': '🇩🇪', 'Netherlands': '🇳🇱', 'Belgium': '🇧🇪',
    'Turkey': '🇹🇷', 'Morocco': '🇲🇦', 'Poland': '🇵🇱', 'Romania': '🇷🇴',
    'China': '🇨🇳', 'Vietnam': '🇻🇳', 'India': '🇮🇳', 'Bangladesh': '🇧🇩',
    'USA': '🇺🇸', 'Brazil': '🇧🇷', 'Mexico': '🇲🇽',
};

const COUNTRIES = Object.keys(COUNTRY_FLAG);

function getLeadTimeBadge(days: number) {
    if (days <= 4) return 'text-green-700 bg-green-50 border-green-100';
    if (days <= 8) return 'text-yellow-700 bg-yellow-50 border-yellow-100';
    return 'text-red-700 bg-red-50 border-red-100';
}

export default async function SuppliersPage() {
    const suppliers = await (prisma as any).supplier.findMany({
        include: {
            _count: { select: { products: true, purchaseOrders: true } },
        },
        orderBy: { name: 'asc' },
    });

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Suppliers</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''} registered
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ── LEFT: Supplier List ── */}
                <div className="lg:col-span-2 space-y-4">
                    {suppliers.length === 0 && (
                        <div className="bg-white border border-dashed border-gray-200 rounded-xl py-16 flex flex-col items-center text-center">
                            <Globe size={36} className="text-gray-200 mb-3" />
                            <p className="text-sm text-gray-400 font-medium">No suppliers yet.</p>
                            <p className="text-xs text-gray-300 mt-1">Add your first supplier using the form →</p>
                        </div>
                    )}

                    {suppliers.map((s: any) => {
                        const badgeClass = getLeadTimeBadge(s.leadTimeDays);
                        const flag = COUNTRY_FLAG[s.country] ?? '🌍';
                        return (
                            <div
                                key={s.id}
                                className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h2 className="text-base font-semibold text-gray-900">{s.name}</h2>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badgeClass}`}>
                                                <Clock size={10} /> {s.leadTimeDays} days
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                            <Globe size={12} className="text-gray-400 flex-shrink-0" />
                                            {flag} {s.country}
                                        </p>

                                        {s.contactEmail && (
                                            <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-1 truncate">
                                                <Mail size={12} className="flex-shrink-0" />
                                                {s.contactEmail}
                                            </p>
                                        )}
                                    </div>

                                    {/* Delete Button */}
                                    <form
                                        action={async () => {
                                            'use server';
                                            await deleteSupplierAction(s.id);
                                        }}
                                    >
                                        <button
                                            type="submit"
                                            title="Delete supplier"
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </form>
                                </div>

                                {/* Footer stats */}
                                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50">
                                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                        <Package size={13} className="text-gray-300" />
                                        <strong className="text-gray-700">{s._count.products}</strong> products
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        <strong className="text-gray-700">{s._count.purchaseOrders}</strong> purchase orders
                                    </span>
                                    <Link
                                        href={`/admin/purchases/new?supplierId=${s.id}`}
                                        className="ml-auto text-xs font-medium text-gray-500 hover:text-black underline underline-offset-2 transition-colors"
                                    >
                                        Create PO →
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── RIGHT: Add Supplier Form ── */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 sticky top-6">
                        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Plus size={15} /> New Supplier
                        </h2>

                        <form action={createSupplierAction} className="space-y-4">

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="e.g. NordStyle GmbH"
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 transition-colors text-gray-800 placeholder:text-gray-300"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                                    Contact Email
                                </label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    placeholder="orders@supplier.com"
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 transition-colors text-gray-800 placeholder:text-gray-300"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                                    Country *
                                </label>
                                <select
                                    name="country"
                                    required
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 transition-colors text-gray-800 bg-white"
                                >
                                    <option value="">— Select a country —</option>
                                    {COUNTRIES.map(c => (
                                        <option key={c} value={c}>
                                            {COUNTRY_FLAG[c]} {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                                    Custom Lead Time (days)
                                </label>
                                <input
                                    type="number"
                                    name="customLeadTime"
                                    min="1"
                                    max="90"
                                    placeholder="Auto from country"
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-900 transition-colors text-gray-800 placeholder:text-gray-300"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">
                                    Leave blank to use the default lead time for the selected country.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white py-2.5 text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors mt-2"
                            >
                                Add Supplier
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
