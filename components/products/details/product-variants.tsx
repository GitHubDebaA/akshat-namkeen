"use client";

import type { ProductDetailsVariant } from "@/types/product";

interface Props {
    variants: ProductDetailsVariant[];
    selectedVariantId: string;
    onVariantChange: (variantId: string) => void;
}

export default function ProductVariants({
    variants,
    selectedVariantId,
    onVariantChange,
}: Props) {
    return (
        <div className="my-5">
            <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-obsidian">
                    Select Variant
                </p>

                <span className="text-xs text-obsidian/50">
                    {variants.length} options
                </span>
            </div>

            <div className="flex flex-wrap gap-2">
                {variants.map((item) => {
                    const isSelected = item.id === selectedVariantId;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                                onVariantChange(item.id)
                            }
                            className={`min-w-24 px-4 py-2.5 border text-sm font-medium transition-all rounded-sm cursor-pointer
                                ${ isSelected ? "border-obsidian bg-obsidian text-ivory" : "border-obsidian/10 text-obsidian hover:border-obsidian"}`}
                        >
                            {item.variant}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}