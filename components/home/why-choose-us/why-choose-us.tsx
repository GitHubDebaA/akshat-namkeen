export default function WhyChooseUsSection() {
    const pillars = [
        {
            id: "01",
            title: "Freshly Prepared",
            description: "Our namkeens are prepared in small daily batches to ensure every pack reaches you with maximum freshness and crunch.",
            metric: "Fresh Daily"
        },
        {
            id: "02",
            title: "Authentic Indian Recipes",
            description: "Made using traditional recipes and carefully balanced spice blends that have delighted families for generations.",
            metric: "Traditional Taste"
        },
        {
            id: "03",
            title: "Premium Ingredients",
            description: "We source quality ingredients and use refined cooking methods to deliver a light, crispy, and flavorful experience.",
            metric: "Quality Assured"
        },
        {
            id: "04",
            title: "Sealed For Freshness",
            description: "Every pack is carefully sealed to lock in aroma, taste, and crunch so you enjoy the same freshness every time.",
            metric: "Long Lasting Freshness"
        }
    ];

    return (
        <div>
            {/* SECTION HEADER: High-End Fashion Brand Alignment */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-obsidian/50">
                        Why Choose Akshat
                    </span>
                    <h2 className="text-2xl font-md text-obsidian">
                        Crafted With Quality, Served With Trust
                    </h2>
                </div>
                <div className="md:col-span-8 md:pt-6">
                    <p className="text-sm text-obsidian/50 max-w-2xl leading-relaxed">
                        Every pack of Akshat Namkeen is prepared using carefully selected ingredients, authentic recipes, and hygienic processes to deliver the perfect balance of taste and freshness.
                    </p>
                </div>
            </div>

            {/* EDITORIAL REASON GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
                {pillars.map((pillar) => (
                    <div
                        key={pillar.id}
                        className="group flex flex-col justify-between p-6 rounded-2xl bg-ivory/30 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-charcoal/5 transition-all duration-500 h-full"
                    >
                        <div className="space-y-4">
                            {/* Top Row: Luxury Index Number & Small Tag */}
                            <div className="flex items-center justify-between">
                                <span className="font-serif text-2xl font-light text-brand-200 group-hover:text-brand-500 transition-colors duration-300">
                                    {pillar.id}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                    {pillar.metric}
                                </span>
                            </div>

                            {/* Core Content */}
                            <div className="space-y-2">
                                <h3 className="font-medium text-base text-charcoal tracking-wide">
                                    {pillar.title}
                                </h3>
                                <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-500 transition-colors duration-300">
                                    {pillar.description}
                                </p>
                            </div>
                        </div>

                        {/* Bottom Accent Line: Glides into view on hover */}
                        <div className="pt-6">
                            <div className="h-[2px] w-0 bg-brand-500 group-hover:w-full transition-all duration-500" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
