'use client';

import { useState } from 'react';
import { loginAction } from './actions';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await loginAction(null, formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8]">
            <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-2xl font-bold tracking-widest text-center">AURA<span className="text-gray-400 font-normal">SaaS</span></h1>
                    </Link>
                </div>

                <h2 className="text-lg font-semibold text-center text-gray-900 mb-6">Iniciar Sesión</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-medium mb-6 flex items-center justify-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="admin@aura.com"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-gray-50 focus:bg-white text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-gray-50 focus:bg-white text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white rounded-lg py-2.5 px-4 font-medium hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <span>Entrar</span>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-gray-400">
                    Esta área es de uso exclusivo para el personal de administración.
                </p>
            </div>
        </div>
    );
}
