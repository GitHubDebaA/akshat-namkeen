"use client";

import { Product } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
    product: Product;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
};

type CartStore = {
    items: CartItem[];
    isOpen: boolean;
    addItem: (product: Product, quantity?: number, color?: string, size?: string) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    total: () => number;
    itemCount: () => number;
};

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product, quantity = 1, color, size) => {
                const existing = get().items.find((i) => i.product.id === product.id);
                if (existing) {
                    set((state) => ({
                        items: state.items.map((i) =>
                            i.product.id === product.id
                                ? { ...i, quantity: i.quantity + quantity }
                                : i
                        ),
                        isOpen: true,
                    }));
                } else {
                    set((state) => ({
                        items: [...state.items, { product, quantity, selectedColor: color, selectedSize: size }],
                        isOpen: true,
                    }));
                }
            },

            removeItem: (productId) =>
                set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set((state) => ({
                    items: state.items.map((i) =>
                        i.product.id === productId ? { ...i, quantity } : i
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
            itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
        }),
        { name: "akshat-namkeen-cart" }
    )
);
