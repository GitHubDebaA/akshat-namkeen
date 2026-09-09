import prisma from "@/lib/prisma";
import ProductList from "@/components/products/list";

export default async function ViewAllProducts() {
    const products = await prisma.product.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            name: "asc",
        }
    });
    return (
        <div className="space-y-6 md:space-y-12">
            <ProductList products={products} />
        </div>
    );
}