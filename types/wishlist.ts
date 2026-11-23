import { Prisma } from "@prisma/client";

type PrismaWishlistItemWithProduct = Prisma.WishlistItemGetPayload<{
    include: {
        variant: {
            include: {
                product: true;
            };
        };
    };
}>;

type PrismaWishlistWithItems = Prisma.WishlistGetPayload<{
    include: {
        items: {
            include: {
                variant: {
                    include: {
                        product: true;
                    };
                };
            };
        };
    };
}>;

export type WishlistItemWithProduct = Omit<PrismaWishlistItemWithProduct, "variant"> & {
    variant: Omit<PrismaWishlistItemWithProduct["variant"], "mrp" | "sellingPrice"> & {
        mrp: number;
        sellingPrice: number;
    };
};

export type WishlistWithItems = Omit<PrismaWishlistWithItems, "items"> & {
    items: WishlistItemWithProduct[];
};
