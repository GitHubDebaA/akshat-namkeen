"use client";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { useAccountOptions } from "@/store/account/options/option";
import RequiredLogin from "./required-login";
import Bag from "./bag";
import OrderSummary from "./order-summary";

export default function Checkout() {
    const { data: session, status } = useSession();
    const isLoggedIn = !!session;
    const { openAccountOptions } = useAccountOptions();

    const steps = [
        { id: "bag", label: "Your Bag" },
        { id: "address", label: "Address" },
        { id: "payment", label: "Payment" }
    ];

    useEffect(() => {
        if (status !== "loading" && !isLoggedIn) {
            openAccountOptions();
        }
    }, [isLoggedIn, status, openAccountOptions]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto md:my-6 max-w-7xl">
            <div className="md:col-span-2 lg:col-span-3 bg-obsidian/10 md:rounded-lg p-4 hidden">
                Section 1 (Full Width)
            </div>
            <div className="md:col-span-1 lg:col-span-2 md:rounded-lg p-4">
                <Bag />
            </div>
            <div className="md:col-span-1 bg-obsidian/10 md:rounded-lg p-4">
                <OrderSummary isLoggedIn={isLoggedIn} />
            </div>
        </div>
    );
}