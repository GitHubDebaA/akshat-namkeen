"use client";
import { Check, LoaderCircle, Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import { Button } from "../../ui/button";

import type {
    ProductDetailsVariant,
    ProductInventory,
} from "@/types/product";

interface Props {
    variant: ProductDetailsVariant;
    quantity: number;
    added: boolean;
    isAdding: boolean;
    isBuying: boolean;
    inventory?: ProductInventory;

    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onBuyNow: () => void;
}

export default function ProductActions({
    quantity,
    added,
    isAdding,
    isBuying,
    inventory,
    onQuantityChange,
    onAddToCart,
    onBuyNow,
}: Props) {
    const isOutOfStock = inventory
        ? !inventory.inStock
        : false;

    return (
        <div className="mb-6 grid grid-cols-[112px_minmax(0,1fr)] gap-2 md:grid-cols-3 md:gap-3">
            {/* Quantity */}
            <div className="flex h-11 w-full shrink-0 overflow-hidden rounded-full bg-obsidian text-white shadow-lg">
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
                aria-label="Add to cart"
                className="h-11 w-full shrink-0 cursor-pointer rounded-full bg-obsidian text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-obsidian/90 hover:shadow-xl active:translate-y-0 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 md:gap-2"
                disabled={isOutOfStock || isAdding || isBuying}
            >
                {isAdding ? <LoaderCircle className="size-4 animate-spin" /> : added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
                <span className="text-xs md:text-sm">
                    {isOutOfStock ? "Out of Stock" : isAdding ? "Adding…" : added ? "Added to cart" : "Add to cart"}
                </span>
            </Button>

            {/* Buy Now */}
            <Button
                type="button"
                size="lg"
                onClick={onBuyNow}
                disabled={isOutOfStock || isAdding || isBuying}
                className="col-span-2 h-11 w-full min-w-0 cursor-pointer rounded-full gap-2 bg-project_primary text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-project_primary/90 hover:shadow-xl active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 md:col-span-1"
            >
                {isBuying ? <LoaderCircle className="size-4 animate-spin" /> : <Zap className="h-4 w-4" />}

                <span>
                    {isOutOfStock ? "Out of Stock" : isBuying ? "Preparing checkout…" : "Buy Now"}
                </span>
            </Button>
        </div>
    );
}
