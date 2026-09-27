"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { toggleWishlist } from "@/lib/actions/wishlist";

interface WishlistButtonProps {
    variantId: string;
    initialWishlisted?: boolean;
    size?: "sm" | "md" | "lg";
}

export default function WishlistButton({
    variantId,
    initialWishlisted = false,
    size = "md",
}: WishlistButtonProps) {
    const [wishlisted, setWishlisted] = useState(initialWishlisted);
    const [isPending, startTransition] = useTransition();

    const sizes = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
    };

    const iconSizes = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    };

    function handleToggle() {
        if (isPending) return;

        const previousValue = wishlisted;

        setWishlisted(!previousValue);

        startTransition(async () => {
            try {
                const result = await toggleWishlist(variantId);

                setWishlisted(result.wishlisted);

                toast.success(
                    result.wishlisted
                        ? "Added to wishlist"
                        : "Removed from wishlist"
                );
            } catch (error) {
                console.error('error in handle wish list ', error);
                setWishlisted(previousValue);
                toast.error("Please sign in to manage your wishlist.");
            }
        });
    }

    return (
        <button
            type="button"
            aria-label={
                wishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
            }
            aria-pressed={wishlisted}
            disabled={isPending}
            onClick={handleToggle}
            className={`flex ${sizes[size]} items-center justify-center rounded-full border border-brand-200 bg-white transition hover:border-project_primary hover:text-project_primary ${wishlisted
                    ? "text-project_primary"
                    : "text-obsidian/60"
                }`}
        >
            <Heart
                className={iconSizes[size]}
                strokeWidth={1.8}
                fill={wishlisted ? "currentColor" : "none"}
            />
        </button>
    );
}