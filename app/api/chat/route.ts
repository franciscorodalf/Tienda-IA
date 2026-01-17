import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { products } from '@/lib/data';
import { NextResponse } from 'next/server';

// 1. Configuración Inicial
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// 2. Definición de Herramientas (Tu "Buscador")
const tools = [
    {
        functionDeclarations: [
            {
                name: 'searchProducts',
                description: 'Busca productos en el inventario. Úsalo para encontrar prendas específicas, estilos (boxy, oversized), colores o tipos de ropa.',
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        query: {
                            type: SchemaType.STRING,
                            description: 'Término de búsqueda. Puede ser un color, un tipo de prenda (hoodie, tee), un fit (oversized) o una característica.',
                        },
                    },
                    required: ['query'],
                },
            },
            {
                name: 'addToCart',
                description: 'Añade un producto al carrito de compras del usuario.',
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        productName: {
                            type: SchemaType.STRING,
                            description: 'El nombre exacto del producto a añadir.',
                        },
                        size: {
                            type: SchemaType.STRING,
                            description: 'La talla seleccionada (S, M, L, XL, One Size).',
                        },
                        color: {
                            type: SchemaType.STRING,
                            description: 'El color seleccionado.',
                        }
                    },
                    required: ['productName'],
                },
            },
        ],
    },
];

// 3. Inicializar Modelo con "Instrucción de Sistema"
const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    tools: tools as any,
    systemInstruction: `Eres 'Alex', un experto en Streetwear y moda urbana.
  - Tu tono es "serio", relajado pero profesional.
  - TU OBJETIVO: Recomendar outfits y vender los productos de la tienda.
  - Al mostrar productos, resalta sus detalles técnicos (gsm, tipo de corte) para justificar el precio.
  - Si un producto tiene varios colores, menciónalo.
  - SI EL USUARIO QUIERE COMPRAR ALGO (ej: "quiero comprar esto", "añádelo al carrito"):
    1. SI sabes qué producto, talla y color quiere -> USA LA HERRAMIENTA 'addToCart'.
    2. SI falta talla o color -> PREGUNTA antes de añadirlo.
  - Responde siempre en Español.
  - No hagas textos tan largos.
  - No uses asteriscos para destacar algo, usa negrita en su lugar.
  - No uses emojis.`,

});

// Función auxiliar de búsqueda (Tu lógica backend)
async function searchProducts(query: string) {
    console.log(`🔎 [Backend] Buscando: "${query}"`);
    const lowerQuery = query.toLowerCase();

    return products.filter((product) => {
        const inName = product.name.toLowerCase().includes(lowerQuery);
        const inDesc = product.description.toLowerCase().includes(lowerQuery);
        const inCat = product.category.toLowerCase().includes(lowerQuery);
        // Nuevos campos de búsqueda
        const inColors = product.colors.some(c => c.toLowerCase().includes(lowerQuery));
        const inFeatures = product.features.some(f => f.toLowerCase().includes(lowerQuery));

        return inName || inDesc || inCat || inColors || inFeatures;
    });
}

function findProductByName(name: string) {
    const lowerName = name.toLowerCase();
    return products.find(p => p.name.toLowerCase().includes(lowerName));
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { history, message } = body;

        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
        }

        // Limpiamos el historial para evitar errores de formato
        const validHistory = history?.filter((msg: any) => msg.role === 'user' || msg.role === 'model') || [];

        const chat = model.startChat({
            history: validHistory,
        });

        console.log(`💬 [Usuario]: ${message}`);

        // Enviamos el mensaje
        const result = await chat.sendMessage(message);
        const response = await result.response;

        // Obtenemos las llamadas a funciones (si las hay)
        const functionCalls = response.functionCalls();

        let finalResponseText = "";
        let matchedProducts: any[] = [];
        let cartAction = null;

        // --- LÓGICA CRÍTICA ---
        if (functionCalls && functionCalls.length > 0) {
            // 1. La IA quiere usar una herramienta
            const call = functionCalls[0];

            if (call.name === 'searchProducts') {
                const { query } = call.args as { query: string };
                matchedProducts = await searchProducts(query);
                console.log(`✅ [Backend] Encontrados ${matchedProducts.length} productos.`);

                const functionResponse = [
                    {
                        functionResponse: {
                            name: 'searchProducts',
                            response: {
                                products: matchedProducts.map(p => ({
                                    name: p.name,
                                    price: p.price,
                                    description: p.description,
                                    colors: p.colors,
                                    sizes: p.sizes,
                                    features: p.features
                                }))
                            }
                        }
                    }
                ];
                const finalResult = await chat.sendMessage(functionResponse);
                finalResponseText = finalResult.response.text();
            }

            else if (call.name === 'addToCart') {
                const { productName, size, color } = call.args as { productName: string, size?: string, color?: string };
                console.log(`🛒 [Backend] Intentando añadir al carrito: ${productName} (${size}, ${color})`);

                const product = findProductByName(productName);

                if (product) {
                    // En lugar de añadirlo aquí (el backend no tiene contexto de carrito de cliente),
                    // enviamos una señal al frontend para que LO añada.

                    cartAction = {
                        type: 'ADD',
                        product: product,
                        size: size || product.sizes?.[0] || 'One Size',
                        color: color || product.colors?.[0] || 'Default'
                    };

                    const functionResponse = [
                        {
                            functionResponse: {
                                name: 'addToCart',
                                response: { success: true, message: `Añadido ${product.name} al carrito.` }
                            }
                        }
                    ];
                    const finalResult = await chat.sendMessage(functionResponse);
                    finalResponseText = finalResult.response.text();

                } else {
                    // Producto no encontrado
                    const functionResponse = [
                        {
                            functionResponse: {
                                name: 'addToCart',
                                response: { success: false, message: `No encontré el producto ${productName}.` }
                            }
                        }
                    ];
                    const finalResult = await chat.sendMessage(functionResponse);
                    finalResponseText = finalResult.response.text();
                }
            }

        } else {
            finalResponseText = response.text();
        }

        return NextResponse.json({
            text: finalResponseText,
            products: matchedProducts.length > 0 ? matchedProducts : undefined,
            cartAction: cartAction
        });

    } catch (error: any) {
        console.error('❌ Error in chat route:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message || String(error),
            stack: error.stack
        }, { status: 500 });
    }
}