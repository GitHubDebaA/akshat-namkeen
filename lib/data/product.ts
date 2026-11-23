import prisma from "@/lib/prisma";

export async function getAllProducts() {
    return prisma.product.findMany({
        where: {
            isActive: true,
            variants: { some: { isActive: true } },
            category: { isActive: true },
        },
        include: {
            variants: {
                where: { isActive: true },
                orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
            },
        },
        orderBy: { name: "asc" },
    });
}

export async function getProductsByCategory(slug: string) {
    return await prisma.product.findMany({
        where: {
            isActive: true,
            variants: { some: { isActive: true } },
            category: {
                slug: slug,
                isActive: true
            }
        },
        include: {
            variants: {
                where: { isActive: true },
                orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
            },
        },
        orderBy: {
            name: "asc",
        }
    });
}

export async function getProductById(id: string) {
    return await prisma.product.findFirst({
        where : {
            id,
            isActive: true
        },
        include: {
            variants: {
                where: {
                    isActive: true
                },
                orderBy: [
                    {createdAt: "asc"},
                    {isDefault: "desc"}
                ],
                include: {
                    properties: {
                        orderBy: {
                            order: "asc"
                        }
                    }
                }
            }
        }
    });
}
