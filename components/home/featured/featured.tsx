import { getCollection } from "@/lib/data/collection";
import FeaturedContent from "./content";
export default async function Featured() {
    const collection = await getCollection("new-arrivals");

    if (!collection) {
        return null;
    }

    return (
        <FeaturedContent variant={collection.items.map(item => item.variant)} />
    );
}