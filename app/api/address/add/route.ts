import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const addressSchema = z.object({
    fullName: z.string().trim().min(2).max(100),
    mobile: z.string().trim().regex(/^[6-9]\d{9}$/),
    addressLine1: z.string().trim().min(3).max(180),
    addressLine2: z.string().trim().max(180).optional().default(""),
    city: z.string().trim().min(2).max(100),
    state: z.string().trim().min(2).max(100),
    postalCode: z.string().trim().regex(/^\d{6}$/),
    country: z.literal("India"),
    addressType: z.enum(["HOME", "OFFICE", "OTHER"]).default("HOME"),
});

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const parsed = addressSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json({ message: "Please check the address details." }, { status: 400 });
        }

        const address = await prisma.address.create({
            data: {
                ...parsed.data,
                userId: session.user.id,
            },
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Failed to save address" },
            { status: 500 }
        );
    }
}
