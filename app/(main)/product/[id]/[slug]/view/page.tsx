import { mapProductDetailsData } from "@/lib/mappers/product";
import { getProductById } from "@/lib/data/product";
import { getProductReviewData } from "@/lib/data/review";

import { notFound } from "next/navigation";
import ProductDetails from "@/components/products/details/index";

interface ProductPageProps {
    params: Promise<{
        id: string;
        slug: string;
    }>;

    searchParams: Promise<{
        variant?: string;
    }>;
}

export default async function ProductViewPage({ params, searchParams }: ProductPageProps) {
    const { id } = await params;
    const { variant: variantId } = await searchParams;
    const product = await getProductById(id);

    if (!product || product.variants.length === 0) {
        notFound();
    }

    const reviews = await getProductReviewData(id);
    const productDetails = mapProductDetailsData(product, {
        variantId,
        rating: reviews.rating,
        reviews,
    });

    return <ProductDetails data={productDetails} />;
}
