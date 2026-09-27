import { redirect } from "next/navigation";

import { getWishlist } from "@/lib/data/wishlist";
import WishlistPage from "@/components/wishlist/wishlist-page";

export default async function Page() {
    const wishlist = await getWishlist();

    if (!wishlist) {
        redirect("/login?callbackUrl=/wishlist");
    }

    return <WishlistPage wishlist={wishlist} />;
}