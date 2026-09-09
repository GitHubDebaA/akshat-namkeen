import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
const MAX_ATTEMPTS = 5;

export async function POST(req: Request) {
    const { email, otp } = await req.json();

    const record = await prisma.passwordResetOTP.findFirst({
        where: { email },
        orderBy: { createdAt: "desc" },
    });

    if (!record) {
        return Response.json({ error: "No OTP found" }, { status: 400 });
    }

    if (record.attempts >= MAX_ATTEMPTS) {
        return Response.json(
            { error: "Too many invalid attempts. Please request a new OTP." },
            { status: 400 }
        );
    }

    if (record.expiresAt < new Date()) {
        return Response.json({ error: "OTP expired" }, { status: 400 });
    }

    const valid = await bcrypt.compare(otp, record.otp);
    if (!valid) {
        await prisma.passwordResetOTP.update({
            where: { id: record.id },
            data: { attempts: { increment: 1 } },
        });

        return Response.json({ error: "Invalid OTP" }, { status: 400 });
    }

    await prisma.passwordResetOTP.update({
        where: { id: record.id },
        data: {
            verified: true,
        },
    });

    return Response.json({
        success: true,
    });
}