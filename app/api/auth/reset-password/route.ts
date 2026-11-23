import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { z } from "zod";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Must contain one uppercase letter.")
    .regex(/[a-z]/, "Must contain one lowercase letter.")
    .regex(/[0-9]/, "Must contain one number.")
    .regex(/[^A-Za-z0-9]/, "Must contain one special character.");

export async function POST(req: Request) {
    let body: { email?: unknown; password?: unknown };
    try {
        body = await req.json();
    } catch {
        return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (typeof body.email !== "string" || typeof body.password !== "string") {
        return Response.json({ error: "Email and password are required." }, { status: 400 });
    }
    const email = body.email.trim().toLowerCase();
    const passwordResult = passwordSchema.safeParse(body.password);
    if (!z.email().safeParse(email).success) {
        return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!passwordResult.success) {
        return Response.json({ error: passwordResult.error.issues[0]?.message ?? "Invalid password." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(passwordResult.data, 10);

    const otpRecord = await prisma.passwordResetOTP.findFirst({
        where: {
            email,
            verified: true,
            expiresAt: { gt: new Date() },
        },

        orderBy: {
            createdAt: "desc",
        },
    });

    if (!otpRecord) {
        return Response.json(
            { error: "Your verification has expired. Request and verify a new code." },
            { status: 403 }
        );
    }

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) {
        return Response.json({ error: "We couldn't find an account for this email." }, { status: 404 });
    }

    await prisma.$transaction([
        prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } }),
        prisma.passwordResetOTP.deleteMany({ where: { email } }),
    ]);

    return Response.json({ success: true });
}
