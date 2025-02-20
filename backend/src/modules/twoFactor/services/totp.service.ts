import { PrismaClient } from "@prisma/client";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const prisma = new PrismaClient();

export class TotpService {

    async setupTOTP() {
         // Generate a new TOTP secret
        const totpSecret = speakeasy.generateSecret({
            name: "FT_Transcendence",
        });

        // Generate a QR code data URL from the otpauth URL provided in the secret
        const qrCodeDataURL = await qrcode.toDataURL(totpSecret.otpauth_url!);

        // Return the base32-encoded secret and the QR code
        return { secret: totpSecret.base32, qrCodeDataURL };
    }

    async enableTOTP(userId: number, secret: string, token: string) {
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

        await prisma.user.update({
            where: { id: userId },
            data: {
                two_factor_enabled: true,
                two_factor_secret: secret,
            },
        });

        return { message: "2FA enabled successfully" };
    }

    async verifyTOTP(userId: number, twoFactorToken: string) {

        if (!twoFactorToken)
                throw new Error("2FA Token is missing");
        
        const user = await prisma?.user.findUnique({
            where: { id: userId},
        });
        if (!user || !user.two_factor_enabled || !user.two_factor_secret) {
            throw new Error("User not found or 2FA not enabled");
            }
    
        const validTowFactorToken = speakeasy.totp.verify({
            secret: user.two_factor_secret,
            encoding: "base32",
            token: twoFactorToken,
            window: 1,
        });
    
        if (!validTowFactorToken)
            throw new Error("Invalid 2FA Token");

        return (user);
    }
}