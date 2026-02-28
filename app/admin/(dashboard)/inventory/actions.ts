'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProductAction(formData: FormData) {
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const stockQuantity = parseInt(formData.get('stockQuantity') as string) || 0;
    const imageUrl = formData.get('imageUrl') as string;

    // Parsear arrays desde strings separados por coma
    const parseList = (value: string | null) =>
        value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];

    const colors = parseList(formData.get('colors') as string);
    const sizes = parseList(formData.get('sizes') as string);
    const features = parseList(formData.get('features') as string);

    // Auto-generar productId correlativo basado en el último guardado
    const lastProduct = await prisma.product.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    let nextIdNumber = 1;
    if (lastProduct && lastProduct.productId) {
        const match = lastProduct.productId.match(/\d+$/);
        if (match) {
            nextIdNumber = parseInt(match[0], 10) + 1;
        }
    }
    const productId = String(nextIdNumber).padStart(3, '0');

    await prisma.product.create({
        data: {
            name,
            productId,
            price,
            description,
            category,
            stockQuantity,
            imageUrl: imageUrl || '',
            colors,
            sizes,
            features
        }
    });

    revalidatePath('/admin/inventory');
    revalidatePath('/');
    redirect('/admin/inventory');
}

export async function deleteProductAction(id: string) {
    await prisma.product.delete({
        where: { id }
    });
    revalidatePath('/admin/inventory');
    revalidatePath('/');
}
