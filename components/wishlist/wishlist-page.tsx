"use client";

import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { clearWishlist } from "@/lib/actions/wishlist";
import { useCart } from "@/store/cart";
import WishlistItemCard from "./wishlist-item-card";
import { WishlistWithItems } from "@/types/wishlist";

interface WishlistPageProps {
    wishlist: WishlistWithItems;
}

const listMotion = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
};

export default function WishlistPage({ wishlist }: WishlistPageProps) {
    const [isPending, startTransition] = useTransition();
    const addItem = useCart((state) => state.addItem);
    const items = wishlist?.items ?? [];
    const availableItems = items.filter((item) => item.variant.isActive);

    function handleClear() {
        if (items.length === 0 || isPending) return;
        if (!window.confirm("Remove all items from your wishlist?")) return;

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

    function handleAddAll() {
        if (availableItems.length === 0) {
            toast.error("There are no available items to add.");
            return;
        }

        availableItems.forEach(({ variant, variant: { product } }) => {
            addItem({
                variantId: variant.id,
                productId: product.id,
                productName: product.name,
                variantName: variant.name,
                price: Number(variant.sellingPrice),
                displayURL: variant.displayURL,
            });
        });

        toast.success(`${availableItems.length} ${availableItems.length === 1 ? "item" : "items"} added to cart`);
    }

    return (
        <main className="min-h-screen bg-ivory text-obsidian">
            <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-9 lg:px-8">
                <Breadcrumb className="mb-5">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                className="text-xs text-obsidian/55 hover:text-obsidian"
                                render={<Link href="/" />}
                            >
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-obsidian/40" />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-xs font-medium text-obsidian">
                                Wishlist
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <motion.header
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Wishlist</h1>
                        <p className="mt-1 text-sm text-obsidian/60">{items.length} {items.length === 1 ? "item" : "items"} saved</p>
                    </div>

                    {items.length > 0 && (
                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isPending}
                                onClick={handleClear}
                                className="h-10 w-full rounded-full border-obsidian/20 bg-ivory px-5 text-obsidian hover:bg-obsidian/5 sm:w-auto"
                            >
                                <Trash2 className="h-4 w-4" />
                                {isPending ? "Clearing…" : "Clear all"}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleAddAll}
                                disabled={availableItems.length === 0}
                                className="group/button relative h-10 w-full overflow-hidden rounded-full bg-obsidian px-5 text-sm text-ivory transition-all duration-300 hover:shadow-xl disabled:opacity-50 sm:w-auto"
                            >
                                <span className="absolute inset-0 origin-left scale-x-0 bg-project_primary transition-transform duration-300 group-hover/button:scale-x-100" />
                                <span className="relative flex items-center justify-center gap-2">
                                    <ShoppingBag className="h-4 w-4" /> Add all to cart
                                </span>
                            </Button>
                        </div>
                    )}
                </motion.header>

                {items.length > 0 ? (
                    <motion.div
                        variants={listMotion}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4"
                    >
                        {items.map((item) => <WishlistItemCard key={item.id} item={item} />)}
                    </motion.div>
                ) : (
                    <EmptyWishlist />
                )}
            </div>
        </main>
    );
}

function EmptyWishlist() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mx-auto mt-8 flex max-w-2xl flex-col items-center rounded-xl border border-obsidian/10 bg-ivory px-6 py-14 text-center shadow-sm sm:py-16"
        >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-project_primary/10 text-project_primary">
                <Heart className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-xl font-semibold">Your wishlist is empty</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-obsidian/55">
                Browse the store and save products you’d like to come back to.
            </p>
            <Link href="/collections" className="group/button relative mt-6 inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-obsidian px-6 text-sm font-medium text-ivory transition-all duration-300 hover:shadow-xl">
                <span className="absolute inset-0 origin-left scale-x-0 bg-project_primary transition-transform duration-300 group-hover/button:scale-x-100" />
                <span className="relative flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" /> Continue shopping <ArrowRight className="h-4 w-4" />
                </span>
            </Link>
        </motion.section>
    );
}
