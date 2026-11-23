"use client";
import { useState } from "react";
import { Info, Star } from "lucide-react";
import { toast } from "sonner";

import type { ProductReviewData, RatingProductData } from "@/types/product";
import ReviewDrawer from "./review-drawer";
import { Button } from "@/components/ui/button";
import { useAccountOptions } from "@/store/account/options/option";

interface Props {
    product: RatingProductData;
    reviews: ProductReviewData;
    onReviewsChange: (reviews: ProductReviewData) => void;
}

export default function ReviewRatingSummary({
    product,
    reviews,
    onReviewsChange,
}: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { openAccountOptions } = useAccountOptions();

    async function submitReview(review: { rating: number; comment: string; file: File | null }) {
        try {
            const response = await fetch(`/api/products/${product.productId}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating: review.rating, comment: review.comment }),
            });
            const result = await response.json();
            if (response.status === 401) {
                setDrawerOpen(false);
                openAccountOptions();
                toast.error("Sign in to leave a review.");
                return false;
            }
            if (!response.ok) throw new Error(result.message || "Unable to save your review.");

            const updated = await fetch(`/api/products/${product.productId}/reviews`);
            if (updated.ok) onReviewsChange(await updated.json() as ProductReviewData);
            toast.success("Thanks for sharing your review.");
            return true;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to save your review.");
            return false;
        }
    }

    return (
        <>
            <div>
                <h2 className="font-display text-xl lg:text-2xl font-medium text-obsidian">
                    Overall Customer Reviews
                </h2>

                <div className="my-4">
                    <div className="flex gap-2">
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map(
                                (_, index) => (
                                    <Star
                                        key={index}
                                            className={`h-5 w-5 ${index < Math.round(reviews.rating.average)
                                            ? "fill-project_primary text-project_primary"
                                            : "text-project_primary"
                                            }`}
                                        strokeWidth={1}
                                    />
                                )
                            )}
                        </div>
                        <span className="text-medium font-bold text-obsidian/50">
                            {reviews.rating.average.toFixed(1)} out of 5
                        </span>
                    </div>
                    <div className="text-medium text-obsidian/50 flex items-center gap-2">
                        <div className="relative inline-flex items-center gap-1 overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 px-2.5 py-0.5 text-white shadow-sm shadow-emerald-600/20 ring-1 ring-white/20">
                            {/* Animated Wave Light Sweep */}
                            <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                            <Star className="h-3 w-3 fill-white text-white relative z-10" />
                            <span className="text-[10px] font-extrabold uppercase tracking-widest drop-shadow-xs relative z-10">
                                New
                            </span>
                        </div>
                        {reviews?.totalReviews || 0} total reviews
                    </div>
                </div>

                {/* Rating Breakdown */}
                <div className="my-4">
                    <div className="space-y-2.5">
                        {reviews?.breakdown
                            .sort((a, b) => b.rating - a.rating)
                            .map((item) => (
                                <div
                                    key={item.rating}
                                    className="flex items-center gap-3"
                                >
                                    <span className="w-8 text-xs text-obsidian/60">
                                        {item.rating}★
                                    </span>

                                    <div className="flex-1 h-2 rounded-full bg-brand-100 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-project_primary transition-all"
                                            style={{
                                                width: `${item.percentage}%`,
                                            }}
                                        />
                                    </div>

                                    <span className="w-10 text-right text-xs text-obsidian/50">
                                        {item?.percentage}%
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>

                {/* How calculated */}
                <div className="my-4 p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Info className="h-4 w-4 text-obsidian/40 shrink-0" />

                        <div>
                            <h3 className="text-xs font-bold text-obsidian">
                                How ratings are calculated
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-obsidian/50">
                                The overall rating is calculated from
                                customer ratings across all verified
                                product reviews. Ratings are weighted
                                equally.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Review button */}
                <Button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    className="my-4 w-full h-11 rounded-full border border-obsidian bg-white text-sm font-semibold text-obsidian cursor-pointer transition-all hover:bg-obsidian hover:text-ivory"
                >
                    Review this product
                </Button>
            </div>

            <ReviewDrawer
                product={product}
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                onSubmit={submitReview}
            />
        </>
    );
}
