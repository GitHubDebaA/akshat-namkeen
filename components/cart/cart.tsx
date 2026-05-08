"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "../ui/button";

export default function Cart() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart();
    const cartTotal = total();

    const handleExplore = () => {
        window.location.href = "/";
        closeCart();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-obsidian/40 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 350, damping: 35 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-ivory z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-200">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-obsidian" />
                                <h2 className="font-display text-lg font-medium">Your Bag</h2>
                                <span className="text-sm text-obsidian/50">({items.length})</span>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 rounded-full hover:bg-brand-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            <AnimatePresence>
                                {items.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center h-64 text-center"
                                    >
                                        <ShoppingBag className="w-12 h-12 text-brand-300 mb-4" />
                                        <p className="font-display text-xl text-obsidian/50">Your bag is empty</p>
                                        <p className="text-sm text-obsidian/40">Discover something beautiful</p>
                                        <Button className="gap-3 bg-obsidian/70 text-ivory uppercase px-8 py-6 mt-6" onClick={handleExplore}>
                                            Explore <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </motion.div>
                                ) : (
                                    items.map((item) => (
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
                                                    src={item.product.images[0]}
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
                                                className="self-start p-1 text-obsidian/30 hover:text-obsidian/60 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="px-6 py-5 border-t border-brand-200 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-obsidian/60">Free shipping on orders over {formatPrice(75)}</span>
                                    <span className={cartTotal >= 75 ? "text-green-600 font-medium" : "text-brand-500"}>
                                        {cartTotal >= 75 ? "✓ Unlocked" : `$${75 - cartTotal} away`}
                                    </span>
                                </div>
                                {cartTotal >= 75 && (
                                    <div className="w-full h-1.5 rounded-full bg-green-100">
                                        <div className="h-full bg-green-500 rounded-full w-full" />
                                    </div>
                                )}
                                {cartTotal < 75 && (
                                    <div className="w-full h-1.5 rounded-full bg-brand-100">
                                        <div
                                            className="h-full bg-brand-400 rounded-full transition-all duration-500"
                                            style={{ width: `${(cartTotal / 75) * 100}%` }}
                                        />
                                    </div>
                                )}
                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        <p className="text-xs text-obsidian/50 uppercase tracking-wider">Subtotal</p>
                                        <p className="font-display text-2xl font-medium">{formatPrice(cartTotal)}</p>
                                    </div>
                                    <Link href="/checkout" onClick={closeCart}>
                                        <Button size="lg" className="gap-3 bg-obsidian/50 hover:bg-obsidian transition-colors text-ivory uppercase px-8 py-6">
                                            Checkout <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}