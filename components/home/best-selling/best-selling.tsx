"use client"
import { useState, useMemo } from "react";
import Image from 'next/image';
import { Product } from "@prisma/client";
import { ChevronRight, Minus, MoveDown, MoveUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/card";

interface Props {
    products: Product[];
}

export default function BestSelling({ products }: Props) {
    const [sortBy, setSortBy] = useState('default');

    const sortedProducts = useMemo(() => {
        const data = [...products];
        switch (sortBy) {
            case "low to high":
                return data.sort((a, b) => a.price - b.price);
            case "high to low":
                return data.sort((a, b) => b.price - a.price);
            default:
                return data;
        }

    }, [products, sortBy]);

    const handleSortBy = () => {
        if (sortBy === 'default') return setSortBy('low to high');
        setSortBy(sortBy === 'low to high' ? 'high to low' : 'low to high');
    }

    return (
        <div>
            {/* Section @@Header and Description */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6">
                <div className="max-w-xl">
                    <h2 className="text-2xl font-md text-obsidian">
                        Our Best Sellers
                    </h2>
                    <p className="text-sm text-obsidian/50">
                        Explore our most popular pieces loved by community members worldwide.
                    </p>
                </div>

                {/* Section @@Sort by controller */}
                <div className="flex items-center self-start md:self-auto gap-2 group cursor-pointer" onClick={handleSortBy}>
                    <div className="flex flex-col self-start md:self-auto">
                        <label className="text-xs font-medium uppercase tracking-wider text-obsidian/50 whitespace-nowrap">
                            Sort By price
                        </label>
                        <div className="text-xs font-bold uppercase tracking-widest text-brand-500">
                            {sortBy}
                        </div>
                    </div>
                    <div>
                        {sortBy === 'default' ? <Minus className="w-5 h-5" /> : null}
                        {sortBy === 'high to low' ? <MoveUp className="w-5 h-5" /> : null}
                        {sortBy === 'low to high' ? <MoveDown className="w-5 h-5" /> : null}
                    </div>
                </div>
            </div>

            {/* Section @@Best Selling Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}

                {/* Section @@View all action */}
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="text-xs font-bold uppercase tracking-widest text-brand-500">
                        Customer Favorites
                    </div>
                    <div className="text-xs font-md tracking-widest text-brand-500">
                        View all
                    </div>
                    <Button className="w-12 h-12 flex items-center justify-center rounded-full bg-obsidian text-ivory cursor-pointer">
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}