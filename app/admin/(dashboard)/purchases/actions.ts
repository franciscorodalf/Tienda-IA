'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPurchaseOrderAction(formData: FormData) {
    const supplierId = formData.get('supplierId') as string;
    const notes = formData.get('notes') as string;

    // Obtener el leadTimeDays del proveedor para calcular expectedAt
    const supplier = await (prisma as any).supplier.findUnique({ where: { id: supplierId } });
    if (!supplier) throw new Error('Supplier not found');

    const expectedAt = new Date();
    expectedAt.setDate(expectedAt.getDate() + supplier.leadTimeDays);

    // Los items vienen como: product_[id] = quantity y cost_[id] = unitCost
    const items: { productId: string; quantityOrdered: number; unitCost: number }[] = [];

    for (const [key, value] of formData.entries()) {
        if (key.startsWith('qty_')) {
            const productId = key.replace('qty_', '');
            const qty = parseInt(value as string);
            if (qty > 0) {
                const cost = parseFloat(formData.get(`cost_${productId}`) as string) || 0;
                items.push({ productId, quantityOrdered: qty, unitCost: cost });
            }
        }
    }

    if (items.length === 0) {
        throw new Error('Debes añadir al menos 1 producto a la orden.');
    }

    await (prisma as any).purchaseOrder.create({
        data: {
            supplierId,
            notes: notes || null,
            status: 'DRAFT',
            expectedAt,
            items: {
                create: items,
            },
        },
    });

    revalidatePath('/admin/purchases');
    redirect('/admin/purchases');
}

export async function advancePOStatusAction(poId: string, currentStatus: string) {
    const nextStatus: Record<string, string> = {
        DRAFT: 'SENT',
        SENT: 'CONFIRMED',
        CONFIRMED: 'RECEIVED',
    };
    const next = nextStatus[currentStatus];
    if (!next) return;

    await (prisma as any).purchaseOrder.update({
        where: { id: poId },
        data: { status: next },
    });

    // Si se pasa a RECEIVED → sumamos las cantidades al stock
    if (next === 'RECEIVED') {
        const po = await (prisma as any).purchaseOrder.findUnique({
            where: { id: poId },
            include: { items: true },
        });

        for (const item of po.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stockQuantity: { increment: item.quantityOrdered } },
            });
        }
    }

    revalidatePath('/admin/purchases');
}
