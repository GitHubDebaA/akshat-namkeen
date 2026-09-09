import { getCollection } from "@/lib/data/collection";
import JustDroppedContent from "./content";

export default async function JustDropped() {
    const collection = await getCollection("new-arrivals");
    console.log("Collection Data:", collection); // Debugging line to check the fetched data

    if (!collection) {
        return null;
    }

    const limitedProducts = collection.items.slice(0, 5).map(item => item.variant);
    return (
        <JustDroppedContent variant={limitedProducts} />
    );
}