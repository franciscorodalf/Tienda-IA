'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/data';

export interface CartItem extends Product {
    cartId: string; // Unique ID for this specific item in cart (to distinct same product with diff sizes)
    selectedSize?: string;
    selectedColor?: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, size?: string, color?: string) => void;
    removeItem: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    cartTotal: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [itemCount, setItemCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    // Recalculate totals
    useEffect(() => {
        setItemCount(items.reduce((total, item) => total + item.quantity, 0));
        setCartTotal(items.reduce((total, item) => total + (item.price * item.quantity), 0));
    }, [items]);

    const addItem = (product: Product, size?: string, color?: string) => {
        setItems((prev) => {
            // Check if item with same ID, Size, and Color already exists
            const existingItem = prev.find(
                (item) =>
                    item.id === product.id &&
                    item.selectedSize === size &&
                    item.selectedColor === color
            );

            if (existingItem) {
                return prev.map((item) =>
                    item.cartId === existingItem.cartId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            // New Item
            return [
                ...prev,
                {
                    ...product,
                    cartId: `${product.id}-${Date.now()}`,
                    selectedSize: size || product.sizes?.[0] || 'One Size',
                    selectedColor: color || product.colors?.[0] || 'Default',
                    quantity: 1,
                },
            ];
        });
        setIsCartOpen(true); // Auto open cart
    };

    const removeItem = (cartId: string) => {
        setItems((prev) => prev.filter((item) => item.cartId !== cartId));
    };

    const updateQuantity = (cartId: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(cartId);
            return;
        }
        setItems((prev) =>
            prev.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
        );
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                isCartOpen,
                setIsCartOpen,
                cartTotal,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
