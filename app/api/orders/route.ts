import { randomUUID } from "node:crypto";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { mapOrder } from "@/lib/mappers/order";

const orderRequestSchema = z.object({
    addressId: z.string().min(1).max(64),
    items: z.array(z.object({
        variantId: z.string().min(1).max(64),
        quantity: z.number().int().min(1).max(20),
    })).min(1).max(50),
});

function toRupees(paise: number) {
    return (paise / 100).toFixed(2);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return Response.json({ message: "Sign in to place an order." }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ message: "Invalid order request." }, { status: 400 });
    }

    const parsed = orderRequestSchema.safeParse(body);
    if (!parsed.success) {
        return Response.json({ message: "Your bag or delivery address is invalid." }, { status: 400 });
    }

    const { addressId, items } = parsed.data;
    const quantities = new Map<string, number>();
    for (const item of items) {
        quantities.set(item.variantId, (quantities.get(item.variantId) ?? 0) + item.quantity);
    }
    if (Array.from(quantities.values()).some((quantity) => quantity > 20)) {
        return Response.json({ message: "Each item is limited to 20 per order." }, { status: 400 });
    }

    try {
        const [address, variants] = await Promise.all([
            prisma.address.findFirst({ where: { id: addressId, userId: session.user.id } }),
            prisma.productVariant.findMany({
                where: {
                    id: { in: [...quantities.keys()] },
                    isActive: true,
                    product: { isActive: true, category: { isActive: true } },
                },
                include: { product: true },
            }),
        ]);

        if (!address) {
            return Response.json({ message: "Choose one of your saved delivery addresses." }, { status: 400 });
        }
        if (address.country !== "India") {
            return Response.json({ message: "We currently deliver within India." }, { status: 400 });
        }
        if (variants.length !== quantities.size) {
            return Response.json({ message: "One or more items are no longer available. Refresh your bag and try again." }, { status: 409 });
        }

        const lineItems = variants.map((variant) => {
            const quantity = quantities.get(variant.id)!;
            const unitPaise = Math.round(Number(variant.sellingPrice) * 100);
            return {
                variantId: variant.id,
                productId: variant.productId,
                productName: variant.product.name,
                variantName: variant.variant,
                image: variant.displayURL,
                quantity,
                unitPrice: toRupees(unitPaise),
                totalPrice: toRupees(unitPaise * quantity),
                totalPaise: unitPaise * quantity,
            };
        });
        const subtotalPaise = lineItems.reduce((total, item) => total + item.totalPaise, 0);
        const shippingPaise = subtotalPaise > 50000 ? 0 : 4000;
        const orderNumber = `AKS-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 5).toUpperCase()}`;

        const order = await prisma.$transaction(async (transaction) => transaction.order.create({
            data: {
                orderNumber,
                userId: session.user.id,
                addressId,
                subtotal: toRupees(subtotalPaise),
                shippingCharge: toRupees(shippingPaise),
                total: toRupees(subtotalPaise + shippingPaise),
                items: {
                    create: lineItems.map((item) => ({
                        variantId: item.variantId,
                        productId: item.productId,
                        productName: item.productName,
                        variantName: item.variantName,
                        image: item.image,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice,
                    })),
                },
                statusHistory: {
                    create: { status: "PROCESSING", description: "Order placed with cash on delivery." },
                },
            },
            select: { id: true, orderNumber: true, total: true },
        }));

        return Response.json({
            id: order.id,
            orderNumber: order.orderNumber,
            total: Number(order.total),
        }, { status: 201 });
    } catch (error) {
        console.error("Order creation failed", error);
        return Response.json({ message: "We couldn't place your order. Please try again." }, { status: 500 });
    }
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            include: { address: true, items: true, statusHistory: { orderBy: { createdAt: "asc" } } },
            orderBy: { createdAt: "desc" },
        });
        return Response.json({ orders: orders.map(mapOrder) });
    } catch (error) {
        console.error("Order list failed", error);
        return Response.json({ message: "Unable to load your orders." }, { status: 500 });
    }
}
