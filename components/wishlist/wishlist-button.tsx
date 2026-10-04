"use client";

import { useState, useTransition } from "react";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { toggleWishlist } from "@/lib/actions/wishlist";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface WishlistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variantId: string;
    initialWishlisted?: boolean;
    size?: "sm" | "md" | "lg";
}

const sizeClasses = {
    sm: "h-9 w-9",
    md: "h-11 w-11",
    lg: "h-12 w-12",
};

const iconSizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
};

export default function WishlistButton({
    variantId,
    initialWishlisted = false,
    size = "md",
    className,
    ...props
}: WishlistButtonProps) {
    const [wishlisted, setWishlisted] = useState(initialWishlisted);
    const [isPending, startTransition] = useTransition();

    async function handleToggle(e: React.MouseEvent<HTMLButtonElement>) {
        // Prevent ProductCard / Link from opening
        e.preventDefault();
        e.stopPropagation();

        if (isPending) return;

        const previousValue = wishlisted;
        const nextValue = !previousValue;

        // Optimistic update
        setWishlisted(!nextValue);

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
        <Button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            disabled={isPending}
            onClick={handleToggle}
            className={cn(
                "group relative inline-flex shrink-0 items-center justify-center rounded-full p-0 transition-all duration-300",
                "bg-obsidian text-white hover:bg-obsidian/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-project_primary focus-visible:ring-offset-2",
                "active:scale-95 disabled:pointer-events-none disabled:opacity-70",
                sizeClasses[size],
                wishlisted && "bg-obsidian text-project_primary",
                className
            )}
            {...props}
        >
            {isPending ? (
                <Loader2 className={cn("animate-spin text-white/80", iconSizeClasses[size])} />
            ) : (
                <Heart
                    className={cn(
                        iconSizeClasses[size],
                        "transition-all duration-300 group-hover:scale-110 active:scale-125",
                        wishlisted
                            ? "fill-project_primary text-project_primary animate-in zoom-in-75 duration-200"
                            : "fill-none text-current"
                    )}
                    strokeWidth={2}
                />
            )}
        </Button>
    );
}