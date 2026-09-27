import {
    Check,
} from "lucide-react";

import { Order } from "@/types/order";
import { formatDate } from "@/lib/utils";

interface OrderTimelineProps {
    order: Order;
}

const steps = [
    {
        status: "CONFIRMED",
        label: "Confirmed",
    },
    {
        status: "PACKED",
        label: "Packed",
    },
    {
        status: "SHIPPED",
        label: "Shipped",
    },
    {
        status: "OUT_FOR_DELIVERY",
        label: "Out for delivery",
    },
    {
        status: "DELIVERED",
        label: "Delivered",
    },
];

const statusOrder = [
    "PROCESSING",
    "CONFIRMED",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
];

export default function OrderTimeline({
    order,
}: OrderTimelineProps) {
    const currentIndex = statusOrder.indexOf(order.status);

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-obsidian">
                        Delivery status
                    </h2>

                    <p className="mt-1 text-xs text-obsidian/50">
                        {order.status === "DELIVERED"
                            ? `Delivered on ${formatDate(
                                order.tracking?.deliveredAt ||
                                order.updatedAt
                            )}`
                            : order.tracking?.estimatedDelivery
                                ? `Expected by ${formatDate(
                                    order.tracking.estimatedDelivery
                                )}`
                                : "Your order is being prepared"}
                    </p>
                </div>

                {order.tracking?.trackingNumber && (
                    <div className="hidden text-right sm:block">
                        <p className="text-[10px] uppercase tracking-wider text-obsidian/40">
                            Tracking ID
                        </p>

                        <p className="mt-1 text-xs font-medium text-obsidian">
                            {order.tracking.trackingNumber}
                        </p>
                    </div>
                )}
            </div>

            <div className="relative">
                {/* Line */}
                <div className="absolute left-[10%] right-[10%] top-4 h-[2px] bg-brand-100" />

                <div className="relative grid grid-cols-5">
                    {steps.map((step) => {
                        const stepIndex = statusOrder.indexOf(
                            step.status
                        );

                        const completed =
                            currentIndex >= stepIndex;

                        return (
                            <div
                                key={step.status}
                                className="flex flex-col items-center"
                            >
                                <div
                                    className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white ${completed
                                        ? "border-project_primary bg-project_primary text-white"
                                        : "border-brand-200 text-obsidian/30"
                                        }`}
                                >
                                    {completed ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <span className="h-2 w-2 rounded-full bg-current" />
                                    )}
                                </div>

                                <p
                                    className={`mt-2 text-center text-[10px] font-medium sm:text-xs ${completed
                                        ? "text-obsidian"
                                        : "text-obsidian/40"
                                        }`}
                                >
                                    {step.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}