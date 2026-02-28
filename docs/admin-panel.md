# Panel de Administración — AURA Admin

## Acceso

- **URL**: `/admin` (redirige a `/admin/login` si no autenticado)
- **Protección**: Middleware de Next.js que verifica la cookie `aura_admin_auth`
- **Credenciales**: Configuradas en variables de entorno o en el action de login

---

## Secciones del Panel

### 1. Dashboard (Overview)

**Ruta**: `/admin`

Muestra métricas en tiempo real calculadas directamente desde Supabase:

| Métrica | Cálculo |
|---|---|
| Total Products | `prisma.product.count()` |
| Orders | `prisma.order.count()` |
| Customers | `prisma.customer.count()` |
| Low Stock | `prisma.product.count({ where: { stockQuantity: { lte: 5 } } })` |
| Inventory Value | `SUM(price × stockQuantity)` de productos con stock > 0 |

Alerta visual si hay productos con stock bajo o agotado (≤5 unidades).

---

### 2. Inventory

**Ruta**: `/admin/inventory`

Tabla de todos los productos con:
- Imagen miniatura
- Nombre + descripción truncada
- SKU (productId)
- Categoría
- Precio
- **Badge de stock dinámico**:
 - Verde: `stockQuantity > stockAlert` (stock saludable + número de uds)
 - Amarillo: `0 < stockQuantity ≤ stockAlert` (stock bajo)
 - Rojo: `stockQuantity === 0` (agotado)
- Botones de Editar y Eliminar

#### Crear nuevo producto

**Ruta**: `/admin/inventory/new`

Formulario con campos:
- Nombre, descripción, categoría, precio
- URL de imagen
- Colores (separados por coma)
- Tallas (separadas por coma)
- Features/características (separadas por coma)
- Stock inicial (número de unidades)

El `productId` (SKU) se **auto-genera** basándose en el último productId existente para evitar colisiones manuales.

---

### 3. Orders

**Ruta**: `/admin/orders`

Listado de pedidos de clientes con estado: `PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`.

---

### 4. Customers

**Ruta**: `/admin/customers`

Tabla de usuarios registrados (nombre, email, fecha de registro). La columna "Role" fue eliminada para simplificar la UI.

---

### 5. Suppliers 

**Ruta**: `/admin/suppliers`

CRUD completo de proveedores. Layout de dos columnas:

**Columna izquierda — Lista de proveedores:**
- Nombre + país con bandera emoji (...)
- Badge de lead time con semáforo:
 - ≤4 días
 - 5-8 días
 - ≥9 días
- Email de contacto
- Contadores: nº de productos y purchase orders asociados
- Link "Create PO →" que pre-selecciona el proveedor en el formulario de PO
- Botón eliminar (desvincula productos antes de borrar)

**Columna derecha — Formulario sticky "New Supplier":**
- Nombre de empresa (obligatorio)
- Email de contacto (opcional)
- Selector de país (18 países con banderas)
- Lead time personalizable → si se deja en blanco, **se calcula automáticamente** por el país:

```typescript
const LEAD_TIME_BY_COUNTRY = {
 'Spain': 2, 'Portugal': 3, 'Germany': 4,
 'Turkey': 7, 'China': 18, 'Vietnam': 17, ...
}
```

---

### 6. Purchase Orders 

**Ruta**: `/admin/purchases`

Tabla de todas las órdenes de compra con:
- ID corto (últimos 6 caracteres del CUID)
- Proveedor + país
- Nº de SKUs y unidades totales
- Fecha estimada de llegada (calculada en creación)
- Estado con badge
- Enlace "Manage →" para ver detalle

#### Crear nueva Purchase Order

**Ruta**: `/admin/purchases/new`

Formulario en 3 pasos:

**Paso 1 — Seleccionar Proveedor**
Cards visuales de todos los proveedores. Al seleccionar uno:
- Se muestra la **fecha estimada de llegada** (hoy + leadTimeDays del proveedor)
- La lista de productos del paso 2 se filtra automáticamente

**Paso 2 — Productos a pedir**
Solo muestra los productos asignados al proveedor seleccionado. Por cada producto:
- Imagen + nombre + stock actual (con alerta si bajo)
- Input de coste por unidad (pre-rellenado al 50% del PVP como estimación)
- Input de cantidad a pedir (0 = no pedir)

**Paso 3 — Notas opcionales**

Al enviar, se crea la PO con estado `DRAFT` y `expectedAt` = hoy + `leadTimeDays`.

#### Detalle de Purchase Order

**Ruta**: `/admin/purchases/[id]`

- **Stepper visual** de 4 etapas: Borrador → Enviado → Confirmado → Recibido
- Botón de avance del estado con texto contextual:
 - `DRAFT` → "Marcar como Enviado al Proveedor"
 - `SENT` → "Marcar como Confirmado"
 - `CONFIRMED` → "Confirmar Recepción de Mercancía"
- **Al pasar a `RECEIVED`**: se suma automáticamente `quantityOrdered` al `stockQuantity` de cada producto
- Tabla de líneas de pedido con coste/ud y total
- Nota de la orden si existe

---

## Server Actions

Cada sección tiene su archivo `actions.ts` con funciones marcadas con `'use server'`:

```
app/admin/(dashboard)/
├── inventory/actions.ts → createProduct, deleteProduct
├── suppliers/actions.ts → createSupplier, deleteSupplier
└── purchases/actions.ts → createPurchaseOrder, advancePOStatus
```

Tras cada mutación se llama a `revalidatePath()` para que Next.js invalide la caché y muestre datos frescos sin recargar manualmente.

---

## Seguridad del Admin

1. **Middleware**: Todas las rutas `/admin/*` (excepto `/admin/login`) verifican la cookie antes de renderizar
2. **Server Actions**: Se ejecutan en el servidor, nunca exponen lógica al cliente
3. **Mejora futura**: Implementar JWT o NextAuth para autenticación más robusta
