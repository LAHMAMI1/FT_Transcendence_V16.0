import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import env from "./config/env";
import authRoutes from "./routes/auth.routes";
import { PrismaClient } from "@prisma/client";

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

// Enable CORS to allow cross-origin requests (for development, we allow all origins)
fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

// Register JWT plugin
fastify.register(fastifyJwt, { secret: env.jwtSecret });

// receive user 2fa enabled information
fastify.post("/2fa-enabled", async (request, reply) => {
  try {
    const { userId, two_factor_enabled } = request.body as any;
    // Create a twofa record in the database
    const twofa = await prisma.authUser.update({
      where: { id: userId },
      data: {
          two_factor_enabled
      }
    });
    return reply.send({ message: "Twofa record updated", twofa });
  }
  catch (error: any) {
    return reply.code(500).send({ message: error.message });
  }
});

// Register Auth Routes
fastify.register(authRoutes, { prefix: "/auth" });

// Start the server
fastify.listen({ port: 3001, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Auth Service listening at ${address}`);
});
