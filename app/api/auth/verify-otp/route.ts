import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const { email, otp } = await req.json();

    const record = await prisma.passwordResetOTP.findFirst({
        where: { email },
        orderBy: { createdAt: "desc" },
    });

    if (!record) {
        return Response.json({ error: "No OTP found" }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
        return Response.json({ error: "OTP expired" }, { status: 400 });
    }

    if (record.otp !== otp) {
        await prisma.passwordResetOTP.update({
            where: { id: record.id },
            data: { attempts: { increment: 1 } },
        });

        return Response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    return Response.json({ success: true });
}