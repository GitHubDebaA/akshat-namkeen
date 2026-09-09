import ProductList from "@/components/products/list";
import prisma from "@/lib/prisma";

export default async function ProductByCategory({ params }: { params: Promise<{ slug: string }>; }) {
    const { slug } = await params;

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