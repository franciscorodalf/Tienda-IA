import Link from 'next/link';

export const metadata = {
    title: 'AURA Admin',
    description: 'SaaS Dashboard',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F7F7F8] text-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <span className="font-bold tracking-widest text-lg">AURA<span className="text-gray-400 font-normal">SaaS</span></span>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link href="/admin" className="block px-3 py-2 bg-gray-100 rounded-md font-medium text-sm">Dashboard</Link>
                    <Link href="/admin/products" className="block px-3 py-2 hover:bg-gray-50 text-gray-600 rounded-md font-medium text-sm transition-colors">Products</Link>
                    <Link href="/admin/orders" className="block px-3 py-2 hover:bg-gray-50 text-gray-600 rounded-md font-medium text-sm transition-colors">Orders</Link>
                    <Link href="/admin/customers" className="block px-3 py-2 hover:bg-gray-50 text-gray-600 rounded-md font-medium text-sm transition-colors">Customers</Link>
                    <Link href="/admin/settings" className="block px-3 py-2 hover:bg-gray-50 text-gray-600 rounded-md font-medium text-sm transition-colors">Settings</Link>
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <Link href="/" className="block px-3 py-2 text-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">← Back to Store</Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
                    <h2 className="text-lg font-medium">Overview</h2>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            AD
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
