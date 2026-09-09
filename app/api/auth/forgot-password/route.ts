import prisma from "@/lib/prisma";
import { sendOTPEmail } from "@/lib/mailer";
import { randomInt } from "crypto";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return Response.json({ success: true });
    }

    await prisma.passwordResetOTP.deleteMany({
        where: { email },
    });

    const otp = randomInt(100000, 1000000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await prisma.passwordResetOTP.create({
        data: {
            email,
            otp: hashedOtp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
        },
    });
    await sendOTPEmail(email, otp);
    return Response.json({ success: true });
}