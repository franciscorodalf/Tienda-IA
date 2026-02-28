import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Si intenta acceder a una ruta de admin que NO es login
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const authCookie = req.cookies.get('aura_admin_auth');

        if (!authCookie || authCookie.value !== 'true') {
            const url = req.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }
    }

    // Si intenta acceder directamente al login estanco logueado, redirigir al dashboard
    if (pathname === '/admin/login') {
        const authCookie = req.cookies.get('aura_admin_auth');
        if (authCookie && authCookie.value === 'true') {
            const url = req.nextUrl.clone();
            url.pathname = '/admin';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
