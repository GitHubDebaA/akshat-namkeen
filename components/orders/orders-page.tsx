import OrderCard from "./order-card";
import { mockOrders } from "@/lib/mock/order";

export default function OrdersPage() {
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mockOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                        />
                    ))}
                </div>

            </div>
        </main>
    );
}