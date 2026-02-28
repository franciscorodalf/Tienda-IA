# Sistema de Inventario y Proveedores

## Motivación

El inventario de una tienda real no es solo un campo "en stock / sin stock". Las tiendas gestionan:

1. **Cantidades exactas** por referencia (SKU)
2. **Umbrales de alerta** para reordenar antes de quedarse sin stock
3. **Múltiples proveedores** — una tienda de ropa no compra todo a un único fabricante
4. **Tiempos de entrega** variables según el país de origen del proveedor
5. **Órdenes de compra** como documento formal de solicitud de mercancía

Tienda.IA implementa exactamente este flujo de manera realista.

---

## Modelo de Datos

### Supplier (Proveedor)

```prisma
model Supplier {
 id String @id @default(cuid())
 name String
 contactEmail String?
 country String
 leadTimeDays Int // Días de tránsito estimados desde España
 
 products Product[]
 purchaseOrders PurchaseOrder[]
 
 createdAt DateTime @default(now())
 updatedAt DateTime @updatedAt
}
```

### Product (actualizado)

```prisma
model Product {
 id String @id @default(cuid())
 productId String @unique // SKU legible (ej: "t-001")
 name String
 price Float
 description String
 category String
 stockQuantity Int @default(0) // Unidades disponibles
 stockAlert Int @default(5) // Umbral mínimo antes de alerta
 imageUrl String
 colors String[]
 sizes String[]
 features String[]
 supplierId String? // Proveedor principal
 
 supplier Supplier? @relation(...)
 orderItems OrderItem[]
 purchaseOrderItems PurchaseOrderItem[]
}
```

### PurchaseOrder (Orden de Compra)

```prisma
model PurchaseOrder {
 id String @id @default(cuid())
 supplierId String
 status String @default("DRAFT") // DRAFT|SENT|CONFIRMED|RECEIVED
 notes String?
 expectedAt DateTime? // Fecha estimada de llegada
 
 supplier Supplier @relation(...)
 items PurchaseOrderItem[]
}

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

## Proveedores Realistas por Defecto (Seed)

El seed incluye 4 proveedores que representan distintas regiones geográficas reales del mundo textil:

| Proveedor | País | Lead Time | Categorías |
|---|---|---|---|
| UrbanTextile Co. | Portugal | 3 días | Tops, sudaderas, camisetas |
| NordStyle GmbH | Alemania | 4 días | Outerwear, pantalones |
| AccessPro S.r.l. | Italia | 4 días | Accesorios, calzado |
| AsiaTex Ltd. | China | 18 días | Volumen / genéricos |

### ¿Por qué lead times distintos?

Las tiendas en la vida real gestionan esto así:
- **Portugal/España**: Producto de proximidad, envíos en 2-4 días
- **Europa central**: 3-5 días por carretera/ferrocarril
- **Turquía**: 6-8 días, punto medio entre Europa y Asia
- **China/Vietnam**: 15-20 días, volumen a bajo coste pero larga espera

---

## Cálculo Automático de Lead Time

Cuando se selecciona un país para un nuevo proveedor, el lead time se calcula automáticamente:

```typescript
const LEAD_TIME_BY_COUNTRY: Record<string, number> = {
 'Spain': 2,
 'Portugal': 3,
 'France': 3,
 'Italy': 4,
 'Germany': 4,
 'Netherlands': 4,
 'Belgium': 4,
 'Turkey': 7,
 'Morocco': 6,
 'Poland': 5,
 'China': 18,
 'Vietnam': 17,
 'India': 14,
 'Bangladesh': 16,
 'USA': 12,
 'Brazil': 15,
 'Mexico': 13,
};
```

El admin puede sobreescribir este valor si su negociación con el proveedor implica tiempos distintos.

---

## Ciclo de Vida de una Purchase Order

```
DRAFT ──────► SENT ──────► CONFIRMED ──────► RECEIVED
 │ │ │ │
 │ │ │ │
Creada Enviada Proveedor Mercancía
por admin (simulado) confirma llega al
 el pedido almacén
 │
 stockQuantity += quantityOrdered
 (para cada producto de la PO)
```

### Fechas estimadas

Al crear una PO, se calcula `expectedAt`:

```typescript
const expectedAt = new Date();
expectedAt.setDate(expectedAt.getDate() + supplier.leadTimeDays);
```

Esto permite al admin visualizar cuándo esperar la mercancía antes de confirmar el pedido.

---

## Actualización Automática del Stock

Al marcar una PO como `RECEIVED`, el sistema actualiza el stock de cada producto automáticamente:

```typescript
// purchases/actions.ts
if (next === 'RECEIVED') {
 for (const item of po.items) {
 await prisma.product.update({
 where: { id: item.productId },
 data: { stockQuantity: { increment: item.quantityOrdered } },
 });
 }
}
```

Esto simula el proceso real de "entrada de mercancía" en un ERP, donde al registrar la recepción de un albarán, el stock sube automáticamente.

---

## Alertas de Stock

El campo `stockAlert` define el umbral mínimo por producto (por defecto: 5 unidades). Cuando `stockQuantity <= stockAlert`, el producto aparece en amarillo en el inventario del admin.

| Estado | Condición | Color UI |
|---|---|---|
| Saludable | `stockQuantity > stockAlert` | Verde |
| Bajo stock | `0 < stockQuantity ≤ stockAlert` | Amarillo |
| Agotado | `stockQuantity === 0` | Rojo |

El Dashboard también muestra el número de productos en estado crítico (≤5 unidades) para que el admin actúe rápidamente creando una nueva PO.

---

## Flujo Completo — Ejemplo Práctico

```
1. Admin ve en Dashboard: "3 productos con stock bajo"
2. Va a Inventory → identifica: Pantalón Chino Beige (8 uds, alerta en 5)
3. Va a Suppliers → ve que NordStyle GmbH suministra pantalones
4. Click "Create PO →" → redirige a /purchases/new?supplierId=nordstyle-id
5. Formulario pre-selecciona NordStyle GmbH
6. Fecha estimada: hoy + 4 días (Alemania)
7. Lista solo los productos de NordStyle
8. Introduce qty: 30 uds de Pantalón Chino Beige, cost: €22.50/ud
9. Submit → PO creada en DRAFT
10. En /purchases/[id] → "Marcar como Enviado"
11. Días después → "Marcar como Confirmado"
12. Llega la mercancía → "Confirmar Recepción"
13. Sistema suma +30 a stockQuantity del Pantalón Chino Beige automáticamente
14. Dashboard ya no muestra alerta para ese producto 
```
