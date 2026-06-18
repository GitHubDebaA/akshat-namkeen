import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const address = await prisma.address.findMany({
            orderBy: { createdAt: "asc" },
        });

        return Response.json({ address });
    } catch (error) {
        console.error("Error fetching address:", error);
        return Response.json(
            {
                error: "Failed to fetch addresses",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}