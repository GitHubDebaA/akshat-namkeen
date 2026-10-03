"use client";

import { useMemo, useState } from "react";
import { ChevronRight, MoveDown, MoveUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import ProductCard from "@/components/products/card";
import Link from "next/link";

type JustDroppedItem = {
    product: Parameters<typeof ProductCard>[0]["product"];
    variantId: string;
};

interface Props {
    items: JustDroppedItem[];
}

export default function JustDroppedContent({ items }: Props) {
    const [sortBy, setSortBy] = useState("default");

    const sortedItems = useMemo(() => {
        const data = [...items];

        switch (sortBy) {
            case "low to high":
                return data.sort(
                    (a, b) => {
                        const variantA = a.product.variants.find(
                            (variant) => variant.id === a.variantId
                        );

                        const variantB = b.product.variants.find(
                            (variant) => variant.id === b.variantId
                        );

                        return (
                            (variantA?.price ?? 0) -
                            (variantB?.price ?? 0)
                        );
                    }
                );

            case "high to low":
                return data.sort(
                    (a, b) => {
                        const variantA = a.product.variants.find(
                            (variant) => variant.id === a.variantId
                        );

                        const variantB = b.product.variants.find(
                            (variant) => variant.id === b.variantId
                        );

                        return (
                            (variantB?.price ?? 0) -
                            (variantA?.price ?? 0)
                        );
                    }
                );

            default:
                return data;
        }
    }, [items, sortBy]);

    const handleSortBy = () => {
        if (sortBy === "default") {
            return setSortBy("low to high");
        }

        setSortBy(
            sortBy === "low to high"
                ? "high to low"
                : "low to high"
        );
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6">
                <div className="flex-1">
                    <h2 className="text-2xl font-md text-obsidian">
                        Fresh Batches & New Flavours
                    </h2>

                    <p className="text-sm text-obsidian/50">
                        Be the first to experience our latest culinary creations.
                        Hand-crafted in small batches, freshly fried, and curated
                        for the perfect crunch.
                    </p>
                </div>

                {/* Sort */}
                <div
                    className="flex items-center self-start md:self-auto gap-2 group"
                    onClick={handleSortBy}
                >
                    <div className="flex flex-col self-start md:self-auto">
                        <Tooltip>
                            <TooltipTrigger>
                                <label className="text-xs text-right font-medium uppercase tracking-wider text-obsidian/50 whitespace-nowrap mr-5">
                                    Sort By price
                                </label>

                                <div className="text-xs font-bold uppercase tracking-widest text-obsidian flex items-center gap-1 group-hover:text-project_primary transition-colors duration-300 cursor-pointer">
                                    {sortBy}

                                    {sortBy === "high to low" && (
                                        <MoveUp className="w-3 h-3" />
                                    )}

                                    {sortBy === "low to high" && (
                                        <MoveDown className="w-3 h-3" />
                                    )}
                                </div>
                            </TooltipTrigger>

                            <TooltipContent>
                                <span className="text-xs text-ivory/80">
                                    Click on the label to toggle between low to high
                                    and high to low sorting.
                                </span>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {sortedItems.map((item) => (
                    <ProductCard
                        key={item.variantId}
                        product={item.product}
                        variantId={item.variantId}
                    />
                ))}

                {/* View all */}
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="text-xs font-bold uppercase tracking-widest text-brand-500">
                        Just Dropped
                    </div>

                    <div className="text-xs font-md tracking-widest text-brand-500">
                        View all
                    </div>

                    <Link href="/product">
                        <Button className="w-12 h-12 flex items-center justify-center rounded-full bg-obsidian text-ivory cursor-pointer transition-transform duration-700 hover:scale-105">
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}