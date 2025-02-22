import { FastifyRequest, FastifyReply } from "fastify";
import { EmailService } from "../services/email.service";
import { VerifyEmailRequest } from "../types/twoFactor.types";

export class EmailController {
    private emailService = new EmailService();

    constructor() {
        this.enableEmail = this.enableEmail.bind(this);
        this.setupEmail = this.setupEmail.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
    }
    
    async enableEmail(request: FastifyRequest, reply: FastifyReply) {
        try {
            // Check JWT to authenticate the user
            if (!await request.jwtVerify())
                throw new Error("Unauthorized");

            const userId = (request.user as { userId: number }).userId;

            const result = await this.emailService.enableEmail(userId);

            return reply.send(result);
        }
        catch (error: any) {
            return { message: error.message }
        }
    }

    async setupEmail(request: FastifyRequest, reply: FastifyReply) {
        try {
            // Check JWT to authenticate the user
            if (!await request.jwtVerify()) {
                throw new Error("Unauthorized");
            }

            const userId = (request.user as { userId: number }).userId;

            const result = await this.emailService.setupEmail(userId);

            return reply.send(result);
        }
        catch (error: any) {
            return { message: error.message }
        }
    }

    async verifyEmail(request: FastifyRequest<{ Body: VerifyEmailRequest }>, reply: FastifyReply) {
        try {
            const { tempToken, code } = request.body;

            // Check the temporary token
            const payload = request.server.jwt.verify(tempToken) as { userId: number, towFactor?: boolean };
            if (!payload.towFactor)
                throw new Error("Invalid Temporary Token");

            await this.emailService.verifyEmail(payload.userId, code);

            // Generate a JWT token that includes the userId in the payload and set the token to expire in 1 hour
            const token = request.server.jwt.sign(
                { userId: payload.userId },
                { expiresIn: "1h" }
            );

            return reply.send({ message: "Login successful!", token });
        }
        catch (error: any) {
            return { message: error.message }
        }
    }
}