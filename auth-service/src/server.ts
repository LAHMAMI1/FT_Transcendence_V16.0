import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import env from "./config/env";
import authRoutes from "./routes/auth.routes";

const fastify = Fastify({ logger: true });

// Enable CORS to allow cross-origin requests (for development, we allow all origins)
fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

// Register JWT plugin
fastify.register(fastifyJwt, { secret: env.jwtSecret });

// Register Auth Routes
fastify.register(authRoutes, { prefix: "/auth" });

// Start the server
fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Auth Service listening at ${address}`);
});
