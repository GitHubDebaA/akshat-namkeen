import HeroSection from "./hero/hero";
import ShopByCateogry from "./shop-by-category/shop-by-category";
// import BestSelling from "./best-selling/best-selling";
import JustDropped from "./just-dropped/just-dropped";
import Featured from "./featured/featured";
import ViewAll from "./view-all/view-all";
import WhyChooseUsSection from "./why-choose-us/why-choose-us";

import prisma from "@/lib/prisma";

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

    const featuredProducts = await prisma.product.findMany({
        where: {
            isActive: true,
        },
        take: 6
    });

    return (
        <section className="space-y-6 md:space-y-12">
            <section className="overflow-hidden">
                <HeroSection />
            </section>
            <ShopByCateogry />
            {/* <BestSelling products={bestSellingProducts}/> */}
            <JustDropped products={bestSellingProducts} />
            <Featured products={featuredProducts} />
            <WhyChooseUsSection />
            <ViewAll />
        </section>
    );
}