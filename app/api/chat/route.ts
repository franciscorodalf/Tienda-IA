import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { groq } from '@/lib/groq';
import { SYSTEM_INSTRUCTION, TOOLS } from '@/lib/ai-config';
import { Product as RawProduct } from '@/lib/data'; // Keep types from data temporarily
import NodeCache from 'node-cache';

// Creamos caché de 1 hora de duración para comandos de texto repetidos
const myCache = new NodeCache({ stdTTL: 3600 });

// --- TYPES ---
interface Product extends RawProduct { }

interface CartAction {
    type: 'ADD';
    product: Product;
    size: string;
    color: string;
}

interface ChatResponse {
    text: string;
    products?: Product[];
    cartAction?: CartAction | null;
}

interface SearchToolArgs {
    query: string;
}

interface AddToCartToolArgs {
    productName: string;
    size?: string;
    color?: string;
}


// --- HELPER FUNCTIONS ---

function findProductByName(name: string, allProducts: Product[]): Product | undefined {
    const lowerName = name.toLowerCase().trim();

    // 1. Strict (or partial) string match
    const exactMatch = allProducts.find(p => p.name.toLowerCase().includes(lowerName));
    if (exactMatch) return exactMatch;

    // 2. Fuzzy/Word match (Fallback)
    // Useful if AI translates "Combat Boots" to "Botas" or just says "Stomp"
    const searchTerms = lowerName.split(' ').filter(t => t.length > 2);

    return allProducts.find(p => {
        const productLower = p.name.toLowerCase();
        // Check if *all* significant search terms are present in the product name
        // or effectively if the "model name" (quoted part) is present.

        // Strategy: If the input has "stomp", it should match 'Combat Boots "Stomp"'
        // But we must be careful not to match "Hoodie" with "Zip-Up Hoodie" if user just said "Hoodie".

        // Count how many terms match
        const matches = searchTerms.filter(term => productLower.includes(term));
        return matches.length >= Math.ceil(searchTerms.length * 0.75); // 75% match threshold
    });
}


// --- MAIN ROUTE ---

export async function POST(req: Request) {
    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { history, message } = body;

    // Fast Check
    if (!process.env.GROQ_API_KEY) {
        return NextResponse.json({ text: "Error: Falta la API KEY de Groq." });
    }

    try {
        // Fetch products dynamically from Supabase
        const dbProducts = await prisma.product.findMany();
        const activeProducts = dbProducts.map((p: any) => ({
            id: p.productId,
            name: p.name,
            price: p.price,
            description: p.description,
            category: p.category,
            stock: p.stock,
            imageUrl: p.imageUrl,
            colors: p.colors,
            sizes: p.sizes,
            features: p.features,
        }));

        // --- RAG (Retrieval-Augmented Generation) LIGERA ---
        // En lugar de inyectar TODOS los 16 productos, buscamos los 4 más relevantes
        // basándonos en el último mensaje del usuario para ahorrar muchísimos tokens de IA.
        const Fuse = (await import('fuse.js')).default;

        const fuse = new Fuse(activeProducts, {
            keys: ['name', 'category', 'description', 'colors', 'features'],
            threshold: 0.6, // Búsqueda semántica (fuzzy matching) relajada
            includeScore: true
        });

        // Buscamos productos que coincidan con el mensaje del usuario
        const searchResults = fuse.search(message);

        // Si no detecta coincidencia específica (es un "Hola" o genérico), o si es el primer msj, pasamos algunos aleatorios 
        // o los más vendidos. En este caso pasamos los 4 primeros por defecto si no hay matches.
        let relevantProducts = activeProducts.slice(0, 4);

        if (searchResults.length > 0) {
            // Cogemos los 4 mejores resultados
            relevantProducts = searchResults.slice(0, 4).map(res => res.item);
        } else if (message.toLowerCase().includes('todo') || message.toLowerCase().includes('catálogo')) {
            // Excepción: Si nos pide expresamente ver todo, le pasamos más, max 8.
            relevantProducts = activeProducts.slice(0, 8);
        }

        const catalogContext = relevantProducts.map((p: any) =>
            `- ${p.name} (${p.category}): ${p.description}. Precio: ${p.price}. Colores: ${p.colors.join(', ')}. Tallas: ${p.sizes.join(', ')}.`
        ).join('\n');

        const systemMessageWithContext = `${SYSTEM_INSTRUCTION}

        [[INVENTARIO RELEVANTE - ÚSALO PARA RECOMENDAR]]
        Aquí tienes una MUESTRA los productos de la tienda que PUEDEN ENCAJAR con lo que pide el cliente:
        ${catalogContext}
        
        [[INSTRUCCIÓN RAG]]
        Si el usuario te ha preguntado por pantalones y ves pantalones en la lista, ofréceselos.
        Si la lista que se te ha pasado en el INVENTARIO RELEVANTE no encaja nada, dile amablemente:
        "No he encontrado exactamente eso, pero te puedo recomendar otras prendas de nuestra tienda".
        ATENCIÓN: Tienes desactivado el uso de "tools" temporalmente para optimizar tu respuesta.
        `;

        // Map history to Groq format
        let messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
            { role: 'system', content: systemMessageWithContext },
            ...(history?.map((msg: any) => ({
                role: msg.role === 'model' ? 'assistant' : msg.role as 'user' | 'assistant' | 'system',
                content: msg.parts ? msg.parts[0].text : msg.content
            })) || []),
            { role: 'user', content: message }
        ];

        console.log(`💬 [Usuario]: ${message}`);

        // 1. Caching requests for Identical Prompts (Basic Semantic Cache)
        const isActionOrComplex = history.length > 5; // Evitamos cachear si la conver es muy larga
        const cacheKey = message.toLowerCase().trim();
        let cachedResponse = null;

        if (!isActionOrComplex && myCache.has(cacheKey)) {
            console.log(`⚡ [Cache Hit] Respondiendo sin usar IA: "${message}"`);
            cachedResponse = myCache.get(cacheKey);
        }

        let responseMessage, toolCallsArr, completion;

        if (cachedResponse) {
            responseMessage = { content: cachedResponse };
            toolCallsArr = undefined;
        } else {
            completion = await groq.chat.completions.create({
                messages,
                model: 'llama-3.3-70b-versatile',
                tools: TOOLS, // Only contains addToCart now
                tool_choice: 'auto',
                max_tokens: 1024,
            });
            responseMessage = completion.choices[0].message;
            toolCallsArr = responseMessage.tool_calls;

            // Guardar en caché si es una respuesta estándar directa y limpia
            if (!toolCallsArr && responseMessage.content) {
                myCache.set(cacheKey, responseMessage.content);
            }
        }

        const toolCalls = toolCallsArr;

        let finalResponseText = (responseMessage.content as string) || "";
        let cartAction: CartAction | null = null;

        // 2. Handle Tool Calls
        if (toolCalls) {
            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                const functionArgs = JSON.parse(toolCall.function.arguments);

                if (functionName === 'addToCart') {
                    const { productName, size, color } = functionArgs as AddToCartToolArgs;
                    console.log(`🛒 [Backend] Intentando añadir al carrito: ${productName}`);

                    const product = findProductByName(productName, activeProducts);

                    if (product) {
                        cartAction = {
                            type: 'ADD',
                            product,
                            size: size || product.sizes?.[0] || 'One Size',
                            color: color || product.colors?.[0] || 'Default'
                        };
                        // 1. ELIMINADA LA DOBLE LLAMADA:
                        // No le devolvemos el resultado a la IA. Nosotros mismos cerramos la conversación
                        // indicándole al usuario que la acción se completó con éxito.
                        finalResponseText = `¡Listo! He añadido **${product.name}** a tu carrito de compras en talla ${cartAction.size} y color ${cartAction.color}. ¿Te gustaría que te recomiende algo a juego?`;

                    } else {
                        // Si falla, también respondemos desde el backend ahorrando re-llamar a la IA.
                        finalResponseText = `Vaya, he intentado añadir "${productName}" al carrito pero parece que no puedo encontrarlo exactamente así en mi sistema. ¿Podrías confirmarme el nombre desde la ficha de producto?`;
                    }
                }
            }
        }

        const lowerResponse = finalResponseText.toLowerCase();

        // Remove duplicates and check mention
        const productsToShow = activeProducts.filter((p: any) => {
            // Check if the full name appears
            if (lowerResponse.includes(p.name.toLowerCase())) return true;

            // Fallback: Check for quoted model name
            const parts = p.name.split('"');
            if (parts.length > 1) {
                const modelName = parts[1].toLowerCase();
                if (modelName.length > 2 && lowerResponse.includes(modelName)) return true;
            }
            return false;
        });

        if (productsToShow.length > 0) {
            console.log(`🧹 [Filtering] Productos mostrados en UI: ${productsToShow.length} (Mencionados explícitamente)`);
        }

        return NextResponse.json({
            text: finalResponseText,
            products: productsToShow.length > 0 ? productsToShow : undefined,
            cartAction
        });

    } catch (error: any) {
        console.error('❌ Error in chat route:', error.message);
        return NextResponse.json({ text: "Lo siento, mis neuronas se han cruzado. Intenta recargar la página." });
    }
}