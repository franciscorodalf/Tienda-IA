'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProductAction(formData: FormData) {
    const name = formData.get('name') as string;
    const productId = formData.get('productId') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const stock = formData.get('stock') === 'on'; // Checkbox
    const imageUrl = formData.get('imageUrl') as string;

    await prisma.product.create({
        data: {
            name,
            productId,
            price,
            description,
            category,
            stock,
            imageUrl: imageUrl || '',
            colors: [],
            sizes: ['S', 'M', 'L'], // Default sizes
            features: []
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
