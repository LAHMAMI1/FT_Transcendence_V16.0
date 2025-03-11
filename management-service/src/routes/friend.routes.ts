import { FastifyInstance } from "fastify";
import { FriendController } from "../controllers/friend.controller";
import { verifyJWT } from "../hooks/jwt.hook";
import { FriendRequestSchema } from "../schemas/friend.schemas";

export default async function friendRoutes(fastify: FastifyInstance) {
    const controller = new FriendController();

    // Send friend request route
    fastify.post("/send", { schema: FriendRequestSchema, preHandler: verifyJWT }, controller.sendFriendRequest);
    // Accept friend request route
    fastify.put("/accept", { schema: FriendRequestSchema, preHandler: verifyJWT }, controller.acceptFriendRequest);
    // Reject friend request route
    fastify.put("/reject", { schema: FriendRequestSchema, preHandler: verifyJWT }, controller.rejectFriendRequest);
    // Get all friends route
    fastify.get("/all", { preHandler: verifyJWT }, controller.getAllFriends);
    // Remove friend route
    fastify.delete("/remove", { schema: FriendRequestSchema, preHandler: verifyJWT }, controller.removeFriend);
}