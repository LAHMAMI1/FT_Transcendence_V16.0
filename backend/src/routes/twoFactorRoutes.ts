import { FastifyInstance } from "fastify";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { PrismaClient } from "@prisma/client";
import { request } from "http";

const prisma = new PrismaClient();

// Interface for setup 2FA
interface Setup2FARequest {
    userId: number;
    secret: string;
    token: string;
}

export default async function towFactorRoutes(fastify: FastifyInstance) {
    // Generates a new TOTP secret and returns a QR code URL for the user
    fastify.get("/2fa/setup", async (request, reply) => {
        try {
            // Check JWT to authenticate the user
            if (!await request.jwtVerify()) {
                throw new Error("Unauthorized");
            }
            
            // Generate a new TOTP secret
            const totpSecret = speakeasy.generateSecret({
                name: "FT_Transcendence",
            });

            // Generate a QR code data URL from the otpauth URL provided in the secret.
            const qrCodeDataURL = await qrcode.toDataURL(totpSecret.otpauth_url!);

            // Return the base32-encoded secret and the QR code.
            return { secret: totpSecret.base32, qrCodeDataURL };
        }
        catch (error: any) {
            return { message: error.message };
        }
    });

    // Verifies the provided TOTP token and enables 2FA for the user by updating the database
    fastify.post<{ Body: Setup2FARequest }>("/2fa/enable", async (request, reply) => {
        try {
            // Check JWT to authenticate the user
            if (!await request.jwtVerify()) {
                throw new Error("Unauthorized");
            }

            const { secret, token } = request.body;
            // Check the TOTP
            const validTOTP = speakeasy.totp.verify({
                secret,
                encoding: "base32",
                token,
                window: 1,
            });

            if (!validTOTP) {
                throw new Error("Invalid 2FA Token");
            };

            const userId = request.body.userId;
            await prisma.user.update({
                where: { id: userId },
                data: {
                    two_factor_enabled: true,
                    two_factor_secret: secret,
                },
            });
            return { message: "2FA enabled successfully" };
        } 
        catch (error: any) {
            return { message: error.message };
        }
    });
};