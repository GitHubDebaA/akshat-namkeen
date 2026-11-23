"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import type { ProductDetailsData } from "@/types/product";

import ProductGallery from "./product-gallery";
import ProductSummary from "./product-summary";
import ProductVariants from "./product-variants";
import ProductActions from "./product-actions";
import ProductInformation from "./product-information";
import ProductReviews from "./reviews/product-reviews";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { mapRatingProductData } from "@/lib/mappers/product";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

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
        reviews
    } = data;

    const [selectedVariantId, setSelectedVariantId] = useState(initialVariantId);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const addItem = useCart((state) => state.addItem);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const selectedVariant =
        variants.find((variant) => variant.id === selectedVariantId) ??
        variants[0];

    useEffect(() => {
        setSelectedVariantId(initialVariantId);
    }, [initialVariantId]);

    useEffect(() => () => {
        if (addedTimer.current) clearTimeout(addedTimer.current);
    }, []);

    if (!selectedVariant) {
        return null;
    }

    const handleVariantChange = (variantId: string) => {
        setSelectedVariantId(variantId);
        setAdded(false);

        const newParams = new URLSearchParams(searchParams.toString());

        newParams.set("variant", variantId);

        router.replace(`${pathname}?${newParams.toString()}`, {
            scroll: false,
        });
    };

    const addSelectedToCart = () => {
        if (!selectedVariant) return;
        addItem({
            variantId: selectedVariant.id,
            productId: product.id,
            productName: product.name,
            variantName: selectedVariant.variant,
            price: Number(selectedVariant.sellingPrice),
            displayURL: selectedVariant.displayURL,
        }, quantity);
    };

    const handleAddToCart = async () => {
        if (isAdding || isBuying || !selectedVariant) return;

        setIsAdding(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        addSelectedToCart();

        setIsAdding(false);
        setAdded(true);
        toast.success("Added to cart.");

        if (addedTimer.current) clearTimeout(addedTimer.current);
        addedTimer.current = setTimeout(() => setAdded(false), 1800);
    };

    const handleBuyNow = async () => {
        if (isAdding || isBuying || !selectedVariant) return;

        setIsBuying(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        addSelectedToCart();
        toast.success("Added to cart. Taking you to checkout.");
        router.push("/checkout");
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
                    <div>
                        {/* Product Images */}
                        <ProductGallery
                            variant={selectedVariant}
                            wishlisted={wishlistedVariantIds.includes(
                                selectedVariant.id
                            )}
                        />
                    </div>

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
                                isAdding={isAdding}
                                isBuying={isBuying}
                                inventory={inventory}
                                onQuantityChange={setQuantity}
                                onAddToCart={handleAddToCart}
                                onBuyNow={handleBuyNow}
                            />

                            <ProductInformation
                                product={product}
                                variant={selectedVariant}
                            />
                        </motion.div>
                    </div>
                </div>

                <div>
                    <ProductReviews product={mapRatingProductData(data)} reviews={reviews}></ProductReviews>
                </div>
                {/* Related Products - later */}
            </div>
        </div>
    );
}
