import Image from "next/image";
import { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";

interface OrderItemsProps {
    order: Order;
}

export default function OrderItems({
    order,
}: OrderItemsProps) {
    return (
        <div className="divide-y divide-brand-100">
            {order.items.map((item) => (
                <div
                    key={item.id}
                    className="flex gap-4 px-5 py-5 sm:px-6"
                >
                    {/* Image */}
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-50">
                        {item.image ? (
                            <Image
                                src={item.image}
                                alt={item.productName}
                                width={96}
                                height={96}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-xs text-obsidian/30">
                                No image
                            </span>
                        )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-obsidian">
                            {item.productName}
                        </h3>

                        <p className="mt-1 text-xs text-obsidian/50">
                            {item.variantName}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-obsidian/55">
                            <span>
                                Qty:{" "}
                                <strong className="font-medium text-obsidian">
                                    {item.quantity}
                                </strong>
                            </span>

                            <span>
                                Price:{" "}
                                <strong className="font-medium text-obsidian">
                                    {formatPrice(item.unitPrice)}
                                </strong>
                            </span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-obsidian">
                            {formatPrice(item.totalPrice)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}