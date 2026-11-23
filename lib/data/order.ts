import prisma from "@/lib/prisma";
import { mapOrder } from "@/lib/mappers/order";

const orderInclude = {
    address: true,
    items: true,
    statusHistory: { orderBy: { createdAt: "asc" as const } },
};

export async function getOrdersForUser(userId: string) {
    const orders = await prisma.order.findMany({
        where: { userId },
        include: orderInclude,
        orderBy: { createdAt: "desc" },
    });
    return orders.map(mapOrder);
}

export async function getOrderForUser(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
        where: { id: orderId, userId },
        include: orderInclude,
    });
    return order ? mapOrder(order) : null;
}
