"use client"
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

export default function CollectionHero() {
    const handleExploreCollections = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const element = document.getElementById("all-collections");
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    return (
        <section className="relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/illustrations/view-all.png')",
                }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian/75 via-obsidian/45 to-obsidian/25" />

            {/* Content */}
            <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 py-24 lg:px-8">
                <div className="max-w-3xl">
                    {/* Badge */}
                    <span className="inline-flex items-center rounded-full border border-project_primary/50 bg-white/50 px-4 py-2 text-sm font-medium tracking-wide text-ivory backdrop-blur">
                        ✨ Premium Indian Snacks
                    </span>

                    {/* Heading */}
                    <h1 className="mt-6 text-5xl font-bold leading-tight text-white lg:text-7xl">
                        Discover Every
                        <span className="block text-project_primary">
                            Collection
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory">
                        From crispy namkeen and traditional mixtures to festive
                        sweets, explore handcrafted collections prepared using
                        authentic recipes, premium ingredients, and packed fresh
                        for every celebration.
                    </p>

                    {/* Buttons */}
                    <div className="mt-10 flex flex-wrap gap-4">
                        <div className="flex-1">
                            <Button
                                onClick={handleExploreCollections}
                                className="relative overflow-hidden h-11 w-full text-sm rounded-full bg-obsidian text-white group/button transition-all duration-300 hover:shadow-xl cursor-pointer"
                            >
                                <span className="absolute inset-0 bg-project_primary scale-x-0 origin-left transition-transform duration-300 group-hover/button:scale-x-100"></span>
                                <span className="relative flex items-center justify-center gap-2">
                                    Explore Collections
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                            </Button>
                        </div>
                        <div className="flex-1">
                            <Link href="/collections/featured-products">
                                <Button
                                    className="relative overflow-hidden h-11 w-full text-sm rounded-full bg-ivory text-obsidian group/button transition-all duration-300 hover:shadow-xl hover:text-white cursor-pointer"
                                >
                                    <span className="absolute inset-0 bg-project_primary scale-x-0 origin-left transition-transform duration-300 group-hover/button:scale-x-100"></span>
                                    <span className="relative flex items-center justify-center gap-2">
                                        Shop Signature Collection
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Trust Points */}
                    <div className="mt-14 flex flex-wrap gap-8 text-sm text-ivory">
                        <div className="flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-ivory" />
                            <span>Made with Premium Ingredients</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Truck className="h-5 w-5 text-ivory" />
                            <span>Fresh Delivery Across India</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-ivory" />
                            <span>Safe & Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}