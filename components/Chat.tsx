'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare, X, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Product } from '@/lib/data';
import { ProductModal } from './ProductModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useChat } from '@/context/ChatContext';
import toast from 'react-hot-toast';

interface Message {
    role: 'user' | 'model';
    text: string;
    products?: Product[];
}

export default function Chat() {
    const { isOpen, closeChat, openChat, initialMessage, clearInitialMessage } = useChat();
    // const [isOpen, setIsOpen] = useState(false); // REPLACED BY CONTEXT
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            text: "Bienvenido a AURA. ¿En qué le puedo ayudar a refinar su estilo hoy?",
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [error, setError] = useState<string | null>(null);

    const { addItem, setIsCartOpen } = useCart();

    // Auto-open logic: Runs once per session
    useEffect(() => {
        const hasOpened = sessionStorage.getItem('chatHasOpened');
        if (!hasOpened) {
            const timer = setTimeout(() => {
                openChat();
                sessionStorage.setItem('chatHasOpened', 'true');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    // Effect to handle initial message from Context (e.g. from ProductModal)
    useEffect(() => {
        if (isOpen && initialMessage) {
            setInput(initialMessage);
            // Optional: Auto-submit? No, let user confirm or edit.
            // But we should focus the input.
        }
    }, [isOpen, initialMessage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        // Clear context message once submitted
        if (initialMessage) clearInitialMessage();

        const userMessage: Message = { role: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null); // Reset error on new submission

        try {
            const history = messages
                .filter(m => m.role === 'user' || m.role === 'model')
                .slice(1)
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

            // Handle Cart Action from AI
            if (data.cartAction && data.cartAction.type === 'ADD') {
                const { product, size, color } = data.cartAction;
                addItem(product, size, color);
                setIsCartOpen(true); // Open drawer to show it worked
            }

            const aiMessage: Message = {
                role: 'model',
                text: data.text,
                products: data.products,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            toast.error('Lo siento, ha habido un error de conexión con mi sistema principal. Por favor, inténtalo de nuevo.', {
                style: {
                    background: 'var(--foreground)',
                    color: 'var(--background)',
                    borderRadius: '0px',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                },
                iconTheme: {
                    primary: '#ef4444',
                    secondary: 'var(--background)',
                },
            });
            // We remove the user message so they can try to send it again without it getting stuck
            setMessages((prev) => prev.slice(0, -1));
            setInput(userMessage.text);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openChat()}
                    className="fixed bottom-6 right-6 z-40 bg-[var(--foreground)] text-[var(--background)] p-4 rounded-full shadow-2xl flex items-center gap-2 border border-[var(--background)]"
                >
                    <Bot size={24} />
                    <span className="font-medium uppercase tracking-widest text-[10px] pl-1 pr-2">AURA Assistant</span>
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        className="fixed bottom-6 right-6 z-40 w-full max-w-sm h-[600px] max-h-[80vh] bg-[var(--background)] border border-[var(--muted)] shadow-2xl flex flex-col font-sans"
                    >
                        {/* Chat Header */}
                        <div className="p-4 border-b border-[var(--muted)] flex items-center justify-between shadow-sm z-10 bg-[var(--background)]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-black">
                                    <Bot size={18} />
                                </div>
                                <div>
                                    <h2 className="font-medium text-xs text-[var(--foreground)] uppercase tracking-widest">AURA / Virtual Assistant</h2>
                                    <p className="text-[9px] text-gray-500 font-medium uppercase tracking-widest flex items-center gap-1 mt-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeChat}
                                className="p-2 hover:bg-[var(--muted)] rounded-full transition-colors"
                            >
                                <Minimize2 size={18} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={idx}
                                    className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${msg.role === 'user' ? 'bg-transparent border-[var(--muted)] text-[var(--foreground)]' : 'bg-[var(--foreground)] text-[var(--background)] border-transparent'
                                            }`}
                                    >
                                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>

                                    <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div
                                            className={`p-3 text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-[var(--muted)] text-[var(--foreground)]'
                                                : 'bg-transparent text-[var(--foreground)] border border-[var(--muted)]'
                                                }`}
                                        >
                                            <ReactMarkdown
                                                components={{
                                                    strong: ({ node, ...props }: any) => <span className="font-bold underline decoration-1 underline-offset-2" {...props} />
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>

                                        {/* Render Products if available */}

                                        {msg.products && msg.products.length > 0 && (
                                            <div className="mt-3 grid gap-2 w-full">
                                                {msg.products.map((product) => (
                                                    <div
                                                        key={product.id}
                                                        onClick={() => setSelectedProduct(product)}
                                                        className="bg-[var(--muted)]/50 p-2 border border-transparent hover:border-[var(--foreground)] cursor-pointer transition-all flex gap-3 items-center group"
                                                    >
                                                        <div className="w-12 h-12 bg-gray-800 overflow-hidden flex-shrink-0">
                                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-xs font-bold text-[var(--foreground)] truncate uppercase">{product.name}</h4>
                                                            <span className="text-[10px] text-gray-400 font-mono">${product.price}</span>
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
                                    <div className="w-8 h-8 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center flex-shrink-0">
                                        <Bot size={14} />
                                    </div>
                                    <div className="bg-transparent p-3 border border-[var(--muted)]">
                                        <Loader2 size={14} className="animate-spin text-[var(--foreground)]" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-[var(--muted)] bg-[var(--background)]">
                            <form onSubmit={handleSubmit} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Mensaje..."
                                    disabled={isLoading}
                                    className="w-full pl-4 pr-12 py-3 bg-[var(--muted)]/30 border border-[var(--muted)] focus:outline-none focus:border-[var(--foreground)] text-sm transition-all text-[var(--foreground)] placeholder:text-gray-600 rounded-none tracking-wide"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--foreground)] hover:text-gray-300 transition-colors disabled:opacity-50"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </>
    );
}
