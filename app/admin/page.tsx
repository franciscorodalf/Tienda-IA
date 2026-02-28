export default function AdminDashboard() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Good morning, Admin</h1>
                    <p className="text-gray-500 text-sm mt-1">Here's what's happening with your store today.</p>
                </div>
                <button className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
                    Download Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric Card 1 */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <span className="text-gray-500 text-sm font-medium">Total Revenue</span>
                    <div className="mt-4 flex items-baseline space-x-2">
                        <span className="text-3xl font-bold tracking-tight">$45,231.89</span>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+20.1%</span>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">from last month</span>
                </div>

                {/* Metric Card 2 */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <span className="text-gray-500 text-sm font-medium">Sales</span>
                    <div className="mt-4 flex items-baseline space-x-2">
                        <span className="text-3xl font-bold tracking-tight">+2,350</span>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+10.5%</span>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">from last month</span>
                </div>

                {/* Metric Card 3 */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <span className="text-gray-500 text-sm font-medium">Active Users</span>
                    <div className="mt-4 flex items-baseline space-x-2">
                        <span className="text-3xl font-bold tracking-tight">+1,244</span>
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">-3.2%</span>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">from last month</span>
                </div>
            </div>

            {/* Dummy charts / tables area */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                    <button className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">View all</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 bg-gray-50/50 uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <tr className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                                <td className="px-6 py-4 font-medium text-gray-900 group-hover:text-black">#ORD-6721</td>
                                <td className="px-6 py-4 text-gray-600">Alice Smith</td>
                                <td className="px-6 py-4">
                                    <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-xs font-medium">Completed</span>
                                </td>
                                <td className="px-6 py-4 text-gray-900 font-medium text-right">$129.00</td>
                            </tr>
                            <tr className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                                <td className="px-6 py-4 font-medium text-gray-900 group-hover:text-black">#ORD-6722</td>
                                <td className="px-6 py-4 text-gray-600">Bob Jones</td>
                                <td className="px-6 py-4">
                                    <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-full text-xs font-medium">Processing</span>
                                </td>
                                <td className="px-6 py-4 text-gray-900 font-medium text-right">$89.50</td>
                            </tr>
                            <tr className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                                <td className="px-6 py-4 font-medium text-gray-900 group-hover:text-black">#ORD-6723</td>
                                <td className="px-6 py-4 text-gray-600">Charlie Doe</td>
                                <td className="px-6 py-4">
                                    <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-xs font-medium">Completed</span>
                                </td>
                                <td className="px-6 py-4 text-gray-900 font-medium text-right">$215.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
