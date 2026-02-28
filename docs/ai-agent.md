# Sistema de IA — Alex, Personal Shopper

## ¿Qué es Alex?

Alex es el asistente virtual de Tienda.IA. No es un chatbot genérico: está condicionado específicamente para actuar como un **experto en moda streetwear** capaz de recomendar productos, resolver dudas técnicas sobre tejidos y gestionar el carrito de forma autónoma.

---

## Modelo y Proveedor

| Parámetro | Valor |
|---|---|
| Proveedor | **Groq** |
| Modelo | `llama-3.3-70b-versatile` |
| Latencia media | ~300-600ms (Groq LPU hardware) |
| Max tokens | 1024 por respuesta |
| Tool choice | `auto` |

Groq se eligió por su **velocidad extrema** gracias a sus LPU (Language Processing Units), que ofrecen latencias 10-20x menores que soluciones convencionales como OpenAI o Anthropic para modelos de tamaño similar.

---

## Arquitectura de Contexto (RAG Ligero)

El sistema **no inyecta el catálogo entero** en cada request (sería caro en tokens). En su lugar usa un enfoque de **RAG manual con Fuse.js**:

```
Mensaje del usuario
 │
 ▼
Fuse.js search sobre todos los productos de BD
 keys: ['name', 'category', 'description', 'colors', 'features']
 threshold: 0.6 (búsqueda tolerante a errores)
 │
 ▼
Selección de los 4 resultados más relevantes
 │
 ┌─────┴─────┐
 │ Excepción │ Si el usuario dice "todo" o "catálogo"
 │ │ → inyecta hasta 8 productos
 └─────┬─────┘
 │
 ▼
System Prompt + [[INVENTARIO RELEVANTE]] + Historial + Mensaje
 │
 ▼
Groq API → Respuesta (text + posible tool_call)
```

### ¿Por qué no RAG completo con embeddings?

Para un catálogo de 15 productos, el RAG clásico (embeddings + vector search) sería over-engineering. Fuse.js ofrece búsqueda semántica suficientemente precisa con cero latencia adicional y sin costes de embedding.

---

## System Prompt

El prompt de Alex define:

1. **Rol**: Experto en moda elegante y streetwear de AURA
2. **Tono**: Sofisticado, profesional, sin jerga ni emojis
3. **Reglas de tool_calls**: Si el usuario quiere comprar → ejecutar `addToCart`, no prometerlo
4. **Validación**: Si falta talla/color → preguntar primero (salvo talla única)
5. **Idioma**: Siempre en español
6. **Restricciones de formato**: Sin asteriscos, sin JSON visible, sin respuestas largas

```typescript
// lib/ai-config.ts
export const SYSTEM_INSTRUCTION = `Eres el Asistente Virtual de AURA...
- SI EL USUARIO QUIERE COMPRAR:
 1. Si sabes producto + talla + color → USA addToCart
 2. Si falta algún dato → PREGUNTA
`;
```

---

## Tool: `addToCart`

La única herramienta habilitada permite al modelo añadir productos al carrito del usuario.

```typescript
{
 name: "addToCart",
 description: "Añade un producto al carrito. Úsalo cuando el usuario confirme que quiere comprar.",
 parameters: {
 productName: string, // Nombre del producto (fuzzy match en backend)
 size?: string, // Talla (S, M, L, 42...)
 color?: string // Color seleccionado
 }
}
```

### Flujo del tool call

```
IA genera tool_call { name: "addToCart", args: { productName, size, color } }
 │
 ▼
Backend: findProductByName(productName, allProducts)
 1. Búsqueda exacta (includes)
 2. Fallback: fuzzy match (75% de palabras coinciden)
 │
 ┌─────┴─────┐
 │ Encontrado │ cartAction = { type: 'ADD', product, size, color }
 │ │ → Enviado al cliente en la respuesta JSON
 └─────┬─────┘
 │
 ┌─────┴─────┐
 │ No encontrado → Mensaje de error amigable
 └───────────┘
 │
 ▼
Chat.tsx recibe cartAction
 → CartContext.addItem(product, size, color)
 → Feedback visual en UI
```

---

## Sistema de Caché

Para reducir llamadas a la API en mensajes repetidos:

```typescript
const myCache = new NodeCache({ stdTTL: 3600 }); // TTL: 1 hora

// Solo cachea si:
// 1. La conversación tiene ≤5 mensajes (no demasiado contexto acumulado)
// 2. El mensaje exacto ya fue respondido antes
// 3. La respuesta no requirió tool_calls

const cacheKey = message.toLowerCase().trim();
if (!isActionOrComplex && myCache.has(cacheKey)) {
 return cachedResponse; // Sin llamada a Groq
}
```

Esto es especialmente útil para preguntas frecuentes como "¿qué tipos de tejido usáis?" o "¿hacéis envíos internacionales?".

---

## Filtrado de Productos en UI

Alex menciona productos por nombre en su respuesta. El frontend filtra qué tarjetas mostrar:

```typescript
const productsToShow = activeProducts.filter(p => {
 // Coincidencia por nombre completo
 if (lowerResponse.includes(p.name.toLowerCase())) return true;
 
 // Fallback: nombre entre comillas del modelo (ej: "Stomp" en 'Combat Boots "Stomp"')
 const modelName = p.name.split('"')[1];
 if (modelName && lowerResponse.includes(modelName.toLowerCase())) return true;
 
 return false;
});
```

Solo se muestran tarjetas de productos que la IA ha mencionado **explícitamente**, evitando ruido visual.

---

## Integración con Fichas de Producto

El botón "Ideas de Outfit" y "Detalles" en el modal de producto abre el chat con un **mensaje predefinido** que incluye el contexto del producto específico, permitiendo conversaciones contextuales sin que el usuario tenga que repetir de qué prenda habla.
