"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingBag, ChevronDown, Check, ImageOff, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "../ui/button"

import { Prisma } from "@prisma/client";
import { ProductProperty } from "@prisma/client";
import WishlistButton from "../wishlist/wishlist-button";

type ProductVariantWithDetails = Prisma.ProductVariantGetPayload<{
    include: {
        product: true;
        properties: {
            orderBy: {
                order: "asc";
            };
        };
    };
}>;

type Props = {
    variant: ProductVariantWithDetails;
    variants: ProductVariantWithDetails[];
};

type TextTab = {
    id: string;
    label: string;
    type: "text";
    content: string;
};

type PropertiesTab = {
    id: string;
    label: string;
    type: "properties";
    items: ProductProperty[];
};

type Tab = TextTab | PropertiesTab;

export default function ProductDetails({ variant, variants }: Props) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [openTab, setOpenTab] = useState<string | null>("description");
    const images = [variant.displayURL, ...variant.images];

    const router = useRouter();
    const searchParams = useSearchParams();

    const handleVariantChange = (variantId: string) => {
        const newParams = new URLSearchParams(searchParams.toString());

        newParams.set("variant", variantId);

        router.push(`${window.location.pathname}?${newParams.toString()}`, {
            scroll: false,
        });
    };

    const handleAddToCart = () => {
        // addItem(variant, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const sorted = [...variant.properties].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    const grouped = sorted.reduce((acc, item) => {
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
    }, {} as Record<string, ProductProperty[]>);

    const dynamicSections: PropertiesTab[] = Object.entries(grouped).map(
        ([section, items]) => ({
            id: section.toLowerCase().replace(/\s+/g, "-"),
            label: section,
            type: "properties",
            items,
        })
    );
    const tabs: Tab[] = [
        {
            id: "description",
            label: "Description",
            type: "text",
            content: variant.product.description || variant.name,
        },
        ...dynamicSections,
        {
            id: "shipping",
            label: "Shipping & Returns",
            type: "text",
            content:
                "Free shipping on all orders over INR 499. Returns accepted within 7 days.",
        },
    ];

    return (
        <div className="min-h-screen">
            <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-obsidian/50 mb-8">
                    <Link href="/" className="hover:text-obsidian transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/" className="hover:text-obsidian transition-colors">Products</Link>
                    <span>/</span>
                    <span className="text-obsidian">{variant.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                    {/* Images */}
                    <div className="w-full h-[80dvh] min-h-[500px] max-h-[700px] lg:h-[calc(100dvh-200px)] lg:min-h-[600px] lg:max-h-none">
                        <div className="h-full flex flex-col">
                            {/* Main Image */}
                            <div className="relative flex-1 min-h-0">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="absolute inset-0"
                                    >
                                        {images[selectedImage] ? (
                                            <Image
                                                src={images[selectedImage]}
                                                alt={variant.name}
                                                fill
                                                className={`${images[selectedImage] === variant.displayURL ? 'object-cover' : "object-contain"}`}
                                                priority
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                                                <div className="text-obsidian/20 mb-3">
                                                    <ImageOff
                                                        className="w-16 h-16 sm:w-20 sm:h-20"
                                                        strokeWidth={1}
                                                    />
                                                </div>

                                                <div className="text-center">
                                                    <h2 className="text-lg font-light uppercase tracking-widest text-obsidian/40">
                                                        Image
                                                    </h2>

                                                    <p className="mt-2 text-[10px] uppercase tracking-widest text-obsidian/30">
                                                        Not Available
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Badge */}
                                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-obsidian text-ivory text-[10px] font-semibold tracking-widest uppercase rounded-full">
                                    New Arrival
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {images.length > 0 && (
                                <div className="flex-shrink-0 mt-4">
                                    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                                        {images.map((img, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setSelectedImage(i)}
                                                className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 border overflow-hidden transition-all rounded-lg 
                                                ${i === selectedImage ? "border-obsidian" : "border-brand-200 hover:border-obsidian/50"}
                                            `}
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`${variant.name} image ${i + 1}`}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="font-display text-4xl font-medium text-obsidian mb-1">
                                {variant.name}
                            </h1>
                            <p className="text-project_primary text-xs font-semibold tracking-widest uppercase mb-1">
                                Akshat Namkeen
                            </p>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-obsidian">4</span>
                                <div className="flex gap-0.5">
                                    {Array(5).fill(0).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < 4 ? "fill-project_primary text-project_primary" : "text-obsidian"}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-obsidian/50">
                                    (400 reviews)
                                </span>
                            </div>

                            {/* Past Purchase Trend */}
                            <div className="text-xs font-bold mb-1">
                                3K+ bought in past month
                            </div>

                            {/* divider */}
                            <div className="border-b border-solid border-obsidian-400 mb-2 lg:mb-4"></div>

                            {/* Price */}
                            <div className="flex items-center gap-2">
                                <span className="text-lg text-project_primary">-66%</span>
                                <span className="font-display text-2xl font-medium text-obsidian">
                                    {formatPrice(Number(variant.sellingPrice))}
                                </span>
                            </div>
                            <div className="text-xs text-obsidian-400">
                                <span>M.R.P.: </span>
                                {variant.mrp && (
                                    <span className="line-through">
                                        {formatPrice(Number(variant.mrp))}
                                    </span>
                                )}
                            </div>

                            <div className="text-xs text-obsidian font-bold">
                                Inclusive of all Taxes
                            </div>

                            {/* Variants */}
                            {variants.length > 1 && (
                                <div className="my-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-bold text-obsidian">
                                            Select Variant
                                        </p>

                                        <span className="text-xs text-obsidian/50">
                                            {variants.length} options
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {variants.map((item) => {
                                            const isSelected = item.id === variant.id;

                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => handleVariantChange(item.id)}
                                                    className={`min-w-24 px-4 py-2.5 border text-sm font-medium transition-all rounded-sm
                                                        ${isSelected ? "border-obsidian bg-obsidian text-ivory" : "border-brand-200 text-obsidian hover:border-obsidian"}`}
                                                >
                                                    {item.variant}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Colors */}
                            {/* {product.colors && (
                                <div className="mb-6">
                                    <p className="text-sm font-medium text-obsidian mb-3">
                                        Shade: <span className="font-normal text-obsidian/60">{selectedColor}</span>
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                title={color.name}
                                                className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color.name ? "border-obsidian scale-110" : "border-transparent"
                                                    }`}
                                                style={{ backgroundColor: color.hex }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )} */}

                            {/* Sizes */}
                            {/* {product.sizes && (
                                <div className="mb-6">
                                    <p className="text-sm font-medium text-obsidian mb-3">Size</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${selectedSize === size
                                                    ? "bg-obsidian text-ivory border-obsidian"
                                                    : "bg-transparent text-obsidian border-brand-200 hover:border-obsidian"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )} */}

                            {/* Quantity + CTA */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                                {/* Quantity */}
                                <div className="h-12 flex overflow-hidden rounded-full bg-obsidian text-white shadow-lg">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="flex-1 flex items-center justify-center border-r border-white/10 transition-all duration-200 hover:bg-white/10 active:bg-white/20 active:scale-95"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>

                                    <div className="w-12 flex items-center justify-center font-semibold text-sm">
                                        {quantity}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="flex-1 flex items-center justify-center border-l border-white/10 transition-all duration-200 hover:bg-project_primary/90 active:bg-project_primary active:scale-95"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Add to Bag */}
                                <Button
                                    size="lg"
                                    className="h-12 w-full rounded-full gap-2 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
                                    onClick={handleAddToCart}
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {added ? (
                                            <motion.span
                                                key="added"
                                                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Check className="w-4 h-4" /> Added to Bag
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="add"
                                                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                                                transition={{ duration: 0.18 }}
                                                className="flex items-center gap-2"
                                            >
                                                <ShoppingBag className="w-4 h-4" /> Add to Bag
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Button>

                                {/* Buy Now */}
                                <Button
                                    size="lg"
                                    onClick={handleAddToCart}
                                    className="h-12 w-full rounded-full gap-2 bg-project_primary text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-project_primary/90 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {added ? (
                                            <motion.span
                                                key="buying"
                                                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                                                transition={{ duration: 0.18 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Check className="w-4 h-4" />
                                                Added
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="buy"
                                                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                                                transition={{ duration: 0.18 }}
                                                className="flex items-center gap-2"
                                            >
                                                <ShoppingBag className="w-4 h-4" />
                                                Buy Now
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Button>

                                {/* Wishlist */}
                                <WishlistButton
                                    variantId={variant.id}
                                    size="lg"
                                />
                            </div>

                            {/* Benefits */}
                            {/* {product.benefits && (
                                <div className="grid grid-cols-2 gap-2 mb-8">
                                    {product.benefits.map((b) => (
                                        <div key={b} className="flex items-center gap-2 text-sm text-obsidian/70">
                                            <Check className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                                            {b}
                                        </div>
                                    ))}
                                </div>
                            )} */}

                            {/* Accordion */}
                            <div className="border-t border-brand-200 divide-y divide-brand-200">
                                {tabs.map((tab) => (
                                    <div key={tab.id}>
                                        <button
                                            onClick={() => setOpenTab(openTab === tab.id ? null : tab.id)}
                                            className="flex items-center justify-between w-full py-4 text-left"
                                        >
                                            <span className="text-sm font-bold text-obsidian">{tab.label}</span>
                                            <ChevronDown className={`w-4 h-4 text-obsidian/50 transition-transform ${openTab === tab.id ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openTab === tab.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pb-4 text-sm text-obsidian/70 space-y-2">

                                                        {/* TEXT CONTENT */}
                                                        {tab.type === "text" && (
                                                            <p>{tab.content}</p>
                                                        )}

                                                        {/* PROPERTY CONTENT */}
                                                        {tab.type === "properties" &&
                                                            tab.items.map((item) => (
                                                                <div key={item.id} className="flex justify-between">
                                                                    <span className="text-obsidian/50">
                                                                        {item.label}
                                                                    </span>
                                                                    <span className="font-medium text-right">
                                                                        {item.value}
                                                                    </span>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Related Products */}
                {/* {related.length > 0 && (
                    <div className="mt-24">
                        <h2 className="font-display text-3xl font-medium text-obsidian mb-8">
                            You May Also Love
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                            {related.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <ProductCard product={p} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
}