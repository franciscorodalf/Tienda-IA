import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';
import { products } from '@/lib/data';
import { groq } from '@/lib/groq';
import { SYSTEM_INSTRUCTION, TOOLS } from '@/lib/ai-config';

// --- TYPES ---
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stock: boolean;
    colors: string[];
    sizes: string[];
    features: string[];
}

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

async function searchProducts(query: string): Promise<Product[]> {
    console.log(`🔎 [Backend] Buscando: "${query}"`);

    // Normalize query: remove punctuation, lowercase
    const cleanQuery = query.toLowerCase().replace(/[.,?¿!¡]/g, '');
    const terms = cleanQuery.split(' ').filter(t => t.length > 3); // Filter out short words, requiring >3 chars

    return products.filter((product) => {
        // Create strings for specific fields
        const name = product.name.toLowerCase();
        const category = product.category.toLowerCase();
        const description = product.description.toLowerCase();
        const colors = product.colors.join(' ').toLowerCase();

        // Strict Priority Check:
        // 1. If query mentions a category explicitly, filter mainly by that.
        // 2. Otherwise, check for keywords in name/description.

        const matchesTerm = (term: string) => {
            return name.includes(term) || category.includes(term) || description.includes(term) || colors.includes(term);
        };

        // AND logic for multi-word queries usually yields better "specific" results,
        // but OR logic is safer for loose queries.
        // Let's try a hybrid: 
        // If term is a known category keyword, it MUST match the category.

        const categoryKeywords = ['hoodie', 'camiseta', 'pantalon', 'jacket', 'chaqueta', 'abrigo', 'gorra', 'zapatillas', 'sneaker', 'boots'];

        for (const term of terms) {
            if (categoryKeywords.includes(term)) {
                // If the user said "hoodie", the product MUST be a hoodie (or have hoodie in name/cat).
                if (!category.includes(term) && !name.includes(term)) {
                    return false;
                }
            }
        }

        // Default to permissive check for other terms (colors, styles)
        return terms.some(term => matchesTerm(term));
    });
}

function findProductByName(name: string): Product | undefined {
    const lowerName = name.toLowerCase();
    return products.find(p => p.name.toLowerCase().includes(lowerName));
}


// --- FALLBACK LOGIC ---

async function fallbackHandler(message: string): Promise<ChatResponse> {
    const lowerMsg = message.toLowerCase();
    console.log(`⚠️ [Fallback] Processing locally: "${message}"`);

    // 1. Search Intent
    if (['busca', 'tienes', 'quiero', 'muéstrame', 'enseñame'].some(w => lowerMsg.includes(w))) {
        const foundProducts = await searchProducts(message);

        if (foundProducts.length > 0) {
            return {
                text: `**Modo Offline:** La conexión neuronal está inestable (API Quota), pero accedí al inventario local. He encontrado **${foundProducts.length}** prendas que encajan con tu vibe. Chequea abajo 👇`,
                products: foundProducts
            };
        }
        return {
            text: `**Modo Offline:** No encontré nada en nuestra base de datos local para eso. Intenta ser más específico (ej: "hoodie negro", "oversized").`
        };
    }

    // 2. Help/Greeting Intent
    if (['hola', 'buenas', 'ayuda'].some(w => lowerMsg.includes(w))) {
        return {
            text: `**System Reboot:** Mis servicios cognitivos están al máximo de capacidad (Rate Limited), pero sigo operativo en modo básico. \n\nPuedo **buscarte productos** si me dices qué necesitas (ej: "camisetas blancas").`
        };
    }

    return {
        text: `**Error de Conexión:** Mis neuronas están sobrecargadas ahora mismo (Google API Error). \n\nNo puedo procesar conversaciones complejas, pero si buscas ropa, simplemente escribe qué buscas y consultaré el inventario manualmente.`
    };
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
        return NextResponse.json(await fallbackHandler(message));
    }

    try {
        // Map history to Groq format
        let messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
            { role: 'system', content: SYSTEM_INSTRUCTION },
            ...(history?.map((msg: any) => ({
                role: msg.role === 'model' ? 'assistant' : msg.role as 'user' | 'assistant' | 'system',
                content: msg.parts ? msg.parts[0].text : msg.content
            })) || []),
            { role: 'user', content: message }
        ];

        console.log(`💬 [Usuario]: ${message}`);

        // --- OPTIMIZATION (RAG-lite) ---
        // Pre-fetch products if the user seems to be searching, to avoid a tool round-trip.
        // We do a "fuzzy" check here. If we find something, we give it to the AI.
        const lowerMsg = message.toLowerCase();
        let matchedProducts: Product[] = []; // Initialize here to capture RAG results

        if (['busca', 'tienes', 'hay', 'quiero', 'necesito', 'hoodie', 'camiseta', 'pantalon', 'oversize', 'talla', 'precio', 'costo', 'color', 'medidas', 'stock', 'titan', 'stomp', 'pulse', 'outfit', 'look', 'set', 'combinar', 'chaqueta', 'jacket', 'abrigo', 'bomber', 'puffer', 'zapatillas', 'sneaker', 'shoes', 'gorra', 'gorras', 'botas'].some(w => lowerMsg.includes(w))) {
            const contextProducts = await searchProducts(message);
            if (contextProducts.length > 0) {
                console.log(`⚡ [RAG] Contexto inyectado con ${contextProducts.length} productos.`);
                matchedProducts = contextProducts; // Capture for final response

                // Inject a system message right before the user message
                const contextMessage: Groq.Chat.Completions.ChatCompletionMessageParam = {
                    role: 'system',
                    content: `SYSTEM CONTEXT: El usuario podría estar interesado en estos productos disponibles en stock. Úsalos para responder directamente sin llamar a 'searchProducts' si encajan con la búsqueda:\n${JSON.stringify(contextProducts.map(p => ({ name: p.name, price: p.price, features: p.features, colors: p.colors })), null, 2)}`
                };
                // Insert before the last message (User)
                messages.splice(messages.length - 1, 0, contextMessage);
            }
        }
        // -------------------------------

        // 1. First API Call
        // SAFETY LOCK REFINED: 
        // If we found products via RAG, we don't need 'searchProducts' (redundant/risk of hallucination).
        // BUT we MUST allow 'addToCart'.
        let availableTools = TOOLS;
        if (matchedProducts.length > 0) {
            // Remove searchProducts from the tools list, keep addToCart
            // Cast to any to avoid strict TS check on 'function' property availability
            availableTools = TOOLS.filter((t: any) => t.function?.name !== 'searchProducts');
            console.log(`🔒 [Safety Lock] RAG activo: 'searchProducts' deshabilitado, 'addToCart' disponible.`);
        }

        const completion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.3-70b-versatile',
            tools: availableTools,
            tool_choice: 'auto',
            max_tokens: 1024,
        });

        const responseMessage = completion.choices[0].message;
        const toolCalls = responseMessage.tool_calls;

        let finalResponseText = responseMessage.content || "";
        let cartAction: CartAction | null = null;
        // matchedProducts is already potentially populated from RAG

        // 2. Handle Tool Calls
        if (toolCalls) {
            messages.push(responseMessage); // Add assistant's call to history

            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                const functionArgs = JSON.parse(toolCall.function.arguments);

                if (functionName === 'searchProducts') {
                    const { query } = functionArgs as SearchToolArgs;
                    const toolProducts = await searchProducts(query);
                    matchedProducts = [...matchedProducts, ...toolProducts]; // Merge results
                    console.log(`✅ [Backend] Encontrados ${toolProducts.length} productos.`);

                    messages.push({
                        tool_call_id: toolCall.id,
                        role: 'tool',
                        content: JSON.stringify({
                            products: toolProducts.map(p => ({
                                name: p.name,
                                price: p.price,
                                description: p.description,
                                colors: p.colors,
                                sizes: p.sizes,
                                features: p.features
                            }))
                        }),
                    });
                }
                else if (functionName === 'addToCart') {
                    const { productName, size, color } = functionArgs as AddToCartToolArgs;
                    console.log(`🛒 [Backend] Intentando añadir al carrito: ${productName}`);

                    const product = findProductByName(productName);
                    let result;

                    if (product) {
                        cartAction = {
                            type: 'ADD',
                            product,
                            size: size || product.sizes?.[0] || 'One Size',
                            color: color || product.colors?.[0] || 'Default'
                        };
                        result = { success: true, message: `Añadido ${product.name} al carrito.` };
                    } else {
                        result = { success: false, message: `No encontré el producto ${productName}.` };
                    }

                    messages.push({
                        tool_call_id: toolCall.id,
                        role: 'tool',
                        content: JSON.stringify(result),
                    });
                }
            }

            // 3. Second API Call (after tools)
            const secondResponse = await groq.chat.completions.create({
                messages,
                model: 'llama-3.3-70b-versatile',
            });

            finalResponseText = secondResponse.choices[0].message.content || "";
        }

        // --- FILTERING (GLOBAL SCAN) ---
        // Instead of only checking 'matchedProducts', we verify against the ENTIRE catalog.
        // This ensures that if the AI mentions a product from history or knowledge that wasn't retrieved in this specific RAG step, it still shows up.

        const lowerResponse = finalResponseText.toLowerCase();

        // Remove duplicates via Set and check mention
        const productsToShow = products.filter(p => {
            // Check if the full name appears
            if (lowerResponse.includes(p.name.toLowerCase())) return true;

            // Fallback: Check for quoted model name (e.g. "Titan" from 'Chunky Sneaker "Titan"')
            const parts = p.name.split('"');
            if (parts.length > 1) {
                const modelName = parts[1].toLowerCase();
                // Avoid confusing common words if model name is simple, but "Titan", "Chaos", "Tech" are distinct enough in this context
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
        return NextResponse.json(await fallbackHandler(message));
    }
}