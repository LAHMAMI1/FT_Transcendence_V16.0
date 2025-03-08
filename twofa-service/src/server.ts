import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import env from "./config/env";
import twoFactorRoutes from "./routes/twoFactor.routes";
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

fastify.post("/2fa-creation", async (request, reply) => {
  try {
    const { userId, email, two_factor_enabled } = request.body as any;
    // Create a twofa record in the database
    const twofa = await prisma.twoFa.create({
      data: { authUserId: userId, email, two_factor_enabled },
    });
    return reply.send({ message: "Twofa record created", twofa });
  } catch (error: any) {
    return reply.code(500).send({ message: error.message });
  }
});

// Register Auth Routes
fastify.register(twoFactorRoutes, { prefix: "/2fa" });

// Start the server
fastify.listen({ port: 3003, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`twofa Service listening at ${address}`);
});
