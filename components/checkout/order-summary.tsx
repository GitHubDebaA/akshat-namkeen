import { useAccountOptions } from "@/store/account/options/option";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "../ui/button";
import { ShoppingCart, Van, Pen } from "lucide-react";

type OrderSummaryProps = {
    isLoggedIn: boolean;
};

export default function OrderSummary({ isLoggedIn }: OrderSummaryProps) {
    const { itemCount, total } = useCart();
    const { openAccountOptions } = useAccountOptions();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-xl font-medium text-obsidian">Order Summary</span>
            </div>
            <div className="text-sm text-obsidian/50">
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <ShoppingCart className="w-4 h-4 inline-block text-obsidian/50" />
                        Items ({itemCount()})
                    </div>
                    <div className="text-md font-medium text-obsidian">{formatPrice(total())}</div>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <Van className="w-4 h-4 inline-block text-obsidian/50" />
                        Delivery Charges
                    </div>
                    {
                        total() > 500 ? (
                            <div className="text-md font-medium uppercase text-green-700">Free</div>
                        ) : (
                            <div className="text-md font-medium text-obsidian">{formatPrice(40)}</div>
                        )
                    }
                </div>
                <div className="text-xs text-obsidian/50">
                    Free delivery on orders above {formatPrice(500)}!
                </div>
            </div>

            <div className="flex-1 h-px bg-obsidian"></div>

            {/* GRAND TOTAL */}
            <div className="flex justify-between text-sm text-obsidian">
                <div>Grand Total</div>
                <div className="text-md font-medium">{formatPrice(total())}</div>
            </div>

            {/* Shipping Address */}
            <div className="text-sm text-obsidian">
                <div className="font-medium">
                    Delivering To
                    <span className="font-bold ml-1">Home</span>
                </div>
                <div className="text-xs text-obsidian/50">
                    123 Main Street, Anytown, USA
                </div>
                <Button variant="link" className="text-xs p-0" onClick={() => alert("Address selection coming soon!")}>
                    <Pen className="w-2 h-2" />
                    Change Address
                </Button>
            </div>

            {/* Check out button will be enabled once you sign in to your account. */}
            {
                isLoggedIn ? (
                    <Button className="text-sm w-full py-6 bg-obsidian/70 hover:bg-obsidian text-ivory transition-colors cursor-pointer uppercase">
                        Place Order
                    </Button>
                ) : (
                    <Button className="text-sm w-full py-6 bg-obsidian/70 hover:bg-obsidian text-ivory transition-colors cursor-pointer uppercase" onClick={openAccountOptions}>
                        Sign in to Place Order
                    </Button>
                )
            }
        </div>
    );
}