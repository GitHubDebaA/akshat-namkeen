"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Van, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/store/cart";
import { useAccountOptions } from "@/store/account/options/option";
import { useAddressOptions } from "@/store/address/address";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type SavedAddress = {
    id: string;
    fullName: string;
    mobile: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressType: string;
    isDefault: boolean;
};

const FREE_DELIVERY_THRESHOLD = 500;
const DELIVERY_CHARGE = 40;

export default function OrderSummary({ isLoggedIn }: { isLoggedIn: boolean }) {
    const router = useRouter();
    const { items, itemCount, total, clearCart } = useCart();
    const { openAccountOptions } = useAccountOptions();
    const { openAddressOptions, addressRevision } = useAddressOptions();
    const [addresses, setAddresses] = useState<SavedAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [addressLoading, setAddressLoading] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const subtotal = total();
    const delivery = subtotal > FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
    const grandTotal = subtotal + delivery;
    const selectedAddress = useMemo(
        () => addresses.find((address) => address.id === selectedAddressId),
        [addresses, selectedAddressId],
    );

    useEffect(() => {
        if (!isLoggedIn) return;
        let active = true;
        setAddressLoading(true);
        fetch("/api/address/get")
            .then(async (response) => {
                if (!response.ok) throw new Error("Couldn't load your saved addresses.");
                return response.json();
            })
            .then((data: { address: SavedAddress[] }) => {
                if (!active) return;
                const saved = data.address ?? [];
                setAddresses(saved);
                setSelectedAddressId((current) => current || saved.find((item) => item.isDefault)?.id || saved[0]?.id || "");
            })
            .catch(() => {
                if (active) toast.error("Couldn't load your saved addresses.");
            })
            .finally(() => {
                if (active) setAddressLoading(false);
            });
        return () => { active = false; };
    }, [isLoggedIn, addressRevision]);

    async function placeOrder() {
        if (!isLoggedIn) {
            openAccountOptions();
            return;
        }
        if (!selectedAddressId) {
            toast.error("Add a delivery address before placing your order.");
            openAddressOptions();
            return;
        }
        if (!items.length) return;

        setPlacingOrder(true);
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    addressId: selectedAddressId,
                    items: items.map(({ variantId, quantity }) => ({ variantId, quantity })),
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "We couldn't place your order.");
            clearCart();
            toast.success(`Order ${data.orderNumber} placed. Pay on delivery.`);
            router.push(`/orders/${data.id}`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "We couldn't place your order.");
        } finally {
            setPlacingOrder(false);
        }
    }

    return (
        <section className="space-y-5" aria-labelledby="order-summary-title">
            <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-obsidian/60" />
                <h2 id="order-summary-title" className="text-xl font-medium text-obsidian">Order Summary</h2>
            </div>

            <div className="space-y-3 text-sm text-obsidian/65">
                <div className="flex justify-between">
                    <span>Items ({itemCount()})</span><span className="font-medium text-obsidian">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="flex items-center gap-1"><Van className="h-4 w-4" />Delivery</span>
                    <span className={`font-medium ${delivery === 0 ? "text-green-700" : "text-obsidian"}`}>{delivery === 0 ? "Free" : formatPrice(delivery)}</span>
                </div>
                <p className="text-xs">Free delivery on orders above {formatPrice(FREE_DELIVERY_THRESHOLD)}.</p>
            </div>

            <div className="flex justify-between border-t border-obsidian/15 pt-4 text-sm font-semibold text-obsidian">
                <span>Grand Total</span><span>{formatPrice(grandTotal)}</span>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-obsidian"><MapPin className="h-4 w-4" />Delivery address</h3>
                    {addresses.length > 0 && <button type="button" onClick={openAddressOptions} className="text-xs underline underline-offset-2">Manage</button>}
                </div>
                {!isLoggedIn ? (
                    <p className="text-sm text-obsidian/60">Sign in to choose a saved address.</p>
                ) : addressLoading ? (
                    <p className="text-sm text-obsidian/60">Loading saved addresses…</p>
                ) : addresses.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-obsidian/25 p-4">
                        <p className="text-sm text-obsidian/70">Add an address to continue.</p>
                        <Button type="button" variant="link" className="mt-1 h-auto p-0" onClick={openAddressOptions}><Plus className="mr-1 h-4 w-4" />Add delivery address</Button>
                    </div>
                ) : (
                    <>
                        <select value={selectedAddressId} onChange={(event) => setSelectedAddressId(event.target.value)} className="w-full rounded-lg border border-obsidian/20 bg-white px-3 py-2 text-sm text-obsidian" aria-label="Choose delivery address">
                            {addresses.map((address) => <option key={address.id} value={address.id}>{address.fullName} · {address.addressType}{address.isDefault ? " · Default" : ""}</option>)}
                        </select>
                        {selectedAddress && <p className="text-xs leading-5 text-obsidian/60">{selectedAddress.addressLine1}{selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ""}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}<br />{selectedAddress.fullName} · {selectedAddress.mobile}</p>}
                    </>
                )}
            </div>

            <div className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-obsidian/70">Cash on delivery · Pay {formatPrice(grandTotal)} when your order arrives.</div>
            <Button type="button" className="w-full py-6 bg-obsidian text-ivory uppercase" onClick={placeOrder} disabled={placingOrder || addressLoading || !items.length || (isLoggedIn && !selectedAddressId)}>
                {placingOrder ? <><Spinner />Placing order…</> : isLoggedIn ? "Place COD Order" : "Sign in to place order"}
            </Button>
            {!items.length && <p className="text-center text-xs text-obsidian/55">Add an item to your bag to continue.</p>}
        </section>
    );
}
