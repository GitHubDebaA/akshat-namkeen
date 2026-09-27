import { notFound } from "next/navigation";
import OrderDetails from "@/components/orders/order-details";
import { mockOrders } from "@/lib/mock/order";

interface OrderDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrderDetailsPage({
    params,
}: OrderDetailsPageProps) {
    const { id } = await params;

    const order = mockOrders.find((order) => order.id === id);

    if (!order) {
        notFound();
    }

    return <OrderDetails order={order} />;
}