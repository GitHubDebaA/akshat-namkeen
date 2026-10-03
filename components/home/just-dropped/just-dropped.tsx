import { getCollection } from "@/lib/data/collection";
import JustDroppedContent from "./content";

export default async function JustDropped() {
    const collection = await getCollection("new-arrivals");

    if (!collection) {
        return null;
    }

    const limitedItems = collection.items.slice(0, 5).map(item => ({
        product: item.product,
        variantId: item.variant.id,
    }));

    return (
        <JustDroppedContent items={limitedItems} />
    );
}