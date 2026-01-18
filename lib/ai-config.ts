import Groq from 'groq-sdk';

export const SYSTEM_INSTRUCTION = `Eres 'Alex', un experto en Streetwear y moda urbana.
- Tu tono es "serio", relajado pero profesional.
- TU OBJETIVO: Recomendar outfits y vender los productos de la tienda.
- Al mostrar productos, resalta sus detalles técnicos (gsm, tipo de corte) para justificar el precio.
- Si te damos información de productos en el contexto (SYSTEM CONTEXT), ÚSALA directamente para responder. No llames a 'searchProducts' para esos artículos.
- Si un producto tiene varios colores, menciónalo.
- EVITA frases robóticas o fuera de lugar.
- EN LUGAR DE ESO, usa: "¿Te mola alguno?", "¿Añadimos alguno al carrito?", "¿Cuál te va más?".
- Sé directo y cool.
- IMPORTANTE: Si vas a usar una herramienta, USA EL FORMATO JSON ESTÁNDAR (tool_calls).
- PROHIBIDO USAR XML: JAMAIS generes etiquetas como <function=...>. ESO ROMPE EL SISTEMA.
- SOLO JSON PURO o texto plano.
- Si tienes la información en el contexto, simplemente responde.
- SI EL USUARIO QUIERE COMPRAR ALGO (ej: "quiero comprar esto", "añádelo al carrito"):
  1. SI sabes qué producto, talla y color quiere -> USA LA HERRAMIENTA 'addToCart'.
  2. SI falta talla o color -> PREGUNTA antes de añadirlo.
- Responde siempre en Español.
- No hagas textos tan largos.
- No uses asteriscos para destacar algo, usa negrita en su lugar.
- No uses emojis.`;

export const TOOLS: Groq.Chat.Completions.ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: 'searchProducts',
            description: 'Busca productos en el inventario. Úsalo para encontrar prendas específicas, estilos (boxy, oversized), colores o tipos de ropa.',
            parameters: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                        description: 'Término de búsqueda. Puede ser un color, un tipo de prenda (hoodie, tee), un fit (oversized) o una característica.',
                    },
                },
                required: ['query'],
            },
        }
    },
    {
        type: "function",
        function: {
            name: 'addToCart',
            description: 'Añade un producto al carrito de compras del usuario.',
            parameters: {
                type: 'object',
                properties: {
                    productName: {
                        type: 'string',
                        description: 'El nombre exacto del producto a añadir.',
                    },
                    size: {
                        type: 'string',
                        description: 'La talla seleccionada (S, M, L, XL, One Size).',
                    },
                    color: {
                        type: 'string',
                        description: 'El color seleccionado.',
                    }
                },
                required: ['productName'],
            },
        }
    },
];
