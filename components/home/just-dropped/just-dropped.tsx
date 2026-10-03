import { getCollection } from "@/lib/data/collection";
import JustDroppedContent from "./content";

export default async function JustDropped() {
    const collection = await getCollection("new-arrivals");

    if (!collection) {
        return null;
    }

    const limitedItems = collection.items.slice(0, 5).map((item) => ({
        variantId: item.variant.id,
        product: {
            ...item.product,
            variants: item.product.variants.map((variant) => ({
                ...variant,
                mrp: Number(variant.mrp),
                sellingPrice: Number(variant.sellingPrice),
            })),
        },
    }));

    return (
        <JustDroppedContent items={limitedItems} />
    );
}