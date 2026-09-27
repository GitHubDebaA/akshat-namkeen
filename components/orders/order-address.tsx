import { MapPin } from "lucide-react";
import { ShippingAddress } from "@/types/order";

interface OrderAddressProps {
    address: ShippingAddress;
}

export default function OrderAddress({
    address,
}: OrderAddressProps) {
    return (
        <section className="rounded-2xl border border-brand-200 bg-white">
            <div className="border-b border-brand-100 px-5 py-4">
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-project_primary" />

                    <h2 className="text-sm font-semibold text-obsidian">
                        Delivery address
                    </h2>
                </div>
            </div>

            <div className="px-5 py-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-obsidian">
                            {address.name}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-obsidian/60">
                            {address.addressLine1}
                            <br />

                            {address.addressLine2 && (
                                <>
                                    {address.addressLine2}
                                    <br />
                                </>
                            )}

                            {address.city}, {address.state}{" "}
                            {address.postalCode}
                        </p>

                        <p className="mt-3 text-xs text-obsidian/60">
                            {address.phone}
                        </p>
                    </div>

                    {address.addressType && (
                        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-medium text-obsidian/60">
                            {address.addressType}
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
}