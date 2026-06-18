"use client"
import { useEffect, useState } from "react";
import { useAddressOptions } from "@/store/address/address";
import { X, Plus, House, Building2, MapPinHouse, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image";
import type { Address } from "@prisma/client";

export default function SavedAddress() {
    const { isOpen, closeAddressOptions, setPageName } = useAddressOptions();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [totalAddress, setTotalAddresses] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;
        loadAddresses();
    }, [isOpen]);

    const loadAddresses = async () => {
        try {
            const response = await fetch("/api/address/get");
            if (!response.ok) {
                throw new Error("Failed to load addresses");
            }

            const data = await response.json();
            setAddresses(data.address);
            setTotalAddresses(data.address.length);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Section @@ content */}
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-200">
                <div className="flex items-center gap-3">
                    {/* <User className="w-5 h-5 text-obsidian" /> */}
                    <h2 className="font-display text-lg font-medium">Saved Addresses</h2>
                </div>
                <button
                    onClick={closeAddressOptions}
                    className="p-2 rounded-full hover:bg-brand-100 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {
                    loading ?
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Skeleton className="h-[20px] w-[50%] rounded-full" />
                                <Skeleton className="h-[50px] w-[100%] rounded-full" />
                                <Skeleton className="h-[20px] w-[50%] rounded-full" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-[20px] w-[50%] rounded-full" />
                                <Skeleton className="h-[50px] w-[100%] rounded-full" />
                                <Skeleton className="h-[20px] w-[50%] rounded-full" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-[20px] w-[50%] rounded-full" />
                                <Skeleton className="h-[50px] w-[100%] rounded-full" />
                                <Skeleton className="h-[20px] w-[50%] rounded-full" />
                            </div>
                        </div>
                        :
                        <>
                            {
                                totalAddress === 0 ?
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Image
                                            src="/illustrations/no-address.svg"
                                            alt="No address found"
                                            width={220}
                                            height={220}
                                            priority
                                        />

                                        <h3 className="mt-6 text-xl font-semibold text-obsidian">
                                            No Addresses Added Yet
                                        </h3>

                                        <p className="mt-6 max-w-sm text-sm text-muted-foreground">
                                            Add your first delivery address to make checkout faster and
                                            receive your favorite namkeen without hassle.
                                        </p>
                                    </div>
                                    :
                                    <div className="space-y-6">
                                        {addresses.map((item) => (
                                            <div key={item.id}>
                                                <div className="flex flex-column items-center gap-2">
                                                    <div className="text-project_primary">
                                                        {{
                                                            HOME: <House className="size-4" />,
                                                            OFFICE: <Building2 className="size-4" />,
                                                            OTHER: <MapPinHouse className="size-4" />,
                                                        }[item.addressType as "HOME" | "OFFICE" | "OTHER"] ?? <MapPinHouse className="size-4" />}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-medium text-sm">
                                                            {item.fullName}
                                                        </h3>

                                                        {item.isDefault && (
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-project_primary/10 text-project_primary">
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">

                                                    <div className="flex-1 min-w-0">

                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            {[
                                                                item.addressLine1,
                                                                item.addressLine2,
                                                                item.city,
                                                                item.state,
                                                                item.country,
                                                                item.postalCode,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(", ")}
                                                        </p>

                                                        <p className="mt-2 text-sm font-medium flex flex-column items-center gap-2">
                                                            <Phone className="size-4" />
                                                            {item.mobile}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                            }
                        </>
                }
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-brand-200 space-y-4">
                <Button
                    onClick={() => setPageName('add')}
                    className="text-sm w-full py-6 bg-project_primary hover:bg-project_primary-foreground text-white transition-colors cursor-pointer uppercase"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Address
                </Button>
            </div>
        </>
    );
}