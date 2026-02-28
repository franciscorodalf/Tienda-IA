import DashboardChart from '@/components/admin/DashboardChart';
import { ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Buenos días, Admin</h1>
                    <p className="text-gray-500 text-sm mt-1">Aquí tienes el resumen de tu tienda de hoy.</p>
                </div>
                <button className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm flex items-center space-x-2">
                    <Download size={16} />
                    <span>Descargar Reporte</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric Card 1 */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <span className="text-gray-500 text-sm font-medium">Ingresos Totales</span>
                    <div className="mt-4 flex items-baseline space-x-2">
                        <span className="text-3xl font-bold tracking-tight">$45,231.89</span>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center">
                            <ArrowUpRight size={12} className="mr-1" /> 20.1%
                        </span>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">desde el mes pasado</span>
                </div>

                {/* Metric Card 2 */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <span className="text-gray-500 text-sm font-medium">Ventas</span>
                    <div className="mt-4 flex items-baseline space-x-2">
                        <span className="text-3xl font-bold tracking-tight">+2,350</span>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center">
                            <ArrowUpRight size={12} className="mr-1" /> 10.5%
                        </span>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">desde el mes pasado</span>
                </div>

                {/* Metric Card 3 */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <span className="text-gray-500 text-sm font-medium">Usuarios Activos</span>
                    <div className="mt-4 flex items-baseline space-x-2">
                        <span className="text-3xl font-bold tracking-tight">+1,244</span>
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex items-center">
                            <ArrowDownRight size={12} className="mr-1" /> 3.2%
                        </span>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">desde el mes pasado</span>
                </div>
            </div>

            {/* Chart Area */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900">Resumen de Ventas</h3>
                <p className="text-xs text-gray-400 mt-1">Evolución de ventas en los últimos meses (simulado).</p>
                <DashboardChart />
            </div>
        </div>
    );
}
