import { getCollection } from "@/lib/data/collection";
import { mapProductCardData } from "@/lib/mappers/product";

import FeaturedContent from "./content";

export default async function Featured() {
    const collection = await getCollection("featured-products");

    if (!collection) {
        return null;
    }

    const items = collection.items.map((item) =>
        mapProductCardData(item.product, {
            variantId: item.variant.id,
        })
    );
    
    return (
        <FeaturedContent items={items} />
    );
}