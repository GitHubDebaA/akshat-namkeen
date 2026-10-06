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

// Product Details - derived / UI data  
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

export type ProductDetailsVariant = ProductVariant & {
    properties: ProductPropertyData[];
};

export type ProductPropertyData = {
    id: string;
    section: string;
    label: string;
    value: string;
    order: number;
};

export type ProductDetailsData = {
    product: Omit<ProductWithVariants, "variants">;
    /**
     * All active variants available for this product.
     *
     * Each variant contains its product properties.
     */
    variants: ProductDetailsVariant[];

    /**
     * Variant currently displayed on the page.
     */
    selectedVariantId: string;

    /**
     * Product-level rating.
     */
    rating: ProductRating;

    /**
     * Variant IDs currently in the user's wishlist.
     */
    wishlistedVariantIds: string[];

    /**
     * Inventory information. Kept optional because inventory may be added later.
     */
    inventory?: ProductInventory;
};