import prisma from "@/lib/prisma";
import CollectionHero from "./hero/hero";
import CollectionGrid from "./collection-grid/collection-grid";
// import CollectionTrust from "./trust/trust";

export default async function Collections() {
    const collections = await prisma.collection.findMany({
        orderBy: {
            displayOrder: "asc"
        },
        include: {
            items: {
                include: {
                    variant: true
                }
            }
        },
    });

    return (
        <div>
            {/* Section @@ Collection Hero Section */}
            <CollectionHero />

            {/* Section @@ Collection Grid Section */}
            <div id="all-collections" className="scroll-mt-20">
                <CollectionGrid collections={collections} />
            </div>

            {/* Section @@ Build Truct with Values */}
            {/* <CollectionTrust /> */}
        </div>
    );
}