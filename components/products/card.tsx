import Image from "next/image";
import { Product } from "@prisma/client";
import { Button } from "../ui/button";
import Link from "next/link";

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <Link href={`/products/${product.id}/view`}>
            <div className="border rounded-xl p-3 shadow-sm hover:shadow-md transition">
                <div className="relative w-full h-40">
                    <Image
                        src={product.dpURL}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                        unoptimized
                    />
                </div>

                <h3 className="mt-3 font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">₹{product.price}</p>
                <Button>Add to Cart</Button>
            </div>
        </Link>
    );
};

export default ProductCard;