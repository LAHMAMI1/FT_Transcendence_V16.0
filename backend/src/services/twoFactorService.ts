import { PrismaClient } from "@prisma/client";
import speakeasy from 'speakeasy';

const prisma = new PrismaClient();

export async function enableTOTP(secret: string, token: string, userId: number) {
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
}

export async function processTOTP(twoFactorToken: string, userId: number) {

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