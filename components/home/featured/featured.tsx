import { getCollection } from "@/lib/data/collection";
import FeaturedContent from "./content";
export default async function Featured() {
    const collection = await getCollection("new-arrivals");

    if (!collection) {
        return null;
    }

    return (
        <FeaturedContent items={collection.items.map(item => ({
            product: item.product,
            variantId: item.variant.id,
        }))} />
    );
}