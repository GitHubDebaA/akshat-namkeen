import nodemailer from "nodemailer";

function createTransporter() {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER!,
            pass: process.env.EMAIL_PASS!,
        },
    });
}

    export const sendOTPEmail = async (to: string, otp: string) => {
        const transporter = createTransporter();
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

    export const sendWelcomeEmail = async (to: string, name: string) => {
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"Akshat Namkeen" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Welcome to Akshat Namkeen",
            html: `
            <!DOCTYPE html>
            <html>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;">
<tr>
<td
style="background:#b91c1c;padding:24px;text-align:center;color:#fff;">
<h1 style="margin:0;">Akshat Namkeen</h1>
</td>
</tr>
<tr>
<td style="padding:40px;">
<h2>Hello ${name}, 👋</h2>
<p>
Welcome to <strong>Akshat Namkeen</strong>!
We're delighted to have you with us.
</p>

<p>
Discover authentic namkeens, snacks, and delicious treats made with
quality ingredients and traditional recipes.
</p>
<div style="text-align:center;margin:35px 0;">
<a
href="${process.env.NEXT_PUBLIC_APP_URL}"
style="
background:#b91c1c;
color:white;
padding:14px 28px;
text-decoration:none;
border-radius:6px;
display:inline-block;
font-weight:bold;
">
Start Shopping
</a>
</div>
<p>
If you have any questions, simply reply to this email.
Our team is always happy to help.
</p>
<p>
Happy Snacking! 😊
</p>
<p>
<b>Team Akshat Namkeen</b>
</p>
</td>
</tr>
<tr>
<td
style="
background:#f3f4f6;
padding:20px;
font-size:12px;
text-align:center;
color:#666;
">
© ${new Date().getFullYear()} Akshat Namkeen<br/>
You're receiving this email because you created an account.
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>
        `,
        });
    };