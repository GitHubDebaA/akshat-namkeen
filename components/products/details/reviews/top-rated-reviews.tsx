import type { ProductReview } from "@/types/product";

import ReviewCard from "./review-card";

interface Props {
    reviews: ProductReview[];
}

export default function TopRatedReviews({
    reviews,
}: Props) {
    if (!reviews.length) {
        return (
            <div className="mt-10">
                <h2 className="font-display text-2xl font-medium text-obsidian">
                    Top Rated Reviews
                </h2>

                <p className="mt-4 text-sm text-obsidian/50">
                    No reviews yet. Be the first to review this
                    product.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl font-medium text-obsidian">
                    Top Rated Reviews
                </h2>

                <button
                    type="button"
                    className="text-xs font-semibold text-obsidian underline underline-offset-4 hover:text-project_primary"
                >
                    View all
                </button>
            </div>

            <div className="space-y-0">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                    />
                ))}
            </div>
        </div>
    );
}