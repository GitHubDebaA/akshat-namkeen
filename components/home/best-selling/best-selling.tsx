"use client"
import { useState, useMemo } from "react";
import Image from 'next/image';
import { Product } from "@prisma/client";

interface Props {
    products: Product[];
}

export default function BestSelling({ products }: Props) {
    const [sortBy, setSortBy] = useState('default');

    const sortedProducts = useMemo(() => {
        const data = [...products];
        switch (sortBy) {
            case "price-low-high":
                return data.sort((a, b) => a.price - b.price);
            case "price-high-low":
                return data.sort((a, b) => b.price - a.price);
            default:
                return data;
        }

    }, [products, sortBy]);

    return (
        <div>
            {/* SECTION HEADER */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-gray-100 pb-6">
                <div className="max-w-xl">
                    <h2 className="text-2xl font-md text-obsidian">
                        Our Best Sellers
                    </h2>
                    <p className="text-sm text-obsidian/50">
                        Explore our most popular pieces loved by community members worldwide.
                    </p>
                </div>

                {/* SORT CONTROLLER */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                    <label htmlFor="sort" className="text-xs font-medium uppercase tracking-wider text-gray-400 whitespace-nowrap">
                        Sort By:
                    </label>
                    <select
                        id="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm font-medium bg-ivory/40 border border-gray-200 rounded-lg px-3 py-2 text-charcoal focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                        <option value="default">Featured</option>
                        <option value="low-to-high">Price: Low to High</option>
                        <option value="high-to-low">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* DYNAMIC PRODUCT GRID */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {sortedProducts.map((product) => (
                    <div
                        key={product.id}
                        className="group group-last:max-md:col-span-2 cursor-pointer flex flex-col justify-between"
                    >
                        <div>
                            {/* Next.js Image Container */}
                            <div className="relative aspect-[3/4] group-last:max-md:aspect-video rounded-2xl overflow-hidden bg-brand-100 mb-3">
                                <Image
                                    src={product.dpURL}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 20vw" // Tells Next.js what size to optimize/download
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Overlay Container */}
                                <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-ivory/70 text-charcoal backdrop-blur-sm flex flex-col gap-0.5 items-center justify-center z-10">
                                    <div className="text-center capitalize text-xs font-medium tracking-wider truncate w-full">
                                        product.category
                                    </div>
                                </div>
                            </div>

                            {/* Product Info Block */}
                            <div className="space-y-1 px-1">
                                <h3 className="font-medium text-sm text-charcoal truncate">
                                    {product.name}
                                </h3>
                                <p className="text-sm font-semibold text-gray-700">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* VIEW ALL ACTION BUTTON */}
            <div className="flex justify-center pt-4">
                <button className="px-8 py-3 bg-charcoal text-ivory text-sm font-medium tracking-wide rounded-xl hover:bg-opacity-90 transition-all active:scale-[0.98] shadow-sm">
                    View All Best Selling Items
                </button>
            </div>
        </div>
    );
}