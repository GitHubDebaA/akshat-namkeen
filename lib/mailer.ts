import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOTPEmail = async (to: string, otp: string) => {
    await transporter.sendMail({
        from: `"Akshat Namkeen" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Password Reset OTP",
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Password Reset Request</h2>
                <p>Your OTP for password reset is:</p>
                <h1 style="letter-spacing: 4px;">${otp}</h1>
                <p>This OTP is valid for 5 minutes.</p>
                <br/>
                <p>If you didn’t request this, please ignore this email.</p>
            </div>
        `,
    });
};