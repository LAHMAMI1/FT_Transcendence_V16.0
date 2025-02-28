// management-service/server.ts (simplified example)
import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import cors from "@fastify/cors";

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

// Enable CORS to allow cross-origin requests (for development, we allow all origins)
fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

fastify.post("/profile", async (request, reply) => {
  try {
    const { userId, first_name, last_name, username } = request.body as any;
    // Create a profile record in Management DB
    const profile = await prisma.manageUser.create({
      data: { authUserId: userId, first_name, last_name, username, avatar:"" },
    });
    return reply.send({ message: "Profile created", profile });
  } catch (error: any) {
    return reply.code(500).send({ message: error.message });
  }
});

fastify.listen({ port: 3002, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Management Service listening at ${address}`);
});
