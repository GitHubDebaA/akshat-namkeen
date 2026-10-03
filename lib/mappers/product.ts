import { Prisma } from "@prisma/client";
import type { ProductWithVariants } from "@/types/product";

type PrismaProductWithVariants = Prisma.ProductGetPayload<{
    include: {
        variants: true;
    };
}>;

export function mapProductWithVariants(
    product: PrismaProductWithVariants
): ProductWithVariants {
    return {
        ...product,
        variants: product.variants.map((variant) => ({
            ...variant,
            mrp: Number(variant.mrp),
            sellingPrice: Number(variant.sellingPrice),
        })),
    };
}