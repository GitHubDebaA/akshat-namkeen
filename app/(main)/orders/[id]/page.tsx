import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrderForUser } from "@/lib/data/order";
import OrderDetails from "@/components/orders/order-details";

interface OrderDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrderDetailsPage({
    params,
}: OrderDetailsPageProps) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/signin?callbackUrl=%2Forders");
    const order = await getOrderForUser(id, session.user.id);

    if (!order) {
        notFound();
    }

    return <OrderDetails order={order} supportEmail={process.env.SUPPORT_EMAIL} supportPhone={process.env.SUPPORT_PHONE} />;
}
