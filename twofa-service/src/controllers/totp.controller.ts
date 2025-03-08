import { FastifyReply, FastifyRequest } from "fastify";
import { TotpService } from "../services/totp.service";
import { EnableTOTPRequest, VerifyTOTPRequest } from "../types/twoFactor.types";

export class TotpController {
    private totpService = new TotpService();

    constructor() {
        this.setupTOTP = this.setupTOTP.bind(this);
        this.enableTOTP = this.enableTOTP.bind(this);
        this.verifyTOTP = this.verifyTOTP.bind(this);
    }

    async setupTOTP(request: FastifyRequest, reply: FastifyReply) {
        try {
            const result = await this.totpService.setupTOTP();

            return reply.code(result.statusCode).send(result);
        }
        catch (error: any) {
            return reply.code(error.statusCode || 500).send({ message: error.message || "Internal Server Error" });
        }
    }

    async enableTOTP(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { secret, token } = request.body as EnableTOTPRequest;
            const userId = (request.user as { userId: number }).userId;

            const result = await this.totpService.enableTOTP(userId, secret, token);

            return reply.code(result.statusCode).send(result);
        }
        catch (error: any) {
            return reply.code(error.statusCode || 500).send({ message: error.message || "Internal Server Error" });
        }
    }

    async verifyTOTP(request: FastifyRequest<{ Body: VerifyTOTPRequest }>, reply: FastifyReply) {
        try {
            const { tempToken, twoFactorToken } = request.body;

            // Check the temporary token
            const payload = request.server.jwt.verify(tempToken) as { userId: number, towFactor?: boolean };
            if (!payload.towFactor)
                return reply.code(401).send({ message: "Invalid Temporary Token" });

            await this.totpService.verifyTOTP(payload.userId, twoFactorToken);

            // Generate a JWT token that includes the userId in the payload and set the token to expire in 1 hour
            const token = request.server.jwt.sign(
                { userId: payload.userId },
                { expiresIn: "1h" }
            );

            return reply.code(200).send({ message: "Login successful!", token });
        }
        catch (error: any) {
            return reply.code(error.statusCode || 500).send({ message: error.message || "Internal Server Error" });
        }
    }
}
