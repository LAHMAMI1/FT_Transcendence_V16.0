import { FastifyInstance } from "fastify";
import { TotpController } from "../controllers/totp.controller";

export async function totpRoutes(fastify: FastifyInstance) {
    const controller = new TotpController();

    // Generates a new TOTP secret and returns a QR code URL for the user
    fastify.get("/setup", controller.setupTOTP);
    // Verifies the provided TOTP token and enables 2FA for the user by updating the database
    fastify.post("/enable", controller.enableTOTP);
    // Verify TOTP During Login
    fastify.post("/verify", controller.verifyTOTP);
}