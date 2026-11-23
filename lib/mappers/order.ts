import { Prisma } from "@prisma/client";
import type { Order } from "@/types/order";

export type PrismaOrderWithDetails = Prisma.OrderGetPayload<{
    include: {
        address: true;
        items: true;
        statusHistory: { orderBy: { createdAt: "asc" } };
    };
}>;

export function mapOrder(order: PrismaOrderWithDetails): Order {
    return {
        id: order.id,
        orderNumber: order.orderNumber,
        userId: order.userId,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            variantId: item.variantId ?? "",
            productName: item.productName,
            variantName: item.variantName,
            image: item.image,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            totalPrice: Number(item.totalPrice),
        })),
        subtotal: Number(order.subtotal),
        discount: 0,
        shippingCharge: Number(order.shippingCharge),
        tax: 0,
        total: Number(order.total),
        shippingAddress: {
            name: order.address.fullName,
            phone: order.address.mobile,
            addressLine1: order.address.addressLine1,
            addressLine2: order.address.addressLine2 ?? undefined,
            city: order.address.city,
            state: order.address.state,
            postalCode: order.address.postalCode,
            addressType: order.address.addressType,
        },
        payment: {
            method: order.paymentMethod,
            status: order.paymentStatus,
        },
        tracking: order.courierName || order.trackingNumber || order.estimatedDelivery ? {
            courier: order.courierName ?? undefined,
            trackingNumber: order.trackingNumber ?? undefined,
            estimatedDelivery: order.estimatedDelivery?.toISOString(),
        } : undefined,
        statusHistory: order.statusHistory.map((event) => ({
            status: event.status,
            timestamp: event.createdAt.toISOString(),
            description: event.description ?? undefined,
        })),
    };
}
