"use client";

import { useState } from "react";
import ReviewRatingSummary from "./review-rating-summary";
import ReviewSummary from "./review-summary";
import TopRatedReviews from "./top-rated-reviews";

import type { ProductReviewData, RatingProductData } from "@/types/product";

interface Props {
    product: RatingProductData,
    reviews: ProductReviewData;
}

export default function ProductReviews({ product, reviews }: Props) {
    const [currentReviews, setCurrentReviews] = useState(reviews);
    return (
        <section id="reviews" className="my-6 lg:my-12 scroll-mt-24">
            <div className="border-t border-obsidian/30 py-6 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
                    {/* Left - Rating */}
                    <div className="lg:col-span-1">
                        <ReviewRatingSummary product={product} reviews={currentReviews} onReviewsChange={setCurrentReviews} />
                    </div>

                    {/* Right - Reviews */}
                    <div className="lg:col-span-2">
                        <ReviewSummary reviews={currentReviews} />
                        <TopRatedReviews reviews={currentReviews.topReviews} />
                    </div>
                </div>
            </div>
        </section>
    );
}
