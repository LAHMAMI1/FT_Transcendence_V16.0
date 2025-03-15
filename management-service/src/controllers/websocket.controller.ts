import { FastifyRequest } from "fastify";
import { WebSocketService } from "../services/websocket.service";

export class WebSocketController {
    private WebSocketService = new WebSocketService;

    async webSocketConnection(connection: any, request: FastifyRequest) {
        try {
            const authHeader = request.headers.authorization;
            const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
            if (!token) {
                connection.close(1008, "Authentication Required");
                return;
            }

            const payload = request.server.jwt.verify(token) as { userId: number };
            if (!payload) {
                connection.close(1008, "Invalid Token");
                return;
            }

            // Mark the user as online
            await this.WebSocketService.markOnline(payload.userId);

            // Store the connection
            this.WebSocketService.storeConnection(payload.userId, connection);

            // Handle disconnection
            connection.on("close", async () => {
                console.log(`User ${payload.userId} disconnected from WebSocket.`);
                // Remove the connection
                this.WebSocketService.removeConnection(payload.userId);
                // Mark the user as offline after a 30 seconds delay
                setTimeout(async () => {
                    if (!this.WebSocketService.isConnected(payload.userId))
                        await this.WebSocketService.markOffline(payload.userId);
                }, 30000);
            });
        }
        catch (error: any) {
            connection.close(1011, error.message || "Internal Error");
        }
    }
}