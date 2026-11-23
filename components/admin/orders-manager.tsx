"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order, OrderStatus, Payment } from "@/types/order";

type OrderForm = {
    status: OrderStatus;
    paymentStatus: Payment["status"];
    courierName: string;
    trackingNumber: string;
    estimatedDelivery: string;
};

const statuses: OrderStatus[] = ["PROCESSING", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

function toForm(order: Order): OrderForm {
    return {
        status: order.status,
        paymentStatus: order.payment.status,
        courierName: order.tracking?.courier ?? "",
        trackingNumber: order.tracking?.trackingNumber ?? "",
        estimatedDelivery: order.tracking?.estimatedDelivery?.slice(0, 10) ?? "",
    };
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [forms, setForms] = useState<Record<string, OrderForm>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    async function loadOrders() {
        try {
            const response = await fetch("/api/admin/orders", { cache: "no-store" });
            if (!response.ok) throw new Error("Unable to load orders.");
            const data: { orders: Order[] } = await response.json();
            setOrders(data.orders);
            setForms(Object.fromEntries(data.orders.map((order) => [order.id, toForm(order)])));
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to load orders.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { void loadOrders(); }, []);

    function updateForm(orderId: string, update: Partial<OrderForm>) {
        setForms((current) => ({ ...current, [orderId]: { ...current[orderId], ...update } }));
    }

    async function saveOrder(orderId: string) {
        const form = forms[orderId];
        setSaving(orderId);
        try {
            const response = await fetch("/api/admin/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId,
                    status: form.status,
                    paymentStatus: form.paymentStatus,
                    courierName: form.courierName,
                    trackingNumber: form.trackingNumber,
                    estimatedDelivery: form.estimatedDelivery || null,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Unable to update order.");
            toast.success("Order updated.");
            await loadOrders();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to update order.");
        } finally {
            setSaving(null);
        }
    }

    return (
        <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
            <div className="mb-7">
                <h1 className="font-display text-3xl font-semibold text-obsidian">Order management</h1>
                <p className="mt-1 text-sm text-obsidian/60">Update order progress, COD collection, and courier details.</p>
            </div>
            {loading ? <div className="flex justify-center py-16"><Spinner /></div> : orders.length === 0 ? (
                <div className="rounded-2xl border border-brand-200 bg-white p-8 text-center text-sm text-obsidian/60">No customer orders yet.</div>
            ) : (
                <div className="space-y-5">
                    {orders.map((order) => {
                        const form = forms[order.id] ?? toForm(order);
                        return (
                            <article key={order.id} className="space-y-5 rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
                                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-brand-100 pb-4">
                                    <div>
                                        <h2 className="font-semibold text-obsidian">#{order.orderNumber}</h2>
                                        <p className="mt-1 text-xs text-obsidian/55">{formatDate(order.createdAt)} · {order.items.length} {order.items.length === 1 ? "item" : "items"}</p>
                                    </div>
                                    <p className="font-semibold text-obsidian">{formatPrice(order.total)} · COD</p>
                                </div>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="space-y-2 text-sm">
                                        <h3 className="font-medium text-obsidian">Delivery to</h3>
                                        <p className="text-obsidian/70">{order.shippingAddress.name} · {order.shippingAddress.phone}<br />{order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}<br />{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                                        <p className="text-xs text-obsidian/55">{order.items.map((item) => `${item.productName} (${item.variantName}) × ${item.quantity}`).join(" · ")}</p>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <label className="space-y-1 text-xs text-obsidian/60">Order status
                                            <select value={form.status} onChange={(event) => updateForm(order.id, { status: event.target.value as OrderStatus })} className="w-full rounded-lg border border-obsidian/20 bg-white px-3 py-2 text-sm text-obsidian">
                                                {statuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
                                            </select>
                                        </label>
                                        <label className="space-y-1 text-xs text-obsidian/60">COD payment
                                            <select value={form.paymentStatus} onChange={(event) => updateForm(order.id, { paymentStatus: event.target.value as Payment["status"] })} className="w-full rounded-lg border border-obsidian/20 bg-white px-3 py-2 text-sm text-obsidian">
                                                <option value="PENDING">Pending collection</option><option value="PAID">Collected</option><option value="FAILED">Collection failed</option>
                                            </select>
                                        </label>
                                        <label className="space-y-1 text-xs text-obsidian/60">Courier
                                            <input value={form.courierName} onChange={(event) => updateForm(order.id, { courierName: event.target.value })} maxLength={100} className="w-full rounded-lg border border-obsidian/20 px-3 py-2 text-sm text-obsidian" />
                                        </label>
                                        <label className="space-y-1 text-xs text-obsidian/60">Tracking number
                                            <input value={form.trackingNumber} onChange={(event) => updateForm(order.id, { trackingNumber: event.target.value })} maxLength={150} className="w-full rounded-lg border border-obsidian/20 px-3 py-2 text-sm text-obsidian" />
                                        </label>
                                        <label className="space-y-1 text-xs text-obsidian/60 sm:col-span-2">Estimated delivery
                                            <input type="date" value={form.estimatedDelivery} onChange={(event) => updateForm(order.id, { estimatedDelivery: event.target.value })} className="w-full rounded-lg border border-obsidian/20 px-3 py-2 text-sm text-obsidian sm:max-w-xs" />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end border-t border-brand-100 pt-4">
                                    <Button type="button" onClick={() => void saveOrder(order.id)} disabled={saving === order.id} className="min-w-32 bg-obsidian text-white">
                                        {saving === order.id ? <><Spinner />Saving…</> : "Save updates"}
                                    </Button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
