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
                description: 'Busca productos en el inventario. Úsalo SIEMPRE que el usuario pregunte por prendas, disponibilidad, "algo para X evento" o tipos de ropa.',
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        query: {
                            type: SchemaType.STRING,
                            description: 'Término de búsqueda (ej: "vestido rojo", "pantalones", "casual").',
                        },
                    },
                    required: ['query'],
                },
            },
        ],
    },
];

// 3. Inicializar Modelo con "Instrucción de Sistema"
// Esto es mejor que pegarle el prompt en cada mensaje.
const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    tools: tools as any,
    systemInstruction: `Actúa como 'Alex', un Personal Shopper experto, con estilo y muy amable para una tienda de ropa online. 
  - Responde siempre en Español. 
  - Tu objetivo es vender y ayudar.
  - IMPORTANTE: Si encuentras productos, menciona 1 o 2 detalles clave sobre ellos para "venderlos" bien.
  - Sé breve y conversacional.`,
});

// Función auxiliar de búsqueda (Tu lógica backend)
async function searchProducts(query: string) {
    console.log(`🔎 [Backend] Buscando: "${query}"`);
    const lowerQuery = query.toLowerCase();
    return products.filter((product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
}

export async function POST(req: Request) {
    console.log("DEBUG: POST /api/chat hit");
    try {
        const body = await req.json();
        console.log("DEBUG: Body received", JSON.stringify(body));
        const { history, message } = body;

        if (!process.env.GOOGLE_API_KEY) {
            console.error("DEBUG: API Key missing");
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

        // --- LÓGICA CRÍTICA ---
        if (functionCalls && functionCalls.length > 0) {
            // 1. La IA quiere buscar productos
            const call = functionCalls[0];

            if (call.name === 'searchProducts') {
                const { query } = call.args as { query: string };

                // 2. Ejecutamos tu función de búsqueda
                matchedProducts = await searchProducts(query);
                console.log(`✅ [Backend] Encontrados ${matchedProducts.length} productos.`);

                // 3. Preparamos la respuesta para la IA (Function Response)
                // La IA necesita saber qué encontró para poder hablar de ello.
                const functionResponse = [
                    {
                        functionResponse: {
                            name: 'searchProducts',
                            response: {
                                products: matchedProducts.map(p => ({
                                    name: p.name,
                                    price: p.price,
                                    description: p.description // Le damos la descrip para que pueda opinar
                                }))
                            }
                        }
                    }
                ];

                // 4. Enviamos el resultado de la función de vuelta a la IA
                const finalResult = await chat.sendMessage(functionResponse);

                // 5. Ahora sí, obtenemos el texto final (la IA diciendo: "He encontrado estos pantalones...")
                finalResponseText = finalResult.response.text();
            }
        } else {
            // Si NO hubo llamada a función, es una charla normal.
            // Solo aquí es seguro llamar a .text()
            finalResponseText = response.text();
        }

        return NextResponse.json({
            text: finalResponseText,
            products: matchedProducts.length > 0 ? matchedProducts : undefined,
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