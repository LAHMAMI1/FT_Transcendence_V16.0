import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function testRoutes(fastify: FastifyInstance) {
    // Fetch all users
    fastify.get("/", async (request, reply) => {
        const users = await prisma.user.findMany
        ({
            select: {
                id: true,
                username: true,
                email: true
            }
        });;
        return users;
    });
};