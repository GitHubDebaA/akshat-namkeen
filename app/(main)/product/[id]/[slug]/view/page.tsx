import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/products/details";

interface ProductPageProps {
    params: Promise<{
        id: string;
        slug: string;
    }>;

    searchParams: Promise<{
        variant?: string;
    }>;
}

export default async function ProductViewPage({ params, searchParams }: ProductPageProps) {
    const { id, slug } = await params;
    const { variant: variantId } = await searchParams;

    console.log("Product ID:", id);
    console.log("Product Slug:", slug);
    console.log("Variant ID:", variantId);

    const product = await prisma.product.findFirst({
        where: {
            id,
            isActive: true,
        },
        include: {
            variants: {
                where: {
                    isActive: true,
                },
                orderBy: [
                    {
                        isDefault: "desc",
                    },
                    {
                        createdAt: "asc",
                    },
                ],
                include: {
                    product: true,
                    properties: {
                        orderBy: {
                            order: "asc",
                        },
                    },
                },
            },
        },
    });

    if (!product || product.variants.length === 0) {
        notFound();
    }

    const productVariant =
        product.variants.find((v) => v.id === variantId) ??
        product.variants[0];

    return <ProductDetails variant={productVariant} />;
}