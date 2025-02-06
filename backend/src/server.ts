import Fastify from "fastify";
import { createUser, getAllUsers } from "./services/userService";

const fastify = Fastify({ logger: true });

interface CreateUserRequest {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
}

// Insert a user
fastify.post<{ Body: CreateUserRequest }>("/users", async (request, reply) => {
    const { first_name, last_name, username, email, password } = request.body;
    const user = await createUser(first_name, last_name, username, email, password);
    return { userId: user.id };
});

// Fetch all users
fastify.get("/users", async (request, reply) => {
    const users = await getAllUsers();
    return users;
});

// Start the server
fastify.listen({ port: 3000, host: "0.0.0.0" });
