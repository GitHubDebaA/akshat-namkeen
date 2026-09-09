import prisma from "@/lib/prisma";

export async function getCollection(slug: string) {
    return prisma.collection.findUnique({
        where: { slug },
        include: {
            items: {
                orderBy: {
                    order: "asc",
                },
                include: {
                    variant: {
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
            },
        },
    });
}