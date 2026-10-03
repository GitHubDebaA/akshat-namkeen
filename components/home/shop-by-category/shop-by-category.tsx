import Image from "next/image";
import Link from "next/link";
import { getCategory } from "@/lib/data/category";

export default async function ShopByCateogry() {
    const categories = await getCategory();

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

            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                {categories.map((category) => (
                    <Link href={`/product/category/${category.slug}`} key={category.id} className="group cursor-pointer">
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-brand-100 mb-1">
                            <Image
                                src={category.coverImage ? category.coverImage : "/illustrations/view-all.png"
                                }
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                unoptimized
                            />

                            {/* Overlay Container */}
                            <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-ivory/30 text-ivory backdrop-blur-sm flex flex-col gap-1 items-center justify-center">
                                <div className="text-center capitalize text-sm font-medium tracking-wider">
                                    {category.name}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}