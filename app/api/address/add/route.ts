import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email!,
            },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const address = await prisma.address.create({
            data: {
                userId: user.id,

                fullName: body.fullName,
                mobile: body.mobile,

                addressLine1: body.addressLine1,
                addressLine2: body.addressLine2,

                city: body.city,
                state: body.state,
                country: body.country,
                postalCode: body.postalCode,

                addressType: body.addressType,
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