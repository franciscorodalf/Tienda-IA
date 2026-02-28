// lib/data.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: boolean;
  imageUrl: string;
  colors: string[];
  sizes: string[];
  features: string[];
}

export const products: Product[] = [
  // --- SUDADERAS ---
  {
    id: 'hp-001',
    name: 'Sudadera Capucha Básica',
    price: 49.95,
    description: 'Sudadera con capucha de corte holgado. Confeccionada en mezcla de algodón con acabado confort.',
    category: 'Sudaderas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
    colors: ['Gris Vigoré', 'Azul Marino'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['Algodón orgánico', 'Holgada', 'Cordones ajustables'],
  },
  {
    id: 'hp-002',
    name: 'Sudadera Cuello Redondo',
    price: 39.95,
    description: 'Sudadera clásica de cuello redondo. Acabado de pre-encogido para garantizar el mejor ajuste.',
    category: 'Sudaderas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
    colors: ['Blanco Crudo', 'Negro'],
    sizes: ['M', 'L', 'XL'],
    features: ['Cuello caja', 'Canalé en puños', 'Suave al tacto'],
  },

  // --- CAMISETAS ---
  {
    id: 't-001',
    name: 'Camiseta Algodón Pesado',
    price: 25.00,
    description: 'Camiseta de corte fluido en algodón de alto gramaje para aportar una caída perfecta.',
    category: 'Camisetas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
    colors: ['Blanco', 'Piedra'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['Gramaje grueso', 'Algodón 100%', 'Cuello perkins ligero'],
  },
  {
    id: 't-002',
    name: 'Camiseta Lavado Vintage',
    price: 29.95,
    description: 'Camiseta básica con un proceso de lavado especial para conseguir un efecto despintado sutil.',
    category: 'Camisetas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
    colors: ['Gris Antracita', 'Caqui'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['Lavado enzimático', 'Relajado', 'Sin costuras laterales'],
  },
  {
    id: 't-003',
    name: 'Top Ajustado Rib',
    price: 19.95,
    description: 'Top corto confeccionado en tejido de canalé elástico para un efecto segunda piel.',
    category: 'Camisetas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1503341338985-c0477be52513?q=80&w=1000&auto=format&fit=crop',
    colors: ['Negro', 'Blanco'],
    sizes: ['XS', 'S', 'M', 'L'],
    features: ['Tejido punto canalé', 'Espalda nadadora'],
  },

  // --- PANTALONES ---
  {
    id: 'p-001',
    name: 'Vaquero Relaxed Fit',
    price: 49.95,
    description: 'Jeans de corte ancho que bajan rectos desde la cadera al suelo. Denim de aspecto rígido y clásico.',
    category: 'Pantalones',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
    colors: ['Azul Claro', 'Lavado Medio'],
    sizes: ['38', '40', '42', '44'],
    features: ['100% Algodón', 'Tiro medio', 'Cinco bolsillos'],
  },
  {
    id: 'p-002',
    name: 'Pantalón Chino Cargo',
    price: 55.95,
    description: 'Pantalón tejido mezcla algodón con bolsillos de plastrón en los laterales. Corte recto funcional.',
    category: 'Pantalones',
    stock: false,
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
    colors: ['Arena', 'Ceniza'],
    sizes: ['38', '40', '42', '44'],
    features: ['Cintura ajustada', 'Detalle bolsillos', 'Recto'],
  },
  {
    id: 'p-003',
    name: 'Pantalón Lino Fluido',
    price: 45.00,
    description: 'Pantalón ancho en mezcla de lino. Cintura elástica con cordón ajustable para máxima frescura.',
    category: 'Pantalones',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop',
    colors: ['Verde Oliva', 'Piedra'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['Lino orgánico', 'Bajo amplio', 'Textura rústica'],
  },

  // --- CHAQUETAS ---
  {
    id: 'j-001',
    name: 'Acolchada Larga',
    price: 99.95,
    description: 'Chaqueta abullonada repelente al agua. Relleno técnico sostenible extra ligero.',
    category: 'Chaquetas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=1000&auto=format&fit=crop',
    colors: ['Negro', 'Hielo'],
    sizes: ['S', 'M', 'L'],
    features: ['Ligera', 'Repelente agua', 'Cuello subido'],
  },
  {
    id: 'j-002',
    name: 'Cazadora Cuero',
    price: 159.00,
    description: 'Cazadora de piel ovina con detalle de presillas y forro interior a tono. Corte ajustado atemporal.',
    category: 'Chaquetas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
    colors: ['Negro Noche'],
    sizes: ['M', 'L', 'XL'],
    features: ['100% Piel ovina', 'Tiradores metálicos', 'Solapas'],
  },

  // --- ZAPATOS ---
  {
    id: 's-001',
    name: 'Deportivo Piel Retros',
    price: 69.95,
    description: 'Zapatilla deportiva estilo bowling en combinación de pieles lisas y serraje.',
    category: 'Zapatos',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop',
    colors: ['Blanco Roto', 'Crema oscuro'],
    sizes: ['39', '40', '41', '42', '43', '44'],
    features: ['Suela goma', 'Plantilla memory', 'Silueta fina'],
  },
  {
    id: 's-002',
    name: 'Botín Chelsea Piel',
    price: 89.95,
    description: 'Botín clásico Chelsea con elásticos laterales y tirador trasero. Horma estilizada elegante.',
    category: 'Zapatos',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop',
    colors: ['NegroMate', 'Marrón Chocolate'],
    sizes: ['40', '41', '42', '43', '44', '45'],
    features: ['Piel curtida', 'Elástico suave', 'Puntera almendrada'],
  },

  // --- ACCESORIOS ---
  {
    id: 'a-001',
    name: 'Maxi Bolso Lona',
    price: 39.95,
    description: 'Bolso formato shopper XL confeccionado en mezcla gruesa de algodón en color crudo.',
    category: 'Accesorios',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop',
    colors: ['Crudo', 'Verde Bosque'],
    sizes: ['Talla Única'],
    features: ['Canvas grueso', 'Doble asa', 'Compartimentos interiores'],
  },
  {
    id: 'a-002',
    name: 'Perfume Signature',
    price: 25.00,
    description: 'Eau de Parfum. Una nota amaderada con extracto de bergamota e higo para uso diario.',
    category: 'Accesorios',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
    colors: ['Transparente'],
    sizes: ['100ml'],
    features: ['Amaderado', 'Envase reciclable', 'Fresca'],
  },
  {
    id: 'a-003',
    name: 'Gafas de Sol Carey',
    price: 29.95,
    description: 'Gafas de sol de montura rectangular estilo carey con protección UV clase 3.',
    category: 'Accesorios',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop',
    colors: ['Marrón Carey', 'Negro Inyectado'],
    sizes: ['Estándar'],
    features: ['Protección UV400', 'Ligeras', 'Incluye funda blanda'],
  }
];
