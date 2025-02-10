import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { request } from "http";
import config from "./config";
import userRoutes from "./routes/userRoutes";
import oauthRoutes from "./routes/oauthRoutes";
import testRoutes from "./routes/testRoutes";

const fastify = Fastify({ logger: true });

// PLugin registration
// Enable CORS to allow cross-origin requests (for development, we allow all origins)
fastify.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
});
// Register the JWT plugin with a secret key.
fastify.register(fastifyJwt, {
    secret: config.jwtSecret,
});

// Register routes
fastify.register(userRoutes);
fastify.register(oauthRoutes);
fastify.register(testRoutes);

// Start the server
fastify.listen({ port: 3000, host: "0.0.0.0" });
