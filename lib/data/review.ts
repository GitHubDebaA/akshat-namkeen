import prisma from "@/lib/prisma";
import type { ProductReviewData } from "@/types/product";

export async function getProductReviewData(productId: string): Promise<ProductReviewData> {
    const [aggregate, grouped, reviews] = await Promise.all([
        prisma.productReview.aggregate({ where: { productId }, _avg: { rating: true }, _count: { _all: true } }),
        prisma.productReview.groupBy({ by: ["rating"], where: { productId }, _count: { _all: true } }),
        prisma.productReview.findMany({
            where: { productId },
            include: { user: { select: { name: true } } },
            orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
            take: 5,
        }),
    ]);
    const totalReviews = aggregate._count._all;
    const countByRating = new Map(grouped.map((entry) => [entry.rating, entry._count._all]));
    return {
        rating: { average: aggregate._avg.rating ?? 0, count: totalReviews },
        breakdown: [5, 4, 3, 2, 1].map((rating) => {
            const count = countByRating.get(rating) ?? 0;
            return { rating, count, percentage: totalReviews ? Math.round(count * 100 / totalReviews) : 0 };
        }),
        reviewSummary: null,
        topReviews: reviews.map((review) => ({
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            customerName: review.user.name || "Customer",
            createdAt: review.createdAt.toISOString(),
            verifiedPurchase: true,
        })),
        totalReviews,
    };
}
