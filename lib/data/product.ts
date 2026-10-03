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
        orderBy: {
            name: "asc",
        }
    });
}