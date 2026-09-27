import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getWishlist() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    return prisma.wishlist.upsert({
        where: {
            userId: session.user.id,
        },
        create: {
            userId: session.user.id,
        },
        update: {},
        include: {
            items: {
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    variant: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
        },
    });
}