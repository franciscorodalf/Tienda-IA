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

function findProductByName(name: string): Product | undefined {
    const lowerName = name.toLowerCase();
    return products.find(p => p.name.toLowerCase().includes(lowerName));
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
        // --- GLOBAL CONTEXT INJECTION ---
        // We inject the ENTIRE catalog into the system prompt.
        // This gives the AI "perfect memory" of all products without needing to search.
        const catalogContext = products.map(p =>
            `- ${p.name} (${p.category}): ${p.description}. Precio: ${p.price}. Colores: ${p.colors.join(', ')}. Tallas: ${p.sizes.join(', ')}.`
        ).join('\n');

        const systemMessageWithContext = `${SYSTEM_INSTRUCTION}

        [[INVENTARIO COMPLETO - ÚSALO PARA RECOMENDAR]]
        ${catalogContext}
        
        [[INSTRUCCIÓN]]
        Si el usuario pregunta por "algo verde", "ropa para fiesta", "outfit", etc., USA EL INVENTARIO de arriba.
        NO inventes productos. Solo recomienda lo que está en la lista.
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

        // 1. First API Call
        const completion = await groq.chat.completions.create({
            messages,
            model: 'llama-3.3-70b-versatile',
            tools: TOOLS, // Only contains addToCart now
            tool_choice: 'auto',
            max_tokens: 1024,
        });

        const responseMessage = completion.choices[0].message;
        const toolCalls = responseMessage.tool_calls;

        let finalResponseText = responseMessage.content || "";
        let cartAction: CartAction | null = null;

        // 2. Handle Tool Calls
        if (toolCalls) {
            messages.push(responseMessage); // Add assistant's call to history

            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                const functionArgs = JSON.parse(toolCall.function.arguments);

                if (functionName === 'addToCart') {
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
        
        const lowerResponse = finalResponseText.toLowerCase();

        // Remove duplicates and check mention
        const productsToShow = products.filter(p => {
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