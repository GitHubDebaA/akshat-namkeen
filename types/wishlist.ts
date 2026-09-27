import { Prisma } from "@prisma/client";

export type WishlistItemWithProduct =
    Prisma.WishlistItemGetPayload<{
        include: {
            variant: {
                include: {
                    product: true;
                };
            };
        };
    }>;

export type WishlistWithItems =
    Prisma.WishlistGetPayload<{
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