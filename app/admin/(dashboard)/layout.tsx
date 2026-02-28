import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, Settings, Users, ArrowLeft, LogOut, ShoppingBag, Truck, Building2 } from 'lucide-react';
import { logoutAction } from '../login/actions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col items-start px-6 pt-12 pb-8 sticky top-0 h-screen overflow-y-auto">
                {/* Brand / Logo */}
                <div className="mb-14">
                    <h2 className="text-2xl font-bold tracking-[0.2em] text-black">AURA</h2>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mt-2 font-mono">Workspace</p>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 w-full space-y-2">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4 mt-8">Dashboard</p>
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 rounded-md transition-colors w-full"
                    >
                        <LayoutDashboard size={18} className="text-gray-500" />
                        Overview
                    </Link>

                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4 mt-8">Commerce</p>
                    <Link
                        href="/admin/inventory"
                        className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-md transition-colors w-full"
                    >
                        <Package size={18} />
                        Inventory
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-md transition-colors w-full"
                    >
                        <ShoppingBag size={18} />
                        Orders
                    </Link>
                    <Link
                        href="/admin/customers"
                        className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-md transition-colors w-full"
                    >
                        <Users size={18} />
                        Customers
                    </Link>

                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4 mt-8">Supply Chain</p>
                    <Link
                        href="/admin/suppliers"
                        className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-md transition-colors w-full"
                    >
                        <Building2 size={18} />
                        Suppliers
                    </Link>
                    <Link
                        href="/admin/purchases"
                        className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-md transition-colors w-full"
                    >
                        <Truck size={18} />
                        Purchase Orders
                    </Link>

                    <Link
                        href="#"
                        className="flex items-center justify-between px-3 py-3 text-sm font-medium text-gray-400 hover:text-black hover:bg-gray-50 rounded-md transition-colors w-full mt-2"
                    >
                        <div className="flex items-center gap-3">
                            <Settings size={18} />
                            Settings
                        </div>
                        <span className="bg-black/5 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Soon</span>
                    </Link>
                </nav>

                {/* Return Home */}
                <div className="w-full mt-auto pt-8 border-t border-gray-100 flex flex-col gap-2">
                    <form action={logoutAction} className="w-full">
                        <button type="submit" className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors">
                            <LogOut size={18} />
                            Logout Admin
                        </button>
                    </form>

                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Shop
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
