import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";

const ProductCard = ({ product }: { product: Product }) => {
    const [wished, setWished] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
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
                        unoptimized
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 flex items-center justify-center px-3 py-1 rounded-full bg-obsidian/90 backdrop-blur-md text-ivory text-[10px] font-semibold tracking-widest uppercase shadow-sm">
                        Newly Added
                    </div>

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

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart();
                        }}
                        className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-black text-white shadow-lg opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 hover:scale-110"
                    >
                        <ShoppingBag className="w-4 h-4" />
                    </button>
                </div>
            </Link>

            <div className="px-1">
                <p className="text-brand-500 text-[10px] font-semibold tracking-widest uppercase mb-0.5">
                    Akshat Namkeen
                </p>
                <Link href={`/product/${product.id}`}>
                    <h3 className="text-sm font-medium text-obsidian hover:text-brand-700 transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-1.5 mt-1 mb-2">
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
                    <span className="text-sm font-semibold text-obsidian">{formatPrice(product.price)}</span>
                    {product.price && (
                        <span className="text-xs text-obsidian/40 line-through">
                            {formatPrice(product.price + 50)}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;