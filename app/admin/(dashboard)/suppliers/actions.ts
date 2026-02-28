'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Lead time estimado por país (días desde España)
const LEAD_TIME_BY_COUNTRY: Record<string, number> = {
    'Spain': 2,
    'Portugal': 3,
    'France': 3,
    'Italy': 4,
    'Germany': 4,
    'Netherlands': 4,
    'Belgium': 4,
    'Turkey': 7,
    'Morocco': 6,
    'Poland': 5,
    'Romania': 5,
    'China': 18,
    'Vietnam': 17,
    'India': 14,
    'Bangladesh': 16,
    'USA': 12,
    'Brazil': 15,
    'Mexico': 13,
};

export async function createSupplierAction(formData: FormData) {
    const name = formData.get('name') as string;
    const contactEmail = formData.get('contactEmail') as string;
    const country = formData.get('country') as string;
    const customLeadTime = formData.get('customLeadTime') as string;

    if (!name || !country) return;

    // Si se deja el lead time en blanco, lo calculamos por el país
    const leadTimeDays = customLeadTime
        ? parseInt(customLeadTime)
        : LEAD_TIME_BY_COUNTRY[country] ?? 7;

    await (prisma as any).supplier.create({
        data: {
            name: name.trim(),
            contactEmail: contactEmail?.trim() || null,
            country: country.trim(),
            leadTimeDays,
        },
    });

    revalidatePath('/admin/suppliers');
    redirect('/admin/suppliers');
}

export async function deleteSupplierAction(id: string) {
    // Desvincular productos antes de eliminar
    await prisma.product.updateMany({
        where: { supplierId: id },
        data: { supplierId: null },
    });
    await (prisma as any).supplier.delete({ where: { id } });
    revalidatePath('/admin/suppliers');
}
