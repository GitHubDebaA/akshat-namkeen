import ProductCard from "@/components/products/card";
import type { ProductCardData } from "@/types/product";

interface Props {
    items: ProductCardData[];
}

export default function FeaturedContent({ items }: Props) {
    return (
        <section className="overflow-hidden">

            {/* SECTION HEADER: Luxury Lookbook Alignment */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6">
                <div className="flex-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-obsidian/50">
                        {"The Connoisseur's Choice"}
                    </span>
                    <h2 className="text-2xl font-md text-obsidian">
                        Signature Collections
                    </h2>
                    <p className="text-sm text-obsidian/50">
                        Our most celebrated heritage recipes. Timeless snacks perfected over generations, curated for pure indulgence.
                    </p>
                </div>

                {/* Minimal Scroll Indicator */}
                <div className="hidden md:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <span>Swipe to explore</span>
                </div>
            </div>

            {/* HORIZONTAL FASHION CAROUSEL COMPONENT */}
            <div className="flex gap-6 overflow-x-auto pb-6 pt-2 px-4 md:pl-[calc((100vw-80rem)/2+1rem)] scrollbar-none snap-x snap-mandatory">
                {items.map((item) => (
                    <div
                        key={item.selectedVariantId}
                        className="w-[200px] flex-shrink-0 snap-start group cursor-pointer flex flex-col justify-between"
                    >
                        <ProductCard data={item} />
                    </div>
                ))}
            </div>
        </section>
    );
}