# Arquitectura del Sistema — Tienda.IA

## Visión General

Tienda.IA es una aplicación **full-stack monolítica** construida sobre **Next.js 15 App Router**. Todo corre en un único repositorio pero con una separación clara de responsabilidades entre la tienda pública, el panel de administración y la capa de IA.

---

## Diagrama de Arquitectura

```
┌──────────────────────────────────────────────────────┐
│ CLIENTE │
│ Browser (React 19 + Tailwind CSS + Framer Motion) │
└──────────────┬───────────────────────┬───────────────┘
 │ HTTP / RSC Streaming │ WebSocket-like (fetch)
 ▼ ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│ Next.js App Router │ │ API Route Handler │
│ (Server Components) │ │ /api/chat │
│ │ │ (Edge-compatible) │
│ app/(shop)/page.tsx │ └──────────┬──────────────┘
│ app/admin/(dashboard)/ │ │
└──────────┬──────────────┘ │
 │ Prisma ORM │ Groq SDK
 ▼ ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│ Supabase (PostgreSQL) │ │ Groq API │
│ aws-eu-central-1 │ │ Llama 3.3 70B │
└─────────────────────────┘ └─────────────────────────┘
```

---

## Flujo de Datos — Tienda Pública

```
Usuario carga /
 │
 ▼
app/(shop)/page.tsx [Server Component]
 │ await prisma.product.findMany()
 │
 ▼
Supabase PostgreSQL [BD remota]
 │ Devuelve filas de Product
 │
 ▼
HomePageClient.tsx [Client Component]
 │ Recibe products como prop (serializado como JSON)
 │ Gestiona estado local: filtros, carrito, modal
 │
 ▼
ProductCard.tsx + ProductModal.tsx
 │ Renderiza catálogo, maneja interacciones
 │
 ▼ (Si usuario abre chat)
Chat.tsx [Client Component]
 │ POST /api/chat con { history, message }
 │
 ▼
/api/chat/route.ts [Server — API Route]
 │ 1. Busca productos en BD (Prisma)
 │ 2. RAG con Fuse.js (fuzzy search)
 │ 3. Llama a Groq API
 │ 4. Procesa tool calls (addToCart)
 │ 5. Devuelve { text, products, cartAction }
 │
 ▼
Chat.tsx [actualiza UI]
 │ Muestra respuesta IA
 │ Si cartAction → CartContext.addItem()
```

---

## Flujo de Datos — Admin Panel

```
Admin accede a /admin/*
 │
 ▼
middleware.ts [Edge Middleware]
 │ Verifica cookie 'aura_admin_auth'
 │ Si no existe → redirect /admin/login
 │
 ▼
app/admin/(dashboard)/layout.tsx [Server Component]
 │ Renderiza sidebar + navegación
 │
 ▼
app/admin/(dashboard)/[page].tsx [Server Component]
 │ await prisma.[model].findMany()
 │ Renderiza tabla/formulario
 │
 ▼ (Si hay formulario)
actions.ts [Server Actions]
 │ 'use server' — se ejecuta en el servidor
 │ Valida datos del FormData
 │ prisma.[model].create/update/delete()
 │ revalidatePath() → Next.js refresca la página
 │ redirect() si procede
```

---

## Separación de Rutas

| Segmento | Tipo | Descripción |
|---|---|---|
| `app/(shop)/` | Route Group | Tienda pública (sin prefijo URL) |
| `app/admin/(dashboard)/` | Route Group | Panel de administración |
| `app/admin/login/` | Ruta pública | Login del admin (no protegida) |
| `app/api/chat/` | API Route | Endpoint de IA |

Los **Route Groups** (`(shop)`, `(dashboard)`) permiten organizar el código y compartir layouts sin que el nombre del grupo aparezca en la URL.

---

## Rendering Strategy

| Página | Estrategia | Motivo |
|---|---|---|
| `/` (Tienda) | **SSR** (Server Component) | Datos frescos de inventario en cada carga |
| `/admin` (Dashboard) | **SSR** | Métricas en tiempo real |
| `/admin/inventory` | **SSR** | Stock actualizado sin caché |
| Chat widget | **CSR** | Interacción en tiempo real |
| Filtros producto | **CSR** | Estado local sin servidor |

---

## Gestión de Estado

```
CartContext (React Context API)
 ├── items[] → productos en carrito
 ├── addItem() → añadir con talla+color
 ├── removeItem() → eliminar por id+talla+color
 └── clearCart() → vaciar después del checkout
```

El carrito vive en memoria del cliente. No persiste entre sesiones (sin servidor). Para producción, se podría integrar con la tabla `Order` de Prisma.

---

## Middleware de Autenticación

```typescript
// middleware.ts — Se ejecuta en el Edge (antes del render)
if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
 const authCookie = req.cookies.get('aura_admin_auth');
 if (!authCookie || authCookie.value !== 'true') {
 return NextResponse.redirect('/admin/login');
 }
}
```

La cookie `aura_admin_auth` se establece como `HttpOnly` tras login exitoso con la contraseña de administrador almacenada en variable de entorno (o hardcoded para demo).
