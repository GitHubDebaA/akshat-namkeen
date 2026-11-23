import { redirect } from "next/navigation";

import { getWishlist } from "@/lib/data/wishlist";
import WishlistPage from "@/components/wishlist/wishlist-page";
import type { WishlistWithItems } from "@/types/wishlist";

export default async function Page() {
    const wishlist = await getWishlist();

    if (!wishlist) {
        redirect("/login?callbackUrl=/wishlist");
    }

    const serializableWishlist: WishlistWithItems = {
        ...wishlist,
        items: wishlist.items.map((item) => ({
            ...item,
            variant: {
                ...item.variant,
                mrp: Number(item.variant.mrp),
                sellingPrice: Number(item.variant.sellingPrice),
            },
        })),
    };

    return <WishlistPage wishlist={serializableWishlist} />;
}
