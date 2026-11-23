import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import AdminOrders from "@/components/admin/orders-manager";

export default async function AdminOrdersPage() {
    const session = await getServerSession(authOptions);
    if (!isAdminEmail(session?.user?.email)) notFound();
    return <AdminOrders />;
}
