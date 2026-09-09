import HeroSection from "./hero/hero";
import ShopByCateogry from "./shop-by-category/shop-by-category";
// import BestSelling from "./best-selling/best-selling";
import JustDropped from "./just-dropped/just-dropped";
import Featured from "./featured/featured";
import ViewAll from "./view-all/view-all";
import WhyChooseUsSection from "./why-choose-us/why-choose-us";

export default async function Home() {
    return (
        <section className="space-y-6 md:space-y-12">
            <section className="overflow-hidden">
                <HeroSection />
            </section>
            <ShopByCateogry />
            {/* <BestSelling products={bestSellingProducts}/> */}
            <JustDropped />
            <Featured />
            <WhyChooseUsSection />
            <ViewAll />
        </section>
    );
}