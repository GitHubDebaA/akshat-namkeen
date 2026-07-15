import Image from "next/image";
import Link from "next/link";

const categories = [
    { label: "Mixtures", value: "mixture", image: "/categories/mixture.png", },
    { label: "Spicy Snacks", value: "spicy-snack", image: "/categories/spicy-snack.png" },
    { label: "Salted Snacks", value: "salted-snack", image: "/categories/salted-snack.png" },
    { label: "Corn Snacks", value: "corn-snack", image: "/categories/corn-snack.png" },
    { label: "Bhujia", value: "bhujia", image: "/categories/bhujia.png" }
];

export default function ShopByCateogry() {
    return (
        <div>
            <div className="mb-4">
                <h2 className="text-2xl font-md text-obsidian">
                    Shop by Category
                </h2>

                <p className="text-sm text-obsidian/50">
                    Discover your favourite namkeen varieties
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {categories.map((category) => (
                    <Link href={`/products/category/${category.value}`} key={category.label} className="group cursor-pointer last:max-md:col-span-2">
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-100 mb-1 group-last:max-md:aspect-video">
                            <Image
                                src={category.image}
                                alt={category.label}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                unoptimized
                            />

                            {/* Overlay Container */}
                            <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-ivory/30 text-ivory backdrop-blur-sm flex flex-col gap-1 items-center justify-center">
                                <div className="text-center capitalize text-sm font-medium tracking-wider">
                                    {category.label}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}