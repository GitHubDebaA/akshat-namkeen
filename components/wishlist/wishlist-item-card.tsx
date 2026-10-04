"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { removeFromWishlist } from "@/lib/actions/wishlist";
import WishlistButton from "./wishlist-button";
import { WishlistItemWithProduct } from "@/types/wishlist";

import { formatPrice } from "@/lib/utils";

interface WishlistItemCardProps {
    item: WishlistItemWithProduct;
}

export default function WishlistItemCard({
    item,
}: WishlistItemCardProps) {
    const [isPending, startTransition] = useTransition();

    const variant = item.variant;
    const product = variant.product;

    const productUrl = `/products/${product.id}/${slugify(
        product.name
    )}/view?variant=${variant.id}`;

    function handleRemove() {
        startTransition(async () => {
            try {
                await removeFromWishlist(variant.id);

                toast.success("Removed from wishlist");

                window.location.reload();
            } catch {
                toast.error("Unable to remove item");
            }
        });
    }

    return (
        <article className="group">

            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-50">

                <Link href={productUrl}>
                    {variant.displayURL ? (
                        <Image
                            src={variant.displayURL}
                            alt={product.name}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-obsidian/30">
                            No image
                        </div>
                    )}
                </Link>

                {/* Wishlist */}
                <div className="absolute right-3 top-3">
                    <WishlistButton
                        variantId={variant.id}
                        initialWishlisted
                        size="sm"
                    />
                </div>
            </div>

            {/* Information */}
            <div className="pt-4">

                <Link href={productUrl}>
                    <h3 className="truncate text-sm font-semibold text-obsidian transition hover:text-project_primary">
                        {product.name}
                    </h3>
                </Link>

                <p className="mt-1 text-xs text-obsidian/50">
                    {variant.name}
                </p>

                <div className="mt-3 flex items-center justify-between">
                    <p className="text-base font-semibold text-obsidian">
                        {formatPrice(Number(variant.sellingPrice))}
                    </p>

                    {!variant.isActive && (
                        <span className="text-xs font-medium text-red-500">
                            Unavailable
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">

                    {variant.isActive && (
                        <button
                            type="button"
                            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-obsidian px-4 py-2.5 text-xs font-medium text-white transition hover:bg-obsidian/90"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Add to Cart
                        </button>
                    )}

                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleRemove}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-200 text-obsidian/50 transition hover:border-red-200 hover:text-red-500"
                        aria-label="Remove from wishlist"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </article>
    );
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}