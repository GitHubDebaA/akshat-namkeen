"use client";

import Link from "next/link";
import {
    ArrowLeft,
    Download,
    HelpCircle,
    Package,
    RotateCcw,
    Star,
    Truck,
} from "lucide-react";

import { Order } from "@/types/order";
import { formatDate } from "@/lib/utils";

import OrderTimeline from "./order-timeline";
import OrderItems from "./order-items";
import OrderAddress from "./order-address";
import OrderPayment from "./order-payment";

interface OrderDetailsProps {
    order: Order;
}

export default function OrderDetails({
    order,
}: OrderDetailsProps) {
    const isDelivered = order.status === "DELIVERED";
    const isCancelled = order.status === "CANCELLED";

    return (
        <main className="min-h-screen bg-brand-50/40">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* Back */}
                <Link
                    href="/orders"
                    className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-obsidian/60 transition hover:text-project_primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    My Orders
                </Link>

                {/* Header */}
                <section className="rounded-2xl border border-brand-200 bg-white">
                    <div className="px-5 py-5 sm:px-7">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-xl font-semibold tracking-tight text-obsidian sm:text-2xl">
                                        Order #{order.orderNumber}
                                    </h1>

                                    <OrderStatusBadge status={order.status} />
                                </div>

                                <p className="mt-2 text-sm text-obsidian/55">
                                    Placed on {formatDate(order.createdAt)}
                                    <span className="mx-2">•</span>
                                    {order.items.length}{" "}
                                    {order.items.length === 1
                                        ? "item"
                                        : "items"}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {!isCancelled && (
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-full border border-brand-200 px-4 py-2 text-xs font-medium text-obsidian transition hover:bg-brand-50"
                                    >
                                        <Download className="h-4 w-4" />
                                        Invoice
                                    </button>
                                )}

                                {isDelivered && (
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-full bg-obsidian px-4 py-2 text-xs font-medium text-white transition hover:bg-obsidian/90"
                                    >
                                        <Star className="h-4 w-4" />
                                        Review
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    {!isCancelled && (
                        <div className="border-t border-brand-100 px-5 py-6 sm:px-7">
                            <OrderTimeline order={order} />
                        </div>
                    )}
                </section>

                {/* Main Grid */}
                <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">

                    {/* Left */}
                    <div className="space-y-5">

                        {/* Items */}
                        <section className="rounded-2xl border border-brand-200 bg-white">
                            <div className="border-b border-brand-100 px-5 py-4 sm:px-6">
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-project_primary" />

                                    <h2 className="text-base font-semibold text-obsidian">
                                        Items in this order
                                    </h2>
                                </div>
                            </div>

                            <OrderItems order={order} />
                        </section>

                        {/* Help */}
                        <section className="rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
                            <div className="flex gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50">
                                    <HelpCircle className="h-5 w-5 text-project_primary" />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-obsidian">
                                        Need help with your order?
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-obsidian/55">
                                        Have a question about delivery,
                                        returns or your order?
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-4">
                                        <button className="text-xs font-medium text-project_primary hover:underline">
                                            Contact us
                                        </button>

                                        <button className="text-xs font-medium text-project_primary hover:underline">
                                            Return policy
                                        </button>

                                        <button className="text-xs font-medium text-project_primary hover:underline">
                                            Refund policy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right */}
                    <aside className="space-y-5">

                        {/* Address */}
                        <OrderAddress
                            address={order.shippingAddress}
                        />

                        {/* Payment */}
                        <OrderPayment order={order} />

                        {/* Actions */}
                        <section className="rounded-2xl border border-brand-200 bg-white">
                            <div className="border-b border-brand-100 px-5 py-4">
                                <h2 className="text-sm font-semibold text-obsidian">
                                    Order actions
                                </h2>
                            </div>

                            <div className="divide-y divide-brand-100">

                                {!isDelivered &&
                                    !isCancelled && (
                                        <button className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-medium text-obsidian transition hover:bg-brand-50">
                                            <Truck className="h-4 w-4 text-project_primary" />
                                            Track order
                                        </button>
                                    )}

                                {isDelivered && (
                                    <button className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-medium text-obsidian transition hover:bg-brand-50">
                                        <Star className="h-4 w-4 text-project_primary" />
                                        Review & Feedback
                                    </button>
                                )}

                                {!isCancelled && (
                                    <button className="flex w-full items-center gap-3 px-5 py-4 text-left text-sm font-medium text-obsidian transition hover:bg-brand-50">
                                        <RotateCcw className="h-4 w-4 text-project_primary" />
                                        Buy Again
                                    </button>
                                )}
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
}

function OrderStatusBadge({
    status,
}: {
    status: Order["status"];
}) {
    const styles = {
        PROCESSING:
            "bg-amber-50 text-amber-700",
        CONFIRMED:
            "bg-blue-50 text-blue-700",
        PACKED:
            "bg-purple-50 text-purple-700",
        SHIPPED:
            "bg-indigo-50 text-indigo-700",
        OUT_FOR_DELIVERY:
            "bg-orange-50 text-orange-700",
        DELIVERED:
            "bg-green-50 text-green-700",
        CANCELLED:
            "bg-red-50 text-red-700",
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${styles[status]}`}
        >
            {getStatusText(status)}
        </span>
    );
}

function getStatusText(status: Order["status"]) {
    switch (status) {
        case "PROCESSING":
            return "Processing";

        case "CONFIRMED":
            return "Confirmed";

        case "PACKED":
            return "Packed";

        case "SHIPPED":
            return "Shipped";

        case "OUT_FOR_DELIVERY":
            return "Out for delivery";

        case "DELIVERED":
            return "Delivered";

        case "CANCELLED":
            return "Cancelled";
    }
}