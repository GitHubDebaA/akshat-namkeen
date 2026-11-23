import OrderCard from "./order-card";
import type { Order } from "@/types/order";

export default function OrdersPage({ orders }: { orders: Order[] }) {
    return (
        <main className="min-h-screen bg-ivory">
            <div className="max-w-screen-xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-display text-3xl font-semibold text-obsidian">
                        My Orders
                    </h1>

                    <p className="text-sm text-obsidian/60">
                        Track and manage your Akshat Namkeen orders.
                    </p>
                </div>

                {/* Search */}
                {/* <div className="mb-6">
                    ...
                </div> */}

                {/* Filters */}
                {/* <div className="mb-6">
                    ...
                </div>  */}

                {/* Orders */}
                {orders.length === 0 ? (
                    <div className="rounded-2xl border border-brand-200 bg-white px-6 py-12 text-center">
                        <p className="font-display text-xl font-semibold text-obsidian">No orders yet</p>
                        <p className="mt-2 text-sm text-obsidian/60">Your placed orders will appear here.</p>
                    </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                        />
                    ))}
                </div>
                )}

            </div>
        </main>
    );
}
