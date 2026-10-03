"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowDownUp,
    ChevronDown,
    Search,
    Settings2,
} from "lucide-react";

import ProductCard from "./card";

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

type ProductWithVariants = Prisma.ProductGetPayload<{
    include: {
        variants: true;
    };
}>;

interface ProductListProps {
    products: ProductWithVariants[];
}

const CATEGORIES = [
    "Mixtures",
    "Spicy Snacks",
    "Salted Snacks",
    "Corn Snacks",
    "Bhujia",
];

export default function ProductList({ products }: ProductListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("relevance");
    const [isSticky, setIsSticky] = useState(false);

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

        const result = products.filter((product) => {
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

            /*
             * Category
             *
             * Currently category information is not directly available
             * on ProductList's Product model, so we use the product
             * name/description as the fallback.
             */
            let matchesCategory = true;

            if (selectedCategory.length > 0) {
                const searchableText = [
                    product.name,
                    product.description ?? "",
                    ...product.variants.map((variant) => variant.name),
                    ...product.variants.map((variant) => variant.variant),
                ]
                    .join(" ")
                    .toLowerCase();

                matchesCategory = selectedCategory.some((category) =>
                    searchableText.includes(category.toLowerCase())
                );
            }

            return matchesSearch && matchesCategory;
        });

        /*
         * Sorting
         */
        switch (sortBy) {
            case "price-low-to-high":
                return [...result].sort((a, b) => {
                    const priceA = Math.min(
                        ...a.variants
                            .filter((variant) => variant.isActive)
                            .map((variant) => variant.price)
                    );

                    const priceB = Math.min(
                        ...b.variants
                            .filter((variant) => variant.isActive)
                            .map((variant) => variant.price)
                    );

                    return priceA - priceB;
                });

            case "price-high-to-low":
                return [...result].sort((a, b) => {
                    const priceA = Math.min(
                        ...a.variants
                            .filter((variant) => variant.isActive)
                            .map((variant) => variant.price)
                    );

                    const priceB = Math.min(
                        ...b.variants
                            .filter((variant) => variant.isActive)
                            .map((variant) => variant.price)
                    );

                    return priceB - priceA;
                });

            case "newest-first":
                return [...result].sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );

            default:
                return result;
        }
    }, [products, searchQuery, selectedCategory, sortBy]);

    const handleChangeCategory = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value, checked } = event.target;

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
        <main>
            {/* Header */}
            <section className="bg-gradient-to-r from-project_primary/5 to-ivory px-6 py-4 md:p-12">
                <div className="space-y-5 pt-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-obsidian/50">
                        AKSHAT NAMKEEN COLLECTION
                    </span>

                    <h1 className="text-2xl md:text-4xl font-bold leading-tight text-obsidian">
                        Discover Every Crunch,
                        <br />
                        Every Flavour
                    </h1>

                    <p className="max-w-2xl text-obsidian/50">
                        Explore our handcrafted range of authentic namkeens
                        prepared with premium ingredients and traditional
                        recipes.
                    </p>
                </div>
            </section>

            {/* Desktop */}
            <div className="hidden md:grid md:grid-cols-12">
                {/* Filters */}
                <aside className="md:col-span-3 bg-ivory/30 sticky top-20 h-fit self-start">
                    <div className="p-4 font-semibold text-lg tracking-wide">
                        Filters
                    </div>

                    <Separator />

                    <div className="p-4">
                        <InputGroup className="max-w-xs">
                            <InputGroupInput
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                }
                                placeholder="Search by flavor, ingredient or snack name..."
                            />

                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    <Separator />

                    <div className="p-4">
                        <h3 className="font-bold mb-3">Categories</h3>

                        <div className="space-y-2">
                            {CATEGORIES.map((category) => (
                                <label
                                    key={category}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        value={category}
                                        checked={selectedCategory.includes(
                                            category
                                        )}
                                        onChange={handleChangeCategory}
                                    />

                                    {category}
                                </label>
                            ))}
                        </div>
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
                                        Products
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="text-lg">
                            Showing {filteredProducts.length} results of{" "}
                            {products.length}
                        </div>

                        <div className="text-sm flex items-center gap-6">
                            <div className="font-bold">Sort By</div>

                            <Tabs
                                defaultValue="relevance"
                                value={sortBy}
                                onValueChange={setSortBy}
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

                    {filteredProducts.length > 0 ? (
                        <div className="px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
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
                                    Products
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="text-lg">
                        Showing {filteredProducts.length} results of{" "}
                        {products.length}
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
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            placeholder="Search by flavor, ingredient or snack name..."
                                        />

                                        <InputGroupAddon>
                                            <Search />
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>

                                <Separator />

                                <div className="p-4">
                                    <h3 className="font-bold mb-3">
                                        Categories
                                    </h3>

                                    <div className="space-y-2">
                                        {CATEGORIES.map((category) => (
                                            <label
                                                key={category}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={category}
                                                    checked={selectedCategory.includes(
                                                        category
                                                    )}
                                                    onChange={
                                                        handleChangeCategory
                                                    }
                                                />

                                                {category}
                                            </label>
                                        ))}
                                    </div>
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
                                    onValueChange={setSortBy}
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
                {filteredProducts.length > 0 ? (
                    <div className="px-6 grid grid-cols-2 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState />
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