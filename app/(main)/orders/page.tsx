import OrdersPage from "@/components/orders/orders-page";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/data/order";

export default async function Orders() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/signin?callbackUrl=%2Forders");
    const orders = await getOrdersForUser(session.user.id);
    return <OrdersPage orders={orders} />;
}
