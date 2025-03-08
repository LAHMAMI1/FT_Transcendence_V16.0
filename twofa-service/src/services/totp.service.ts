import { PrismaClient } from "@prisma/client";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import axios from 'axios';

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
        return { statusCode: 200, secret: totpSecret.base32, qrCodeDataURL };
    }

    async enableTOTP(userId: number, secret: string, token: string) {
        // Check the TOTP
        const validTOTP = speakeasy.totp.verify({
            secret,
            encoding: "base32",
            token,
            window: 1,
        });

        if (!validTOTP)
            throw {
                statusCode: 401,
                message: "Invalid TOTP token",
            };

        await prisma.twoFa.update({
            where: { id: userId },
            data: {
                two_factor_enabled: true,
                totp_enabled: true,
                two_factor_secret: secret,
            },
        });

        await axios.post(`${process.env.AUTH_SERVICE_URL}/2fa-enabled`, {
            userId,
            two_factor_enabled: true,
        }, {timeout: 5000});

        return { 
            statusCode: 200,
            message: "2FA  authenticator apps enabled successfully"
        };
    }

    async verifyTOTP(userId: number, twoFactorToken: string) {
        
        const user = await prisma.twoFa.findUnique({
            where: { id: userId},
        });
        if (!user || !user.totp_enabled || !user.two_factor_secret)
            throw {
                statusCode: 401,
                message: "2FA not enabled",
            };
    
        const validTowFactorToken = speakeasy.totp.verify({
            secret: user.two_factor_secret,
            encoding: "base32",
            token: twoFactorToken,
            window: 1,
        });
    
        if (!validTowFactorToken)
            throw {
                statusCode: 401,
                message: "Invalid 2FA token",
            };
    }
}