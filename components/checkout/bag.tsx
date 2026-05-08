"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart";
import { ShoppingBag, Minus, Plus, ArrowRight, Trash2, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function Bag() {
    const { items, updateQuantity, removeItem } = useCart();
    return (
        <div className="flex-1 overflow-y-auto space-y-4">
            <AnimatePresence>
                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-64 text-center"
                    >
                        <ShoppingBag className="w-12 h-12 text-ivory mb-4" />
                        <p className="font-display text-xl text-ivory">Your bag is empty</p>
                        <p className="text-sm text-ivory/80">Discover something beautiful</p>

                        <Button className="gap-3 bg-obsidian/70 text-ivory uppercase px-8 py-6 mt-6" onClick={() => window.location.href = "/"}>
                            Explore <ArrowRight className="w-4 h-4" />
                        </Button>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-7 h-7 text-brand-500 inline-block text-obsidian" />
                                <span className="text-xl font-medium text-obsidian">Your Bag</span>
                            </div>
                            <span className="text-sm font-medium text-obsidian/50">{items.length} {items.length === 1 ? "item" : "items"}</span>
                        </div>
                        {items.map((item) => (
                            <motion.div
                                key={item.product.id}
                                layout
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex gap-4 p-3 rounded-2xl bg-white border border-brand-100"
                            >
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.product.dpURL}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-brand-500 font-medium tracking-wider uppercase mb-0.5">
                                        Akshat Namkeen
                                    </p>
                                    <p className="text-sm font-medium text-obsidian truncate">{item.product.name}</p>
                                    {item.selectedColor && (
                                        <p className="text-xs text-obsidian/50 mt-0.5">{item.selectedColor}</p>
                                    )}
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2 bg-brand-100 rounded-full px-2 py-1">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className="w-5 h-5 flex items-center justify-center hover:text-brand-600 transition-colors"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className="w-5 h-5 flex items-center justify-center hover:text-brand-600 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeItem(item.product.id)}
                                    className="self-start p-1 text-obsidian/30 hover:text-obsidian/60 transition-color flex items-center gap-1 text-xs cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Remove
                                </button>
                            </motion.div>
                        ))}

                        <Link href="/" className="text-sm underline text-obsidian/50 hover:text-obsidian/80 transition-colors flex items-center gap-1 mt-4">
                            Add more items
                            <ArrowUpRight className="w-3 h-3 inline-block ml-1" />
                        </Link>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}