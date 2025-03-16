import { FastifyInstance } from "fastify";
import { verifyJWT } from "../hooks/jwt.hook";
import { MatchHistoryController } from "../controllers/matchHistory.controller";
import { createMatchHistorySchema } from "../schemas/matchHistory.schemas";

export default async function matchHistoryRoutes(fastify:FastifyInstance) {
    const controller = new MatchHistoryController();
    // create match history route
    fastify.post("/create", { preHandler: verifyJWT, schema: createMatchHistorySchema }, controller.createMatchHistory);
    // get match history route
    fastify.get("/", { preHandler: verifyJWT }, controller.getMatchHistory);
    // get match wins + losses + draws
    fastify.get("/stats", { preHandler: verifyJWT }, controller.getMatchStats);
}