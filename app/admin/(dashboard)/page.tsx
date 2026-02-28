import { prisma } from '@/lib/prisma';
import DashboardChart from '@/components/admin/DashboardChart';
import { Package, ShoppingCart, Users, AlertTriangle, Download } from 'lucide-react';

export default async function AdminDashboard() {
    // Datos reales desde la BD
    const [totalProducts, outOfStockProducts] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { stockQuantity: { lte: 5 } } }),
    ]);

    // Order y Customer pueden no estar en el cliente de Prisma si aún no se regeneró
    let totalOrders = 0;
    let totalCustomers = 0;
    try {
        totalOrders = await (prisma as any).order.count();
        totalCustomers = await (prisma as any).customer.count();
    } catch {
        // Los modelos aún no están disponibles; valores por defecto: 0
    }

    // Valor total estimado del inventario (suma de precio × stock de cada producto)
    const inStockProducts = await prisma.product.findMany({
        where: { stockQuantity: { gt: 0 } },
    });
    const inventoryValue = inStockProducts.reduce(
        (acc: number, p) => acc + p.price * p.stockQuantity,
        0
    );

    const stats = [
        {
            label: 'Productos en Catálogo',
            value: totalProducts,
            icon: Package,
            note: `${outOfStockProducts} sin stock`,
            alert: outOfStockProducts > 0,
        },
        {
            label: 'Pedidos Totales',
            value: totalOrders,
            icon: ShoppingCart,
            note: 'Histórico completo',
            alert: false,
        },
        {
            label: 'Clientes Registrados',
            value: totalCustomers,
            icon: Users,
            note: 'En base de datos',
            alert: false,
        },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">Buenos días, Admin</h1>
                    <p className="text-gray-500 text-base mt-1">Aquí tienes el resumen de tu tienda.</p>
                </div>
                <button className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm flex items-center space-x-2">
                    <Download size={16} />
                    <span>Descargar Reporte</span>
                </button>
            </div>

            {/* Alertas */}
            {outOfStockProducts > 0 && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-700">
                    <AlertTriangle size={16} className="flex-shrink-0" />
                    <span>
                        <strong>{outOfStockProducts} producto{outOfStockProducts > 1 ? 's' : ''}</strong> sin stock. Revisa el inventario.
                    </span>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Valor del inventario — card especial */}
                <div className="md:col-span-1 bg-gray-900 text-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
                    <span className="text-gray-400 text-sm font-medium">Valor Inventario</span>
                    <div className="mt-4">
                        <span className="text-3xl font-bold tracking-tight">
                            €{inventoryValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <span className="text-sm text-gray-500 mt-2">Suma de productos en stock</span>
                </div>

                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
                            <stat.icon size={18} className="text-gray-300" />
                        </div>
                        <div className="mt-4 flex items-baseline space-x-2">
                            <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
                        </div>
                        <span className={`text-xs mt-2 font-medium ${stat.alert ? 'text-red-500' : 'text-gray-400'}`}>
                            {stat.note}
                        </span>
                    </div>
                ))}
            </div>

            {/* Chart Area */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Resumen de Ventas</h3>
                <p className="text-sm text-gray-500 mt-1">
                    {totalOrders === 0
                        ? 'Aún no hay pedidos registrados. Aquí aparecerá la evolución cuando los haya.'
                        : `Evolución de los ${totalOrders} pedidos registrados.`}
                </p>
                <DashboardChart />
            </div>
        </div>
    );
}

