import {
    BadgeCheck,
    Check,
    CheckCircle2,
    ClipboardList,
    MapPin,
    PackageCheck,
    Truck,
} from "lucide-react";

import { Order, OrderStatus } from "@/types/order";
import { formatDate } from "@/lib/utils";

interface OrderTimelineProps {
    order: Order;
}

const steps: {
    status: OrderStatus;
    label: string;
    Icon: typeof ClipboardList;
}[] = [
    { status: "PROCESSING", label: "Processing", Icon: ClipboardList },
    { status: "CONFIRMED", label: "Confirmed", Icon: BadgeCheck },
    { status: "PACKED", label: "Packed", Icon: PackageCheck },
    { status: "SHIPPED", label: "Shipped", Icon: Truck },
    { status: "OUT_FOR_DELIVERY", label: "Out for delivery", Icon: MapPin },
    { status: "DELIVERED", label: "Delivered", Icon: CheckCircle2 },
];

export default function OrderTimeline({ order }: OrderTimelineProps) {
    const currentIndex = Math.max(0, steps.findIndex((step) => step.status === order.status));
    const currentStep = steps[currentIndex];
    const currentHistory = order.statusHistory.find((entry) => entry.status === order.status);
    const isDelivered = order.status === "DELIVERED";
    const progress = (currentIndex / (steps.length - 1)) * 100;
    const deliveryDate = isDelivered
        ? order.tracking?.deliveredAt || order.updatedAt
        : order.tracking?.estimatedDelivery;

    const headline = isDelivered
        ? "Your order has arrived"
        : order.status === "PROCESSING"
            ? "We’re preparing your order"
            : `Your order is ${currentStep.label.toLowerCase()}`;

    return (
        <section aria-label="Order progress" className="overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-obsidian/10 sm:flex-row sm:items-center sm:justify-between pb-6">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-project_primary">Order progress</p>
                    <h2 className="mt-1 text-base font-semibold text-obsidian sm:text-lg">{headline}</h2>
                    <p className="mt-1 text-xs text-obsidian/55">
                        {currentHistory?.description || (isDelivered ? "Thank you for shopping with us." : "We’ll keep you updated as your order moves along.")}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                    {deliveryDate && (
                        <div className="rounded-xl border border-obsidian/10 bg-ivory px-3 py-2">
                            <p className="text-[9px] font-semibold uppercase tracking-wider text-obsidian/45">
                                {isDelivered ? "Delivered on" : "Estimated delivery"}
                            </p>
                            <p className="mt-0.5 text-xs font-semibold text-obsidian">{formatDate(deliveryDate)}</p>
                        </div>
                    )}
                    {order.tracking?.trackingNumber && (
                        <div className="rounded-xl border border-obsidian/10 bg-ivory px-3 py-2">
                            <p className="text-[9px] font-semibold uppercase tracking-wider text-obsidian/45">Tracking ID</p>
                            <p className="mt-0.5 text-xs font-semibold text-obsidian">{order.tracking.trackingNumber}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Horizontal progress path */}
            <div className="hidden py-6 md:block">
                <div className="relative">
                    <div className="absolute left-[8.333%] right-[8.333%] top-5 h-1 rounded-full bg-obsidian/10" />
                    <div
                        className="absolute left-[8.333%] top-5 h-1 rounded-full bg-project_primary transition-[width] duration-700 ease-out"
                        style={{ width: `${(progress * 83.334) / 100}%` }}
                    />
                    <ol className="relative grid grid-cols-6">
                        {steps.map((step, index) => {
                            const complete = index < currentIndex;
                            const active = index === currentIndex;
                            const reached = index <= currentIndex;
                            const Icon = step.Icon;
                            const history = order.statusHistory.find((entry) => entry.status === step.status);

                            return (
                                <li key={step.status} className="flex min-w-0 flex-col items-center text-center">
                                    <span className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${reached ? "border-project_primary bg-project_primary text-white" : "border-obsidian bg-white text-obsidian"} ${active ? "ring-4 ring-project_primary/15" : ""}`}>
                                        {complete ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Icon className="h-4 w-4" strokeWidth={1.8} />}
                                    </span>
                                    <span className={`mt-3 max-w-24 text-[10px] font-semibold leading-4 lg:text-xs ${active ? "text-project_primary" : reached ? "text-obsidian" : "text-obsidian/40"}`}>
                                        {step.label}
                                    </span>
                                    {history && (
                                        <span className="mt-1 text-[9px] leading-3 text-obsidian/45">{formatDate(history.timestamp)}</span>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>

            {/* Vertical progress path */}
            <ol className="px-4 py-5 md:hidden">
                {steps.map((step, index) => {
                    const complete = index < currentIndex;
                    const active = index === currentIndex;
                    const reached = index <= currentIndex;
                    const Icon = step.Icon;
                    const history = order.statusHistory.find((entry) => entry.status === step.status);

                    return (
                        <li key={step.status} className="flex gap-3">
                            <div className="flex w-8 shrink-0 flex-col items-center">
                                <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${reached ? "border-project_primary bg-project_primary text-project_primary-foreground" : "border-obsidian/15 bg-ivory text-obsidian/35"} ${active ? "ring-4 ring-project_primary/15" : ""}`}>
                                    {complete ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />}
                                </span>
                                {index < steps.length - 1 && (
                                    <span className={`my-1 min-h-6 w-0.5 flex-1 rounded-full ${complete ? "bg-project_primary" : "bg-obsidian/10"}`} />
                                )}
                            </div>
                            <div className={`min-h-12 flex-1 pb-4 ${index === steps.length - 1 ? "pb-0" : ""}`}>
                                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                                    <p className={`text-sm font-semibold ${active ? "text-project_primary" : reached ? "text-obsidian" : "text-obsidian/40"}`}>{step.label}</p>
                                    {history && <p className="text-[10px] text-obsidian/45">{formatDate(history.timestamp)}</p>}
                                </div>
                                {active && currentHistory?.description && (
                                    <p className="mt-1 text-xs leading-5 text-obsidian/55">{currentHistory.description}</p>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
