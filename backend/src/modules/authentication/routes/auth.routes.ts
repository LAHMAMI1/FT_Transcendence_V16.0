import { FastifyInstance } from "fastify";
import { authController } from "../controllers/auth.controller";

export default async function authRoutes(fastify: FastifyInstance) {
    const controller = new authController();

    // registeration route
    fastify.post("/register", controller.register);
    // login route
    fastify.post("/login", controller.login);
    // oauth2 google route
    fastify.post("/oauth2/google", controller.googleAuth);
}