import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { getCategory } from "@/lib/data/category";

export default async function CategoriesPage() {
    const categories = await getCategory();

    return (
        <main className="min-h-screen bg-[#fffdf9]">
            <section className="relative isolate overflow-hidden border-b border-brand-200 bg-[radial-gradient(ellipse_at_85%_25%,rgba(195,103,43,0.18),transparent_38%),linear-gradient(115deg,#fffaf2_0%,#f7ead9_58%,#f4e4d0_100%)]">
                <div aria-hidden="true" className="absolute -right-24 -top-32 -z-10 size-96 rounded-full border border-white/60 bg-white/20 blur-3xl" />
                <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 md:py-12">
                    <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-obsidian/55">
                        <Link href="/" className="transition hover:text-project_primary">Home</Link>
                        <ChevronRight className="size-4" />
                        <span aria-current="page" className="font-medium text-obsidian">Categories</span>
                    </nav>
                    <div className="max-w-3xl">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-project_primary/15 bg-white/75 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-project_primary shadow-sm backdrop-blur">
                            <Sparkles className="size-3.5" /> Find your favourite
                        </span>
                        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-obsidian sm:text-4xl md:text-5xl">
                            A little something for <span className="text-project_primary">every craving.</span>
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-obsidian/65 sm:text-base sm:leading-7">
                            Browse every Akshat Namkeen category and find the perfect crunch for tea time, sharing, or a treat for yourself.
                        </p>
                    </div>
                    <div className="mt-5 text-sm font-medium text-obsidian/60">{categories.length} {categories.length === 1 ? "category" : "categories"} to explore</div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 md:py-12">
                {categories.length ? (
                    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4 lg:grid-cols-6">
                        {categories.map((category, index) => (
                            <Link
                                key={category.id}
                                href={`/product/category/${category.slug}`}
                                className="group relative isolate aspect-[4/5] overflow-hidden rounded-xl bg-brand-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-project_primary focus-visible:ring-offset-4 sm:rounded-2xl"
                                style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
                            >
                                <Image
                                    src={category.coverImage || "/illustrations/view-all.png"}
                                    alt={category.name}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className="-z-10 object-cover transition-transform duration-700 group-hover:scale-110"
                                    unoptimized
                                />
                                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian/85 via-obsidian/10 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                                    <div>
                                        <h2 className="text-lg font-semibold capitalize text-white sm:text-xl">{category.name}</h2>
                                        {category.description && <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/75 sm:text-sm">{category.description}</p>}
                                    </div>
                                    <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition group-hover:bg-project_primary">
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-brand-200 bg-white px-6 py-16 text-center">
                        <h2 className="font-display text-2xl font-semibold text-obsidian">Categories are coming soon</h2>
                        <p className="mt-2 text-sm text-obsidian/60">Please check back shortly to explore our snack range.</p>
                        <Link href="/product" className="mt-6 inline-flex items-center gap-2 rounded-full bg-project_primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">Browse all products <ArrowRight className="size-4" /></Link>
                    </div>
                )}
            </section>
        </main>
    );
}
