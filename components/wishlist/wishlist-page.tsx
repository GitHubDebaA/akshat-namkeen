"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";

import { clearWishlist } from "@/lib/actions/wishlist";
import WishlistItemCard from "./wishlist-item-card";
import { WishlistWithItems } from "@/types/wishlist";

interface WishlistPageProps {
    wishlist: WishlistWithItems;
}

export default function WishlistPage({
    wishlist,
}: WishlistPageProps) {
    const [isPending, startTransition] = useTransition();

    const items = wishlist?.items ?? [];

    function handleClear() {
        if (items.length === 0) return;

        const confirmed = window.confirm(
            "Remove all items from your wishlist?"
        );

        if (!confirmed) return;

        startTransition(async () => {
            try {
                await clearWishlist();

                toast.success("Wishlist cleared");

                window.location.reload();
            } catch {
                toast.error("Unable to clear wishlist");
            }
        });
    }

    return (
        <main className="min-h-screen bg-brand-50/40">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                        <div className="flex items-center gap-3">
                            <Heart
                                className="h-6 w-6 text-project_primary"
                                fill="currentColor"
                            />

                            <h1 className="text-2xl font-semibold tracking-tight text-obsidian sm:text-3xl">
                                My Wishlist
                            </h1>
                        </div>

                        <p className="mt-2 text-sm text-obsidian/55">
                            Things you are craving.
                        </p>
                    </div>

                    {items.length > 0 && (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-obsidian/50">
                                {items.length}{" "}
                                {items.length === 1
                                    ? "item"
                                    : "items"}
                            </span>

                            <button
                                type="button"
                                disabled={isPending}
                                onClick={handleClear}
                                className="inline-flex items-center gap-2 text-xs font-medium text-obsidian/60 transition hover:text-red-600"
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                {items.length === 0 ? (
                    <EmptyWishlist />
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {items.map((item) => (
                            <WishlistItemCard
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

function EmptyWishlist() {
    return (
        <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
                <Heart className="h-9 w-9 text-obsidian/30" />
            </div>

            <h2 className="mt-6 text-lg font-semibold text-obsidian">
                Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-obsidian/50">
                Save your favourite namkeens here and come back
                whenever you are ready for a crunchy craving.
            </p>

            <Link
                href="/collections"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-obsidian px-6 py-3 text-sm font-medium text-white transition hover:bg-obsidian/90"
            >
                <ShoppingBag className="h-4 w-4" />
                Explore Namkeens
            </Link>
        </div>
    );
}