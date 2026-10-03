"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
    variantId: string;
    productId: string;

    productName: string;
    variantName: string;

    price: number;
    displayURL?: string | null;

    quantity: number;
};

type CartStore = {
    items: CartItem[];

    isOpen: boolean;

    addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;

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

            addItem: (item, quantity = 1) => {
                const existing = get().items.find(
                    (i) => i.variantId === item.variantId
                );

                if (existing) {
                    set((state) => ({
                        items: state.items.map((i) =>
                            i.variantId === item.variantId
                                ? {
                                    ...i,
                                    quantity: i.quantity + quantity,
                                }
                                : i
                        ),
                    }));

                    return;
                }

                set((state) => ({
                    items: [
                        ...state.items,
                        {
                            ...item,
                            quantity,
                        },
                    ],
                }));
            },

            removeItem: (variantId) =>
                set((state) => ({
                    items: state.items.filter(
                        (item) => item.variantId !== variantId
                    ),
                })),

            updateQuantity: (variantId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(variantId);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.variantId === variantId
                            ? {
                                ...item,
                                quantity,
                            }
                            : item
                    ),
                }));
            },

            clearCart: () =>
                set({
                    items: [],
                }),

            openCart: () =>
                set({
                    isOpen: true,
                }),

            closeCart: () =>
                set({
                    isOpen: false,
                }),

            toggleCart: () =>
                set((state) => ({
                    isOpen: !state.isOpen,
                })),

            total: () =>
                get().items.reduce(
                    (sum, item) =>
                        sum + item.price * item.quantity,
                    0
                ),

            itemCount: () =>
                get().items.reduce(
                    (sum, item) =>
                        sum + item.quantity,
                    0
                ),
        }),
        {
            name: "akshat-namkeen-cart",
        }
    )
);