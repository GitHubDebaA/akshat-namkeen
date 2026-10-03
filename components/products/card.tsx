"use client"
import { Prisma } from "@prisma/client";

type ProductWithVariants = Prisma.ProductGetPayload<{
    include: {
        variants: true;
    };
}>;

type ProductCardProps = {
    product: ProductWithVariants;
    variantId?: string;
    variantPicker?: boolean;
    onVariantSelect?: (variantId: string) => void;
}

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ImageOff, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { formatPrice, slugify } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { toast } from "sonner"
import WishlistButton from "../wishlist/wishlist-button";

import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

const ProductCard = ({ product, variantId, variantPicker = false, onVariantSelect }: ProductCardProps) => {
    const [isVariantDrawerOpen, setIsVariantDrawerOpen] = useState(false);
    const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(variantId);

    const isMobile = useIsMobile();
    const drawerDirection = isMobile ? "bottom" : "right";

    const { items, addItem, updateQuantity } = useCart();
    const cartProductItems = items.filter(
        (item) => item.productId === product.id
    );

    const cartVariant = cartProductItems.length === 1 ? cartProductItems[0] : undefined;

    const effectiveVariantId = selectedVariantId ??
        cartVariant?.variantId ??
        product.variants.find((variant) => variant.isDefault && variant.isActive)?.id ??
        product.variants.find((variant) => variant.isActive)?.id;

    const selectedVariant = product.variants.find((variant) => variant.id === effectiveVariantId) ?? product.variants[0];

    const quantity = items.find((item) => item.variantId === selectedVariant.id)?.quantity ?? 0;

    if (!selectedVariant) {
        return null;
    }

    const variantCount = product.variants?.filter((variant) => variant.isActive).length || 0;

    const handleAddToCart = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        // Normal product card with multiple variants
        if (!variantPicker && variantCount > 1) {
            setIsVariantDrawerOpen(true);
            return;
        }

        // Add the currently displayed variant
        addVariantToCart(selectedVariant);
    };

    const addVariantToCart = (
        variant: ProductWithVariants["variants"][number]
    ) => {
        addItem({
            variantId: variant.id,
            productId: product.id,
            productName: product.name,
            variantName: variant.name,
            price: variant.price,
            displayURL: variant.displayURL || null,
        });

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
        e.stopPropagation();
        updateQuantity(selectedVariant.id, quantity + 1);
    };

    const handleDecrease = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        updateQuantity(selectedVariant.id, quantity - 1);
    };

    const handleSelectVariant = (variantId: string) => {
        setSelectedVariantId(variantId);
        setIsVariantDrawerOpen(false);
    };

    return (
        <>
            <motion.div
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
            >
                {variantPicker ? (
                    <div
                        onClick={() => onVariantSelect?.(selectedVariant.id)}
                        className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-100 mb-3 cursor-pointer"
                    >
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-100 mb-3">
                            {
                                selectedVariant.displayURL ? (
                                    <Image
                                        src={selectedVariant.displayURL}
                                        alt={product.name}
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

                            {!variantPicker && variantCount > 1 && (
                                <div className="absolute top-3 left-3 flex items-center justify-center px-3 py-1 rounded-full bg-obsidian/90 backdrop-blur-md text-ivory text-[10px] font-semibold tracking-widest uppercase shadow-sm">
                                    {variantCount} Options
                                </div>
                            )}

                            {/* Wishlist */}
                            <div className="absolute right-3 top-3 z-10">
                                <WishlistButton variantId={selectedVariant.id} />
                            </div>

                            {/* Floating Add to Cart */}
                            <div className="absolute bottom-3 left-3 right-3">
                                {/* Add to Cart */}
                                {
                                    quantity === 0 ? (
                                        <Button
                                            onClick={handleAddToCart}
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
                                                className="flex-1 flex items-center justify-center border-r border-white/30 transition duration-150 hover:bg-white/10 active:bg-white/20 active:scale-95"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>

                                            <div className="w-12 flex-1 flex items-center justify-center font-semibold text-sm">
                                                {quantity}
                                            </div>

                                            <button
                                                onClick={handleIncrease}
                                                className="flex-1 flex items-center justify-center border-l border-white/30 transition duration-150 hover:bg-project_primary/90 active:bg-project_primary active:scale-95"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link href={`/product/${product.id}/${slugify(product.name)}/view`}>
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-100 mb-3">
                            {
                                selectedVariant.displayURL ? (
                                    <Image
                                        src={selectedVariant.displayURL}
                                        alt={product.name}
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

                            {!variantPicker && variantCount > 1 && (
                                <div className="absolute top-3 left-3 flex items-center justify-center px-3 py-1 rounded-full bg-obsidian/90 backdrop-blur-md text-ivory text-[10px] font-semibold tracking-widest uppercase shadow-sm">
                                    {variantCount} Options
                                </div>
                            )}

                            {/* Wishlist */}
                            <div className="absolute right-3 top-3 z-10">
                                <WishlistButton variantId={selectedVariant.id} />
                            </div>

                            {/* Floating Add to Cart */}
                            <div className="absolute bottom-3 left-3 right-3">
                                {/* Add to Cart */}
                                {
                                    quantity === 0 ? (
                                        <Button
                                            onClick={handleAddToCart}
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
                                                className="flex-1 flex items-center justify-center border-r border-white/30 transition duration-150 hover:bg-white/10 active:bg-white/20 active:scale-95"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>

                                            <div className="w-12 flex-1 flex items-center justify-center font-semibold text-sm">
                                                {quantity}
                                            </div>

                                            <button
                                                onClick={handleIncrease}
                                                className="flex-1 flex items-center justify-center border-l border-white/30 transition duration-150 hover:bg-project_primary/90 active:bg-project_primary active:scale-95"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </Link>
                )}

                <div className="px-1">
                    <p className="text-brand-500 text-[10px] font-semibold tracking-widest uppercase">
                        Akshat Namkeen
                    </p>
                    <Link href={`/product/${product.id}/${slugify(product.name)}/view`}>
                        <h3 className="text-sm font-medium text-obsidian line-clamp-1">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="text-xs text-obsidian/30">
                        {selectedVariant.variant}
                    </div>
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
                        <span className="text-sm font-medium text-obsidian">{formatPrice(selectedVariant.price)}</span>
                    </div>
                </div>
            </motion.div >
            {!variantPicker && (
                <Drawer
                    direction={drawerDirection}
                    open={isVariantDrawerOpen}
                    onOpenChange={setIsVariantDrawerOpen}
                >
                    <DrawerContent className={isMobile ? "bg-ivory" : "bg-ivory rounded-none"}>
                        <div className="mx-auto w-full max-w-6xl">
                            <DrawerHeader>
                                <DrawerTitle>
                                    {product.name}
                                </DrawerTitle>

                                <DrawerDescription>
                                    Choose from {variantCount} available options
                                </DrawerDescription>
                            </DrawerHeader>

                            <div className="px-4 pb-8">
                                <div className="grid grid-cols-2 gap-6">
                                    {product.variants
                                        .filter((variant) => variant.isActive)
                                        .map((variant) => (
                                            <ProductCard
                                                key={variant.id}
                                                product={product}
                                                variantId={variant.id}
                                                variantPicker
                                                onVariantSelect={handleSelectVariant}
                                            />
                                        ))}
                                </div>
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            )}
        </>
    );
};

export default ProductCard;