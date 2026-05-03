import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/products/details";

export default async function ProductViewPage({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id: id },
    });

    const properties = await prisma.productProperty.findMany({
        where: { productId: id },
        orderBy: { order: "asc" },
    });

    if (!product) {
        notFound();
    }

    return (
        <ProductDetails product={product} properties={properties} />
    );
}