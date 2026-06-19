import Image from "next/image";
import { Product } from "@prisma/client";
interface Props {
    products: Product[];
}

export default function Featured({ products }: Props) {
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
                    <span className="h-[1px] w-12 bg-gray-300 inline-block animate-pulse"></span>
                </div>
            </div>

            {/* HORIZONTAL FASHION CAROUSEL COMPONENT */}
            {/* Left padding matches page layout, right padding allows items to bleed nicely off-screen */}
            <div className="flex gap-6 overflow-x-auto pb-6 pt-2 px-4 md:pl-[calc((100vw-80rem)/2+1rem)] scrollbar-none snap-x snap-mandatory">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="w-[280px] md:w-[320px] flex-shrink-0 snap-start group cursor-pointer flex flex-col justify-between"
                    >
                        <div>
                            {/* Product Visual Frame */}
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-100 mb-4 shadow-sm">
                                <Image
                                    src={product.dpURL}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 280px, 320px"
                                    className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                                />

                                {/* Micro Heritage Badge */}
                                <span className="absolute top-4 left-4 bg-white/90 text-charcoal text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-charcoal/10 backdrop-blur-sm z-10">
                                    Signature
                                </span>

                                {/* Sleek Retail Quick Add Bar */}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent pt-12 pb-4 px-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                    <button className="w-full py-2.5 bg-ivory text-charcoal text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-opacity-95 transition-colors shadow-lg">
                                        + Quick Add
                                    </button>
                                </div>
                            </div>

                            {/* High-End Labeling Block */}
                            <div className="space-y-1 px-1">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-medium text-base text-charcoal tracking-wide truncate">
                                        {product.name}
                                    </h3>
                                    <span className="font-semibold text-sm text-gray-800 whitespace-nowrap">
                                        ₹{product.price.toFixed(2)}
                                    </span>
                                </div>

                                {/* Snack Description line mimicking fashion "Fabric Details" layout */}
                                <p className="text-xs text-gray-400 line-clamp-1 italic tracking-wide">
                                    {product.description || "Traditional recipe, light crisp finish."}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    );
}