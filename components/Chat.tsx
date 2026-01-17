'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Product } from '@/lib/data';
import { ProductModal } from './ProductModal';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'model';
    text: string;
    products?: Product[];
}

export default function Chat() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            text: "¡Hola! Soy tu Personal Shopper con IA. Puedo ayudarte a encontrar productos, verificar stock o darte consejos de moda. Prueba buscando 'chaquetas' o 'algo para el verano'.",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare history for API (simplified)
            // Filter out messages to ensure valid history for Gemini (starts with user)
            const history = messages
                .filter(m => m.role === 'user' || m.role === 'model')
                .slice(1) // Skip the initial welcome message from model
                .map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.text }]
                }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.text,
                    history: history,
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            const aiMessage: Message = {
                role: 'model',
                text: data.text,
                products: data.products,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'model', text: 'Lo siento, hubo un error. Por favor intenta de nuevo.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col h-full bg-gray-50 font-sans">
                {/* Chat Header */}
                <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-3 shadow-sm z-10">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                        <Bot size={18} />
                    </div>
                    <div>
                        <h2 className="font-bold text-sm text-gray-900">AI Stylist</h2>
                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            En línea
                        </p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {messages.map((msg, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={idx}
                            className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-200 text-gray-700' : 'bg-black text-white'
                                    }`}
                            >
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                            ? 'bg-black text-white rounded-tr-none'
                                            : 'bg-white text-gray-900 border border-gray-200 rounded-tl-none font-medium'
                                        }`}
                                >
                                    {msg.text}
                                </div>

                                {/* Render Products if available */}
                                {msg.products && msg.products.length > 0 && (
                                    <div className="mt-3 grid gap-2 w-full">
                                        {msg.products.map((product) => (
                                            <div
                                                key={product.id}
                                                onClick={() => setSelectedProduct(product)}
                                                className="bg-white p-2 rounded-xl border border-gray-200 hover:border-black cursor-pointer transition-all flex gap-3 items-center group shadow-sm"
                                            >
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-black">{product.name}</h4>
                                                    <span className="text-xs text-gray-700 font-medium">${product.price}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
                                <Bot size={16} />
                            </div>
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                                <Loader2 size={16} className="animate-spin text-gray-400" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            disabled={isLoading}
                            className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50 focus:bg-white text-gray-900"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>

            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </>
    );
}
