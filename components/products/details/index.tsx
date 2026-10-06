"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import type { ProductDetailsData } from "@/types/product";

import ProductGallery from "./product-gallery";
import ProductSummary from "./product-summary";
import ProductVariants from "./product-variants";
import ProductActions from "./product-actions";
import ProductInformation from "./product-information";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface Props {
    data: ProductDetailsData;
}

export default function ProductDetails({ data }: Props) {
    const {
        product,
        variants,
        selectedVariantId: initialVariantId,
        rating,
        wishlistedVariantIds,
        inventory,
    } = data;

    const [selectedVariantId, setSelectedVariantId] =
        useState(initialVariantId);

    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedVariant =
        variants.find((variant) => variant.id === selectedVariantId) ??
        variants[0];

    useEffect(() => {
        setSelectedVariantId(initialVariantId);
    }, [initialVariantId]);

    if (!selectedVariant) {
        return null;
    }

    const handleVariantChange = (variantId: string) => {
        setSelectedVariantId(variantId);

        const newParams = new URLSearchParams(searchParams.toString());

        newParams.set("variant", variantId);

        router.replace(`${pathname}?${newParams.toString()}`, {
            scroll: false,
        });
    };

    const handleAddToCart = () => {
        /*
         * Cart integration will go here.
         *
         * Example:
         *
         * addItem({
         *     variantId: selectedVariant.id,
         *     productId: product.id,
         *     productName: product.name,
         *     variantName: selectedVariant.variant,
         *     price: selectedVariant.sellingPrice,
         *     displayURL: selectedVariant.displayURL,
         *     quantity,
         * });
         */

        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink className="text-xs ttext-obsidian/50 hover:text-obsidian" render={<Link href="/">Home</Link>}>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator className="text-xs text-obsidian/50" />

                        <BreadcrumbItem>
                            <BreadcrumbLink className="text-xs text-obsidian/50 hover:text-obsidian" render={<Link href="/product">Products</Link>}>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator className="text-xs text-obsidian/50 hover:text-obsidian" />

                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-xs text-obsidian font-medium">
                                {product.name}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                    {/* Left */}
                    <ProductGallery
                        variant={selectedVariant}
                        wishlisted={wishlistedVariantIds.includes(
                            selectedVariant.id
                        )}
                    />

                    {/* Right */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <ProductSummary
                                product={product}
                                variant={selectedVariant}
                                rating={rating}
                            />

                            {variants.length > 1 && (
                                <ProductVariants
                                    variants={variants}
                                    selectedVariantId={selectedVariant.id}
                                    onVariantChange={handleVariantChange}
                                />
                            )}

                            <ProductActions
                                variant={selectedVariant}
                                quantity={quantity}
                                added={added}
                                inventory={inventory}
                                onQuantityChange={setQuantity}
                                onAddToCart={handleAddToCart}
                            />

                            <ProductInformation
                                product={product}
                                variant={selectedVariant}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Related Products - later */}
            </div>
        </div>
    );
}