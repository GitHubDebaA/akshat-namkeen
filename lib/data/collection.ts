import prisma from "@/lib/prisma";

export async function getCollection(slug: string) {
    const collection = await prisma.collection.findUnique({
        where: {
            slug,
        },
        include: {
            items: {
                orderBy: {
                    order: "asc",
                },
                select: {
                    id: true,
                    order: true,
                    variant: {
                        select: {
                            id: true,
                            productId: true,
                        },
                    },
                },
            },
        },
    });

    if (!collection) {
        return null;
    }

    const productIds = [
        ...new Set(
            collection.items.map(
                (item) => item.variant.productId
            )
        ),
    ];

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds,
            },
            isActive: true,
        },
        include: {
            variants: {
                where: {
                    isActive: true,
                },
                orderBy: [{
                    isDefault: "desc",
                }, {
                    createdAt: "asc",
                }],
            },
        },
    });

    const productMap = new Map(
        products.map((product) => [
            product.id,
            product,
        ])
    );

    const items = collection.items.flatMap((item) => {
        const product = productMap.get(item.variant.productId);

        if (!product) {
            return [];
        }

        return [{
            ...item,
            product,
        }];
    });

    return {
        ...collection,
        items,
    };
}