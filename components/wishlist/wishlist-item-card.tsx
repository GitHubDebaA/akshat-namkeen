"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import WishlistButton from "./wishlist-button";
import { WishlistItemWithProduct } from "@/types/wishlist";
import { formatPrice, slugify } from "@/lib/utils";
import { useCart } from "@/store/cart";

interface WishlistItemCardProps {
    item: WishlistItemWithProduct;
}

export default function WishlistItemCard({ item }: WishlistItemCardProps) {
    const addItem = useCart((state) => state.addItem);
    const variant = item.variant;
    const product = variant.product;
    const productUrl = `/product/${product.id}/${slugify(product.name)}/view?variant=${variant.id}`;

    function handleAddToCart() {
        if (!variant.isActive) return;
        addItem({
            variantId: variant.id,
            productId: product.id,
            productName: product.name,
            variantName: variant.name,
            price: Number(variant.sellingPrice),
            displayURL: variant.displayURL,
        });
        toast.success("Added to cart");
    }

    return (
        <motion.article
            variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
            }}
            whileHover={{ y: -3 }}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-obsidian/10 bg-ivory transition-all duration-300 hover:shadow-xl"
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-ivory">
                <Link href={productUrl} aria-label={`View ${product.name}`} className="absolute inset-0">
                    {variant.displayURL ? (
                        <Image
                            src={variant.displayURL}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${variant.isActive ? "" : "grayscale opacity-60"}`}
                        />
                    ) : (
                        <span className="flex h-full flex-col items-center justify-center gap-2 text-obsidian/35">
                            <ImageOff className="h-9 w-9" strokeWidth={1.2} />
                            <span className="text-[10px] font-medium">Image coming soon</span>
                        </span>
                    )}
                </Link>

                <div className="absolute left-2 top-2">
                    <span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${variant.isActive ? "bg-ivory/90 text-obsidian" : "bg-obsidian/80 text-ivory"}`}>
                        {variant.isActive ? "In stock" : "Unavailable"}
                    </span>
                </div>
                <div className="absolute right-2 top-2 flex items-center gap-1">
                    <WishlistButton variantId={variant.id} initialWishlisted size="sm" tone="primary" />
                </div>
            </div>

            <div className="flex flex-1 flex-col p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <Link href={productUrl} className="block">
                            <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-obsidian transition-colors group-hover:text-project_primary">{product.name}</h2>
                        </Link>
                        <p className="mt-1 line-clamp-1 text-xs leading-4 text-obsidian/60">{variant.variant}</p>
                    </div>
                    <p className="shrink-0 text-right text-sm font-bold text-obsidian sm:text-base">{formatPrice(Number(variant.sellingPrice))}</p>
                </div>
                <div className="mt-3 border-t border-obsidian/10 pt-3">
                    {variant.isActive ? (
                        <Button
                            type="button"
                            onClick={handleAddToCart}
                            className="group/button relative h-9 w-full overflow-hidden rounded-full bg-obsidian text-xs text-ivory transition-all duration-300 hover:shadow-lg"
                        >
                            <span className="absolute inset-0 origin-left scale-x-0 bg-project_primary transition-transform duration-300 group-hover/button:scale-x-100" />
                            <span className="relative flex items-center justify-center gap-2">
                                <ShoppingBag className="h-3.5 w-3.5" /> Add to cart
                            </span>
                        </Button>
                    ) : (
                        <Button type="button" disabled className="h-9 w-full rounded-full bg-obsidian/10 text-xs text-obsidian/45">
                            Unavailable
                        </Button>
                    )}
                </div>
            </div>
        </motion.article>
    );
}
