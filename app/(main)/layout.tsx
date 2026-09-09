import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Provider from "../SessionProvider";
import Cart from "@/components/cart/cart";
import AddressOptions from "@/components/address/address";
import Account from "@/components/account/account";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "Akshat Namkeen",
    description: "Akshat Namkeen is the personal website of Akshat, a software engineer and technology enthusiast. It serves as a platform to showcase his projects, share his thoughts on technology, and connect with like-minded individuals. The website features a clean and modern design, with sections for his portfolio, blog, and contact information. Whether you're interested in learning more about Akshat's work or just want to stay updated on his latest projects, Akshat V2 is the place to be.",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <Provider>
            <div className="flex min-h-screen flex-col">
                <Header />
                <Cart />
                <Account />
                <AddressOptions />
                <Toaster />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </Provider>
    );
}
