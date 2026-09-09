"use client"
import { Prisma } from "@prisma/client";
type ProductVariant = Prisma.ProductVariantGetPayload<{
    include: {
        product: true;
    };
}>;

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ImageOff, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { formatPrice, slugify } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { toast } from "sonner"
import { Button } from "../ui/button";

const ProductCard = ({ variant }: { variant : ProductVariant }) => {
    console.log("Product variant data:", variant); // Debugging line to check the product data
    const [wished, setWished] = useState(false);
    const { addItem, items, updateQuantity } = useCart();

    const cartItem = items.find((item) => item.product.id === variant.productId);
    const quantity = cartItem?.quantity ?? 0;

    const handleAddToCart = () => {
        // addItem(product, 1);
        toast.success("Item added to cart!", {
            position: "bottom-left",
            style: {
                background: "#111827",
                color: "#fff",
                border: "1px solid #374151",
            },
        });
    };

    const handleIncrease = (e: React.MouseEvent) => {
        e.preventDefault();

        if (cartItem) {
            // updateQuantity(product.id, quantity + 1);
        } else {
            // addItem(product, 1);
        }
    };

    const handleDecrease = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!cartItem) return;

        // updateQuantity(product.id, quantity - 1);
    };

    return (
        <motion.div
            className="group relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <Link href={`/product/${variant.productId}/${slugify(variant.product.name)}/view`}>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-100 mb-3">
                    {
                        variant.displayURL ? (
                            <Image
                                src={variant.displayURL}
                                alt={variant.name}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority={false}
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 select-none animate-pulse">
                                <div className="text-obsidian/30 mb-2">
                                    <ImageOff
                                        className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24"
                                        strokeWidth={1}
                                    />
                                </div>

                                <div className="text-center">
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-light uppercase tracking-widest text-obsidian/50">
                                        Image
                                    </h2>
                                    <p className="mt-1 text-[10px] sm:text-xs uppercase border-t border-obsidian/30 text-obsidian/40">
                                        Not Available
                                    </p>
                                </div>
                            </div>
                        )
                    }

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                    {/* Badge */}
                    {/* <div className="absolute top-3 left-3 flex items-center justify-center px-3 py-1 rounded-full bg-obsidian/90 backdrop-blur-md text-ivory text-[10px] font-semibold tracking-widest uppercase shadow-sm">
                        Newly Added
                    </div> */}

                    {/* Wishlist */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setWished(!wished);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-md transition hover:scale-110"
                    >

                        <Heart
                            className={`w-4 h-4 transition-colors ${wished
                                ? "fill-red-500 text-red-500"
                                : "text-obsidian/60"
                                }`}
                        />
                    </button>

                    {/* Floating Add to Cart */}
                    <div className="absolute bottom-3 left-3 right-3">
                        {/* Add to Cart */}
                        {/* <Button
                            onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart();
                            }}
                            className="w-full h-11 rounded-full bg-ivory/30 backdrop-blur-sm text-ivory hover:bg-project_primary transition-all duration-300 shadow-lg hover:shadow-xl font-medium cursor-pointer group/button"
                        >
                            <ShoppingBag className="w-4 h-4 transition-transform duration-300 group-hover/button:-translate-y-0.5" />
                            <span>Add to bag</span>
                        </Button> */}

                        {
                            quantity === 0 ? (
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToCart();
                                    }}
                                    className="relative overflow-hidden h-11 w-full text-sm rounded-full bg-obsidian text-white group/button transition-all duration-300 hover:shadow-xl cursor-pointer">
                                    <span className="absolute inset-0 bg-project_primary scale-x-0 origin-left transition-transform duration-300 group-hover/button:scale-x-100"></span>
                                    <span className="relative flex items-center justify-center gap-2">
                                        <ShoppingBag className="w-4 h-4" />
                                        Add to Cart
                                    </span>
                                </Button>
                            ) : (
                                <div className="flex h-11 overflow-hidden rounded-full bg-obsidian text-white shadow-xl">
                                    <button
                                        onClick={handleDecrease}
                                        className="flex-1 flex items-center justify-center border-r border-white/10 transition duration-150 hover:bg-white/10 active:bg-white/20 active:scale-95"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>

                                    <div className="w-12 flex items-center justify-center font-semibold text-sm">
                                        {quantity}
                                    </div>

                                    <button
                                        onClick={handleIncrease}
                                        className="flex-1 flex items-center justify-center border-l border-white/10 transition duration-150 hover:bg-project_primary/90 active:bg-project_primary active:scale-95"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </Link>

            <div className="px-1">
                <p className="text-brand-500 text-[10px] font-semibold tracking-widest uppercase">
                    Akshat Namkeen
                </p>
                <Link href={`/product/${variant.id}`}>
                    <h3 className="text-sm font-medium text-obsidian line-clamp-1">
                        {variant.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex gap-0.5">
                        {Array(5).fill(0).map((_, i) => (
                            <Star
                                key={i}
                                className={`w-2.5 h-2.5 ${i < 3 ? "fill-brand-400 text-brand-400" : "text-brand-200"}`}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] text-obsidian/50">(100)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-obsidian">{formatPrice(variant.price)}</span>
                </div>
            </div>
        </motion.div >
    );
};

export default ProductCard;