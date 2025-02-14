import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import transporter from "../../utils/mailUtils";
import { request } from "http";

const prisma = new PrismaClient();

export default async function email2FARoutes(fastify: FastifyInstance) {
    // Generate and send a verification code via email
    fastify.post("/2fa/email/setup", async (request, reply) => {
        try {
            // Check JWT to authenticate the user
            if (!await request.jwtVerify()) {
                throw new Error("Unauthorized");
            }

            // Generate a random 6 digit code
            const emailCode = Math.floor(100000 + Math.random() * 900000).toString();

            const userId = ( request.user as { userId: number } ).userId;
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
        catch (error: any) {
            return { message: error.message }
        }
    });

    // Email 2FA verification
    fastify.post("/2fa/email/verification", async (request, reply) => {
        try {
            // Check JWT to authenticate the user
            if (!await request.jwtVerify())
                throw new Error("Unauthorized");

            const { code } = request.body as { code: string };
            const userId = (request.user as { userId: number }).userId;

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

            return { message: "Email 2FA verified successfully" };
        }
        catch (error: any) {
            return { message: error.message }
        }
    })
}