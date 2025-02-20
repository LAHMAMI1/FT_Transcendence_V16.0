import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { env } from "./config";
import userRoutes from "./modules/routes/userRoutes";
import oauthRoutes from "./modules/routes/oauthRoutes";
import testRoutes from "./modules/routes/testRoutes";
import towFactorRoutes from "./modules/twoFactor/routes/twoFactor.routes";

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
    secret: env.jwtSecret,
});

// Register routes
fastify.register(userRoutes);
fastify.register(oauthRoutes);
fastify.register(towFactorRoutes, { prefix: "/2fa" });
fastify.register(testRoutes);

// Start the server
fastify.listen({ port: 3000, host: "0.0.0.0" });
