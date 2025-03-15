import { FastifyInstance } from "fastify";
import { WebSocketController } from "../controllers/websocket.controller";

export default async function websocketRoutes(fastify: FastifyInstance) {
    const controller = new WebSocketController;

    fastify.get("/ws", { websocket: true }, (connection, request) => {
        controller.webSocketConnection(connection, request);
    });
}