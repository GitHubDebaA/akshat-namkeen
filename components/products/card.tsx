"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { toast } from "sonner"
import { Button } from "../ui/button";

const ProductCard = ({ product }: { product: Product }) => {
    const [wished, setWished] = useState(false);
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem(product, 1);
        toast.success("Item added to cart!", {
            position: "bottom-left",
            style: {
                background: "#111827",
                color: "#fff",
                border: "1px solid #374151",
            },
        });
    };

    return (
        <motion.div
            className="group relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            <Link href={`/products/${product.id}/view`}>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-100 mb-3">
                    <Image
                        src={product.dpURL}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

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
                    </div>
                </div>
            </Link>

            <div className="px-1">
                <p className="text-brand-500 text-[10px] font-semibold tracking-widest uppercase">
                    Akshat Namkeen
                </p>
                <Link href={`/product/${product.id}`}>
                    <h3 className="text-sm font-medium text-obsidian line-clamp-1">
                        {product.name}
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
                    <span className="text-sm font-medium text-obsidian">{formatPrice(product.price)}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;