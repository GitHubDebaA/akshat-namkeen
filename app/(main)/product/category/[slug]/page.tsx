import ProductList from "@/components/products/list";
import { getAllProducts } from "@/lib/data/product";
import { getCategory, getCategoryBySlug } from "@/lib/data/category";
import { mapProductCardData } from "@/lib/mappers/product";
import { notFound } from "next/navigation";

interface ProductByCategoryProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductByCategory({ params }: ProductByCategoryProps ) {
    const { slug } = await params;

    const [category, products, categories] = await Promise.all([
        getCategoryBySlug(slug),
        getAllProducts(),
        getCategory(),
    ]);
    if (!category) notFound();
    const productCards = products.map((product) => mapProductCardData(product));

    return (
        <div className="space-y-6 md:space-y-12">
            <ProductList
                key={category.id}
                products={productCards}
                categories={categories.map(({ id, name }) => ({ id, name }))}
                activeCategoryId={category.id}
            />
        </div>
    );
}
