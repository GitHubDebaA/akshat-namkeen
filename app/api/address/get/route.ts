import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const address = await prisma.address.findMany({
            where: { userId: session.user.id },
            orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        });

        return Response.json({ address });
    } catch (error) {
        console.error("Error fetching address:", error);
        return Response.json(
            {
                error: "Failed to fetch addresses",
            },
            { status: 500 }
        );
    }
}
