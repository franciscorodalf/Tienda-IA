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
    name: 'Sudadera Capucha Gris',
    price: 49.95,
    description: 'Sudadera con capucha clásica en tono gris marengo. Confeccionada en mezcla de algodón cálido.',
    category: 'Sudaderas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
    colors: ['Gris Vigoré', 'Azul Marino'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['Algodón', 'Corte Regular', 'Cordones ajustables'],
  },

  // --- CAMISETAS ---
  {
    id: 'hp-002',
    name: 'Camiseta Negra Cuello Caja',
    price: 39.95,
    description: 'Camiseta de corte clásico en algodón negro. Acabado suave y fit relajado.',
    category: 'Camisetas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
    colors: ['Negro'],
    sizes: ['M', 'L', 'XL'],
    features: ['Cuello redondo', 'Algodón peinado', 'Manga corta'],
  },
  {
    id: 't-001',
    name: 'Camiseta Básica Blanca',
    price: 25.00,
    description: 'Nuestra prenda más esencial. Camiseta blanca de algodón orgánico puro para llevar todos los días.',
    category: 'Camisetas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
    colors: ['Blanco'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['Algodón orgánico', 'Ajuste medio', 'Tacto ligero'],
  },
  {
    id: 't-002',
    name: 'Camiseta Estampada Texto',
    price: 29.95,
    description: 'Camiseta negra estructurada con serigrafía sutil de texto en el pecho.',
    category: 'Camisetas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
    colors: ['Negro Asfalto'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['Serigrafía blanca', 'Corte recto', 'Sin costuras molestas'],
  },
  {
    id: 't-003',
    name: 'Camiseta Larga Gráfica',
    price: 19.95,
    description: 'Camiseta larga de estilo casual con un diseño estampado gráfico en la parte delantera.',
    category: 'Camisetas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1503341338985-c0477be52513?q=80&w=1000&auto=format&fit=crop',
    colors: ['Negro'],
    sizes: ['XS', 'S', 'M', 'L'],
    features: ['Largo extendido', 'Gráfico central', 'Estilo urbano'],
  },

  // --- PANTALONES ---
  {
    id: 'p-001',
    name: 'Vaquero Con Apliques',
    price: 49.95,
    description: 'Jeans de corte tradicional intervenidos con apliques y parches decorativos.',
    category: 'Pantalones',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop',
    colors: ['Azul Medio'],
    sizes: ['38', '40', '42', '44'],
    features: ['Denim rígido', 'Rotos decorativos', 'Parches bordados'],
  },
  {
    id: 'p-002',
    name: 'Pantalón Denim Recto',
    price: 55.95,
    description: 'Pantalón denim de lavado muy oscuro y corte totalmente recto. Una base para cualquier armario.',
    category: 'Pantalones',
    stock: false,
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
    colors: ['Azul Noche'],
    sizes: ['38', '40', '42', '44'],
    features: ['Corte recto', 'Tiro alto', 'Lavado uniforme'],
  },
  {
    id: 'p-003',
    name: 'Pantalón Chino Beige',
    price: 45.00,
    description: 'Pantalón tipo chino en algodón elástico de tono beige perfecto para looks diarios.',
    category: 'Pantalones',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop',
    colors: ['Beige Arena'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['Algodón elástico', 'Corte ajustado', 'Bolsillos diagonales'],
  },

  // --- CHAQUETAS ---
  {
    id: 'j-001',
    name: 'Cazadora Vaquera Borreguillo',
    price: 99.95,
    description: 'Cazadora de tela vaquera con forro interior grueso efecto borrego a contraste.',
    category: 'Chaquetas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=1000&auto=format&fit=crop',
    colors: ['Azul Índigo'],
    sizes: ['S', 'M', 'L'],
    features: ['Forro cálido', 'Cierre botonadura', 'Cuello borrego'],
  },
  {
    id: 'j-002',
    name: 'Cazadora Biker de Cuero',
    price: 159.00,
    description: 'Cazadora de piel bovina asimétrica con cremalleras metálicas y cinturón en la cadera.',
    category: 'Chaquetas',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
    colors: ['Negro Intenso'],
    sizes: ['M', 'L', 'XL'],
    features: ['Piel natural', 'Cremalleras cruzadas', 'Bolsillos exteriores'],
  },

  // --- ZAPATOS ---
  {
    id: 's-001',
    name: 'Zapatilla Urbana Color',
    price: 69.95,
    description: 'Calzado deportivo alto en bloques de color negro, rojo y blanco.',
    category: 'Zapatos',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop',
    colors: ['Rojo/Blanco/Negro'],
    sizes: ['39', '40', '41', '42', '43', '44'],
    features: ['Corte alto', 'Cuero sintético', 'Suela acolchada'],
  },
  {
    id: 's-002',
    name: 'Zapatilla Blanca Clásica',
    price: 89.95,
    description: 'Zapatilla blanca de diseño minimalista puro con sutiles detalles en contraste.',
    category: 'Zapatos',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop',
    colors: ['Blanco Nieve'],
    sizes: ['40', '41', '42', '43', '44'],
    features: ['Horma fina', 'Cordones algodón', 'Suela de goma eva'],
  },

  // --- ACCESORIOS ---
  {
    id: 'a-001',
    name: 'Bolso Shopper Lona',
    price: 39.95,
    description: 'Bolso formato shopper XL confeccionado en mezcla gruesa de algodón color caqui.',
    category: 'Accesorios',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop',
    colors: ['Caqui Natural'],
    sizes: ['Talla Única'],
    features: ['Canvas grueso', 'Asas superiores largas', 'Interior forrado'],
  },
  {
    id: 'a-002',
    name: 'Perfume Signature Noir',
    price: 25.00,
    description: 'Eau de Parfum intensa. Una esencia oscura, floral y amaderada para la noche.',
    category: 'Accesorios',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
    colors: ['Negro'],
    sizes: ['100ml'],
    features: ['Frasco cristal negro', 'Esencia floral oriental', 'Alta duración'],
  },
  {
    id: 'a-003',
    name: 'Gafas de Sol Redondas',
    price: 29.95,
    description: 'Gafas de sol de montura redonda metálica dorada y cristales ahumados verdosos.',
    category: 'Accesorios',
    stock: true,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop',
    colors: ['Oro/Verde'],
    sizes: ['Estándar'],
    features: ['Estructura dorada', 'Lentes categoría 3', 'Protección UV'],
  }
];
