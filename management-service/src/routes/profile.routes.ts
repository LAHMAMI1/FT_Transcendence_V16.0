import { FastifyInstance } from "fastify";
import { profileController } from "../controllers/profile.controller";
import { CreateProfileSchema, UpdateProfileSchema } from "../schemas/profile.schemas";
import { verifyJWT } from "../hooks/jwt.hook";

export default async function profileRoutes(fastify: FastifyInstance) {
    const controller = new profileController();

    // create profile route
    fastify.post("/create", { schema: CreateProfileSchema }, controller.createProfile);
    // get profile route
    fastify.get("/:userId", { preHandler: verifyJWT }, controller.getProfile);
    // update profile route
    fastify.put("update/:userId", { schema: UpdateProfileSchema, preHandler: verifyJWT }, controller.updateProfile);
}