import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Image from "next/image";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id: id },
    });

    if (!product) return <div>Product not found</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p>₹{product.price}</p>
            <Image src={product.dpURL} alt={product.name} width={400} height={400} />
            {product.images && product.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {product.images.map((img, idx) => (
                        <Image key={idx} src={img} alt={`${product.name} image ${idx + 1}`} width={200} height={200} className="object-cover rounded" />
                    ))}
                </div>
            )}
            <p className="mt-4">{product.description}</p>
            <Button>Add to Cart</Button>
        </div>
    );   
}