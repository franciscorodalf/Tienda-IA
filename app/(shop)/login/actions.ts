'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function customerLoginAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) return { error: 'Por favor, llena todos los campos.' };

    const customer = await prisma.customer.findUnique({
        where: { email },
    });

    if (!customer) {
        return { error: 'Correo o contraseña incorrectos.' };
    }

    const isValid = await bcrypt.compare(password, customer.passwordHash);

    if (!isValid) {
        return { error: 'Correo o contraseña incorrectos.' };
    }

    // Set local session cookie 
    const cookieStore = await cookies();
    cookieStore.set('aura_customer_auth', customer.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 semana
        path: '/',
    });

    redirect('/');
}

export async function customerRegisterAction(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) return { error: 'Por favor, llena todos los campos.' };

    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) {
        return { error: 'Este correo ya está registrado.' };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const customer = await prisma.customer.create({
        data: { name, email, passwordHash },
    });

    const cookieStore = await cookies();
    cookieStore.set('aura_customer_auth', customer.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 semana
        path: '/',
    });

    redirect('/');
}

export async function customerLogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('aura_customer_auth');
    redirect('/login');
}
