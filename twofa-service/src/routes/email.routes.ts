import { FastifyInstance } from "fastify";
import { EmailController } from "../controllers/email.controller";
import { VerifyEmailSchema } from "../schemas/twoFactor.schemas";
import { verifyJWT } from "../hooks/jwt.hook";

export default async function emailRoutes(fastify: FastifyInstance) {
    const controller = new EmailController;

    // Enable email 2FA
    fastify.post("/enable", { preHandler: verifyJWT }, controller.enableEmail);
    // Generate and send a verification code via email
    fastify.post("/setup", { preHandler: verifyJWT }, controller.setupEmail);
    // Email 2FA verification
    fastify.post("/verify", { schema: VerifyEmailSchema }, controller.verifyEmail);
}