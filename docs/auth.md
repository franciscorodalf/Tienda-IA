# Sistema de Autenticación

## Visión General

Tienda.IA tiene **dos sistemas de autenticación independientes**:

1. **Auth de Administrador**: Basado en cookie simple para el panel AURA Admin
2. **Auth de Cliente**: Registro/login de usuarios de la tienda pública con bcrypt

---

## Auth de Administrador

### Flujo

```
Admin accede a /admin/[cualquier-ruta]
 │
 ▼
middleware.ts [Edge — antes del render]
 ├── ¿Ruta es /admin/login? → Pasar
 └── ¿Tiene cookie 'aura_admin_auth' = 'true'?
 ├── SÍ → Continuar al dashboard
 └── NO → Redirect a /admin/login
 
Admin en /admin/login
 │ Introduce contraseña
 │
 ▼
app/admin/login/actions.ts [Server Action]
 ├── Verifica contraseña (variable de entorno)
 ├── Si correcta → Set cookie 'aura_admin_auth=true' (HttpOnly, Secure)
 └── Redirect a /admin
 
Admin hace Logout
 │
 ▼
Server Action logoutAction
 ├── Elimina cookie 'aura_admin_auth'
 └── Redirect a /admin/login
```

### Implementación del Middleware

```typescript
// middleware.ts
export function middleware(req: NextRequest) {
 const { pathname } = req.nextUrl;

 if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
 const authCookie = req.cookies.get('aura_admin_auth');
 if (!authCookie || authCookie.value !== 'true') {
 return NextResponse.redirect(new URL('/admin/login', req.url));
 }
 }

 // Si ya está logueado e intenta ir al login → redirect al dashboard
 if (pathname === '/admin/login') {
 const authCookie = req.cookies.get('aura_admin_auth');
 if (authCookie?.value === 'true') {
 return NextResponse.redirect(new URL('/admin', req.url));
 }
 }
}

export const config = {
 matcher: '/admin/:path*', // Solo aplica a rutas bajo /admin
};
```

### Consideraciones de Seguridad

| Aspecto | Estado actual | Mejora recomendada |
|---|---|---|
| Contraseña | Hardcoded / env variable | Almacenar hash bcrypt |
| Token | Cookie simple `true/false` | JWT con expiración |
| Sesiones | Sin expiración | Añadir `maxAge` a la cookie |
| CSRF | No protegido | Tokens CSRF en formularios |

Para un proyecto en producción real se recomienda implementar **NextAuth.js** con un provider de credenciales.

---

## Auth de Clientes (Tienda)

### Flujo de Registro

```
Usuario rellena /register (nombre, email, password)
 │
 ▼
Server Action registerAction
 ├── Verificar si el email ya existe en Customer
 ├── Si existe → error "Email ya registrado"
 ├── bcrypt.hash(password, 12) → passwordHash
 └── prisma.customer.create({ email, name, passwordHash })
 └── Redirect a /login
```

### Flujo de Login

```
Usuario introduce email + password en /login
 │
 ▼
Server Action loginAction
 ├── prisma.customer.findUnique({ where: { email } })
 ├── Si no existe → error "Email no encontrado"
 ├── bcrypt.compare(password, customer.passwordHash)
 ├── Si no coincide → error "Contraseña incorrecta"
 └── Set cookie de sesión de cliente (nombre, email)
 └── Redirect a /
```

### Modelo de Cliente en BD

```prisma
model Customer {
 id String @id @default(cuid())
 email String @unique
 passwordHash String // bcrypt hash (cost factor 12)
 name String
 role String @default("USER")
 
 orders Order[]
 createdAt DateTime @default(now())
 updatedAt DateTime @updatedAt
}
```

### bcrypt — Por qué cost factor 12

El cost factor define cuánto trabajo computacional requiere generar el hash:

| Cost Factor | Tiempo aprox | Seguridad |
|---|---|---|
| 10 | ~100ms | Mínimo aceptable |
| **12** | ~400ms | **Recomendado (equilibrio)** |
| 14 | ~1.6s | Alto (puede ser lento en registro) |

Con cost factor 12, aunque un atacante obtenga la BD, cada intento de crackear 1 contraseña tarda ~400ms → ataques de fuerza bruta inviables en la práctica.

---

## Separación de Dominios de Auth

Es importante destacar que las dos auth son **completamente independientes**:

| Aspecto | Admin | Cliente |
|---|---|---|
| Cookie | `aura_admin_auth` | `aura_customer_session` |
| Verificación | Middleware (Edge) | Server Actions |
| Almacenamiento | Variable de entorno | BD (bcrypt hash) |
| Protección | Todas las rutas `/admin/*` | Solo rutas de compra |

Un cliente autenticado en la tienda **no puede** acceder al admin panel, y viceversa.
