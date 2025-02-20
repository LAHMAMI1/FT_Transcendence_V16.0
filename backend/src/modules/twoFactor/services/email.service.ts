import { randomInt } from 'crypto';
import transporter from "../../../config/mailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class EmailService {

    async setupEmail(userId: number) {
        // Generate a random 6 digit code
        const emailCode = randomInt(100000, 999999).toString();

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user)
            throw new Error("User not found");

        // send the mail with the code
        await transporter.sendMail({
            from: '"FT Transcendence" <no-reply@fttranscendence.com>',
            to: user.email,
            subject: "Your 2FA Verification Code",
            text: `Your verification code is: ${emailCode}`,
            html: `<p>Your verification code is: <strong>${emailCode}</strong></p>`,
        });

        // Save the 6 digit code with the expiration date
        await prisma.user.update({
            where: { id: userId },
            data: {
                two_factor_email_code: emailCode,
                two_factor_email_expires: new Date(Date.now() + 5 * 60 * 1000),
            },
        });

        return { message: "Email code sent" };
    }

    async verifyEmail(userId: number, code: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user || !user.two_factor_email_code || !user.two_factor_email_expires)
            throw new Error("User not found or Email 2FA not set up");

        // Check the expiration date
        if (new Date() > user.two_factor_email_expires)
            throw new Error("The email code has expired");

        if (user.two_factor_email_code !== code)
            throw new Error("Invalid email code");

        // Mark the user as Verified
        await prisma.user.update({
            where: { id: userId },
            data: { two_factor_email_verified: true },
        });

        return { message: "Email 2FA verified successfully" };
    }
}