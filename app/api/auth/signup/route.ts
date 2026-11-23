import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { signUpSchema } from "@/lib/auth-schema";
import { sendSignupVerificationEmail } from "@/lib/mailer";

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_WAIT_MS = 60 * 1000;

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
        return Response.json(
            { error: parsed.error.issues[0]?.message ?? "Please check your details." },
            { status: 400 }
        );
    }

    const { name, password } = parsed.data;
    const email = parsed.data.email.toLowerCase();

    try {
        const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
        if (existingUser) {
            return Response.json(
                { error: "An account with this email already exists. Sign in instead." },
                { status: 409 }
            );
        }

        const pending = await prisma.signupVerification.findUnique({ where: { email } });
        const now = Date.now();
        if (pending && now - pending.createdAt.getTime() < RESEND_WAIT_MS) {
            const retryAfter = Math.ceil((RESEND_WAIT_MS - (now - pending.createdAt.getTime())) / 1000);
            return Response.json(
                { error: `Please wait ${retryAfter} seconds before requesting another code.`, retryAfter },
                { status: 429 }
            );
        }

        const code = randomInt(100000, 1000000).toString();
        const [hashedPassword, hashedCode] = await Promise.all([
            bcrypt.hash(password, 12),
            bcrypt.hash(code, 10),
        ]);

        await prisma.signupVerification.upsert({
            where: { email },
            create: {
                email,
                name,
                password: hashedPassword,
                otp: hashedCode,
                expiresAt: new Date(now + CODE_TTL_MS),
            },
            update: {
                name,
                password: hashedPassword,
                otp: hashedCode,
                attempts: 0,
                expiresAt: new Date(now + CODE_TTL_MS),
                createdAt: new Date(now),
            },
        });

        try {
            await sendSignupVerificationEmail(email, code);
        } catch (error) {
            await prisma.signupVerification.deleteMany({ where: { email, otp: hashedCode } });
            console.error("Signup verification email could not be sent:", error);
            return Response.json(
                { error: "We couldn't send a verification email. Check the address and try again." },
                { status: 503 }
            );
        }

        return Response.json({ success: true, email }, { status: 200 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return Response.json(
                { error: "An account with this email already exists. Sign in instead." },
                { status: 409 }
            );
        }
        console.error("Signup verification could not be started:", error);
        return Response.json({ error: "Unable to start account verification right now." }, { status: 500 });
    }
}
