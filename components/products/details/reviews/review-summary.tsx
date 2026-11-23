import type { ProductReviewData } from "@/types/product";

interface Props {
    reviews: ProductReviewData;
}

export default function ReviewSummary({
    reviews,
}: Props) {
    if (!reviews.reviewSummary) {
        return null;
    }

    return (
        <div>
            <h2 className="font-display text-2xl font-medium text-obsidian">
                Product Review Summary
            </h2>

            <div className="mt-4">
                <p className="text-sm leading-7 text-obsidian/65 max-w-3xl">
                    {reviews.reviewSummary}
                </p>
            </div>
        </div>
    );
}