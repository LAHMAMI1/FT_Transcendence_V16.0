import { FastifyInstance } from "fastify";
import { deleteUser, getAllUsers} from "../services/userService";

export default async function testRoutes(fastify: FastifyInstance) {
    // Fetch all users
    fastify.get("/users", async (request, reply) => {
        const users = await getAllUsers();
        return users;
    });

    // delete a user
    fastify.delete<{ Params: { userId: string } }>("/users/:userId", async (request, reply) => {
        const userIdInt = parseInt(request.params.userId, 10);

        await deleteUser(userIdInt);
        return { message: "User deleted" };
    });

    // Example Protected Route
    // This route requires a valid JWT token to access.
    fastify.get("/protected", async (request, reply) => {
        try {
            // If the token is invalid or missing jwtVerify will throw an error.
            await request.jwtVerify();
            return { message: "You are authenticated and can access this protected route!" };
        } catch (error: any) {
            return { message: "Unauthorized" };
        }
    });
};