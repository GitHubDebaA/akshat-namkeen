import { CheckCircle2, Star } from "lucide-react";

import type { ProductReview } from "@/types/product";

interface Props {
    review: ProductReview;
}

export default function ReviewCard({
    review,
}: Props) {
    return (
        <article className="border-t border-brand-200 py-6">
            {/* Rating */}
            <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map(
                        (_, index) => (
                            <Star
                                key={index}
                                className={`h-3.5 w-3.5 ${index < review.rating
                                        ? "fill-project_primary text-project_primary"
                                        : "text-obsidian/20"
                                    }`}
                            />
                        )
                    )}
                </div>

                {review.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-green-700 uppercase tracking-wide">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified Purchase
                    </span>
                )}
            </div>

            {/* Title */}
            {review.title && (
                <h3 className="mt-3 text-sm font-bold text-obsidian">
                    {review.title}
                </h3>
            )}

            {/* Review */}
            <p className="mt-2 text-sm leading-6 text-obsidian/65">
                {review.comment}
            </p>

            {/* Customer */}
            <div className="mt-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-obsidian">
                        {review.customerName}
                    </p>

                    <p className="mt-0.5 text-[11px] text-obsidian/40">
                        {new Date(
                            review.createdAt
                        ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>
                </div>

                {review.helpfulCount !== undefined && (
                    <span className="text-[11px] text-obsidian/40">
                        {review.helpfulCount} found this helpful
                    </span>
                )}
            </div>
        </article>
    );
}