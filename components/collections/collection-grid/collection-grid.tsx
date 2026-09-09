import { Prisma } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type CollectionWithItems = Prisma.CollectionGetPayload<{
    include: { items: true };
}>;

interface Props {
    collections: CollectionWithItems[];
}

export default function CollectionGrid({ collections }: Props) {
    return (
        <section className="bg-ivory py-24">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-[0.3em] text-project_primary">
                        Our Collections
                    </span>

                    <h2 className="mt-3 text-4xl font-bold text-obsidian">
                        Crafted for Every Taste
                    </h2>

                    <p className="mt-4 text-obsidian/50">
                        Browse our carefully curated collections of fresh namkeen,
                        traditional mixtures, festive delights and everyday favourites.
                    </p>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                    {collections.map((item) => (
                        <Link key={item.id}
                            href={`/collections/${item.slug}`}
                            className="group overflow-hidden rounded-3xl border bg-ivory transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                {
                                    item.coverImage ? (
                                        <Image
                                            src={item.coverImage}
                                            alt={item.name}
                                            fill
                                            className="object-cover transition duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <Image
                                            src="/illustrations/product-not-found.svg"
                                            alt={item.name}
                                            fill
                                            className="object-cover transition duration-500 group-hover:scale-110"
                                        />
                                    )
                                }

                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium backdrop-blur">
                                    {item.items.length} Products
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-semibold">
                                    {item.name}
                                </h3>

                                <p className="mt-2 text-sm text-obsidian/50">
                                    {item.description}
                                </p>

                                <div className="mt-6 flex items-center gap-2 font-medium text-primary">
                                    View Collection
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}