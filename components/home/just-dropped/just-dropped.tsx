import { getCollection } from "@/lib/data/collection";
import JustDroppedContent from "./content";
import { mapProductCardData } from "@/lib/mappers/product";

export default async function JustDropped() {
    const collection = await getCollection("new-arrivals");

    if (!collection) {
        return null;
    }

    const items = collection.items.slice(0, 5).map((item) =>
        mapProductCardData(item.product, {
            variantId: item.variant.id,
        })
    );
    return (
        <JustDroppedContent items={items} />
    );
}