export default async function ProductByCategory({ params }: { params: Promise<{ slug: string }>; }) {
    const { slug } = await params;

    return (
        <p className="text-obsidian">{slug}</p>
    );
}