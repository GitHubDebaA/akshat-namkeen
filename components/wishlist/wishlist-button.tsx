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
        sm: "h-9 w-9",
        md: "h-10 w-10",
        lg: "h-12 w-12",
    };

    const iconSizes = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    };

    function handleToggle(e: React.MouseEvent<HTMLButtonElement>) {
        // Prevent ProductCard / Link from opening
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;

        const previousValue = wishlisted;

        // Optimistic update
        setWishlisted(!previousValue);

        startTransition(async () => {
            try {
                const result = await toggleWishlist(variantId);
                setWishlisted(result.wishlisted);
                toast.success(result.wishlisted ? "Added to wishlist" : "Removed from wishlist");
            } catch (error) {
                console.error("error in handle wish list", error);
                setWishlisted(previousValue);
                toast.error("Please sign in to manage your wishlist.");
            }
        });
    }

    return (
        <button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            disabled={isPending}
            onClick={handleToggle}
            className={`
                group relative flex ${sizes[size]}
                items-center justify-center
                rounded-full
                border
                border-white/70
                bg-white/90
                text-obsidian/60
                shadow-[0_4px_14px_rgba(0,0,0,0.08)]
                backdrop-blur-md
                transition-all
                duration-200
                hover:scale-105
                hover:bg-white
                hover:text-project_primary
                hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]
                active:scale-95
                disabled:cursor-default
                disabled:opacity-60
                cursor-pointer
                ${wishlisted ? "text-project_primary" : ""}
            `}
        >
            <Heart
                className={`
                    ${iconSizes[size]}
                    transition-transform
                    duration-200
                    ${wishlisted
                        ? "scale-110 fill-current"
                        : "group-hover:scale-110"
                    }
                `}
                strokeWidth={1.8}
            />
        </button>
    );
}