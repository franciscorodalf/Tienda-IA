import { PrismaClient } from '@prisma/client'
import { products } from '../lib/data'

const prisma = new PrismaClient()

async function main() {
    console.log('Empezando migración de datos a Supabase...')

    // Borrar productos existentes (opcional por si lo ejecutas varias veces sin querer)
    await prisma.product.deleteMany()
    console.log('Productos anteriores limpiados.')

    // Insertar cada producto
    for (const prod of products) {
        const p = await prisma.product.create({
            data: {
                productId: prod.id,
                name: prod.name,
                price: prod.price,
                description: prod.description,
                category: prod.category,
                stock: prod.stock,
                imageUrl: prod.imageUrl,
                colors: prod.colors,
                sizes: prod.sizes,
                features: prod.features,
            }
        })
        console.log(`Creado => ${p.name} (${p.productId})`)
    }

    console.log('¡Todos los datos migrados exitosamente!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
