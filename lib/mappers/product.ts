import { Prisma } from "@prisma/client";

import type {
    ProductWithVariants,
    ProductCardData,
    ProductDetailsData,
    ProductDetailsVariant,
    ProductPropertyData,
} from "@/types/product";

// ============================================================
// Prisma Types
// ============================================================

type PrismaProductWithVariants = Prisma.ProductGetPayload<{
    include: {
        variants: true;
    };
}>;

type PrismaProductWithDetails = Prisma.ProductGetPayload<{
    include: {
        variants: {
            include: {
                properties: {
                    orderBy: {
                        order: "asc";
                    };
                };
            };
        };
    };
}>;

// ============================================================
// Product
// ============================================================

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

// ============================================================
// Product Card
// ============================================================

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
        (
            options?.variantId
                ? mappedProduct.variants.find(
                    (variant) => variant.id === options.variantId
                )
                : undefined
        ) ??
        mappedProduct.variants.find(
            (variant) => variant.isDefault && variant.isActive
        ) ??
        mappedProduct.variants.find((variant) => variant.isActive);

    if (!selectedVariant) {
        throw new Error(`Product ${product.id} has no active variant`);
    }

    return {
        product: mappedProduct,

        selectedVariantId: selectedVariant.id,

        wishlistedVariantIds: options?.wishlistedVariantIds
            ? [...options.wishlistedVariantIds]
            : [],

        rating: options?.rating ?? {
            average: 0,
            count: 0,
        },
    };
}

// ============================================================
// Product Details - Variant
// ============================================================

function mapProductDetailsVariant(
    variant: PrismaProductWithDetails["variants"][number]
): ProductDetailsVariant {
    return {
        ...variant,

        mrp: Number(variant.mrp),
        sellingPrice: Number(variant.sellingPrice),

        properties: variant.properties.map(
            (property): ProductPropertyData => ({
                id: property.id,
                section: property.section,
                label: property.label,
                value: property.value,
                order: property.order ?? 0,
            })
        ),
    };
}

// ============================================================
// Product Details
// ============================================================

export function mapProductDetailsData(
    product: PrismaProductWithDetails,
    options?: {
        variantId?: string;

        wishlistedVariantIds?: Set<string>;

        rating?: {
            average: number;
            count: number;
        };

        inventory?: {
            inStock: boolean;
            quantity?: number;
        };
    }
): ProductDetailsData {
    const variants = product.variants.map(mapProductDetailsVariant);

    if (variants.length === 0) {
        throw new Error(`Product ${product.id} has no active variant`);
    }

    const selectedVariant =
        (
            options?.variantId
                ? variants.find(
                    (variant) => variant.id === options.variantId
                )
                : undefined
        ) ??
        variants.find(
            (variant) => variant.isDefault && variant.isActive
        ) ??
        variants.find((variant) => variant.isActive);

    if (!selectedVariant) {
        throw new Error(`Product ${product.id} has no active variant`);
    }

    return {
        product: {
            id: product.id,
            name: product.name,
            description: product.description,
            code: product.code,
            categoryId: product.categoryId,
            isActive: product.isActive,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        },

        variants,

        selectedVariantId: selectedVariant.id,

        wishlistedVariantIds: options?.wishlistedVariantIds
            ? [...options.wishlistedVariantIds]
            : [],

        rating: options?.rating ?? {
            average: 0,
            count: 0,
        },

        inventory: options?.inventory,
    };
}