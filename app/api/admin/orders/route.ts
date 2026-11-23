import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { mapOrder } from "@/lib/mappers/order";
import prisma from "@/lib/prisma";

const statusSchema = z.enum(["PROCESSING", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"]);
const updateSchema = z.object({
    orderId: z.string().min(1),
    status: statusSchema.optional(),
    paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]).optional(),
    courierName: z.string().trim().max(100).nullable().optional(),
    trackingNumber: z.string().trim().max(150).nullable().optional(),
    estimatedDelivery: z.string().date().nullable().optional(),
}).refine((data) => data.status || data.paymentStatus || data.courierName !== undefined || data.trackingNumber !== undefined || data.estimatedDelivery !== undefined);

const transitions: Record<z.infer<typeof statusSchema>, z.infer<typeof statusSchema>[]> = {
    PROCESSING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PACKED", "CANCELLED"],
    PACKED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["OUT_FOR_DELIVERY", "DELIVERED"],
    OUT_FOR_DELIVERY: ["SHIPPED", "DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
};

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    return isAdminEmail(session?.user?.email) ? session : null;
}

export async function GET() {
    if (!(await requireAdmin())) return Response.json({ message: "Not found" }, { status: 404 });
    try {
        const orders = await prisma.order.findMany({
            include: { address: true, items: true, statusHistory: { orderBy: { createdAt: "asc" } } },
            orderBy: { createdAt: "desc" },
            take: 200,
        });
        return Response.json({ orders: orders.map(mapOrder) });
    } catch (error) {
        console.error("Admin order list failed", error);
        return Response.json({ message: "Unable to load orders." }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    if (!(await requireAdmin())) return Response.json({ message: "Not found" }, { status: 404 });
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ message: "Invalid order update." }, { status: 400 });
    }
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return Response.json({ message: "Check the order update details." }, { status: 400 });

    const { orderId, status, paymentStatus, courierName, trackingNumber, estimatedDelivery } = parsed.data;
    try {
        const current = await prisma.order.findUnique({ where: { id: orderId }, select: { status: true } });
        if (!current) return Response.json({ message: "Order not found." }, { status: 404 });
        if (status && status !== current.status && !transitions[current.status].includes(status)) {
            return Response.json({ message: `An order cannot move from ${current.status} to ${status}.` }, { status: 409 });
        }

        await prisma.$transaction(async (transaction) => {
            await transaction.order.update({
                where: { id: orderId },
                data: {
                    ...(status ? { status } : {}),
                    ...(paymentStatus ? { paymentStatus } : {}),
                    ...(courierName !== undefined ? { courierName: courierName || null } : {}),
                    ...(trackingNumber !== undefined ? { trackingNumber: trackingNumber || null } : {}),
                    ...(estimatedDelivery !== undefined ? { estimatedDelivery: estimatedDelivery ? new Date(`${estimatedDelivery}T00:00:00.000Z`) : null } : {}),
                },
            });
            if (status && status !== current.status) {
                await transaction.orderEvent.create({
                    data: { orderId, status, description: `Order status updated to ${status.toLowerCase().replaceAll("_", " ")}.` },
                });
            }
        });
        return Response.json({ success: true });
    } catch (error) {
        console.error("Order update failed", error);
        return Response.json({ message: "Unable to update the order." }, { status: 500 });
    }
}
