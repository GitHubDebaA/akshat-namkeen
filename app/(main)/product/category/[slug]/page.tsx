import ProductList from "@/components/products/list";
import { getCategory } from "@/lib/data/category";
import { getProductsByCategory } from "@/lib/data/product";

interface ProductByCategoryProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductByCategory({ params }: ProductByCategoryProps ) {
    const { slug } = await params;

    const products = await getProductsByCategory(slug);
    console.log('products ', products);

    return (
        <div className="space-y-6 md:space-y-12">
            <ProductList products={products} />
        </div>
    );
}