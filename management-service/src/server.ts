import Fastify from "fastify";
import cors from "@fastify/cors";
import profileRoutes from "./routes/profile.routes";
import fastifyJwt from "@fastify/jwt";
import env from "./config/env";

const fastify = Fastify({ logger: true });

// Enable CORS to allow cross-origin requests (for development, we allow all origins)
fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

// Register JWT plugin
fastify.register(fastifyJwt, { secret: env.jwtSecret });

// Register routes
fastify.register(profileRoutes, {prefix: "/profile"});

fastify.listen({ port: 3002, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Management Service listening at ${address}`);
});
