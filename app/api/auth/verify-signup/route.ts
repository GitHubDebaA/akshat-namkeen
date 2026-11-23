import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import prisma from "@/lib/prisma";

const requestSchema = z.object({
    email: z.string().trim().email().transform((email) => email.toLowerCase()),
    code: z.string().trim().regex(/^\d{6}$/, "Enter the six-digit verification code."),
});

const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
        return Response.json(
            { error: parsed.error.issues[0]?.message ?? "Enter a valid verification code." },
            { status: 400 }
        );
    }

    const { email, code } = parsed.data;
    try {
        const pending = await prisma.signupVerification.findUnique({ where: { email } });
        if (!pending) {
            return Response.json({ error: "No pending sign-up was found. Start again to request a new code." }, { status: 404 });
        }
        if (pending.expiresAt <= new Date()) {
            await prisma.signupVerification.deleteMany({ where: { email } });
            return Response.json({ error: "That code has expired. Start sign-up again to receive a new one." }, { status: 410 });
        }
        if (pending.attempts >= MAX_ATTEMPTS) {
            return Response.json({ error: "Too many incorrect attempts. Request a new code." }, { status: 429 });
        }

        const validCode = await bcrypt.compare(code, pending.otp);
        if (!validCode) {
            await prisma.signupVerification.updateMany({
                where: { email, otp: pending.otp, attempts: { lt: MAX_ATTEMPTS } },
                data: { attempts: { increment: 1 } },
            });
            const remaining = Math.max(0, MAX_ATTEMPTS - pending.attempts - 1);
            return Response.json(
                { error: remaining ? `That code doesn't match. ${remaining} attempts remaining.` : "Too many incorrect attempts. Request a new code." },
                { status: 400 }
            );
        }

        const result = await prisma.$transaction(async (transaction) => {
            const current = await transaction.signupVerification.findUnique({ where: { email } });
            if (!current || current.otp !== pending.otp || current.expiresAt <= new Date() || current.attempts >= MAX_ATTEMPTS) {
                return { error: "Your verification code is no longer valid. Request a new code.", status: 410 as const };
            }

            const existingUser = await transaction.user.findUnique({ where: { email }, select: { id: true } });
            if (existingUser) {
                await transaction.signupVerification.delete({ where: { email } });
                return { error: "An account with this email already exists. Sign in instead.", status: 409 as const };
            }

            const user = await transaction.user.create({
                data: {
                    name: current.name,
                    email: current.email,
                    password: current.password,
                    emailVerified: new Date(),
                },
                select: { id: true, name: true, email: true },
            });
            await transaction.signupVerification.delete({ where: { email } });
            return { user };
        });

        if ("error" in result) return Response.json({ error: result.error }, { status: result.status });
        return Response.json({ success: true, user: result.user });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return Response.json(
                { error: "An account with this email already exists. Sign in instead." },
                { status: 409 }
            );
        }
        console.error("Signup verification failed:", error);
        return Response.json({ error: "Unable to verify your email right now." }, { status: 500 });
    }
}
