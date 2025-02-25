import { randomInt } from 'crypto';
import transporter from "../../../config/mailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class EmailService {

    async enableEmail(userId: number) {
        // Enable the email 2FA
        await prisma.user.update({
            where: { id: userId },
            data: { 
                two_factor_enabled: true,
                email_enabled: true,
             },
        });

        return { 
            statusCode: 200,
            message: "Email 2FA enabled successfully" 
        };
    }

    async setupEmail(userId: number) {
        // Generate a random 6 digit code
        const emailCode = randomInt(100000, 999999).toString();

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user)
            throw {
                statusCode: 404,
                message: "User not found"
            }

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

        return { 
            statusCode: 200,
            message: "Email code sent" 
        };
    }

    async verifyEmail(userId: number, code: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user || !user.two_factor_email_code || !user.two_factor_email_expires)
            throw {
                statusCode: 401,
                message: "2FA not enabled",
            };

        // Check the expiration date
        if (new Date() > user.two_factor_email_expires)
            throw {
                statusCode: 401,
                message: "The email code has expired"
            };

        if (user.two_factor_email_code !== code)
            throw {
                statusCode: 401,
                message: "Invalid email code"
            };
    }
}