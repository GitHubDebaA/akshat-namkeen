import prisma  from "@/lib/prisma";
import { sendOTPEmail } from "@/lib/mailer";

export async function POST(req: Request) {
    const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
    };

    const { email } = await req.json();

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
    }

    const otp = generateOTP();
    try {
        await prisma.passwordResetOTP.create({
            data: {
                email,
                otp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
            },
        });
        await sendOTPEmail(email, otp);
    } catch (err) {
        console.error("Error creating OTP record:", err);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }

    return Response.json({ success: true });
}