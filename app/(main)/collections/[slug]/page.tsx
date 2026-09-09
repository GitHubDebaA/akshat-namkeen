import CollectionDetails from "@/components/collections/details/details";

interface CollectionPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {

    const { slug } = await params;
    return (
        <CollectionDetails slug={slug} />
    );
}