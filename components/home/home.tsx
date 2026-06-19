import HeroSection from "./hero/hero";
import ShopByCateogry from "./shop-by-category/shop-by-category";
import BestSelling from "./best-selling/best-selling";
import prisma  from "@/lib/prisma"; 

export default async function Home() {
    const bestSellingProducts = await prisma.product.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5
    });

    return (
        <section className="space-y-6 md:space=y-12">
            <HeroSection />
            <ShopByCateogry />
            <BestSelling products={bestSellingProducts}/>
        </section>
    );
}