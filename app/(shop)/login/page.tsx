'use client';

import { useState } from 'react';
import Link from 'next/link';
import { customerLoginAction, customerRegisterAction } from './actions';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function ShopLogin() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const action = isLogin ? customerLoginAction : customerRegisterAction;

        try {
            const result = await action(null, formData);
            if (result?.error) {
                setError(result.error);
            }
        } catch (err) {
            setError('Ocurrió un error inesperado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-[var(--background)]">
            <div className="w-full max-w-md p-8 bg-[var(--background)] border border-gray-100 shadow-sm rounded-lg">
                <h2 className="text-3xl font-light tracking-widest text-center text-black uppercase mb-8">
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm text-center mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2" htmlFor="name">
                                Nombre Completo
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required={!isLogin}
                                className="w-full bg-transparent border-b border-gray-300 py-2 text-black focus:outline-none focus:border-black transition-colors text-sm font-light [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:text-black [&:-webkit-autofill]:transition-all [&:-webkit-autofill]:duration-[50000ms]"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2" htmlFor="email">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full bg-transparent border-b border-gray-300 py-2 text-black focus:outline-none focus:border-black transition-colors text-sm font-light [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:text-black [&:-webkit-autofill]:transition-all [&:-webkit-autofill]:duration-[50000ms]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            required
                            className="w-full bg-transparent border-b border-gray-300 py-2 text-black focus:outline-none focus:border-black transition-colors text-sm font-light [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:text-black [&:-webkit-autofill]:transition-all [&:-webkit-autofill]:duration-[50000ms]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white uppercase tracking-widest text-xs font-bold py-4 mt-8 hover:bg-gray-800 transition-colors flex justify-center items-center disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : (isLogin ? 'Entrar' : 'Registrarse')}
                    </button>
                </form>

                <div className="mt-8 flex flex-col items-center gap-6">
                    <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                        className="text-xs text-gray-500 font-mono hover:text-black transition-colors"
                    >
                        {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>

                    <Link
                        href="/"
                        className="flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-[0.2em] font-bold hover:text-black transition-colors"
                    >
                        <ArrowLeft size={12} /> VOLVER A LA TIENDA
                    </Link>
                </div>
            </div>
        </div>
    );
}
