import ProductList from "@/components/products/list";
import { getAllProducts } from "@/lib/data/product";
import { getCategory } from "@/lib/data/category";
import { mapProductCardData } from "@/lib/mappers/product";

export default async function ViewAllProducts() {
    const [products, categories] = await Promise.all([getAllProducts(), getCategory()]);
    const productCards = products.map((product) => mapProductCardData(product));

    return (
        <div className="space-y-6 md:space-y-12">
            <ProductList
                key="all-products"
                products={productCards}
                categories={categories.map(({ id, name }) => ({ id, name }))}
            />
        </div>
    );
}
