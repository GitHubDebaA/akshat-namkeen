"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
    ArrowDown,
    ArrowDownUp,
    Check,
    ChevronDown,
    Leaf,
    Search,
    Settings2,
    Sparkles,
} from "lucide-react";

import ProductCard from "./card";
import type { ProductCardData } from "@/types/product";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../ui/breadcrumb";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerTrigger,
} from "../ui/drawer";

const PRODUCTS_PER_LOAD = 10;

interface ProductListProps {
    products: ProductCardData[];
    categories: { id: string; name: string }[];
    activeCategoryId?: string;
}

export default function ProductList({ products, categories, activeCategoryId }: ProductListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string[]>(
        activeCategoryId ? [activeCategoryId] : [],
    );
    const [sortBy, setSortBy] = useState("relevance");
    const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_LOAD);
    const [isSticky, setIsSticky] = useState(false);
    const reduceMotion = useReducedMotion();

    const selectedCategoryNames = categories
        .filter((category) => selectedCategory.includes(category.id))
        .map((category) => category.name);
    const currentCategoryName = selectedCategoryNames.join(", ");
    const categoryCounts = useMemo(
        () => new Map(categories.map((category) => [
            category.id,
            products.filter((item) => item.product.categoryId === category.id).length,
        ])),
        [categories, products],
    );

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        const result = products.filter(({ product }) => {
            /*
             * Search
             */
            const matchesSearch =
                query.length === 0 ||
                product.name.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query) ||
                product.variants.some(
                    (variant) =>
                        variant.name.toLowerCase().includes(query) ||
                        variant.variant.toLowerCase().includes(query)
                );

            const matchesCategory = selectedCategory.length === 0 || selectedCategory.includes(product.categoryId);

            return matchesSearch && matchesCategory;
        });

        /*
         * Sorting
         */
        switch (sortBy) {
            case "price-low-to-high":
                return [...result].sort((a, b) => {
                    const priceA = Math.min(
                        ...a.product.variants
                            .filter((variant) => variant.isActive)
                            .map((variant) => Number(variant.sellingPrice))
                    );

                    const priceB = Math.min(
                        ...b.product.variants
                            .filter((variant) => variant.isActive)
                            .map((variant) => Number(variant.sellingPrice))
                    );

                    return priceA - priceB;
                });

            case "price-high-to-low":
                return [...result].sort((a, b) => {
                    const priceA = Math.min(
                        ...a.product.variants
                            .filter((variant) => variant.isActive)
                            .map((variant) => Number(variant.sellingPrice))
                    );

                    const priceB = Math.min(
                        ...b.product.variants
                            .filter((variant) => variant.isActive)
                            .map((variant) => Number(variant.sellingPrice))
                    );

                    return priceB - priceA;
                });

            case "newest-first":
                return [...result].sort(
                    (a, b) =>
                        new Date(b.product.createdAt).getTime() -
                        new Date(a.product.createdAt).getTime()
                );

            default:
                return result;
        }
    }, [products, searchQuery, selectedCategory, sortBy]);

    const visibleProducts = filteredProducts.slice(0, visibleCount);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setVisibleCount(PRODUCTS_PER_LOAD);
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        setVisibleCount(PRODUCTS_PER_LOAD);
    };

    const handleChangeCategory = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value, checked } = event.target;
        setVisibleCount(PRODUCTS_PER_LOAD);

        if (checked) {
            setSelectedCategory((prev) =>
                prev.includes(value) ? prev : [...prev, value]
            );
        } else {
            setSelectedCategory((prev) =>
                prev.filter((category) => category !== value)
            );
        }
    };

    return (
        <main className="pb-20 md:pb-24">
            {/* Header */}
            <motion.section
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }}
                className="relative isolate overflow-hidden border-b border-brand-200 bg-[radial-gradient(ellipse_at_85%_30%,rgba(195,103,43,0.16),transparent_38%),linear-gradient(115deg,#fffaf2_0%,#f7ead9_56%,#f4e4d0_100%)]"
            >
                <motion.div
                    aria-hidden="true"
                    animate={reduceMotion ? undefined : { y: [0, -9, 0], rotate: [0, 2, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-20 -top-28 -z-10 size-80 rounded-full border border-white/60 bg-white/20 blur-3xl"
                />
                <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 py-10 sm:px-8 md:py-14 lg:grid-cols-[1.2fr_.8fr] lg:px-12 lg:py-16">
                    <div>
                        <motion.div
                            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: reduceMotion ? 0 : 0.1, duration: 0.4 }}
                            className="mb-5 inline-flex items-center gap-2 rounded-full border border-project_primary/15 bg-white/75 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-project_primary shadow-sm backdrop-blur"
                        >
                            <Sparkles className="size-3.5" />
                            Akshat Namkeen · The snack collection
                        </motion.div>
                        <motion.h1
                            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: reduceMotion ? 0 : 0.18, duration: 0.48 }}
                            className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-obsidian sm:text-5xl lg:text-6xl"
                        >
                            {currentCategoryName ? (
                                <>A little more <span className="text-project_primary">{currentCategoryName}</span></>
                            ) : (
                                <>Find your next <span className="text-project_primary">favourite crunch.</span></>
                            )}
                        </motion.h1>
                        <p className="mt-5 max-w-xl text-sm leading-7 text-obsidian/65 sm:text-base">
                            {currentCategoryName
                                ? `Explore the ${currentCategoryName.toLowerCase()} collection, made for sharing, snacking, and every little craving.`
                                : "Explore traditional namkeen favourites, from spicy bhujia to savoury mixtures."}
                        </p>
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <a href="#product-grid" className="inline-flex items-center gap-2 rounded-full bg-obsidian px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-obsidian/10 transition hover:-translate-y-0.5 hover:bg-project_primary">
                                Explore products <ArrowDown className="size-4" />
                            </a>
                            <span className="inline-flex items-center gap-2 rounded-full border border-obsidian/10 bg-white/60 px-4 py-3 text-xs font-medium text-obsidian/65 backdrop-blur">
                                <Leaf className="size-4 text-project_primary" /> Made with traditional recipes
                            </span>
                        </div>
                    </div>

                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, scale: 0.94, x: 14 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: reduceMotion ? 0 : 0.2, duration: 0.55, ease: "easeOut" }}
                        className="relative hidden min-h-56 items-center justify-center lg:flex"
                    >
                        <div aria-hidden="true" className="absolute size-64 rounded-full bg-project_primary/10 blur-2xl" />
                        <motion.div
                            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="relative w-72 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-2xl shadow-project_primary/10 backdrop-blur-xl"
                        >
                            <div className="flex items-center justify-between">
                                <span className="grid size-12 place-items-center rounded-2xl bg-project_primary/10 text-project_primary"><Sparkles className="size-6" /></span>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">The good stuff</span>
                            </div>
                            <p className="mt-6 font-display text-2xl font-semibold text-obsidian">A snack for every mood</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {categories.slice(0, 4).map((category, index) => (
                                    <motion.span
                                        key={category.id}
                                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: reduceMotion ? 0 : 0.32 + index * 0.08 }}
                                        className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-obsidian/70"
                                    >
                                        {category.name}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Desktop */}
            <div className="hidden md:grid md:grid-cols-12">
                {/* Filters */}
                <aside className="sticky top-0 z-20 md:col-span-3 h-fit max-h-screen self-start overflow-y-auto bg-ivory/90 backdrop-blur-md">
                    <div className="flex items-center justify-between p-4 font-semibold text-lg tracking-wide">
                        <span>Filters</span>
                        {selectedCategory.length > 0 && (
                            <button type="button" onClick={() => { setSelectedCategory([]); setVisibleCount(PRODUCTS_PER_LOAD); }} className="text-xs font-semibold text-project_primary hover:underline">Clear all</button>
                        )}
                    </div>

                    <Separator />

                    <div className="p-4">
                        <InputGroup className="max-w-xs">
                            <InputGroupInput
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Search by flavor, ingredient or snack name..."
                            />

                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    <Separator />

                    <div className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-bold">Shop by category</h3>
                            <span className="text-[11px] text-obsidian/45">{categories.length} options</span>
                        </div>
                        <CategoryFilterList categories={categories} selectedCategory={selectedCategory} categoryCounts={categoryCounts} onChange={handleChangeCategory} />
                    </div>

                    <Separator />
                </aside>

                {/* Products */}
                <section className="md:col-span-9 space-y-6">
                    <div className="px-6 pt-6 border-b border-obsidian/10 space-y-1">
                        <Breadcrumb className="text-sm">
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        render={<Link href="/" />}
                                    >
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbSeparator />

                                <BreadcrumbItem>
                                        <BreadcrumbPage>
                                        {currentCategoryName || "Products"}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="text-lg">
                            Showing {visibleProducts.length} of {filteredProducts.length} products
                        </div>

                        <div className="text-sm flex items-center gap-6">
                            <div className="font-bold">Sort By</div>

                            <Tabs
                                defaultValue="relevance"
                                value={sortBy}
                                onValueChange={handleSortChange}
                            >
                                <TabsList variant="line">
                                    <TabsTrigger value="relevance">
                                        Relevance
                                    </TabsTrigger>

                                    <TabsTrigger value="price-low-to-high">
                                        Price -- Low to High
                                    </TabsTrigger>

                                    <TabsTrigger value="price-high-to-low">
                                        Price -- High to Low
                                    </TabsTrigger>

                                    <TabsTrigger value="newest-first">
                                        Newest First
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    {visibleProducts.length > 0 ? (
                        <div id="product-grid" className="px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 pb-16">
                            {visibleProducts.map((product) => (
                                <ProductCard key={product.product.id} data={product} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                    {visibleCount < filteredProducts.length && (
                        <div className="flex justify-center px-6 pb-8">
                            <Button type="button" variant="outline" onClick={() => setVisibleCount((count) => count + PRODUCTS_PER_LOAD)}>
                                Load 10 more products
                            </Button>
                        </div>
                    )}
                </section>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-6">
                <div
                    className={`px-6 pt-6 space-y-1 sticky top-15 h-fit self-start z-10 bg-white transition-all duration-300 ${isSticky
                        ? "pb-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-b border-black/5"
                        : ""
                        }`}
                >
                    <Breadcrumb className="text-sm">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink render={<Link href="/" />}>
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />

                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {currentCategoryName || "Products"}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="text-lg">
                        Showing {visibleProducts.length} of {filteredProducts.length} products
                    </div>

                    <div className="flex items-center justify-start gap-6">
                        {/* Filter Drawer */}
                        <Drawer>
                            <DrawerTrigger
                                asChild
                                className="flex-1 flex items-center justify-between"
                            >
                                <Button>
                                    <Settings2 />
                                    Filters
                                    <ChevronDown />
                                </Button>
                            </DrawerTrigger>

                            <DrawerContent>
                                <div className="p-4 font-semibold text-lg tracking-wide">
                                    Filters
                                </div>

                                <Separator />

                                <div className="p-4">
                                    <InputGroup>
                                        <InputGroupInput
                                            value={searchQuery}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            placeholder="Search by flavor, ingredient or snack name..."
                                        />

                                        <InputGroupAddon>
                                            <Search />
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>

                                <Separator />

                                <div className="p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="font-bold">Shop by category</h3>
                                        {selectedCategory.length > 0 && <button type="button" onClick={() => { setSelectedCategory([]); setVisibleCount(PRODUCTS_PER_LOAD); }} className="text-xs font-semibold text-project_primary hover:underline">Clear</button>}
                                    </div>
                                    <CategoryFilterList categories={categories} selectedCategory={selectedCategory} categoryCounts={categoryCounts} onChange={handleChangeCategory} />
                                </div>

                                <DrawerFooter className="flex flex-row items-center justify-between gap-6">
                                    <DrawerClose
                                        asChild
                                        className="flex-1"
                                    >
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </DrawerClose>

                                    <DrawerClose
                                        asChild
                                        className="flex-1"
                                    >
                                        <Button>Apply</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>

                        {/* Sort Drawer */}
                        <Drawer>
                            <DrawerTrigger
                                asChild
                                className="flex-1 flex items-center justify-between"
                            >
                                <Button>
                                    <ArrowDownUp />
                                    Sort
                                    <ChevronDown />
                                </Button>
                            </DrawerTrigger>

                            <DrawerContent>
                                <div className="p-4 font-semibold text-lg tracking-wide">
                                    Sort By
                                </div>

                                <Separator />

                                <Tabs
                                    defaultValue="relevance"
                                    value={sortBy}
                                    onValueChange={handleSortChange}
                                    orientation="vertical"
                                >
                                    <TabsList variant="line">
                                        <TabsTrigger
                                            value="relevance"
                                            className="px-6 py-2"
                                        >
                                            Relevance
                                        </TabsTrigger>

                                        <TabsTrigger
                                            value="price-low-to-high"
                                            className="px-6 py-2"
                                        >
                                            Price -- Low to High
                                        </TabsTrigger>

                                        <TabsTrigger
                                            value="price-high-to-low"
                                            className="px-6 py-2"
                                        >
                                            Price -- High to Low
                                        </TabsTrigger>

                                        <TabsTrigger
                                            value="newest-first"
                                            className="px-6 py-2"
                                        >
                                            Newest First
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                <DrawerFooter className="flex flex-row items-center justify-between gap-6">
                                    <DrawerClose
                                        asChild
                                        className="flex-1"
                                    >
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </DrawerClose>

                                    <DrawerClose
                                        asChild
                                        className="flex-1"
                                    >
                                        <Button>Apply</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    </div>
                </div>

                {/* Mobile Products */}
                {visibleProducts.length > 0 ? (
                    <div id="product-grid" className="px-6 grid grid-cols-2 gap-6 pb-16">
                            {visibleProducts.map((product) => (
                            <ProductCard key={product.product.id} data={product} />
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
                {visibleCount < filteredProducts.length && (
                    <div className="flex justify-center px-6 pb-8">
                        <Button type="button" variant="outline" onClick={() => setVisibleCount((count) => count + PRODUCTS_PER_LOAD)}>
                            Load 10 more products
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white max-w-7xl mx-auto space-y-12">
            <Image
                src="/illustrations/product-not-found.svg"
                alt="Products not found"
                width={220}
                height={220}
                priority
            />

            <div className="text-center">
                <p className="text-obsidian font-medium text-lg">
                    No crisp drops found
                </p>

                <p className="text-xs text-obsidian/50">
                    Try loosening your filters or adjusting your search.
                </p>
            </div>
        </div>
    );
}

function CategoryFilterList({
    categories,
    selectedCategory,
    categoryCounts,
    onChange,
}: {
    categories: { id: string; name: string }[];
    selectedCategory: string[];
    categoryCounts: Map<string, number>;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="space-y-2">
            {categories.map((category) => {
                const checked = selectedCategory.includes(category.id);
                return (
                    <label key={category.id} className={`group flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all focus-within:ring-2 focus-within:ring-project_primary/30 ${checked ? "border-project_primary/30 bg-project_primary/5 shadow-sm" : "border-transparent bg-white/65 hover:border-brand-200 hover:bg-white"}`}>
                        <input type="checkbox" value={category.id} checked={checked} onChange={onChange} className="sr-only" />
                        <span aria-hidden="true" className={`grid size-5 shrink-0 place-items-center rounded-md border transition-colors ${checked ? "border-project_primary bg-project_primary text-white" : "border-obsidian/20 bg-white group-hover:border-project_primary/50"}`}>
                            {checked && <Check className="size-3.5" strokeWidth={3} />}
                        </span>
                        <span className={`min-w-0 flex-1 truncate ${checked ? "font-semibold text-obsidian" : "text-obsidian/75"}`}>{category.name}</span>
                        <span className="rounded-full bg-obsidian/5 px-2 py-0.5 text-[11px] tabular-nums text-obsidian/55">{categoryCounts.get(category.id) ?? 0}</span>
                    </label>
                );
            })}
        </div>
    );
}
