import { CheckCircle2, CreditCard } from "lucide-react";

import { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";

interface OrderPaymentProps {
    order: Order;
}

export default function OrderPayment({
    order,
}: OrderPaymentProps) {
    return (
        <section className="rounded-2xl border border-brand-200 bg-white">

            <div className="border-b border-brand-100 px-5 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-project_primary" />

                        <h2 className="text-sm font-semibold text-obsidian">
                            Payment summary
                        </h2>
                    </div>

                    {order.payment.status === "PAID" && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-green-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Paid
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-3 px-5 py-5">

                <div className="flex justify-between text-xs">
                    <span className="text-obsidian/55">
                        Payment method
                    </span>

                    <span className="font-medium text-obsidian">
                        {order.payment.method}
                    </span>
                </div>

                <div className="flex justify-between text-xs">
                    <span className="text-obsidian/55">
                        Subtotal
                    </span>

                    <span className="font-medium text-obsidian">
                        {formatPrice(order.subtotal)}
                    </span>
                </div>

                {order.discount > 0 && (
                    <div className="flex justify-between text-xs">
                        <span className="text-obsidian/55">
                            Discount
                        </span>

                        <span className="font-medium text-green-600">
                            -{formatPrice(order.discount)}
                        </span>
                    </div>
                )}

                <div className="flex justify-between text-xs">
                    <span className="text-obsidian/55">
                        Shipping
                    </span>

                    <span className="font-medium text-obsidian">
                        {order.shippingCharge === 0
                            ? "Free"
                            : formatPrice(order.shippingCharge)}
                    </span>
                </div>

                <div className="border-t border-brand-100 pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-obsidian">
                            Total
                        </span>

                        <span className="text-lg font-semibold text-obsidian">
                            {formatPrice(order.total)}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}