import bcrypt from "bcryptjs";
import prisma  from "@/lib/prisma";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
    });

    await prisma.passwordResetOTP.deleteMany({
        where: { email },
    });

    return Response.json({ success: true });
}