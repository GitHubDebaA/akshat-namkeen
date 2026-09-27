"use client";

import { useState } from "react";
import { Order } from "@/types/order";
import Link from "next/link";
import { formatDate, formatPrice } from "../../lib/utils";
import {
    ArrowRight,
    ImageOff,
    MapPin,
    RotateCcw,
    Star,
    X,
} from "lucide-react";
import Image from "next/image";

interface OrderCardProps {
    order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
    const [showAllItems, setShowAllItems] = useState(false);

    const isDelivered = order.status === "DELIVERED";

    const visibleItems = showAllItems
        ? order.items
        : order.items.slice(0, 2);

    const remainingItems = order.items.length - 2;

    return (
        <article className="flex flex-col overflow-hidden rounded-xl border border-brand-200 bg-white">
            {/* Header */}
            <div className="shrink-0 border-b border-brand-100 px-5 py-4">
                <div className="flex justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold tracking-wide text-obsidian">
                            ORDER #{order.orderNumber}
                        </p>

                        <p className="mt-1 text-xs text-obsidian/60">
                            {formatDate(order.createdAt)}
                        </p>
                    </div>

                    <div className="text-right text-sm font-semibold text-obsidian">
                        {formatPrice(order.total)}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex min-h-0 flex-1 flex-col px-5 py-4">
                {/* Status */}
                <div className="pb-2 mb-3 shrink-0 border-b">
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full 
                            ${isDelivered ? "bg-green-500" : order.status === "CANCELLED" ? "bg-red-500" : "bg-project_primary"}`}
                        />
                        <p className="text-sm font-semibold text-obsidian">
                            {getStatusText(order.status).label}
                        </p>
                    </div>

                    <p className="mt-1 text-xs text-obsidian/60">
                        {getStatusText(order.status).message}
                    </p>
                </div>

                {/* Products */}
                <div className="min-h-0 flex-1 overflow-hidden">
                    <div className="space-y-3">
                        {visibleItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex min-h-[58px] items-center gap-3"
                            >
                                {/* Product Image */}
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-50">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.productName}
                                            className="h-full w-full object-cover"
                                            width={100}
                                            height={100}
                                        />
                                    ) : (
                                        <ImageOff className="h-8 w-8 text-obsidian/30" />
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="min-w-0 flex-1">
                                    <div>
                                        <p className="truncate text-sm font-semibold text-obsidian">
                                            {item.productName}
                                        </p>
                                    </div>

                                    <div className="col-span-2 flex items-center gap-1">
                                        <div className="truncate text-xs text-obsidian/55">
                                            {item.variantName}
                                        </div>
                                        <X className="h-3 w-3 text-obsidian/55 shrink-0"></X>
                                        <div className="text-xs text-obsidian/60">
                                            {item.quantity}
                                        </div>
                                    </div>
                                </div>

                                {/* Line Total */}
                                <div className="shrink-0 text-right">
                                    <p className="text-sm font-semibold text-obsidian">
                                        {formatPrice(item.totalPrice)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* More Items */}
                    {!showAllItems && remainingItems > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowAllItems(true)}
                            className="mt-3 text-xs font-medium text-project_primary hover:underline"
                        >
                            + {remainingItems} more{" "}
                            {remainingItems === 1 ? "item" : "items"}
                        </button>
                    )}

                    {showAllItems && order.items.length > 2 && (
                        <button
                            type="button"
                            onClick={() => setShowAllItems(false)}
                            className="mt-3 text-xs font-medium text-project_primary hover:underline"
                        >
                            Show less
                        </button>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="grid shrink-0 grid-cols-3 border-t border-brand-100">
                {/* View Order */}
                <Link href={`/orders/${order.id}`}>
                    <OrderAction
                        icon={ArrowRight}
                        label="View Order"
                    />
                </Link>

                {/* Track / Review */}
                {isDelivered ? (
                    <OrderAction
                        icon={Star}
                        label="Review & Feedback"
                    />
                ) : (
                    <OrderAction
                        icon={MapPin}
                        label="Track Order"
                    />
                )}

                {/* Buy Again */}
                <OrderAction
                    icon={RotateCcw}
                    label="Buy Again"
                    last
                />
            </div>
        </article>
    );
}

interface OrderActionProps {
    icon: React.ElementType;
    label: string;
    last?: boolean;
}

function OrderAction({
    icon: Icon,
    label,
    last = false,
}: OrderActionProps) {
    return (
        <button
            type="button"
            className={`flex min-h-[64px] flex-col items-center justify-center gap-1.5 px-2 text-xs font-medium text-obsidian/70 transition hover:bg-brand-50 hover:text-project_primary ${!last ? "border-r border-brand-100" : ""}`}
        >
            <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
            <span className="text-center leading-tight">
                {label}
            </span>
        </button>
    );
}

function getStatusText(status: Order["status"]) {
    switch (status) {
        case "PROCESSING":
            return {
                label: "Order processing",
                message: "Seller will confirm your order soon."
            };

        case "CONFIRMED":
            return {
                label: "Order confirmed",
                message: "Order confirmed. Your order will shipping soon."
            };

        case "PACKED":
            return {
                label: "Order packed",
                message: "No more waiting, Your order is ready to shipping."
            };

        case "SHIPPED":
            return {
                label: "Order shipped",
                message: 'Expected by today'
            };

        case "OUT_FOR_DELIVERY":
            return {
                label: "Arriving Today",
                message: 'Our delivery partner is out for delivery'
            }
        case "DELIVERED":
            return {
                label: "Delivered",
                message: 'Delivered today'
            };
        case "CANCELLED":
            return {
                label: "Cancelled",
                message: "🥲🥲🥲"
            }

        default:
            return status;
    }
}