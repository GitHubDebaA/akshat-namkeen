import prisma from "@/lib/prisma";

export async function getProductsByCategory(slug: string) {
    return await prisma.product.findMany({
        where: {
            isActive: true,
            category: {
                slug: slug,
                isActive: true
            }
        },
        include: {
            variants: true,
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