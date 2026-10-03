import prisma from "@/lib/prisma";

export async function getCategory() {
    return await prisma.category.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            name: "asc",
        },
    });
}