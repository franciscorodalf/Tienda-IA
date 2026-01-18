import React from 'react';
import { Product } from '@/lib/data';
import { X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useChat } from '@/context/ChatContext';

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const { addItem, setIsCartOpen } = useCart();
    const { openChat } = useChat();
    const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
    const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (isOpen) {
            setSelectedSize(null);
            setSelectedColor(null);
            setError(null);
        }
    }, [isOpen, product]);

    if (!product) return null;

    const handleAddToCart = () => {
        if (!selectedSize) {
            setError('Please select a size');
            return;
        }
        if (!selectedColor) {
            setError('Please select a color');
            return;
        }

        addItem(product, selectedSize, selectedColor);
        setIsCartOpen(true);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[var(--background)] border border-[var(--muted)] w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative shadow-2xl"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-[var(--foreground)] hover:text-gray-400 z-10 transition-colors bg-black/20 backdrop-blur-md"
                            >
                                <X size={24} />
                            </button>

                            {/* Image Section */}
                            <div className="w-full md:w-1/2 bg-[var(--muted)] relative h-96 md:h-auto">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[var(--background)] text-[var(--foreground)]">
                                <div className="mb-8">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-2 block">{product.category}</span>
                                        {product.stock ? (
                                            <span className="text-green-500 text-[10px] uppercase font-bold tracking-widest border border-green-500/30 px-2 py-1">In Stock</span>
                                        ) : (
                                            <span className="text-red-500 text-[10px] uppercase font-bold tracking-widest border border-red-500/30 px-2 py-1">Out of Stock</span>
                                        )}
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">{product.name}</h2>
                                    <div className="text-2xl font-mono text-gray-400">${product.price.toFixed(2)}</div>
                                </div>

                                <div className="space-y-6 mb-12">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description</h3>
                                        <p className="text-sm leading-relaxed text-gray-300 font-medium max-w-md">{product.description}</p>
                                    </div>

                                    {/* Features List (New) */}
                                    {product.features && product.features.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Details</h3>
                                            <ul className="grid grid-cols-2 gap-2 text-xs uppercase tracking-wide text-gray-400">
                                                {product.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center gap-2">
                                                        <span className="w-1 h-1 bg-[var(--foreground)] rounded-full"></span>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Colors (Visual) */}
                                    {product.colors && product.colors.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Colors</h3>
                                            <div className="flex gap-2">
                                                {product.colors.map((color, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => { setSelectedColor(color); setError(null); }}
                                                        className={`px-3 py-1 border text-xs uppercase transition-colors ${selectedColor === color
                                                            ? 'border-[var(--foreground)] text-[var(--foreground)] bg-[var(--muted)]/50'
                                                            : 'border-[var(--muted)] text-gray-400 hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
                                                            }`}
                                                    >
                                                        {color}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sizes */}
                                    {product.sizes && product.sizes.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Size</h3>
                                            <div className="flex gap-2 flex-wrap">
                                                {product.sizes.map((size, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => { setSelectedSize(size); setError(null); }}
                                                        className={`px-3 py-1 border text-xs uppercase transition-colors ${selectedSize === size
                                                            ? 'border-[var(--foreground)] text-[var(--foreground)] bg-[var(--muted)]/50'
                                                            : 'border-[var(--muted)] text-gray-400 hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
                                                            }`}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* --- ASK ALEX SECTION (New) --- */}
                                    <div className="pt-6 border-t border-[var(--muted)]">
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            Ask Alex AI
                                        </h3>

                                        {/* Smart Chips */}
                                        <div className="flex gap-2 mb-3 flex-wrap">
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    openChat(`Sobre ${product.name}: ¿Podrías darme ideas de outfit para combinarlo?`);
                                                }}
                                                className="px-3 py-1.5 bg-[var(--muted)] text-[var(--foreground)] text-[10px] uppercase font-bold tracking-wider hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors rounded-full"
                                            >
                                                👟 Ideas de Outfit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    openChat(`Sobre ${product.name}: Cuéntame más detalles técnicos y materiales de prenda.`);
                                                }}
                                                className="px-3 py-1.5 bg-[var(--muted)] text-[var(--foreground)] text-[10px] uppercase font-bold tracking-wider hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors rounded-full"
                                            >
                                                🧵 Detalles / Material
                                            </button>
                                        </div>

                                        {/* Manual Input Trigger */}
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const form = e.target as HTMLFormElement;
                                                const input = form.elements.namedItem('question') as HTMLInputElement;
                                                if (input.value.trim()) {
                                                    onClose();
                                                    openChat(`Sobre ${product.name}: ${input.value}`);
                                                }
                                            }}
                                            className="relative"
                                        >
                                            <input
                                                name="question"
                                                type="text"
                                                placeholder="Pregunta algo específico..."
                                                className="w-full bg-[var(--muted)]/30 border border-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] placeholder:text-gray-500"
                                            />
                                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--foreground)] hover:text-gray-400">
                                                <ShoppingBag size={12} className="rotate-[-45deg]" /> {/* Stylized arrow icon reuse */}
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4 animate-pulse">
                                        ⚠️ {error}
                                    </p>
                                )}

                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.stock}
                                    className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingBag size={18} />
                                    {product.stock ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
