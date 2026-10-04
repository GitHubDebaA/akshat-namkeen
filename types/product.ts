import { Prisma } from "@prisma/client";

// Prisma types
type PrismaProductWithVariants = Prisma.ProductGetPayload<{
    include: {
        variants: true;
    };
}>;

// Product
export type ProductVariant = Omit<
    PrismaProductWithVariants["variants"][number],
    "mrp" | "sellingPrice"
> & {
    mrp: number;
    sellingPrice: number;
};

export type ProductWithVariants = Omit<
    PrismaProductWithVariants,
    "variants"
> & {
    variants: ProductVariant[];
};

// Product Card - derived / UI data  
export type ProductRating = {
    average: number;
    count: number;
};

export type ProductWishlist = {
    isWishlisted: boolean;
};

export type ProductInventory = {
    inStock: boolean;
    quantity?: number;
};

export type ProductPricing = {
    mrp: number;
    sellingPrice: number;
    discountPercentage: number;
};

export type ProductCardData = {
    product: ProductWithVariants;
    /**
     * Variant displayed by the card initially.
     */
    selectedVariantId: string;

    /**
     * Variant IDs currently in the user's wishlist.
     *
     * This allows the card to update correctly when
     * the user switches variants.
     */
    wishlistedVariantIds: string[];

    /**
     * Product-level rating.
     */
    rating: ProductRating;

    /**
     * Optional inventory information.
     */
    inventory?: ProductInventory;
};