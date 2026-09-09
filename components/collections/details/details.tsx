import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductCard from "@/components/products/card";
import { getCollection } from "@/lib/data/collection";
import {
    Leaf,
    Package,
    ShieldCheck,
    Truck,
} from "lucide-react";

interface Props {
    slug: string;
}

export default async function CollectionDetails({ slug }: Props) {
    const collection = await getCollection(slug);

    if (!collection) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="max-w-md text-center">
                    <span className="mb-4 block text-6xl">🥣</span>

                    <h1 className="text-3xl font-bold text-amber-950">
                        Collection Not Found
                    </h1>

                    <p className="mt-3 text-amber-800/80">
                        {`The collection you're looking for doesn't exist or has
                        been removed.`}
                    </p>

                    <Link
                        href="/collections"
                        className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90"
                    >
                        Browse Collections
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main>
            {/* -------------------- Hero -------------------- */}

            <section className="relative overflow-hidden">
                {/* Background */}

                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${collection.coverImage})`,
                    }}
                />

                {/* Overlay */}

                <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-obsidian/60 to-obsidian/30" />

                {/* Breadcrumb */}
                <div className="absolute left-0 right-0 top-0 z-20">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink className="text-white hover:text-white" render={<Link href="/">Home</Link>}>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbSeparator className="text-white hover:text-white" />

                                <BreadcrumbItem>
                                    <BreadcrumbLink className="text-white hover:text-white" render={<Link href="/collections">Collections</Link>}>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbSeparator className="text-white hover:text-white" />

                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-white font-bold hover:text-white ">
                                        {collection.name}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>

                {/* Hero Content */}

                <div className="relative mx-auto flex min-h-[480px] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <span className="rounded-full bg-white/30 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-project_primary backdrop-blur">
                            Akshat Namkeen
                        </span>

                        <h1 className="mt-6 text-4xl font-black leading-tight text-ivory md:text-6xl">
                            {collection.name}
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
                            {collection.description}
                        </p>

                        {/* Collection Stats */}

                        <div className="mt-10 flex flex-wrap gap-6 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <Package className="h-12 w-12 text-ivory" />
                                <div>
                                    <p className="text-2xl font-bold text-ivory">
                                        {collection.items.length}
                                    </p>
                                    <p className="text-sm text-ivory/80">
                                        Products
                                    </p>
                                </div>
                            </div>

                            <div className="h-12 w-px bg-ivory/80" />

                            <div className="flex items-center gap-3">
                                <Leaf className="h-12 w-12 text-ivory" />
                                <div>
                                    <p className="font-semibold text-ivory">
                                        Premium
                                    </p>
                                    <p className="text-sm text-ivory/80">
                                        Ingredients
                                    </p>
                                </div>
                            </div>

                            <div className="h-12 w-px bg-ivory/80" />

                            <div className="flex items-center gap-3">
                                <Truck className="h-12 w-12 text-ivory" />
                                <div>
                                    <p className="font-semibold text-ivory">
                                        Fresh
                                    </p>
                                    <p className="text-sm text-ivory/80">
                                        Packed Daily
                                    </p>
                                </div>
                            </div>

                            <div className="h-12 w-px bg-ivory/80" />

                            <div className="flex items-center gap-3">
                                <ShieldCheck className="h-12 w-12 text-ivory" />
                                <div>
                                    <p className="font-semibold text-ivory">
                                        Secure
                                    </p>
                                    <p className="text-sm text-ivory/80">
                                        Checkout
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* -------------------- Products -------------------- */}

            <section className="py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Section Heading */}

                    <div className="mb-12 flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-project_primary">
                                Collection Products
                            </span>

                            <h2 className="mt-2 text-3xl font-bold text-amber-950">
                                Explore {collection.name}
                            </h2>

                            <p className="mt-2 text-amber-900/70">
                                Carefully prepared using authentic recipes and
                                premium ingredients.
                            </p>
                        </div>

                        <div className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">
                            {collection.items.length} Products
                        </div>
                    </div>

                    {collection.items.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-8">
                            {/* {collection.items.map((item) => (
                                <ProductCard
                                    key={item.id}
                                    product={item.variant}
                                />
                            ))} */}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-amber-200 bg-white py-20 text-center">
                            <Package className="mx-auto h-12 w-12 text-amber-400" />

                            <h3 className="mt-6 text-2xl font-semibold text-amber-950">
                                No Products Available
                            </h3>

                            <p className="mx-auto mt-3 max-w-md text-amber-900/70">
                                {`This collection doesn't have any products yet.
                                Please check back soon for freshly added
                                namkeen.`}
                            </p>

                            <Link
                                href="/products"
                                className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90"
                            >
                                Browse All Products
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}