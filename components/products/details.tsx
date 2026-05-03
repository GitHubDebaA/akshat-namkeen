"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingBag, Heart, Share2, ChevronDown, Check, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "../ui/button"
import { useCart } from "@/store/cart";

import { Product, ProductProperty } from "@prisma/client";
import ProductCard from "./card";

type Props = {
    product: Product;
    properties: ProductProperty[];
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

export default function ProductDetails({ product, properties }: Props) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [wished, setWished] = useState(false);
    const [openTab, setOpenTab] = useState<string | null>("description");
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const sorted = [...properties].sort(
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
            content: product.description,
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-obsidian/50 mb-8">
                    <Link href="/" className="hover:text-obsidian transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/" className="hover:text-obsidian transition-colors">Products</Link>
                    <span>/</span>
                    <span className="text-obsidian">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
                    {/* Images */}
                    <div className="flex gap-4 h-[40dvh] md:h-[50dvh] lg:h-[100vh] max-h-[600px]">
                        {/* Thumbnails */}
                        {product.images.length > 0 && (
                            <div className="flex flex-col gap-3 w-16 flex-shrink-0 h-full">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? "border-obsidian" : "border-transparent opacity-60 hover:opacity-100"}`}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image */}
                        <div className="flex-1 relative h-full rounded-3xl overflow-hidden bg-brand-100">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={product.images[selectedImage]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>

                            <div className="absolute top-4 left-4 px-3 py-1 bg-obsidian text-ivory text-[10px] font-semibold tracking-widest uppercase rounded-full">
                                New Arrival
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-brand-500 text-xs font-semibold tracking-widest uppercase mb-2">
                                Akshat Namkeen
                            </p>
                            <h1 className="font-display text-4xl font-medium text-obsidian mb-4">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex gap-0.5">
                                    {Array(5).fill(0).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < 4
                                                ? "fill-brand-400 text-brand-400"
                                                : "text-brand-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-obsidian">3</span>
                                <span className="text-sm text-obsidian/50">
                                    (400 reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-4 mb-8">
                                <span className="font-display text-3xl font-medium text-obsidian">
                                    {formatPrice(product.price)}
                                </span>
                                {product.price && (
                                    <span className="text-lg text-obsidian/40 line-through">
                                        {formatPrice(product.price + 50)}
                                    </span>
                                )}
                                {product.price && (
                                    <span className="px-3 py-1 bg-brand-100 text-brand-700 text-sm font-medium rounded-full">
                                        Save {formatPrice(product.price + 50 - product.price)}
                                    </span>
                                )}
                            </div>

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
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center gap-3 bg-brand-100 rounded-full px-4 py-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-5 h-5 flex items-center justify-center text-obsidian hover:text-brand-600 transition-colors text-lg font-medium"
                                    >
                                        −
                                    </button>
                                    <span className="w-6 text-center font-medium text-obsidian">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-5 h-5 flex items-center justify-center text-obsidian hover:text-brand-600 transition-colors text-lg font-medium"
                                    >
                                        +
                                    </button>
                                </div>

                                <Button
                                    size="lg"
                                    className="flex-1 gap-2"
                                    onClick={handleAddToCart}
                                >
                                    <AnimatePresence mode="wait">
                                        {added ? (
                                            <motion.span
                                                key="added"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Check className="w-4 h-4" /> Added to Bag
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="add"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="flex items-center gap-2"
                                            >
                                                <ShoppingBag className="w-4 h-4" /> Add to Bag
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Button>

                                <button
                                    onClick={() => setWished(!wished)}
                                    className={`p-3.5 rounded-full border transition-all ${wished
                                        ? "bg-red-50 border-red-200 text-red-500"
                                        : "border-brand-200 text-obsidian hover:border-obsidian"
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${wished ? "fill-red-500" : ""}`} />
                                </button>
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
                                            <span className="text-sm font-medium text-obsidian">{tab.label}</span>
                                            <ChevronDown
                                                className={`w-4 h-4 text-obsidian/50 transition-transform ${openTab === tab.id ? "rotate-180" : ""
                                                    }`}
                                            />
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