# TIENDA.IA — E-Commerce de Streetwear con IA

![Inicio](resources/Start.png)

> **Demo en vivo →** [tiendawithia.vercel.app](https://tiendawithia.vercel.app)

Tienda.IA es un e-commerce completo de moda streetwear construido con **Next.js 15**, **Supabase + Prisma** e **IA generativa (Groq / Llama 3.3 70B)**. El proyecto combina una tienda pública de alta calidad con un panel de administración profesional que incluye gestión de inventario, proveedores y órdenes de compra.

---

## Características Principales

### Tienda Pública
- Catálogo dinámico con datos reales de Supabase
- Filtrado por categoría sin recarga de página
- Carrito con validación de talla + color antes de añadir
- Modal de producto con imágenes, features y variantes
- Chat de IA integrado (Alex, Personal Shopper)
- Sección "Archivo" editorial inmersiva
- Autenticación de clientes (registro / login)

### Asistente de IA — Alex
- Modelo: **Llama 3.3 70B** via Groq (ultra baja latencia)
- Búsqueda semántica con Fuse.js (fuzzy matching)
- Gestión autónoma del carrito (`addToCart` tool call)
- Caché de respuestas para reducir llamadas a la API
- Context RAG ligero: solo inyecta los 4 productos más relevantes

### Panel de Administración (AURA Admin)
- **Dashboard** con métricas reales: productos, pedidos, clientes, valor de inventario
- **Inventario**: tabla con stock real por unidades, alertas visuales ()
- **Pedidos**: gestión y seguimiento de órdenes de clientes
- **Clientes**: listado de usuarios registrados
- **Proveedores**: CRUD completo con país, email y lead time automático
- **Purchase Orders**: flujo realista DRAFT → SENT → CONFIRMED → RECEIVED con actualización automática de stock al recibir
- Autenticación por cookie protegida con middleware de Next.js

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Frontend | React 19, Tailwind CSS v4, Framer Motion |
| Base de datos | PostgreSQL (Supabase) |
| ORM | Prisma 5 |
| IA | Groq SDK — Llama 3.3 70B Versatile |
| Auth | Cookies + bcryptjs + middleware |
| Búsqueda | Fuse.js (fuzzy matching) |
| Testing | Vitest + Testing Library |
| Deploy | Vercel |

---

## Modelo de Datos

```
Supplier ─┐
 ├─< Product >─< OrderItem >─< Order >─< Customer
 └─< PurchaseOrder >─< PurchaseOrderItem >─< Product
```

- **Supplier**: Nombre, país, email, `leadTimeDays` (calculado por país)
- **Product**: `stockQuantity`, `stockAlert`, vinculado a un `Supplier`
- **PurchaseOrder**: Ciclo de vida DRAFT→RECEIVED, `expectedAt` automático
- **Order / OrderItem**: Pedidos de clientes desde la tienda
- **Customer**: Registro con `passwordHash` (bcrypt)

---

## Instalación Local

```bash
# 1. Clonar
git clone https://github.com/franciscorodalf/Tienda-IA.git
cd Tienda-IA

# 2. Instalar dependencias
npm install

# 3. Variables de entorno
cp .env.example .env.local
# Rellena DATABASE_URL y GROQ_API_KEY

# 4. Sincronizar base de datos
npx prisma db push
npx tsx prisma/seed.ts

# 5. Arrancar
npm run dev
```

### Variables de entorno necesarias

```env
DATABASE_URL=postgresql://... # Supabase connection string (pooled)
GROQ_API_KEY=gsk_... # Groq API Key
```

---

## Estructura del Proyecto

```
Tienda-IA/
├── app/
│ ├── (shop)/ # Rutas públicas de la tienda
│ │ ├── page.tsx # Home — catálogo
│ │ ├── checkout/ # Checkout
│ │ ├── archive/ # Sección editorial
│ │ └── login/ # Auth de cliente
│ ├── admin/
│ │ ├── (dashboard)/ # Panel de administración
│ │ │ ├── page.tsx # Dashboard Overview
│ │ │ ├── inventory/ # Gestión de inventario
│ │ │ ├── orders/ # Pedidos
│ │ │ ├── customers/ # Clientes
│ │ │ ├── suppliers/ # Proveedores (CRUD)
│ │ │ └── purchases/ # Purchase Orders
│ │ └── login/ # Login de administrador
│ └── api/
│ └── chat/ # Endpoint de IA (Groq)
├── components/ # Componentes React reutilizables
├── lib/
│ ├── prisma.ts # Singleton del cliente Prisma
│ ├── groq.ts # Cliente Groq
│ ├── ai-config.ts # System prompt + tools de IA
│ └── data.ts # Tipos TypeScript del catálogo
├── prisma/
│ ├── schema.prisma # Esquema de BD
│ └── seed.ts # Datos iniciales (proveedores + productos)
├── middleware.ts # Protección de rutas admin
└── docs/ # Documentación detallada
```

---

## Documentación Detallada

| Documento | Descripción |
|---|---|
| [docs/architecture.md](docs/architecture.md) | Arquitectura general y flujo de datos |
| [docs/ai-agent.md](docs/ai-agent.md) | Sistema de IA: Alex, RAG, tools y caché |
| [docs/admin-panel.md](docs/admin-panel.md) | Panel de administración completo |
| [docs/inventory-system.md](docs/inventory-system.md) | Sistema de inventario y proveedores |
| [docs/database-schema.md](docs/database-schema.md) | Esquema de base de datos con diagramas |
| [docs/auth.md](docs/auth.md) | Sistema de autenticación |

---

## Tests

```bash
npm test # Ejecutar todos los tests
npm run test:watch # Modo watch
```

Tests incluidos en `lib/data.test.ts` y `components/ProductCard.test.tsx`.

---

## Seguridad

- API Keys solo en servidor (nunca expuestas al cliente)
- Rutas `/admin/*` protegidas por middleware con cookie `aura_admin_auth`
- Contraseñas de cliente hasheadas con **bcrypt** (cost factor 12)
- System prompt de IA con restricciones de rol

---

*Tienda.IA — Proyecto Open Source bajo licencia MIT.*
*Desarrollado con Next.js 15 + Supabase + Groq.*
