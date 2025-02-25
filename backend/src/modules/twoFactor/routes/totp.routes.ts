import { FastifyInstance } from "fastify";
import { TotpController } from "../controllers/totp.controller";
import { EnableTotpSchema, VerifyTotpSchema } from "../schemas/twoFactor.schemas";
import { verifyJWT } from "../../../hooks/jwt.hook";

export default async function totpRoutes(fastify: FastifyInstance) {
    const controller = new TotpController();

    // Generates a new TOTP secret and returns a QR code URL for the user
    fastify.get("/setup", { preHandler: verifyJWT }, controller.setupTOTP);
    // Verifies the provided TOTP token and enables 2FA for the user by updating the database
    fastify.post("/enable", { schema: EnableTotpSchema, preHandler: verifyJWT }, controller.enableTOTP);
    // Verify TOTP During Login
    fastify.post("/verify", { schema: VerifyTotpSchema }, controller.verifyTOTP);
}