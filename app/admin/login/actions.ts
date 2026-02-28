'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Credenciales en duro (en un futuro se puede conectar a base de datos de administradores)
    if (email === 'admin@aura.com' && password === 'aura123') {
        // Configura la cookie para que el middleware la apruebe
        const cookieStore = await cookies();
        cookieStore.set('aura_admin_auth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 día
            path: '/',
        });

        // Redirige al dashboard
        redirect('/admin');
    }

    // Si fallan
    return { error: 'Correo o contraseña incorrectos.' };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('aura_admin_auth');
    redirect('/admin/login');
}
