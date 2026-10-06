"use client";
import { Star, StarIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { ProductRating, ProductDetailsVariant, ProductWithVariants } from "@/types/product";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
    product: Omit<ProductWithVariants, "variants">;
    variant: ProductDetailsVariant;
    rating: ProductRating;
}

export default function ProductSummary({ product, variant, rating }: Props) {
    const mrp = variant.mrp;
    const sellingPrice = variant.sellingPrice;
    const discountPercentage = mrp && mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

    return (
        <>
            <h1 className="font-display text-2xl md:text-4xl font-medium text-obsidian mb-1">
                {product.name}
            </h1>

            <p className="text-project_primary text-xs font-semibold tracking-widest uppercase mb-1">
                Akshat Namkeen
            </p>

            {/* Rating */}
            {/* Rating */}
            {
                rating.count === 0 ? (
                    <div className="inline-flex items-center gap-1.5 rounded-sm border border-green-200 bg-green-50 px-2 py-0.5 text-green-700">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            New
                        </span>
                    </div>
                ) : (
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="flex shrink-0 cursor-help items-center gap-1"
                                aria-label={`${rating.average} out of 5 from ${rating.count} reviews`}
                            >
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <Star
                                            key={index}
                                            className={`h-2.5 w-2.5 ${index < Math.round(rating.average) ?
                                                "fill-project_primary text-project_primary" :
                                                "text-obsidian/30"
                                                }`}
                                        />
                                    )
                                    )}
                                </div>

                                <span className="text-[10px] font-medium text-obsidian/60">
                                    {rating.average.toFixed(1)}
                                </span>
                            </div>
                        </TooltipTrigger>

                        <TooltipContent>
                            <p className="flex items-center justify-center gap-1 text-center text-sm text-ivory">
                                <StarIcon className="h-3 w-3 shrink-0 fill-ivory text-ivory" />
                                <span>
                                    {rating.average.toFixed(1)}{" "}
                                    ({rating.count}{" "}reviews)
                                </span>
                            </p>
                        </TooltipContent>
                    </Tooltip>
                )
            }

            {/* Past Purchase Trend */}
            <div className="text-xs font-bold my-1">
                3K+ bought in past month
            </div>

            {/* Divider */}
            <div className="border-b border-solid border-obsidian-400 mb-2 lg:mb-4" />

            {/* Price */}
            <div className="flex items-center gap-2">
                <span className="text-lg text-project_primary">
                    -{discountPercentage}%
                </span>

                <span className="font-display text-2xl font-medium text-obsidian">
                    {formatPrice(sellingPrice)}
                </span>
            </div>

            <div className="text-xs text-obsidian-400">
                {mrp && (
                    <span>
                        <span>M.R.P.: </span>
                        <span className="line-through">
                            {formatPrice(mrp)}
                        </span>
                    </span>
                )}
            </div>

            <div className="text-xs text-obsidian font-bold">
                Inclusive of all Taxes
            </div>
        </>
    );
}