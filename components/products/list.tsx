import { Product } from "@prisma/client";
import ProductCard from "./card";

export default function ProductList({ products }: { products: Product[] }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}