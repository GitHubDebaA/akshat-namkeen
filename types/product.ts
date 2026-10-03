export type ProductVariant = {
    id: string;
    productId: string;

    name: string;
    variant: string;

    mrp: number;
    sellingPrice: number;

    displayURL: string;
    images: string[];

    isDefault: boolean;
    isActive: boolean;

    createdAt: Date;
    updatedAt: Date;
};

export type ProductWithVariants = {
    id: string;
    name: string;
    description: string | null;
    code: string;

    isActive: boolean;
    categoryId: string;

    createdAt: Date;
    updatedAt: Date;

    variants: ProductVariant[];
};