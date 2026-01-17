export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: boolean;
  imageUrl: string;
}

export const products: Product[] = [
  // Categoría: Ropa de Exterior (Outerwear)
  {
    id: '1',
    name: 'Chaqueta Urbana Tech',
    price: 129.99,
    description: 'Chaqueta resistente al agua y transpirable diseñada para la ciudad. Cuenta con múltiples bolsillos ocultos y una silueta elegante.',
    category: 'Abrigos',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Sudadera Streetwear',
    price: 75.00,
    description: 'Sudadera de felpa pesada con diseño minimalista. Incluye bolsillo canguro y puños acanalados.',
    category: 'Abrigos',
    stock: false,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '7',
    name: 'Abrigo de Lana Clásico',
    price: 199.50,
    description: 'Abrigo largo de mezcla de lana, perfecto para el invierno. Corte recto y elegante.',
    category: 'Abrigos',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1000&auto=format&fit=crop',
  },

  // Categoría: Partes Superiores (Tops)
  {
    id: '2',
    name: 'Camiseta de Algodón Minimalista',
    price: 35.00,
    description: 'Camiseta de algodón orgánico premium con corte relajado. Suave, duradera y perfecta para capas.',
    category: 'Camisetas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '8',
    name: 'Camisa Oxford Blanca',
    price: 59.90,
    description: 'Un básico esencial. Camisa de corte slim fit ideal para oficina o salidas casuales.',
    category: 'Camisas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
  },

  // Categoría: Pantalones (Bottoms)
  {
    id: '3',
    name: 'Jeans Slim Fit',
    price: 89.50,
    description: 'Vaqueros índigo clásicos con un toque de elasticidad para mayor comodidad. Ajuste entallado que combina con todo.',
    category: 'Pantalones',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '9',
    name: 'Pantalón Chino Beige',
    price: 65.00,
    description: 'Pantalones chinos versátiles y cómodos. Ideales para un look smart-casual.',
    category: 'Pantalones',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop',
  },

  // Categoría: Accesorios
  {
    id: '5',
    name: 'Bolso de Fin de Semana',
    price: 110.00,
    description: 'Bolso de lona duradero con detalles en cuero. Espacioso, ideal para viajes cortos o el gimnasio.',
    category: 'Accesorios',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '10',
    name: 'Gafas de Sol Retro',
    price: 45.00,
    description: 'Montura clásica inspirada en los años 80 con protección UV400.',
    category: 'Accesorios',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop',
  },

  // Categoría: Calzado
  {
    id: '6',
    name: 'Zapatillas Blancas Clásicas',
    price: 95.00,
    description: 'Zapatillas atemporales hechas de cuero vegano. Suela cómoda para usar todo el día.',
    category: 'Calzado',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
  }
];
