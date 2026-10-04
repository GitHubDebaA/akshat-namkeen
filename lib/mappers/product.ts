import { Prisma } from "@prisma/client";
import type { ProductWithVariants, ProductCardData } from "@/types/product";

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

export function mapProductCardData(
    product: PrismaProductWithVariants,
    options?: {
        variantId?: string;
        wishlistedVariantIds?: Set<string>;
        rating?: {
            average: number;
            count: number;
        };
    }
): ProductCardData {
    const mappedProduct = mapProductWithVariants(product);

    const selectedVariant =
        (options?.variantId
            ? mappedProduct.variants.find(
                (variant) => variant.id === options.variantId
            )
            : undefined) ??
        mappedProduct.variants.find(
            (variant) =>
                variant.isDefault && variant.isActive
        ) ??
        mappedProduct.variants.find(
            (variant) => variant.isActive
        );

    if (!selectedVariant) {
        throw new Error(
            `Product ${product.id} has no active variant`
        );
    }

    return {
        product: mappedProduct,

        selectedVariantId: selectedVariant.id,

        wishlistedVariantIds:
            options?.wishlistedVariantIds
                ? [...options.wishlistedVariantIds]
                : [],

        rating: options?.rating ?? {
            average: 0,
            count: 0,
        },
    };
}