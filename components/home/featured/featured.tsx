import { getCollection } from "@/lib/data/collection";
import FeaturedContent from "./content";
export default async function Featured() {
    const collection = await getCollection("new-arrivals");

    if (!collection) {
        return null;
    }

    const items = collection.items.map((item) => ({
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
        <FeaturedContent items={items} />
    );
}