import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getProductReviewData } from "@/lib/data/review";
import prisma from "@/lib/prisma";

const reviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().trim().max(1500).default(""),
});

type RouteContext = { params: Promise<{ productId: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
    const { productId } = await params;
    try {
        return Response.json(await getProductReviewData(productId));
    } catch (error) {
        console.error("Product reviews could not be loaded", error);
        return Response.json({ message: "Unable to load reviews." }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: RouteContext) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return Response.json({ message: "Sign in to leave a review." }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ message: "Invalid review." }, { status: 400 });
    }
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
        return Response.json({ message: "Choose a rating from 1 to 5." }, { status: 400 });
    }

    const { productId } = await params;
    try {
        const order = await prisma.order.findFirst({
            where: { userId: session.user.id, status: "DELIVERED", items: { some: { productId } } },
            orderBy: { updatedAt: "desc" },
            select: { id: true },
        });
        if (!order) {
            return Response.json({ message: "Reviews are available after this product has been delivered to you." }, { status: 403 });
        }

        const review = await prisma.productReview.create({
            data: {
                productId,
                userId: session.user.id,
                orderId: order.id,
                rating: parsed.data.rating,
                comment: parsed.data.comment,
            },
        });
        return Response.json({ id: review.id }, { status: 201 });
    } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
            return Response.json({ message: "You have already reviewed this product." }, { status: 409 });
        }
        console.error("Product review could not be saved", error);
        return Response.json({ message: "Unable to save your review." }, { status: 500 });
    }
}
