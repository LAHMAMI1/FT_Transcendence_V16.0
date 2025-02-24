import { FastifyInstance } from "fastify";
import { authController } from "../controllers/auth.controller";
import { GoogleAuthSchema, LoginSchema, RegistrationUserSchema } from "../schemas/auth.schemas";

export default async function authRoutes(fastify: FastifyInstance) {
    const controller = new authController();

    // registeration route
    fastify.post("/register", { schema: RegistrationUserSchema }, controller.register);
    // login route
    fastify.post("/login", { schema: LoginSchema }, controller.login);
    // oauth2 google route
    fastify.post("/oauth2/google", {schema: GoogleAuthSchema }, controller.googleAuth);
}