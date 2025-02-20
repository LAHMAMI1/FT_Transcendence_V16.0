import { FastifyInstance } from "fastify";
import { totpRoutes } from "./totp.routes";
import emailRoutes from "./email.routes";

export default async function twoFactorRoutes(fastify: FastifyInstance) {
    // Prefix `/2fa/totp` for TOTP
    fastify.register(totpRoutes, { prefix: "/totp" });
    // Prefix `/2fa/email` for Email
    fastify.register(emailRoutes, { prefix: "/email" });
}