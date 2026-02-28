import { PrismaClient } from '@prisma/client'
import { products } from '../lib/data'

const prisma = new PrismaClient()

// Lead time real estimado por región (días desde España)
const LEAD_TIME_BY_COUNTRY: Record<string, number> = {
    'Spain': 2,
    'Portugal': 3,
    'France': 3,
    'Italy': 4,
    'Germany': 4,
    'Turkey': 7,
    'Morocco': 6,
    'China': 18,
    'Vietnam': 17,
    'India': 14,
}

const suppliers = [
    {
        name: 'UrbanTextile Co.',
        contactEmail: 'orders@urbantextile.pt',
        country: 'Portugal',
        // Suministra: básicos, hoodies, camisetas
        productCategories: ['tops'],
    },
    {
        name: 'NordStyle GmbH',
        contactEmail: 'purchasing@nordstyle.de',
        country: 'Germany',
        // Suministra: outerwear, pantalones cargo
        productCategories: ['outerwear', 'bottoms'],
    },
    {
        name: 'AccessPro S.r.l.',
        contactEmail: 'supply@accesspro.it',
        country: 'Italy',
        // Suministra: accesorios, bolsos, calzado
        productCategories: ['accessories', 'footwear'],
    },
    {
        name: 'AsiaTex Ltd.',
        contactEmail: 'export@asiatex.cn',
        country: 'China',
        // Suministra: volumen / prendas genéricas
        productCategories: [],
    },
]

async function main() {
    console.log('🌱 Iniciando seed de Supabase...')

    // Limpiar tablas dependientes primero (orden importa por FK)
    await prisma.purchaseOrderItem.deleteMany()
    await prisma.purchaseOrder.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.supplier.deleteMany()
    await prisma.customer.deleteMany()
    console.log('✅ Tablas limpiadas.')

    // Crear proveedores
    const createdSuppliers = await Promise.all(
        suppliers.map(s =>
            prisma.supplier.create({
                data: {
                    name: s.name,
                    contactEmail: s.contactEmail,
                    country: s.country,
                    leadTimeDays: LEAD_TIME_BY_COUNTRY[s.country] ?? 7,
                },
            })
        )
    )
    console.log(`✅ ${createdSuppliers.length} proveedores creados.`)

    // Asignar función helper: ¿qué proveedor suministra este producto?
    function getSupplierForProduct(category: string) {
        const lower = category.toLowerCase()
        if (['tops', 'hoodies', 'shirts'].some(c => lower.includes(c))) {
            return createdSuppliers.find(s => s.name === 'UrbanTextile Co.')!.id
        }
        if (['outerwear', 'bottoms', 'pants'].some(c => lower.includes(c))) {
            return createdSuppliers.find(s => s.name === 'NordStyle GmbH')!.id
        }
        if (['accessories', 'footwear', 'bags', 'belts'].some(c => lower.includes(c))) {
            return createdSuppliers.find(s => s.name === 'AccessPro S.r.l.')!.id
        }
        // Por defecto: AsiaTex (proveedor de volumen)
        return createdSuppliers.find(s => s.name === 'AsiaTex Ltd.')!.id
    }

    // Crear productos con stockQuantity real (entre 8 y 35 unidades aleatoriamente)
    for (const prod of products) {
        const stockQty = Math.floor(Math.random() * 28) + 8  // 8–35 uds
        const p = await prisma.product.create({
            data: {
                productId: prod.id,
                name: prod.name,
                price: prod.price,
                description: prod.description,
                category: prod.category,
                stockQuantity: stockQty,
                stockAlert: 5,
                imageUrl: prod.imageUrl,
                colors: prod.colors,
                sizes: prod.sizes,
                features: prod.features,
                supplierId: getSupplierForProduct(prod.category),
            }
        })
        console.log(`  → ${p.name} (${p.productId}) — Stock: ${stockQty} uds`)
    }

    console.log('🎉 Seed completado exitosamente.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
