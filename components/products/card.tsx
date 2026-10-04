"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ImageOff, Minus, Plus, ShoppingBag, Star, StarIcon } from "lucide-react";
import { toast } from "sonner";

import type { ProductCardData, ProductVariant } from "@/types/product";

import { formatPrice, slugify } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useIsMobile } from "@/hooks/use-mobile";

import WishlistButton from "../wishlist/wishlist-button";
import { Button } from "../ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Tooltip, TooltipContent, TooltipTrigger, } from "../ui/tooltip";

interface ProductCardProps {
    data: ProductCardData;
    variantPicker?: boolean;
    onVariantSelect?: (variantId: string) => void;
}

const ProductCard = ({ data, variantPicker = false, onVariantSelect }: ProductCardProps) => {
    const { product, selectedVariantId: initialVariantId, wishlistedVariantIds, rating } = data;
    const [isVariantDrawerOpen, setIsVariantDrawerOpen] = useState(false);
    const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(initialVariantId);

    const isMobile = useIsMobile();
    const drawerDirection = isMobile ? "bottom" : "right";

    const { items, addItem, updateQuantity } = useCart();

    const activeVariants = useMemo(() => product.variants.filter(
        (variant) => variant.isActive
    ), [product.variants]);

    const variantCount = activeVariants.length;

    const selectedVariant = useMemo(() => {
        return (
            activeVariants.find((variant) => variant.id === selectedVariantId) ??
            activeVariants.find((variant) => variant.isDefault) ??
            activeVariants[0]
        );
    }, [activeVariants, selectedVariantId]);

    if (!selectedVariant) {
        return null;
    }

    const quantity = items.find((item) => item.variantId === selectedVariant.id)?.quantity ?? 0;
    const isWishlisted = wishlistedVariantIds.includes(selectedVariant.id);

    const productUrl = `/product/${product.id}/${slugify(product.name)}/view`;

    const addVariantToCart = (variant: ProductVariant) => {
        addItem({
            variantId: variant.id,
            productId: product.id,
            productName: product.name,
            variantName: variant.name,
            price: variant.sellingPrice,
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

    const handleAddToCart = (e?: React.MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (!variantPicker && variantCount > 1) {
            setIsVariantDrawerOpen(true);
            return;
        }

        addVariantToCart(selectedVariant);
    };

    const handleIncrease = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        updateQuantity(selectedVariant.id, quantity + 1);
    };

    const handleDecrease = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        updateQuantity(selectedVariant.id, quantity - 1);
    };

    const handleSelectVariant = (variantId: string) => {
        setSelectedVariantId(variantId);
        setIsVariantDrawerOpen(false);
        onVariantSelect?.(variantId);
    };

    const productImage = (
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-100">
            {selectedVariant.displayURL ? (
                <Image
                    src={selectedVariant.displayURL}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={false}
                />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 select-none">
                    <div className="mb-2 text-obsidian/30">
                        <ImageOff
                            className="h-14 w-14 sm:h-20 sm:w-20 md:h-24 md:w-24"
                            strokeWidth={1}
                        />
                    </div>

                    <div className="text-center">
                        <h2 className="text-lg font-light uppercase tracking-widest text-obsidian/50 sm:text-xl md:text-2xl">
                            Image
                        </h2>

                        <p className="mt-1 border-t border-obsidian/30 text-[10px] uppercase text-obsidian/40 sm:text-xs">
                            Not Available
                        </p>
                    </div>
                </div>
            )}

            {/* Hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

            {/* Variant count */}
            {!variantPicker &&
                variantCount > 1 && (
                    <div className="absolute left-3 top-3 flex items-center justify-center rounded-full bg-obsidian/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ivory shadow-sm backdrop-blur-md">
                        {variantCount} Options
                    </div>
                )}

            {/* Wishlist */}
            <div className=" absolute right-1 top-1 z-20">
                <WishlistButton variantId={selectedVariant.id} initialWishlisted={isWishlisted} />
            </div>

            {/* Add to cart */}
            <div className="absolute bottom-3 left-1 right-1">
                {quantity === 0 ? (
                    /* Add to Cart Button */
                    <Button
                        type="button"
                        onClick={handleAddToCart}
                        className="group/button relative h-11 w-full overflow-hidden rounded-full bg-obsidian text-sm text-white transition-all duration-300 hover:shadow-xl"
                    >
                        <span className="absolute inset-0 origin-left scale-x-0 bg-project_primary transition-transform duration-300 group-hover/button:scale-x-100" />
                        <span className="relative flex items-center justify-center gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            Add to Cart
                        </span>
                    </Button>
                ) : (
                    /* Quantity Counter Bar */
                    <div className="flex h-11 overflow-hidden rounded-full bg-obsidian text-white shadow-xl">
                        <button
                            type="button"
                            onClick={handleDecrease}
                            className="flex-1 cursor-pointer items-center justify-center border-r border-white/30 transition duration-150 hover:bg-white/10 active:scale-95 active:bg-white/20"
                        >
                            <Minus className="mx-auto h-4 w-4" />
                        </button>

                        <div className="flex-1 flex w-12 items-center justify-center text-sm font-semibold">
                            {quantity}
                        </div>

                        <button
                            type="button"
                            onClick={handleIncrease}
                            className="flex-1 cursor-pointer items-center justify-center border-l border-white/30 transition duration-150 hover:bg-project_primary/90 active:scale-95 active:bg-project_primary"
                        >
                            <Plus className="mx-auto h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

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
                        className="cursor-pointer"
                    >
                        {productImage}
                    </div>
                ) : (
                    <Link href={productUrl}>
                        {productImage}
                    </Link>
                )}

                {/* Product information */}
                <div className="py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-500">
                        Akshat Namkeen
                    </p>

                    <Link href={productUrl}>
                        <div className="flex items-center justify-between gap-5 text-sm font-semibold text-obsidian">
                            <div className="min-w-0 truncate">
                                {product.name}
                            </div>

                            <div className="shrink-0">
                                {formatPrice(selectedVariant.sellingPrice)}
                            </div>
                        </div>
                    </Link>

                    <div className="flex items-center justify-between gap-5 text-xs text-obsidian/70">
                        <div className="truncate">
                            {selectedVariant.variant}
                        </div>

                        {/* Rating */}
                        {
                            rating.count === 0 ? (
                                <div className="inline-flex items-center gap-1.5 rounded-sm border border-green-200 bg-green-50 px-2 py-0.5 text-green-700">
                                    <Star className="h-3 w-3 fill-current" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">
                                        New
                                    </span>
                                </div>
                            ) : (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div className="flex shrink-0 cursor-help items-center gap-1"
                                            aria-label={`${rating.average} out of 5 from ${rating.count} reviews`}
                                        >
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <Star
                                                        key={index}
                                                        className={`h-2.5 w-2.5 ${index < Math.round(rating.average) ?
                                                            "fill-project_primary text-project_primary" :
                                                            "text-obsidian/30"
                                                            }`}
                                                    />
                                                )
                                                )}
                                            </div>

                                            <span className="text-[10px] font-medium text-obsidian/60">
                                                {rating.average.toFixed(1)}
                                            </span>
                                        </div>
                                    </TooltipTrigger>

                                    <TooltipContent>
                                        <p className="flex items-center justify-center gap-1 text-center text-sm text-ivory">
                                            <StarIcon className="h-3 w-3 shrink-0 fill-ivory text-ivory" />
                                            <span>
                                                {rating.average.toFixed(1)}{" "}
                                                ({rating.count}{" "}reviews)
                                            </span>
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            )
                        }
                    </div>
                </div>
            </motion.div>

            {/* Variant drawer */}
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
                                    Choose from{" "}
                                    {variantCount}{" "}
                                    available options
                                </DrawerDescription>
                            </DrawerHeader>

                            <div className="px-4 pb-8">
                                <div className="grid grid-cols-2 gap-6">
                                    {activeVariants.map(
                                        (variant) => (
                                            <ProductCard
                                                key={variant.id}
                                                data={{
                                                    product,
                                                    selectedVariantId: variant.id,
                                                    wishlistedVariantIds,
                                                    rating,
                                                }}
                                                variantPicker
                                                onVariantSelect={handleSelectVariant}
                                            />
                                        )
                                    )}
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