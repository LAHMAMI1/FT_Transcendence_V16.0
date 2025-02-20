import { FastifyRequest, FastifyReply } from "fastify";
import { EmailService } from "../services/email.service";

export class EmailController {
    private emailService = new EmailService();

    constructor() {
        this.setupEmail = this.setupEmail.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
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

    async verifyEmail(request: FastifyRequest, reply: FastifyReply) {
        try {
            // Check JWT to authenticate the user
            if (!await request.jwtVerify())
                throw new Error("Unauthorized");

            const { code } = request.body as { code: string };
            const userId = (request.user as { userId: number }).userId;

            const result = await this.emailService.verifyEmail(userId, code);

            return reply.send(result);
        } 
        catch (error: any) {
            return { message: error.message }
        }
    }
}