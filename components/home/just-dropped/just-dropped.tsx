import { getCollection } from "@/lib/data/collection";
import JustDroppedContent from "./content";
import { mapProductCardData } from "@/lib/mappers/product";
import { getWishlistedVariantIds } from "@/lib/data/wishlist";

export default async function JustDropped() {
    const [collection, wishlistedVariantIds] = await Promise.all([
        getCollection("new-arrivals"),
        getWishlistedVariantIds()
    ]);

    if (!collection) {
        return null;
    }

    console.log('wishlistedVariantIds ', wishlistedVariantIds);

    const items = collection.items.slice(0, 5).map((item) =>
        mapProductCardData(item.product, {
            variantId: item.variant.id,
            wishlistedVariantIds: new Set(wishlistedVariantIds),
        })
    );
    return (
        <JustDroppedContent items={items} />
    );
}