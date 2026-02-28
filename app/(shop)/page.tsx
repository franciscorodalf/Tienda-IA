import React from 'react';
import { HomePageClient } from '@/components/HomePageClient';
import { prisma } from '@/lib/prisma';
import { Product } from '@/lib/data';

// This is a Server Component, meaning this runs directly on the server
// and fetches from the database before sending any HTML to the client!
export default async function Home() {
  // We fetch directly from the Supabase database via Prisma
  const rawProducts = await prisma.product.findMany();

  // Map the raw database layout slightly to match the `Product` type expected by components
  const dynamicProducts: Product[] = rawProducts.map((p: any) => ({
    id: p.productId,
    name: p.name,
    price: p.price,
    description: p.description,
    category: p.category,
    stock: p.stock,
    imageUrl: p.imageUrl,
    colors: p.colors,
    sizes: p.sizes,
    features: p.features,
  }));

  return <HomePageClient initialProducts={dynamicProducts} />;
}
