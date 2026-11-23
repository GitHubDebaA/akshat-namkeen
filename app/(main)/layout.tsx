import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Cart from "@/components/cart/cart";
import AddressOptions from "@/components/address/address";
import Account from "@/components/account/account";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "Akshat Namkeen | Traditional Indian Snacks",
    description: "Shop Akshat Namkeen snacks online. Explore our range of traditional Indian namkeen, mixtures, bhujia and savory snacks.",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="print:hidden"><Header /></div>
            <Cart />
            <Account />
            <AddressOptions />
            <Toaster />
            <main className="flex-1">
                {children}
            </main>
            <div className="print:hidden"><Footer /></div>
        </div>
    );
}
