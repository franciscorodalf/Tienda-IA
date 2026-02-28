# Esquema de Base de Datos

## Proveedor / Tecnología

- **Base de datos**: PostgreSQL (hosted en Supabase, región `aws-eu-central-1`)
- **ORM**: Prisma 5.22
- **Conexión**: Pooled connection via `pgbouncer` (Supabase connection pooler)

---

## Diagrama de Relaciones

```
┌──────────┐ ┌──────────────┐ ┌──────────────────┐
│ Supplier │──1:N──│ Product │──1:N──│ OrderItem │
└──────────┘ └──────────────┘ └────────┬─────────┘
 │ │ │
 │ │ 1:N │ N:1
 │ ▼ ▼
 │ ┌─────────────────┐ ┌──────────┐
 │ │PurchaseOrderItem│ │ Order │──N:1──► Customer
 │ └────────┬────────┘ └──────────┘
 │ │ N:1
 │ ▼
 └───1:N─────► PurchaseOrder
```

---

## Modelos Completos

### Customer

```prisma
model Customer {
 id String @id @default(cuid())
 email String @unique
 passwordHash String // bcrypt hash
 name String
 role String @default("USER") // Para RBAC futuro

 orders Order[]

 createdAt DateTime @default(now())
 updatedAt DateTime @updatedAt
}
```

**Notas:**
- `passwordHash` almacena el hash bcrypt (cost factor 12, no el password en claro)
- `role` preparado para un sistema de roles futuro (USER, ADMIN, etc.)
- `email` único para evitar registros duplicados

---

### Order

```prisma
model Order {
 id String @id @default(cuid())
 customerId String
 status String @default("PENDING") // PENDING|PAID|SHIPPED|DELIVERED|CANCELLED
 total Float

 customer Customer @relation(fields: [customerId], references: [id])
 items OrderItem[]

 createdAt DateTime @default(now())
 updatedAt DateTime @updatedAt
}
```

---

### OrderItem

```prisma
model OrderItem {
 id String @id @default(cuid())
 orderId String
 productId String
 quantity Int
 price Float // Precio en el momento de la compra (snapshot)

 order Order @relation(fields: [orderId], references: [id])
 product Product @relation(fields: [productId], references: [id])
}
```

**Nota importante**: `price` se almacena como snapshot del momento de compra. Si el precio de un producto cambia, los pedidos históricos mantienen el precio original.

---

### Product

```prisma
model Product {
 id String @id @default(cuid())
 productId String @unique // SKU legible (ej: "t-001", "j-002")
 name String
 price Float
 description String
 category String
 stockQuantity Int @default(0)
 stockAlert Int @default(5) // Umbral de alerta de stock bajo
 imageUrl String
 colors String[] // Array de colores disponibles
 sizes String[] // Array de tallas disponibles
 features String[] // Features/specs del producto
 supplierId String? // FK opcional al proveedor

 supplier Supplier? @relation(...)
 orderItems OrderItem[]
 purchaseOrderItems PurchaseOrderItem[]

 createdAt DateTime @default(now())
 updatedAt DateTime @updatedAt
}
```

**Notas:**
- `colors`, `sizes`, `features` son arrays de `String` nativos de PostgreSQL
- `supplierId` es nullable para permitir productos sin proveedor asignado
- `stockQuantity` reemplaza al antiguo campo `stock: Boolean` (migrado)

---

### Supplier

```prisma
model Supplier {
 id String @id @default(cuid())
 name String
 contactEmail String?
 country String
 leadTimeDays Int // Días de tránsito estimados (calculado por país)

 products Product[]
 purchaseOrders PurchaseOrder[]

 createdAt DateTime @default(now())
 updatedAt DateTime @updatedAt
}
```

---

### PurchaseOrder

```prisma
model PurchaseOrder {
 id String @id @default(cuid())
 supplierId String
 status String @default("DRAFT") // DRAFT|SENT|CONFIRMED|RECEIVED
 notes String?
 expectedAt DateTime? // Fecha estimada de llegada

 supplier Supplier @relation(...)
 items PurchaseOrderItem[]

 createdAt DateTime @default(now())
 updatedAt DateTime @updatedAt
}
```

---

### PurchaseOrderItem

```prisma
model PurchaseOrderItem {
 id String @id @default(cuid())
 purchaseOrderId String
 productId String
 quantityOrdered Int
 unitCost Float

 purchaseOrder PurchaseOrder @relation(...)
 product Product @relation(...)
}
```

---

## Convenciones del Schema

| Convención | Decisión |
|---|---|
| IDs | `cuid()` — collision-resistant, URL-safe |
| Timestamps | `createdAt` + `updatedAt` en todos los modelos |
| Enums | Como `String` con comentario de valores posibles (más flexible para migraciones) |
| Relaciones | Siempre con FK explícita + `@relation` |
| Nulabilidad | Solo nullable (`?`) cuando tiene sentido de negocio |

---

## Comandos de Base de Datos

```bash
# Sincronizar schema con la BD (sin migraciones formales — desarrollo)
npx prisma db push

# Regenerar el cliente TypeScript de Prisma
npx prisma generate

# Poblar con datos de prueba
npx tsx prisma/seed.ts

# Abrir Prisma Studio (explorador visual de la BD)
npx prisma studio

# Ver el schema actual
cat prisma/schema.prisma
```

---

## Migración: `stock` → `stockQuantity`

En una versión anterior, el campo de stock era un `Boolean`. Fue migrado a `Int` para soportar cantidades reales:

| Campo antiguo | Campo nuevo | Notas |
|---|---|---|
| `stock: Boolean` | `stockQuantity: Int` | Unidades disponibles |
| — | `stockAlert: Int` | Umbral de alerta (default: 5) |
| — | `supplierId: String?` | FK al proveedor |

La migración se realizó con `prisma db push --force-reset` dado que era un entorno de desarrollo.
