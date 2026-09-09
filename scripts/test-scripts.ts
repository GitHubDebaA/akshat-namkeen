import dotenv from "dotenv";

dotenv.config({
    path: ".env.local",
});

import { sendWelcomeEmail, sendOTPEmail } from "../lib/mailer";

async function main() {
    // await sendOTPEmail("akshat_jain2@whirlpool.in", "12345");
    await sendWelcomeEmail("akshat.jain2104@gmail.com", "Akshat");
    console.log("✅ Email sent");
}

main().catch(console.error);