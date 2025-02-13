import { FastifyInstance } from "fastify";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { enableTOTP, processTOTP } from "../services/twoFactorService";
import { request } from "http";

// Interface for setup 2FA
interface Setup2FARequest {
    secret: string;
    token: string;
}
// Interface for login 2FA
interface Login2FARequest {
    tempToken: string;
    twoFactorToken: string;
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
            const userId = ( request.user as { userId: number } ).userId;
            
            // TOTP
            await enableTOTP(secret, token, userId);

            return { message: "2FA enabled successfully" };
        } 
        catch (error: any) {
            return { message: error.message };
        }
    });

    // login with 2FA
    fastify.post<{ Body: Login2FARequest }>("/login/2fa", async (request, reply) => {
        try {
            const { tempToken, twoFactorToken } = request.body;

            // Check the temporary token
            const payload = fastify.jwt.verify(tempToken) as { userId: number, towFactor?: boolean };
            if (!payload.towFactor)
                throw new Error("Invalid Temporary Token");

            const user = await processTOTP(twoFactorToken, payload.userId);

            // Generate a JWT token that includes the userId in the payload and set the token to expire in 1 hour
            const token = fastify.jwt.sign(
                { userId: user.id },
                { expiresIn: "1h" }
            );

            return { message: "Login successful!", token };
        }
        catch (error: any) {
            return { message: error.message }
        }
    });
};