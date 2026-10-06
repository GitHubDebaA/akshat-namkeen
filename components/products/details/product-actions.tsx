"use client";
import { Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { Button } from "../../ui/button";

import type {
    ProductDetailsVariant,
    ProductInventory,
} from "@/types/product";

interface Props {
    variant: ProductDetailsVariant;
    quantity: number;
    added: boolean;
    inventory?: ProductInventory;

    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
}

export default function ProductActions({
    quantity,
    added,
    inventory,
    onQuantityChange,
    onAddToCart,
}: Props) {
    const isOutOfStock = inventory
        ? !inventory.inStock
        : false;

    return (
        <div className="grid grid-cols-[132px_48px_minmax(0,1fr)] md:grid-cols-3 gap-2 md:gap-3 mb-6">
            {/* Quantity */}
            <div className="h-11 w-[132px] md:w-full flex shrink-0 overflow-hidden rounded-full bg-obsidian text-white shadow-lg">
                <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => onQuantityChange( Math.max(1, quantity - 1))}
                    className="flex-1 flex items-center justify-center border-r border-white/30 transition-all duration-200 hover:bg-white/10 active:bg-white/20 active:scale-95 disabled:opacity-50"
                    aria-label="Decrease quantity"
                >
                    <Minus className="h-4 w-4" />
                </button>

                <div className="w-11 md:flex-1 flex shrink-0 items-center justify-center font-semibold text-sm">
                    {quantity}
                </div>

                <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => onQuantityChange(quantity + 1)}
                    className="flex-1 flex items-center justify-center border-l border-white/30 transition-all duration-200 hover:bg-project_primary/90 active:bg-project_primary active:scale-95 disabled:opacity-50"
                    aria-label="Increase quantity"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            {/* Add to Bag */}
            <Button
                type="button"
                onClick={onAddToCart}
                disabled={isOutOfStock}
                aria-label="Add to bag"
                className="h-11 w-11 md:w-full shrink-0 rounded-full gap-2 bg-obsidian text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-obsidian/90 hover:shadow-xl active:translate-y-0 active:scale-[0.97] disabled:opacity-50"
            >
                <ShoppingBag className="h-4 w-4" />

                <span className="hidden md:inline">
                    {isOutOfStock ? "Out of Stock" : added ? "Added" : "Add to Bag"}
                </span>
            </Button>

            {/* Buy Now */}
            <Button
                type="button"
                size="lg"
                onClick={onAddToCart}
                disabled={isOutOfStock}
                className="h-11 w-full min-w-0 rounded-full gap-2 bg-project_primary text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-project_primary/90 hover:shadow-xl active:translate-y-0 active:scale-[0.98] disabled:opacity-50"
            >
                <Zap className="h-4 w-4" />

                <span>
                    {isOutOfStock ? "Out of Stock" : "Buy Now"}
                </span>
            </Button>
        </div>
    );
}