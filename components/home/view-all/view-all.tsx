import { MoveRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ViewAll() {
    return (
        <section>
            {/* Container Box using responsive flex layout */}
            <div className="relative rounded-3xl overflow-hidden bg-ivory grid grid-cols-1 lg:grid-cols-12 min-h-[480px] md:min-h-[520px] shadow-sm transition-all duration-500 hover:shadow-xl">

                {/* LEFT COLUMN: Clean Editorial Copy Block (Takes 5 columns on desktop) */}
                <div className="lg:col-span-5 bg-ivory/95 flex flex-col justify-between p-8 md:p-12 z-10 relative">
                    <div className="space-y-4 my-auto">
                        <div className="w-12 h-[2px] bg-project_primary mb-4" />
                        <span className="text-xs font-bold uppercase tracking-widest text-obsidian/50 block">
                            Explore more
                        </span>
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-obsidian leading-tight">
                            Discover Every Crunch, Every Flavour
                        </h2>
                        <p className="text-sm text-obsidian/50 leading-relaxed max-w-sm">
                            From classic bhujia and sev to our signature mixtures, explore the complete range of Akshat Namkeen made with quality ingredients and authentic taste.
                        </p>
                    </div>

                    {/* Action Button Link mapped to a generic store path */}
                    <div className="pt-8 lg:pt-0">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/products"
                                className="group inline-flex items-center px-8 py-4 bg-project_primary text-white rounded-xl transition-all hover:shadow-sm"
                            >
                                View All
                                <MoveRight size={18} className="ml-2 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
                            </Link>

                            <Link
                                href="/categories"
                                className="px-8 py-4 border text-obsidian border-obsidian/30 rounded-xl transition-all hover:border-project_primary hover:text-project_primary"
                            >
                                Browse Categories
                            </Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Expansive Product Imagery Canvas (Takes 7 columns on desktop) */}
                {/* Uses absolute/relative positioning to allow Next.js Image component to fill completely */}
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:min-h-[520px] overflow-hidden group">
                    <Image
                        src="/illustrations/view-all.png" // Premium placeholder showing a crisp Indian savory layout
                        alt="Artisanal Akshat Namkeen Collection"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover transition-transform duration-[1500ms] ease-out scale-100 group-hover:scale-[1.03]"
                    />
                    {/* Subtle vignette filter layer overlaying the visual assets */}
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/20 via-transparent to-transparent mix-blend-multiply pointer-events-none" />
                    <div className="absolute bottom-6 left-6 flex gap-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                        <div className="text-2xl font-bold text-project_primary">
                            25+
                        </div>
                        <div className="text-xs text-gray-500">
                            Snack Varieties
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
